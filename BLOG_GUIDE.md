# Publishing research notes

This is the independent blog at https://blog.zhouzedong.top, based on the original Cybersecurity Blog page formerly published within https://zhouzedong.top/blog/.

## Create a post

Add a Markdown file under `_posts/`, such as `2026-10-16-example-note.md`.

```yaml
---
layout: cyber-post
title: "My Research Note"
date: 2026-10-16
excerpt: "A short description."
categories: [Research Notes]
tags: [Linux, Security]
---

Your Markdown article text goes here.
```

The blog automatically lists published posts. The URL pattern is `/posts/YYYY/MM/DD/title/`.

## Site links and operations
- Main academic website: https://zhouzedong.top
- Original Blog: https://zhouzedong.top/blog/ (redirect to the new site only after the independent site works)
- The full Security Deadline tracker remains on the academic website.
- Enable **Settings → Pages → Source: GitHub Actions** to build and deploy.
- Add a CNAME record for `blog` pointing to `2350082187zhou-ux.github.io` and set the custom domain in Pages.
- The six-hour scheduled deployment attempts to refresh the community deadline feed; official/manual dates remain a separate curated file.
- Never commit passwords, API keys, confidential datasets or unpublished sensitive experimental results.
