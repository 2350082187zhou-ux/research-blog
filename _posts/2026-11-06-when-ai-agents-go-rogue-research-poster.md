---
layout: cyber-post
title: "When AI Agents Go Rogue: Who Protects Your Files? — Research Poster"
title_en: "When AI Agents Go Rogue: Who Protects Your Files? — Research Poster"
title_zh: "当 AI 智能体失控：谁来保护你的文件？——科研海报"
date: 2026-11-06
categories: [Research]
tags: [AI Agent Security, File Protection, Linux, eBPF, Storage Security, Poster]
excerpt: "Research poster by Zedong Zhou and Niusen Chen assessing host-side file protections against a root-privileged AI agent."
excerpt_en: "Research poster by Zedong Zhou and Niusen Chen assessing host-side file protections against a root-privileged AI agent."
excerpt_zh: "Zedong Zhou 与 Niusen Chen 的科研海报：实验评估 root 权限 AI 智能体对文件系统、内核和块设备保护的绕过能力。"
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
