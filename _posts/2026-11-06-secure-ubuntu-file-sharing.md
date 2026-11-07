---
layout: cyber-post
title: "使用 SSH、SCP 和 SFTP 在 Windows 与 Ubuntu 之间安全共享文件"
date: 2026-11-06
categories: [Linux]
tags: [Ubuntu, VMware, SSH, SCP, SFTP, File Sharing, Networking]
excerpt: "记录一次 Ubuntu 虚拟机主机名与 DNS/ICMP 检查，并介绍如何通过 SSH、SCP 和 SFTP 与 Windows 安全传输文件。所有网络标识均已脱敏。"
author_profile: true
---

> **隐私声明：** 本文所有主机名、域名、用户名与路径仅作示例；不包含实验设备的真实 IP 地址、内部 DNS 名称、非公开端口、凭据或原始终端截图。

![Windows 与 Ubuntu 通过 SSH/SCP/SFTP 加密传输文件的示意图]({{ '/assets/blog/secure-ubuntu-file-transfer.svg' | relative_url }})

## 为什么记录这个过程？

做 Linux 系统与 I/O 实验时，经常要在 Windows 主机和 Ubuntu 虚拟机之间移动代码、日志、数据集与结果报告。无需把文件先上传到云盘：只要两台设备在获授权的网络中可互相访问，就可以通过 SSH 连接，用 SCP 或 SFTP 安全地传输文件。

本文将**已经完成的环境检查**与**后续可以执行的文件共享步骤**分开说明。实验截图仅证明本机主机名查询、DNS 解析与 ICMP 响应正常；没有证明远程 SSH 已开放或文件传输已经成功。

## 1. Ubuntu 环境及主机名检查

实验环境为 VMware Workstation 中的 Ubuntu Linux。在 Ubuntu 终端中执行：

```bash
hostname
pwd
```

示例输出（已替换真实标识）：

```text
lab-vm
/home/labuser
```

`hostname` 返回主机名，`pwd` 返回当前目录。主机名不一定能被另一台电脑直接解析；需要 DNS、局域网解析机制或合适的本地 hosts 记录。

## 2. DNS 与网络连通性

在已配置名称解析的前提下，可以先检查域名：

```bash
ping -c 2 lab-vm.example.invalid
```

`example.invalid` 是特意选用的占位域名，**不能直接用于真实连接**。这次实验的原始输出中，两次 ICMP 请求均收到回应，丢包率为 0%，平均往返时间约为 0.404 ms。

但这只是对实验名称对应主机的 ICMP 测试，**不代表另一台计算机能够连接这台虚拟机，也不代表 SSH 已开启**。下一步应从实际要传输文件的客户端验证访问。

## 3. 在 Ubuntu 上准备 SSH 服务

仅在你有权管理的 Ubuntu 机器上执行：

```bash
sudo apt update
sudo apt install openssh-server
sudo systemctl enable --now ssh
sudo systemctl status ssh
```

状态为 `active (running)` 时说明服务正在运行。如果在防火墙、虚拟机 NAT/桥接或机构网络策略下仍不可达，需要检查对应网络配置。不要为了传文件随意把 SSH 暴露到公网，优先使用机构认可的 VPN、受控网络和 SSH 公钥认证。

## 4. 从 Windows 连接 Ubuntu

打开 Windows PowerShell，在确认主机真实名称、SSH 服务已启用且访问获授权后执行：

```powershell
ssh labuser@YOUR_AUTHORIZED_HOST
```

`labuser` 是示例登录用户，`YOUR_AUTHORIZED_HOST` 需要替换成你实际拥有权限的主机名称或地址。首次连接应通过可信渠道核实 SSH 主机密钥指纹。如果管理员配置了自定义 SSH 端口，请从私有配置中获取；不要在公开博客中粘贴实际端口。

连接成功后可以运行：

```bash
pwd
ls -lah
cd ~/io-experiment
```

## 5. 使用 SCP 下载或上传实验文件

以下命令从 **Windows PowerShell** 执行。

**Ubuntu → Windows：下载单个文件**

```powershell
scp labuser@YOUR_AUTHORIZED_HOST:~/io-experiment/result.txt "$HOME\Downloads\"
```

**Ubuntu → Windows：下载整个实验目录**

```powershell
scp -r labuser@YOUR_AUTHORIZED_HOST:~/io-experiment "$HOME\Downloads\"
```

**Windows → Ubuntu：上传文件**

```powershell
scp "$HOME\Documents\test.txt" labuser@YOUR_AUTHORIZED_HOST:~/io-experiment/
```

上传前应确保远程目录存在且当前账号有写入权限。对重要实验数据，可以在两端计算 SHA-256 来验证文件完整性。SCP 本身通过 SSH 提供加密传输。

## 6. 使用 SFTP 交互式管理文件

需要按目录逐个浏览和传输文件时，可以使用 SFTP：

```powershell
sftp labuser@YOUR_AUTHORIZED_HOST
```

连接后常见命令：

```text
pwd
ls
cd io-experiment
get result.txt
put test.txt
bye
```

也可以选择支持 SFTP 的图形化客户端，前提仍然是网络可达、账号获授权、SSH 服务已配置。

## 7. 发布实验记录前的安全检查

- 不发布真实 IP 地址、内部 DNS 名称、设备完整主机名或非公开 SSH 端口。
- 不发布私钥、密码、访问令牌、连接配置中的凭据或未脱敏的终端截图。
- 使用最小权限账号与 SSH 公钥认证，限制可访问的目录及来源。
- 不把 `ping` 通或 SSH 服务启动误写成“已经完成跨设备文件传输”。
- 共享研究数据前检查内容是否涉及隐私、受限数据或机构保密要求。

## 总结

这次 VMware Ubuntu 实验确认了主机名查询、名称解析以及 ICMP 响应。基于这一基础，可以进一步通过 OpenSSH、SCP 和 SFTP，在 Windows 与 Ubuntu 之间建立受控、加密的文件传输流程，特别适合研究代码、I/O 监控日志与实验报告的管理。

真正跨设备的远程登录与文件传输仍需要从客户端验证；本文给出的命令是操作指南，而不是对尚未进行测试的结果作出声明。
