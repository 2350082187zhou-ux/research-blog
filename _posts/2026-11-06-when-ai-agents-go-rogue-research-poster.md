---
layout: cyber-post
title: "When AI Agents Go Rogue: Who Protects Your Files? — Research Poster"
date: 2026-11-06
categories: [Research]
tags: [AI Agent Security, File Protection, Linux, eBPF, Storage Security, Poster]
excerpt: "Research poster by Zedong Zhou and Niusen Chen: experimentally assessing how a root-privileged Claude Code agent bypasses protections at file-system, kernel and block-device layers."
author_profile: true
---

> **Research poster** · Zedong Zhou and Niusen Chen · Department of Computer Science and Engineering, University of Nevada, Reno.

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

This page publishes the poster's research content and a newly prepared web overview graphic. The original PDF attachment has **not** been uploaded to the public site, so no PDF download is claimed here.
