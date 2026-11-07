---
layout: cyber-post
title: "When AI Agents Go Rogue: Who Protects Your Files? — Research Poster"
title_en: "When AI Agents Go Rogue: Who Protects Your Files? — Research Poster"
title_zh: "当 AI 智能体失控：谁来保护你的文件？——科研海报"
title_ja: "AIエージェントが暴走するとき：誰がファイルを守るのか？ — 研究ポスター"
title_ko: "AI 에이전트가 통제 불능이 될 때: 누가 파일을 보호하는가? — 연구 포스터"
title_de: "Wenn KI-Agenten außer Kontrolle geraten: Wer schützt Ihre Dateien? — Forschungsposter"
title_fr: "Quand les agents IA dérapent : qui protège vos fichiers ? — Poster de recherche"
date: 2026-11-06
categories: [Research]
tags: [AI Agent Security, File Protection, Linux, eBPF, Storage Security, Poster]
excerpt: "Research poster by Zedong Zhou and Niusen Chen assessing host-side file protections against a root-privileged AI agent."
excerpt_en: "Research poster by Zedong Zhou and Niusen Chen assessing host-side file protections against a root-privileged AI agent."
excerpt_zh: "Zedong Zhou 与 Niusen Chen 的科研海报：实验评估 root 权限 AI 智能体对文件系统、内核和块设备保护的绕过能力。"
excerpt_ja: "root権限を持つAIエージェントがファイルシステム、カーネル、ブロックデバイスの保護を回避するリスクを検証した研究。"
excerpt_ko: "root 권한 AI 에이전트가 파일 시스템, 커널, 블록 장치 보호를 우회하는 위험을 평가한 연구 포스터."
excerpt_de: "Forschungsposter über die Umgehung von Datei-, Kernel- und Blockgeräteschutz durch KI-Agenten mit Root-Rechten."
excerpt_fr: "Poster de recherche sur le contournement des protections du système de fichiers, du noyau et des périphériques blocs par un agent IA root."
author_profile: true
---

<div class="blog-language-panel" data-blog-lang="en" markdown="1">


> **Research poster** · Zedong Zhou and Niusen Chen · Department of Computer Science and Engineering, University of Nevada, Reno.

{% assign original_poster_pdf = site.static_files | where: "path", "/assets/blog/When AI Agents Go Rogue Who Protects Your Files.pdf" | first %}
{% if original_poster_pdf %}
<div style="margin:1.5rem 0;padding:1.2rem;border:1px solid #3b8199;border-radius:14px">
  <strong>Original research poster (PDF)</strong>
  <p><a href="{{ '/assets/blog/When%20AI%20Agents%20Go%20Rogue%20Who%20Protects%20Your%20Files.pdf' | relative_url }}" target="_blank" rel="noopener">Open the complete poster PDF ↗</a> · <a href="{{ '/assets/blog/When%20AI%20Agents%20Go%20Rogue%20Who%20Protects%20Your%20Files.pdf' | relative_url }}" download>Download PDF</a></p>
  <object data="{{ '/assets/blog/When%20AI%20Agents%20Go%20Rogue%20Who%20Protects%20Your%20Files.pdf' | relative_url }}" type="application/pdf" width="100%" height="760"><p>Your browser cannot preview PDFs. <a href="{{ '/assets/blog/When%20AI%20Agents%20Go%20Rogue%20Who%20Protects%20Your%20Files.pdf' | relative_url }}">Open the PDF</a>.</p></object>
</div>
{% else %}
> The original PDF is pending publication. The graphic below is a web-friendly conceptual overview; the complete research content is summarized in this post.
{% endif %}

![Poster overview showing root-privileged AI agents bypassing file-system, kernel, and block-device file protections]({{ '/assets/blog/ai-agents-go-rogue-poster-overview.svg' | relative_url }})

*Figure: Web-friendly conceptual overview adapted from the uploaded one-page poster. This is not an image of the original PDF poster.*

## Abstract

AI agents are increasingly capable of executing shell commands, manipulating files and interacting with operating-system interfaces. These capabilities become a threat to local data when an agent holds **root privileges**. Our poster evaluates three host-side layers of file protection against deletion by such an agent: file-system protection, kernel-level protection and block-device protection.

In the tested setup, the root-privileged agent bypassed or disabled all three evaluated defenses and deleted the target file. The results demonstrate the limits of protections controlled by the same potentially compromised operating system and motivate investigation of protection mechanisms outside that trust boundary.

## Motivation and threat model

Modern AI agents can work with files on personal computers and other devices. While this enables useful automation, privileged commands can also cause accidental or destructive file changes. Our threat model considers an AI agent with full root privileges and access to arbitrary shell commands and host administration interfaces.

**Goal:** protect a target text file containing simulated sensitive information from deletion by the agent.

## Experimental setup

| Component | Poster configuration |
|---|---|
| Operating system | Ubuntu 26.04 LTS |
| Linux kernel | 7.0.0-22-generic (x86-64) |
| File system | ext4 |
| AI agent | Claude Code |
| Language model | claude-sonnet-4-6 |
| Permissions | Full root privileges |
| Target | Text file with simulated sensitive content |

These configuration values reproduce what is printed on the submitted poster; they have not been independently revalidated here.

## Three tested defense layers

### 1. File-system protection

The experiment applies the Linux immutable attribute to make the target file resistant to changes or deletion. A root-privileged agent can change the attribute using `chattr` before deleting the target file.

**Observed result:** the file-system-level protection was bypassed.

### 2. Kernel protection: eBPF LSM

An eBPF Linux Security Module hook is used to monitor and block file deletion operations, including unlink actions. With host administrative privileges, the agent can unload or modify the protection program.

**Observed result:** the kernel-level protection was bypassed.

### 3. Block-device protection

The experiment applies a read-only setting at the block-device layer to prevent writes to the target file system. A root-privileged agent with administrative control can change the device or mount state before deletion.

**Observed result:** the block-device protection was bypassed.

## Main finding

**A defense controlled by the same root-compromised host may not provide a reliable security boundary against a root-privileged AI agent.** The poster's results concern the specific protections and configuration evaluated; they do not demonstrate that every conceivable host-side defense is ineffective.

## Future directions

The poster proposes studying mechanisms that remain enforceable even when the host operating system is not fully trusted:

- **TEE-enforced protection:** isolate authorization or critical control decisions within a trusted execution environment.
- **Flash-enforced protection:** enforce protected-file operations at the storage hardware or controller boundary, beyond ordinary host administration.

These are proposed research directions, not experimentally validated defenses in this poster.

## Original poster and citation

**Poster:** *When AI Agents Go Rogue: Who Protects Your Files?*  
**Authors:** Zedong Zhou, Niusen Chen  
**Affiliation:** Department of Computer Science and Engineering, University of Nevada, Reno.

This page publishes the poster's research content and a newly prepared web overview graphic. When the original PDF is added to the blog's public assets, the viewer and download links above will appear automatically.

</div>

<div class="blog-language-panel" data-blog-lang="zh" markdown="1">

> **科研海报** · Zedong Zhou、Niusen Chen · 美国内华达大学里诺分校计算机科学与工程系。

{% assign original_poster_pdf = site.static_files | where: "path", "/assets/blog/When AI Agents Go Rogue Who Protects Your Files.pdf" | first %}
{% if original_poster_pdf %}
<div class="poster-viewer">
  <strong>原始科研海报（PDF）</strong>
  <p><a href="{{ '/assets/blog/When%20AI%20Agents%20Go%20Rogue%20Who%20Protects%20Your%20Files.pdf' | relative_url }}" target="_blank" rel="noopener">打开完整海报 ↗</a> · <a href="{{ '/assets/blog/When%20AI%20Agents%20Go%20Rogue%20Who%20Protects%20Your%20Files.pdf' | relative_url }}" download>下载 PDF</a></p>
  <object data="{{ '/assets/blog/When%20AI%20Agents%20Go%20Rogue%20Who%20Protects%20Your%20Files.pdf' | relative_url }}" type="application/pdf" width="100%" height="760"><p>浏览器无法预览 PDF。<a href="{{ '/assets/blog/When%20AI%20Agents%20Go%20Rogue%20Who%20Protects%20Your%20Files.pdf' | relative_url }}">点击打开原始海报</a>。</p></object>
</div>
{% else %}
> 原始 PDF 尚未发布。下图为网页版研究概览，并非原始海报。
{% endif %}

![高权限 AI 智能体绕过文件系统、内核和块设备保护的研究示意图]({{ '/assets/blog/ai-agents-go-rogue-poster-overview.svg' | relative_url }})

*图：根据单页研究海报制作的网页概念示意图，不是原始 PDF 海报的截图。*

## 摘要

AI 智能体越来越多地承担命令执行、文件管理和操作系统交互任务。当智能体拥有 **root 权限**时，这些能力可能威胁本地数据的完整性。本海报从文件系统、内核和块设备三个层级，实验评估主机侧文件删除保护机制面对高权限 AI 智能体时的效果。

在所测试的环境中，智能体能够绕过或关闭三类被测试的保护措施，最终删除目标文件。这说明完全由同一台主机控制的防护机制存在信任边界限制，值得进一步研究独立于主机操作系统的保护方式。

## 研究动机与威胁模型

AI 智能体可在个人电脑和其他终端上自动处理文件，提高工作效率；但高权限命令也可能导致意外或破坏性的文件操作。本研究考虑具有完整 root 权限、可执行任意 Shell 命令并操作主机管理接口的 AI 智能体。

**防护目标：** 阻止智能体删除包含模拟敏感信息的目标文本文件。

## 实验环境

| 组件 | 海报记录的配置 |
|---|---|
| 操作系统 | Ubuntu 26.04 LTS |
| Linux 内核 | 7.0.0-22-generic (x86-64) |
| 文件系统 | ext4 |
| AI 智能体 | Claude Code |
| 语言模型 | claude-sonnet-4-6 |
| 权限 | 完整 root 权限 |
| 目标文件 | 包含模拟敏感信息的文本文件 |

以上参数均依据原始海报记录，本文未对其作额外独立验证。

## 测试的三层保护机制

### 1. 文件系统层

实验使用 Linux 不可变文件属性，尝试防止目标文件被修改或删除。但拥有 root 权限的智能体可以通过 `chattr` 改变属性，然后删除文件。

**实验结果：** 文件系统层保护被绕过。

### 2. 内核层：eBPF LSM

实验使用 eBPF Linux Security Module 钩子监控并阻止 `unlink` 等删除操作。拥有主机管理权限的智能体能够卸载或修改相应保护程序。

**实验结果：** 内核层保护被绕过。

### 3. 块设备层

实验对块设备设置只读限制，以阻止对目标文件系统的写入。拥有系统管理权限的智能体可以调整设备或挂载状态后删除目标文件。

**实验结果：** 块设备层保护被绕过。

## 核心发现

**当防护机制与具有 root 权限的 AI 智能体受同一主机管理时，防护机制可能无法建立独立、可靠的安全边界。**

这里的结论仅适用于海报中测试的具体机制和实验配置，并不代表所有主机侧防护技术都必然失效。

## 未来研究方向

海报提出研究即使主机操作系统不完全可信也能保持约束能力的防护机制：

- **TEE 强制保护：** 将授权判断或关键控制决策置于可信执行环境中。
- **Flash/存储硬件强制保护：** 在存储硬件或控制器层执行文件保护策略，使其不完全依赖主机管理员权限。

这些属于未来研究方向，并非海报中已经验证有效的防护方案。

## 海报信息与引用

**标题：** *When AI Agents Go Rogue: Who Protects Your Files?*  
**作者：** Zedong Zhou、Niusen Chen  
**单位：** University of Nevada, Reno — Department of Computer Science and Engineering。

本页面提供海报的中文内容介绍和网页研究示意图；原始 PDF 通过上方在线预览和下载链接提供。

</div>

<div class="blog-language-panel" data-blog-lang="ja" markdown="1">

> **研究ポスター** · Zedong Zhou、Niusen Chen · University of Nevada, Reno。

**[オリジナルのポスターPDFを開く]({{ '/assets/blog/When%20AI%20Agents%20Go%20Rogue%20Who%20Protects%20Your%20Files.pdf' | relative_url }})** · **[PDFをダウンロード]({{ '/assets/blog/When%20AI%20Agents%20Go%20Rogue%20Who%20Protects%20Your%20Files.pdf' | relative_url }})**

![研究内容の概略図]({{ '/assets/blog/ai-agents-go-rogue-poster-overview.svg' | relative_url }})

*この図はWeb用の概要図です。原本は上記のPDFをご覧ください。*

## 概要

AIエージェントは、シェルコマンドの実行、ファイル操作、OSとの連携を行います。**root権限**が与えられると、ローカルファイルの削除や改変が重大なリスクになります。本研究では、ファイルシステム、カーネル、ブロックデバイスの3層におけるホスト側の保護機構を実験的に評価しました。

テストした環境では、権限を持つエージェントが3つの保護を回避または無効化して対象ファイルを削除しました。ホスト自身が管理する防御だけでは、独立した信頼境界を確保できない可能性があります。

## 脅威モデルと実験環境

対象は、管理インターフェースやシェルを利用できるroot権限のClaude Codeエージェントです。Ubuntu 26.04 LTS、Linux 7.0.0-22-generic、ext4、モデルclaude-sonnet-4-6を使用し、模擬機密情報を含むテキストファイルの削除を防ぐことを目標としました。これらの設定は提出済みポスターの記載に基づきます。

## 検証した3層の保護

### 1. ファイルシステム層

変更不可属性を設定しても、root権限で `chattr` を操作すると属性を変更でき、ファイルを削除できます。**結果：回避されました。**

### 2. カーネル層（eBPF LSM）

`unlink` などの削除操作を監視・拒否するeBPF LSMプログラムを導入しました。しかし、ホスト管理権限によってプログラムを変更または取り外せます。**結果：回避されました。**

### 3. ブロックデバイス層

読み取り専用設定によって書き込みを抑止しましたが、管理権限でデバイスまたはマウント状態を変更できました。**結果：回避されました。**

## 結論と今後の研究

今回の結果はテストした設定と機構に限定され、すべてのホスト側保護が無効という意味ではありません。今後は、**TEEによる保護**と**フラッシュストレージ／コントローラによる独立した強制保護**を研究する方針です。これらはまだ検証済みの対策ではありません。

**著者：** Zedong Zhou、Niusen Chen · **所属：** University of Nevada, Reno。

</div>

<div class="blog-language-panel" data-blog-lang="ko" markdown="1">

> **연구 포스터** · Zedong Zhou, Niusen Chen · University of Nevada, Reno.

**[원본 포스터 PDF 열기]({{ '/assets/blog/When%20AI%20Agents%20Go%20Rogue%20Who%20Protects%20Your%20Files.pdf' | relative_url }})** · **[PDF 다운로드]({{ '/assets/blog/When%20AI%20Agents%20Go%20Rogue%20Who%20Protects%20Your%20Files.pdf' | relative_url }})**

![연구 개요 다이어그램]({{ '/assets/blog/ai-agents-go-rogue-poster-overview.svg' | relative_url }})

*이 이미지는 웹용 개요 그림이며 원본 포스터는 위 PDF에서 볼 수 있습니다.*

## 초록

AI 에이전트는 셸 명령 실행, 파일 조작, 운영체제와의 상호작용을 수행할 수 있습니다. **root 권한**이 주어지면 로컬 파일의 무단 삭제나 변경 위험이 커집니다. 본 포스터는 파일 시스템, 커널, 블록 장치 계층에서 적용한 세 가지 호스트 측 보호 방법을 실험적으로 평가합니다.

시험한 환경에서는 root 권한을 가진 에이전트가 모든 시험 대상 보호를 우회하거나 비활성화하고 대상 파일을 삭제했습니다. 이는 동일한 호스트가 제어하는 방어만으로 독립적인 신뢰 경계를 보장하기 어렵다는 점을 보여 줍니다.

## 위협 모델 및 실험 환경

에이전트는 임의의 셸 명령과 관리자 인터페이스를 사용할 수 있는 root 권한의 Claude Code입니다. 환경은 Ubuntu 26.04 LTS, Linux 7.0.0-22-generic, ext4, claude-sonnet-4-6이며, 모의 민감 정보가 들어 있는 텍스트 파일의 삭제를 막는 것을 목표로 했습니다. 수치는 제출한 원본 포스터의 기록을 따릅니다.

## 평가한 세 가지 보호 계층

### 1. 파일 시스템 계층

불변 파일 속성을 설정했지만 root 권한으로 `chattr` 속성을 변경한 뒤 파일을 삭제할 수 있었습니다. **결과: 우회됨.**

### 2. 커널 계층(eBPF LSM)

`unlink` 등 삭제 작업을 차단하는 eBPF LSM 훅을 적용했습니다. 그러나 관리자 권한으로 해당 프로그램을 수정하거나 해제할 수 있었습니다. **결과: 우회됨.**

### 3. 블록 장치 계층

읽기 전용 설정으로 기록을 막았으나 관리자가 장치 또는 마운트 상태를 변경할 수 있었습니다. **결과: 우회됨.**

## 결론과 향후 연구

결과는 시험한 환경과 보호 수단에 한정되며, 모든 호스트 측 보안이 무용하다는 뜻은 아닙니다. 향후 연구 방향은 **TEE 기반 강제 보호**와 **플래시/저장장치 컨트롤러 수준의 독립적인 보호**입니다. 두 방향 모두 아직 본 포스터에서 실험적으로 검증한 방어는 아닙니다.

**저자:** Zedong Zhou, Niusen Chen · **소속:** University of Nevada, Reno.

</div>

<div class="blog-language-panel" data-blog-lang="de" markdown="1">

> **Forschungsposter** · Zedong Zhou und Niusen Chen · University of Nevada, Reno.

**[Originalposter als PDF öffnen]({{ '/assets/blog/When%20AI%20Agents%20Go%20Rogue%20Who%20Protects%20Your%20Files.pdf' | relative_url }})** · **[PDF herunterladen]({{ '/assets/blog/When%20AI%20Agents%20Go%20Rogue%20Who%20Protects%20Your%20Files.pdf' | relative_url }})**

![Übersicht der experimentellen Schutzebenen]({{ '/assets/blog/ai-agents-go-rogue-poster-overview.svg' | relative_url }})

*Die Abbildung ist eine Web-Zusammenfassung. Das Originalposter steht als PDF zur Verfügung.*

## Zusammenfassung

KI-Agenten können Shell-Befehle ausführen, Dateien verwalten und direkt mit Betriebssystemfunktionen interagieren. Mit **Root-Rechten** können diese Fähigkeiten die Integrität lokaler Dateien gefährden. Wir untersuchen experimentell drei hostseitige Schutzebenen gegen Dateilöschung: Dateisystem, Kernel und Blockgerät.

In der getesteten Konfiguration konnte der privilegierte Agent alle untersuchten Schutzmaßnahmen umgehen oder abschalten und die Zieldatei löschen. Ein vom kompromittierbaren Host kontrollierter Mechanismus bildet daher möglicherweise keine unabhängige Sicherheitsgrenze.

## Bedrohungsmodell und Versuchsumgebung

Der Claude-Code-Agent verfügt über vollständige Root-Rechte und kann Shell-Befehle sowie Administrationsschnittstellen nutzen. Laut Poster wurden Ubuntu 26.04 LTS, Linux 7.0.0-22-generic, ext4 und claude-sonnet-4-6 verwendet. Geschützt werden sollte eine Textdatei mit simulierten sensiblen Informationen. Die Konfigurationsangaben wurden aus dem Originalposter übernommen.

## Drei untersuchte Schutzschichten

### 1. Dateisystem

Das unveränderliche Dateiattribut sollte Änderungen und Löschungen verhindern. Mit Root-Rechten konnte der Agent das Attribut über `chattr` ändern und anschließend die Datei löschen. **Ergebnis: umgangen.**

### 2. Kernel (eBPF LSM)

Ein eBPF-LSM-Hook überwachte und blockierte Löschvorgänge wie `unlink`. Host-Administrationsrechte ermöglichten jedoch eine Änderung oder Entfernung des Schutzprogramms. **Ergebnis: umgangen.**

### 3. Blockgerät

Eine Nur-Lese-Einstellung sollte Schreibzugriffe verhindern. Der Agent konnte mit ausreichenden Rechten Geräte- oder Mount-Zustände ändern. **Ergebnis: umgangen.**

## Fazit und Ausblick

Die Ergebnisse gelten für die konkret getesteten Mechanismen und beweisen nicht, dass jeder hostseitige Schutz unwirksam ist. Als zukünftige Forschungsrichtungen schlagen wir **TEE-basierte Durchsetzung** und **unabhängige Schutzmechanismen in Flash-Speicher beziehungsweise Controllern** vor. Diese Ansätze wurden auf dem Poster noch nicht als wirksame Verteidigung bestätigt.

**Autoren:** Zedong Zhou, Niusen Chen · **Institution:** University of Nevada, Reno.

</div>

<div class="blog-language-panel" data-blog-lang="fr" markdown="1">

> **Poster de recherche** · Zedong Zhou et Niusen Chen · University of Nevada, Reno.

**[Ouvrir le poster PDF original]({{ '/assets/blog/When%20AI%20Agents%20Go%20Rogue%20Who%20Protects%20Your%20Files.pdf' | relative_url }})** · **[Télécharger le PDF]({{ '/assets/blog/When%20AI%20Agents%20Go%20Rogue%20Who%20Protects%20Your%20Files.pdf' | relative_url }})**

![Vue d'ensemble des trois protections testées]({{ '/assets/blog/ai-agents-go-rogue-poster-overview.svg' | relative_url }})

*Cette illustration résume les travaux pour le Web ; le poster original se trouve dans le PDF.*

## Résumé

Les agents d’IA peuvent exécuter des commandes, gérer des fichiers et interagir avec le système d’exploitation. Lorsqu’un agent dispose des **privilèges root**, ces capacités peuvent menacer l’intégrité des données locales. Nous évaluons expérimentalement trois niveaux de protection contre la suppression de fichiers : système de fichiers, noyau et périphérique bloc.

Dans la configuration testée, l’agent privilégié a contourné ou désactivé chacune des protections évaluées et supprimé le fichier cible. Les mécanismes contrôlés par le même hôte peuvent donc ne pas constituer une frontière de confiance indépendante.

## Modèle de menace et environnement

L’agent Claude Code dispose des droits root complets et peut utiliser des commandes shell et des interfaces d’administration. Le poster indique Ubuntu 26.04 LTS, Linux 7.0.0-22-generic, ext4 et claude-sonnet-4-6. Le fichier cible est un document texte contenant des informations sensibles simulées. Ces paramètres reprennent le poster original.

## Trois niveaux de défense évalués

### 1. Système de fichiers

L’attribut immuable devait empêcher la modification ou la suppression. Avec les droits root, l’agent a pu modifier l’attribut via `chattr` puis supprimer le fichier. **Résultat : protection contournée.**

### 2. Noyau (eBPF LSM)

Un hook eBPF LSM surveillait et bloquait des suppressions comme `unlink`. Les droits d’administration permettaient toutefois de modifier ou de retirer le programme. **Résultat : protection contournée.**

### 3. Périphérique bloc

Une configuration en lecture seule devait bloquer les écritures. L’agent pouvait modifier l’état du périphérique ou du montage avec ses privilèges. **Résultat : protection contournée.**

## Conclusion et perspectives

Ces résultats concernent uniquement les mécanismes et la configuration étudiés : ils ne signifient pas que toute protection côté hôte est inefficace. Le poster propose d’explorer **une application des politiques dans un TEE** et **une protection indépendante au niveau de la mémoire flash ou du contrôleur de stockage**. Ces pistes ne constituent pas encore des défenses validées par cette étude.

**Auteurs :** Zedong Zhou, Niusen Chen · **Affiliation :** University of Nevada, Reno.

</div>
