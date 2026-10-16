#!/usr/bin/env python3
"""Safely ingest a curated subset of public security conference deadlines.

The manually official-checked Top Four file stays authoritative.
Imported sec-deadlines dates are explicitly tagged community-sourced.
Only approved conference names and a small safe schema can reach the site.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import urlsplit
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

import yaml

ROOT = Path(__file__).resolve().parents[1]
SOURCE_URL = (
    "https://raw.githubusercontent.com/sec-deadlines/"
    "sec-deadlines.github.io/master/_data/conferences.yml"
)
SOURCE_INFO = "https://github.com/sec-deadlines/sec-deadlines.github.io/blob/master/_data/conferences.yml"
OUTPUT = ROOT / "_data" / "security_deadlines_auto.json"
MANUAL = ROOT / "_data" / "security_deadlines.yml"
# Do not import all unreviewed venues; curate security / OS / hardware relevance.
CURATED = {
    "S&P (Oakland)": ("sp", "IEEE S&P", "green", "Security"),
    "USENIX Security": ("usenix", "USENIX Security", "blue", "Security"),
    "CCS": ("ccs", "ACM CCS", "violet", "Security"),
    "NDSS": ("ndss", "NDSS", "orange", "Security"),
    "ASIA CCS": ("asiaccs", "AsiaCCS", "green", "Security"),
    "Euro S&P": ("eurosp", "Euro S&P", "blue", "Security"),
    "ESORICS": ("esorics", "ESORICS", "blue", "Security"),
    "CSF": ("csf", "IEEE CSF", "green", "Security Foundations"),
    "PETS": ("pets", "PETS / PoPETs", "violet", "Privacy"),
    "SOUPS": ("soups", "SOUPS", "violet", "Usable Security"),
    "RAID": ("raid", "RAID", "orange", "Attacks & Defenses"),
    "ACSAC": ("acsac", "ACSAC", "green", "Applied Security"),
    "DIMVA": ("dimva", "DIMVA", "orange", "Malware & Intrusion"),
    "HOST": ("host", "IEEE HOST", "green", "Hardware Security"),
    "CHES": ("ches", "CHES / TCHES", "orange", "Cryptographic Hardware"),
    "WiSec": ("wisec", "ACM WiSec", "blue", "Wireless Security"),
    "FC": ("fc", "Financial Crypto", "violet", "Cryptography"),
    "PKC": ("pkc", "PKC", "violet", "Cryptography"),
    "TCC": ("tcc", "TCC", "violet", "Cryptography"),
    "Crypto": ("crypto", "CRYPTO", "violet", "Cryptography"),
    "Eurocrypt": ("eurocrypt", "EUROCRYPT", "violet", "Cryptography"),
    "Asiacrypt": ("asiacrypt", "ASIACRYPT", "violet", "Cryptography"),
    "CT-RSA": ("ctrsa", "CT-RSA", "violet", "Cryptography"),
    "SECRYPT": ("secrypt", "SECRYPT", "blue", "Security"),
    "PST": ("pst", "PST", "blue", "Privacy & Security"),
    "DFC Europe": ("dfceurope", "DFRWS Europe", "orange", "Digital Forensics"),
}
TOP4 = {"sp", "usenix", "ccs", "ndss"}
MAX_SOURCE_BYTES = 2_000_000
DEFAULT_ZONE = timezone(timedelta(hours=-12))


def plain(value: object, limit: int = 180) -> str:
    """Untrusted source text becomes bounded, non-control-character plain text."""
    if not isinstance(value, (str, int)):
        return ""
    value = " ".join(str(value).split())
    value = re.sub(r"[{}<>]", "", value)
    return value[:limit]


def safe_web_url(value: object) -> str:
    if not isinstance(value, str) or len(value) > 350:
        return ""
    # Never let a community string escape an HTML href attribute.
    if any(ch.isspace() or ord(ch) in (34, 39, 60, 62, 92, 96, 123, 125) for ch in value):
        return ""
    parts = urlsplit(value.strip())
    if parts.scheme != "https" or not parts.hostname or parts.username or parts.password:
        return ""
    return value.strip()


def expand_rolling_date(date_text: str, edition: int) -> str:
    """sec-deadlines: %Y = preceding year, %y = edition year."""
    return date_text.replace("%Y", str(edition - 1)).replace("%y", str(edition))


def resolve_zone(zone: object):
    if zone is None or zone in ("", "AoE", "UTC-12", "Etc/GMT+12"):
        return DEFAULT_ZONE, "AoE (UTC−12)"
    if not isinstance(zone, str):
        raise ValueError("Unsupported time zone")
    zone = zone.strip()
    if not re.fullmatch(r"[A-Za-z0-9_+\-/]{1,64}", zone):
        raise ValueError("Invalid time zone")
    if zone in ("UTC", "Etc/UTC"):
        return timezone.utc, "UTC"
    if zone == "AoE":
        return DEFAULT_ZONE, "AoE (UTC−12)"
    try:
        return ZoneInfo(zone), zone
    except (KeyError, ZoneInfoNotFoundError) as exc:
        raise ValueError(f"Unknown time zone {zone}") from exc


def parse_deadline(raw: object, edition: int, zone: object):
    """Return UTC instant and original date, never guess TBD or unknown formats."""
    if not isinstance(raw, str):
        return None
    raw = expand_rolling_date(raw.strip(), edition)
    match = re.fullmatch(
        r"(20[2-4]\d-\d{2}-\d{2})[ T](\d{2}:\d{2})(?::(\d{2}))?",
        raw,
    )
    if not match:
        return None
    local_date, local_hm, sec = match.groups()
    try:
        local = datetime.fromisoformat(
            f"{local_date}T{local_hm}:{sec or '00'}"
        )
        tz, label = resolve_zone(zone)
        local = local.replace(tzinfo=tz)
        canonical = local.astimezone(timezone.utc)
    except (ValueError, OverflowError):
        return None
    return {
        "iso_utc": canonical.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "local_date": local_date,
        "local_time": local_hm + (":" + sec if sec else ""),
        "zone_label": label,
        "original": f"{local_date} {local_hm}" + (f":{sec}" if sec else ""),
    }


def approved_manual_years(manual: dict) -> set[tuple[str, int]]:
    editions = {
        str(v.get("id")): int(v.get("year"))
        for v in manual.get("conferences", [])
        if isinstance(v, dict) and v.get("id") and str(v.get("year", "")).isdigit()
    }
    result = set()
    for event in manual.get("events", []):
        if isinstance(event, dict) and event.get("conf") in editions:
            result.add((str(event["conf"]), editions[event["conf"]]))
    return result


def build_dataset(source: list, manual: dict, now: datetime) -> dict:
    if not isinstance(source, list) or len(source) < 20:
        raise ValueError("Upstream conference list is missing or unexpectedly small")
    manual_editions = approved_manual_years(manual)
    venues = {}
    output_events = {}
    cutoff = now - timedelta(days=35)
    for raw in source:
        if not isinstance(raw, dict) or raw.get("name") not in CURATED:
            continue
        conf_id, title, theme, specialty = CURATED[raw["name"]]
        try:
            year = int(raw.get("year"))
        except (ValueError, TypeError):
            continue
        if year < now.year or year > now.year + 2:
            continue
        link = safe_web_url(raw.get("link"))
        if not link:
            continue
        submitted = raw.get("deadline")
        if not isinstance(submitted, list) or not submitted or len(submitted) > 16:
            continue
        if (conf_id, year) in manual_editions:
            # Never let crowdsourced updates overwrite hand-verified official dates.
            continue
        valid = []
        for item in submitted:
            item_date = parse_deadline(item, year, raw.get("timezone"))
            if not item_date:
                continue
            when = datetime.fromisoformat(item_date["iso_utc"].replace("Z", "+00:00"))
            if when < cutoff or when > now + timedelta(days=730):
                continue
            valid.append(item_date)
        valid = sorted({x["iso_utc"]: x for x in valid}.values(), key=lambda x: x["iso_utc"])
        if not valid:
            continue
        venue_key = f"{conf_id}-{year}"
        entry = {
            "id": conf_id,
            "short": title,
            "name": plain(raw.get("description") or title, 140),
            "year": year,
            "location": plain(raw.get("place") or "Location TBA", 100),
            "dates": plain(raw.get("date") or "Dates TBA", 100),
            "label": specialty,
            "theme": theme,
            "tier": "top4" if conf_id in TOP4 else "additional",
            "official": link,
            "note": plain(raw.get("comment"), 220),
            "source": "community",
        }
        # Only the most recent edition is promoted to the card,
        # but all valid future editions remain available in events.
        if conf_id not in venues or year > venues[conf_id]["year"]:
            venues[conf_id] = entry
        for idx, deadline in enumerate(valid, 1):
            event_key = f"auto-{venue_key}-{deadline['local_date']}-{idx}"
            event = {
                "id": event_key,
                "conf": conf_id,
                "year": year,
                "cycle": "Cycle " + str(idx) if len(valid) > 1 else "Main deadline",
                "kind": "paper",
                "label": "Full paper submission · community listed",
                "iso_utc": deadline["iso_utc"],
                "local_date": deadline["local_date"],
                "local_time": deadline["local_time"],
                "zone_label": deadline["zone_label"],
                "original": deadline["original"],
                "source": "community",
                "official": link,
            }
            output_events[event_key] = event
    conferences = sorted(
        venues.values(),
        key=lambda entry: (entry["tier"] != "top4", entry["short"].casefold()),
    )
    events = sorted(output_events.values(), key=lambda item: (item["iso_utc"], item["id"]))
    future_count = sum(
        datetime.fromisoformat(e["iso_utc"].replace("Z", "+00:00")) > now
        for e in events
    )
    if len(conferences) < 5 or future_count < 4:
        raise ValueError(
            f"Upstream data looks incomplete: {len(conferences)} venues and "
            f"{future_count} future submission deadlines"
        )
    return {
        "schema_version": 1,
        "source": {
            "name": "sec-deadlines (community curated)",
            "url": SOURCE_INFO,
            "notice": "Community-maintained listing. Verify all imported dates at the official CFP.",
            "default_timezone": "AoE (UTC−12) unless source explicitly specifies another timezone",
        },
        "conferences": conferences,
        "events": events,
    }


def load_yaml(path: Path) -> object:
    with path.open("r", encoding="utf-8") as handle:
        return yaml.safe_load(handle)


def fetch_source() -> object:
    request = urllib.request.Request(
        SOURCE_URL,
        headers={"User-Agent": "Zedong-Research-Deadline-Tracker/1.0 (+GitHub Actions)"},
    )
    with urllib.request.urlopen(request, timeout=25) as response:
        data = response.read(MAX_SOURCE_BYTES + 1)
        if len(data) > MAX_SOURCE_BYTES:
            raise ValueError("Upstream data exceeds size limit")
        return yaml.safe_load(data.decode("utf-8"))


def main() -> int:
    parser = argparse.ArgumentParser(description="Update community security CFP calendar")
    parser.add_argument("--source-file", type=Path, help="Offline YAML source for testing")
    parser.add_argument("--dry-run", action="store_true", help="Validate but do not write")
    args = parser.parse_args()
    try:
        source = load_yaml(args.source_file) if args.source_file else fetch_source()
        manual = load_yaml(MANUAL)
        if not isinstance(manual, dict):
            raise ValueError("Manual official-checked file is invalid")
        result = build_dataset(source, manual, datetime.now(timezone.utc))
        serialized = json.dumps(result, indent=2, ensure_ascii=False) + "\n"
        old = OUTPUT.read_text(encoding="utf-8") if OUTPUT.exists() else ""
        changed = serialized != old
        if changed and not args.dry_run:
            OUTPUT.parent.mkdir(parents=True, exist_ok=True)
            OUTPUT.write_text(serialized, encoding="utf-8")
        print(
            f"{'CHANGED' if changed else 'UNCHANGED'}: {len(result['conferences'])} "
            f"venues, {len(result['events'])} events, "
            f"source={result['source']['name']}"
        )
        return 0
    except Exception as exc:
        # The scheduled workflow fails, leaving the last known-good JSON intact.
        print(f"ERROR: refusing to overwrite last known-good data: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
