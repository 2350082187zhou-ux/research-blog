---
layout: cyber-post
title: "Ubuntu File Sharing: SSH, SCP, SFTP and Browser Downloads"
title_en: "Ubuntu File Sharing: SSH, SCP, SFTP and Browser Downloads"
title_zh: "Ubuntu 文件共享实战：SSH、SCP、SFTP 与浏览器 HTTP 下载"
date: 2026-11-06
categories: [Linux]
tags: [Ubuntu, VMware, SSH, SCP, SFTP, HTTP, File Sharing, Networking]
excerpt: "A practical guide to secure transfers and browser-based downloads from an Ubuntu VM, with redacted network identifiers."
excerpt_en: "A practical guide to secure transfers and browser-based downloads from an Ubuntu VM, with redacted network identifiers."
excerpt_zh: "在 Ubuntu 中使用 SSH/SCP/SFTP 传输文件，或通过 IP 与端口从浏览器下载实验文件；全部示例均已脱敏。"
author_profile: true
---

<div class="blog-language-panel" data-blog-lang="en" markdown="1">

> **Privacy note:** All hostnames, IP addresses, usernames, ports and directory names in this article are examples. No real network details or unredacted screenshots are published.

![Encrypted transfer between Windows and Ubuntu]({{ '/assets/blog/secure-ubuntu-file-transfer.svg' | relative_url }})

## Why share files between Windows and Ubuntu?

When conducting Linux storage and I/O experiments, we often need to move scripts, logs and reports between a Windows workstation and an Ubuntu VM. SSH/SCP/SFTP provide authenticated, encrypted file transfers. For quick demonstrations on a trusted private network, a temporary Python HTTP file server also allows downloads through a browser.

The first experiment verified the VM's hostname, name resolution and ICMP responses. A later screenshot shows a working browser directory listing. **Neither screenshot alone verifies an SSH transfer or a completed download.**

## 1. Check the hostname and working directory

In the Ubuntu terminal:

```bash
hostname
pwd
```

Sanitized output:

```text
lab-vm
/home/labuser
```

A hostname is not automatically resolvable from another computer; the network needs appropriate DNS, local name resolution or hosts configuration.

## 2. Check name resolution and connectivity

```bash
ping -c 2 lab-vm.example.invalid
```

The domain above is a deliberately invalid placeholder, not a usable server address. In the recorded experiment, two ICMP replies were received (0% loss), with approximately 0.404 ms average round-trip time. This does **not** prove remote SSH access is available.

## 3. Enable SSH on Ubuntu

On an Ubuntu machine you administer:

```bash
sudo apt update
sudo apt install openssh-server
sudo systemctl enable --now ssh
sudo systemctl status ssh
```

An `active (running)` status means the daemon is running. Actual access also depends on VM networking, firewalls and your organization's network policy. Prefer SSH public-key authentication and avoid unnecessary public exposure.

## 4. Connect from Windows

In Windows PowerShell:

```powershell
ssh labuser@YOUR_AUTHORIZED_HOST
```

Replace the placeholder host and user with credentials for a machine you are authorized to access. Verify the server's SSH host-key fingerprint through a trusted channel before accepting it. Keep any nondefault port details in private configuration.

Once connected:

```bash
pwd
ls -lah
cd ~/io-experiment
```

## 5. Transfer files with SCP

Run these commands in **Windows PowerShell**.

**Download one file from Ubuntu:**

```powershell
scp labuser@YOUR_AUTHORIZED_HOST:~/io-experiment/result.txt "$HOME\Downloads\"
```

**Download an entire directory:**

```powershell
scp -r labuser@YOUR_AUTHORIZED_HOST:~/io-experiment "$HOME\Downloads\"
```

**Upload a file to Ubuntu:**

```powershell
scp "$HOME\Documents\test.txt" labuser@YOUR_AUTHORIZED_HOST:~/io-experiment/
```

The destination folder must exist and be writable. For important datasets, compare SHA-256 hashes at both ends.

## 6. Use SFTP interactively

```powershell
sftp labuser@YOUR_AUTHORIZED_HOST
```

Within the interactive session:

```text
pwd
ls
cd io-experiment
get result.txt
put test.txt
bye
```

SFTP provides interactive file management over SSH, including encrypted transport and authentication.

## 7. Open and download shared files through a browser using an IP address and port

A second screenshot shows a browser page titled **Directory listing for /**, with clickable folder entries. The URL follows this general format:

```text
http://<HOST_IP>:<PORT>/
```

The original screenshot includes a real network address, listening port and research folder names. To protect them, the public blog uses this **fictional illustration** instead:

![Sanitized example of a browser HTTP directory listing]({{ '/assets/blog/http-directory-listing-redacted.svg' | relative_url }})

*Illustrative only; all host details and folder names have been replaced.*

### 7.1 Prepare a dedicated share folder

```bash
mkdir -p ~/public-share
cp ~/io-experiment/result.txt ~/public-share/  # Only if safe to share
cd ~/public-share
```

Avoid sharing your whole home directory, credentials, or raw sensitive research data.

### 7.2 Start a temporary Python HTTP server

```bash
SHARE_IP="YOUR_AUTHORIZED_PRIVATE_IP"
SHARE_PORT="YOUR_APPROVED_PORT"
python3 -m http.server "$SHARE_PORT" --bind "$SHARE_IP" --directory "$HOME/public-share"
```

Both variables above are **placeholders** and require actual private values to run. The receiving computer must be able to reach the Ubuntu VM's listening address and port; VM NAT/bridged settings and firewalls can affect connectivity. To preview from Ubuntu alone, bind to `127.0.0.1`.

### 7.3 Browse and download

In a browser on an authorized computer:

```text
http://<HOST_IP>:<PORT>/
```

The root `/` maps to the directory passed to `--directory`. Clicking a folder browses into it; clicking a file normally displays or downloads it, depending on its type and browser settings.

The screenshot confirms directory browsing, **not** that a download completed successfully.

### 7.4 Stop sharing when finished

Press `Ctrl+C` in the Ubuntu terminal running the server, and verify the service is no longer accessible.

**Security limitation:** Python `http.server` provides no built-in login authentication or HTTPS encryption. Anyone who can reach its address and port may browse and download files in the shared folder. Use it only for temporary, non-sensitive sharing on a trusted network. For confidential data, use SSH/SFTP or a properly secured file server.

## 8. Checklist before publishing an experiment

- Redact real IP addresses, internal hostnames, ports and sensitive directory names.
- Never publish SSH keys, passwords, tokens or unredacted terminal/browser screenshots.
- Restrict sharing to approved networks and minimum necessary files.
- Do not confuse successful ICMP or directory listing with proof of a successful file transfer.
- Check institutional policies and data-handling requirements before sharing research data.

## Conclusion

The Ubuntu experiment confirms hostname resolution, ICMP responses and a browser-accessible directory listing. For real file sharing, SSH/SCP/SFTP support authenticated encrypted transfers, whereas a temporary Python HTTP server can offer convenient browser downloads on a trusted local network. Choose the appropriate method for the sensitivity of the data.

</div>

<div class="blog-language-panel" data-blog-lang="zh" markdown="1">


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

## 7. 通过 IP 和端口在浏览器中浏览、下载 Ubuntu 文件夹

除了 SSH/SCP/SFTP，本次新增的实验截图还展示了更直观的方式：**在 Ubuntu 上启动一个临时 HTTP 文件服务器，再从另一台设备的浏览器输入主机 IP 和监听端口，即可看到目录列表并点击下载文件**。浏览器页面标题为 `Directory listing for /`，可见多个可点击的目录链接。

该截图证明浏览器已经获得了目录列表，**但没有证明文件已被实际下载、传输已加密或访问受到认证保护**。原始截图含有实际网络地址、端口以及实验目录名称，因此不在公共博客中展示。下面用完全虚构的文件名及占位符复现显示效果：

![脱敏的 HTTP 文件目录浏览器示意图：虚构 IP、端口和目录名称]({{ '/assets/blog/http-directory-listing-redacted.svg' | relative_url }})

*图：脱敏示意图，并非原始截图。域名/IP、端口和文件名均是占位符或虚构示例。*

### 7.1 选定要分享的目录

推荐单独创建只包含**允许公开给同一受控网络内访问者的文件**的共享目录，不要直接分享 `$HOME` 或含有密钥、隐私和实验原始数据的整个目录。

```bash
mkdir -p ~/public-share
cp ~/io-experiment/result.txt ~/public-share/  # 仅当该文件适合分享
cd ~/public-share
pwd
```

### 7.2 启动临时 HTTP 服务

Ubuntu 自带的 Python 3 提供了简易静态文件服务：

```bash
# 在私有终端中设置实际的、已获准使用的地址与端口（不要提交到公开仓库）
SHARE_IP="YOUR_AUTHORIZED_PRIVATE_IP"
SHARE_PORT="YOUR_APPROVED_PORT"

python3 -m http.server "$SHARE_PORT" --bind "$SHARE_IP" --directory "$HOME/public-share"
```

这里的 `YOUR_AUTHORIZED_PRIVATE_IP` 和 `YOUR_APPROVED_PORT` 是**占位符**，不能原样运行；请只在可信的局域网、实验网或机构允许的网络中替换成实际值。端口必须与命令中指定的监听端口一致，目标电脑也必须能够路由访问该地址；虚拟机 NAT、桥接模式及防火墙配置都可能影响访问。

如果仅在 Ubuntu **本机**预览，可改用 `--bind 127.0.0.1`，但此时另一台电脑无法直接访问该监听地址。

### 7.3 在另一台电脑的浏览器中打开文件列表

在客户端浏览器地址栏输入：

```text
http://<HOST_IP>:<PORT>/
```

其中：

- `HOST_IP` 表示运行临时文件服务的 Ubuntu 主机地址；
- `PORT` 表示启动服务时指定的端口；
- `/` 对应 `--directory` 指定的共享目录根目录。

成功连接时，会显示类似 `Directory listing for /` 的页面。**点击文件名通常会在浏览器中打开或触发下载**；点击目录名则进入该子目录。是否能下载取决于文件权限、网络连通性与浏览器行为。

### 7.4 共享结束后及时关闭

在运行 `http.server` 的 Ubuntu 终端按 `Ctrl+C` 停止服务器，并核实该端口不再提供目录访问。

**安全限制：** Python 的 `http.server` 是临时开发工具，**默认没有登录认证，也不提供 HTTPS 加密**。知道地址且能访问对应端口的人，可能浏览及下载共享目录中的内容。不要将服务直接暴露到公网，更不能用于共享凭据、私人财务文件、受限科研数据或其他敏感文件。如果需要加密与身份验证，优先使用前面介绍的 SSH/SFTP 或经过正确配置的安全文件服务。

## 8. 发布实验记录前的安全检查

- 不发布真实 IP 地址、内部 DNS 名称、设备完整主机名、实际 HTTP/SSH 监听端口或能定位设备的浏览器地址。
- 不发布私钥、密码、访问令牌、连接配置中的凭据或未脱敏的终端截图；目录列表里的敏感文件夹名称也要替换。
- 使用最小权限账号与 SSH 公钥认证，限制可访问的目录及来源。
- 不把 `ping` 通或 SSH 服务启动误写成“已经完成跨设备文件传输”。
- 共享研究数据前检查内容是否涉及隐私、受限数据或机构保密要求。

## 总结

这次 VMware Ubuntu 实验确认了主机名查询、名称解析以及 ICMP 响应。后续浏览器截图还展示了通过 **IP 地址 + 端口** 打开 Ubuntu 文件目录列表的效果。可使用 Python `http.server` 在可信实验网络里演示目录浏览与下载；需要加密和认证时，应选用 SSH/SCP/SFTP。

真正跨设备的远程登录与文件传输仍需要从客户端验证；本文给出的命令是操作指南，而不是对尚未进行测试的结果作出声明。

</div>
