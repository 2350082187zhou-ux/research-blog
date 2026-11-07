---
layout: cyber-post
title: "Ubuntu File Sharing: SSH, SCP, SFTP and Browser Downloads"
title_en: "Ubuntu File Sharing: SSH, SCP, SFTP and Browser Downloads"
title_zh: "Ubuntu 文件共享实战：SSH、SCP、SFTP 与浏览器 HTTP 下载"
title_ja: "Ubuntuのファイル共有：SSH・SCP・SFTPとブラウザダウンロード"
title_ko: "Ubuntu 파일 공유: SSH·SCP·SFTP 및 브라우저 다운로드"
title_de: "Dateifreigabe unter Ubuntu: SSH, SCP, SFTP und Browser-Downloads"
title_fr: "Partager des fichiers sous Ubuntu : SSH, SCP, SFTP et téléchargement Web"
date: 2026-11-06
categories: [Linux]
tags: [Ubuntu, VMware, SSH, SCP, SFTP, HTTP, File Sharing, Networking]
excerpt: "A practical guide to secure transfers and browser-based downloads from an Ubuntu VM, with redacted network identifiers."
excerpt_en: "A practical guide to secure transfers and browser-based downloads from an Ubuntu VM, with redacted network identifiers."
excerpt_zh: "在 Ubuntu 中使用 SSH/SCP/SFTP 传输文件，或通过 IP 与端口从浏览器下载实验文件；全部示例均已脱敏。"
excerpt_ja: "Ubuntu仮想マシンとWindows間の安全な転送、IPとポートを使ったブラウザでのダウンロードを紹介します。"
excerpt_ko: "Ubuntu와 Windows 사이의 안전한 파일 전송과 IP·포트를 이용한 브라우저 다운로드를 설명합니다."
excerpt_de: "Anleitung zu verschlüsselten Transfers und Browser-Downloads zwischen Windows und einer Ubuntu-VM – mit anonymisierten Netzwerkangaben."
excerpt_fr: "Guide du transfert sécurisé et du téléchargement Web entre Windows et une VM Ubuntu, avec les informations réseau masquées."
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

<div class="blog-language-panel" data-blog-lang="ja" markdown="1">

> **プライバシー保護：** 実際のIPアドレス、内部ホスト名、ポート番号、個人用ディレクトリ名、未加工のスクリーンショットは公開していません。以下は架空の例です。

![WindowsとUbuntuの暗号化されたファイル転送]({{ '/assets/blog/secure-ubuntu-file-transfer.svg' | relative_url }})

## はじめに

LinuxのI/O実験では、Ubuntu仮想マシンとWindowsの間でコード、ログ、レポートを転送することがあります。SSH/SCP/SFTPは認証と暗号化を提供します。一方、Pythonの一時HTTPサーバーを使えば、信頼できるネットワーク内でブラウザからファイル一覧を表示し、ダウンロードできます。

最初の画面はホスト名の解決とICMP応答を示し、次の画面ではブラウザにディレクトリ一覧が表示されました。**画面だけではSSH転送やダウンロード完了までは証明できません。**

## 1. ホスト名とネットワークの確認

Ubuntu上で `hostname` と `pwd` を実行し、必要に応じて `ping -c 2 lab-vm.example.invalid` で名前解決とICMP応答を確認します。`example.invalid` は実際には接続できないダミードメインです。

記録された実験では2回の応答があり、パケット損失は0%、平均往復時間は約0.404 msでした。ただし、これは外部からSSH接続できることを意味しません。

## 2. SSHサーバーの設定

管理権限のあるUbuntuでのみ次の操作を行います。

```bash
hostname
pwd
# SSH server (on a host you administer)
sudo apt update
sudo apt install openssh-server
sudo systemctl enable --now ssh
```

SSHサービスが稼働しても、ファイアウォールやVMのNAT/ブリッジ設定によっては他のコンピューターからアクセスできません。公開ネットワークへの不要な公開を避け、公開鍵認証を推奨します。

## 3. Windowsから接続・転送

Windows PowerShellで実行します。ホスト名とユーザー名は権限のある実機の情報へ置き換え、初回接続時はサーバーの鍵指紋を安全な経路で確認してください。

```powershell
ssh labuser@YOUR_AUTHORIZED_HOST
scp labuser@YOUR_AUTHORIZED_HOST:~/io-experiment/result.txt "$HOME\Downloads\"
scp -r labuser@YOUR_AUTHORIZED_HOST:~/io-experiment "$HOME\Downloads\"
scp "$HOME\Documents\test.txt" labuser@YOUR_AUTHORIZED_HOST:~/io-experiment/
sftp labuser@YOUR_AUTHORIZED_HOST
```

SCPはファイルまたはディレクトリをコピーし、SFTPは対話的な転送に使えます。ファイルの整合性を確認する場合は両端でSHA-256を比較します。

## 4. IPアドレスとポートを入力してブラウザからダウンロード

別の実験画面には、`Directory listing for /` というタイトルでディレクトリへのリンクが表示されていました。実際のアドレス・ポート・フォルダ名を隠すため、公開ページには次のサンプル画像のみを載せます。

![匿名化されたHTTPディレクトリ一覧]({{ '/assets/blog/http-directory-listing-redacted.svg' | relative_url }})

まず、共有許可されたファイルだけを入れた専用ディレクトリを用意し、一時HTTPサーバーを起動します。

```bash
mkdir -p ~/public-share
# Copy only files approved for sharing into ~/public-share
SHARE_IP="YOUR_AUTHORIZED_PRIVATE_IP"
SHARE_PORT="YOUR_APPROVED_PORT"
python3 -m http.server "$SHARE_PORT" --bind "$SHARE_IP" --directory "$HOME/public-share"
```

次に、許可された別のコンピューターのブラウザで以下にアクセスします。

```text
http://<HOST_IP>:<PORT>/
```

`HOST_IP` と `PORT` は**プレースホルダー**です。実際のIPと待受ポートが必要で、ネットワーク到達性とファイアウォール設定にも依存します。ディレクトリ内のファイルをクリックすると、形式とブラウザ設定に応じて表示またはダウンロードされます。

終了時はHTTPサーバーの端末で `Ctrl+C` を押します。

## 5. セキュリティ上の注意

Pythonの `http.server` には、既定でログイン認証もHTTPS暗号化もありません。アクセス可能な利用者は公開したディレクトリ内を閲覧・ダウンロードできる可能性があります。機密ファイルは共有しないでください。重要なデータにはSSH/SFTP、または適切に保護されたファイルサービスを使ってください。

## まとめ

実験では、Ubuntuの名前解決・ICMP応答とHTTPディレクトリ一覧を確認しました。暗号化と認証が必要な転送にはSSH/SCP/SFTP、限定された信頼ネットワークでの簡単な共有には一時HTTPサーバーが使えます。

</div>

<div class="blog-language-panel" data-blog-lang="ko" markdown="1">

> **개인정보 보호:** 실제 IP 주소, 내부 호스트 이름, 포트 번호, 민감한 폴더 이름 및 원본 화면 사진은 공개하지 않습니다. 모든 주소는 예시입니다.

![Windows와 Ubuntu 사이의 암호화된 파일 전송]({{ '/assets/blog/secure-ubuntu-file-transfer.svg' | relative_url }})

## 개요

Linux I/O 실험에서는 Windows와 Ubuntu 가상 머신 사이에 코드, 로그와 보고서를 전송해야 할 때가 많습니다. SSH/SCP/SFTP는 인증과 암호화를 제공하며, 신뢰할 수 있는 네트워크에서는 Python의 임시 HTTP 서버로 브라우저 다운로드를 제공할 수도 있습니다.

첫 번째 실험은 호스트 이름 확인, DNS/ICMP 응답을 보여 줍니다. 두 번째 스크린샷은 브라우저의 디렉터리 목록을 보여 주지만, **그 자체로 SSH 전송이나 다운로드 완료를 입증하지는 않습니다.**

## 1. 호스트 이름과 연결 확인

Ubuntu에서 `hostname`, `pwd`를 실행하고 `ping -c 2 lab-vm.example.invalid`로 이름 확인과 ICMP 응답을 점검할 수 있습니다. `example.invalid`는 실제 연결에 사용할 수 없는 예시 도메인입니다.

기록된 테스트에서 ICMP 응답 2개가 수신되었고 손실률은 0%, 평균 왕복 시간은 약 0.404 ms였습니다. 다른 컴퓨터에서 SSH 접속이 가능하다는 뜻은 아닙니다.

## 2. Ubuntu에서 SSH 서비스 실행

관리 권한이 있는 Ubuntu에서만 실행합니다.

```bash
hostname
pwd
# SSH server (on a host you administer)
sudo apt update
sudo apt install openssh-server
sudo systemctl enable --now ssh
```

서비스가 실행 중이어도 가상 머신의 NAT/브리지 설정이나 방화벽 때문에 외부 접속이 제한될 수 있습니다. 불필요한 공용 인터넷 노출을 피하고 SSH 공개키 인증을 권장합니다.

## 3. Windows에서 접속 및 파일 전송

Windows PowerShell에서 실행합니다. 예시 사용자 이름과 호스트를 승인된 실제 정보로 변경하고, 처음 접속할 때 서버 호스트 키 지문을 확인하세요.

```powershell
ssh labuser@YOUR_AUTHORIZED_HOST
scp labuser@YOUR_AUTHORIZED_HOST:~/io-experiment/result.txt "$HOME\Downloads\"
scp -r labuser@YOUR_AUTHORIZED_HOST:~/io-experiment "$HOME\Downloads\"
scp "$HOME\Documents\test.txt" labuser@YOUR_AUTHORIZED_HOST:~/io-experiment/
sftp labuser@YOUR_AUTHORIZED_HOST
```

SCP는 단일 파일과 폴더 복사에 사용하고 SFTP는 대화형 전송에 사용합니다. 중요한 파일은 양쪽에서 SHA-256 해시를 비교할 수 있습니다.

## 4. IP 주소와 포트로 브라우저 파일 다운로드

브라우저 화면에는 `Directory listing for /`와 클릭 가능한 폴더 링크가 나타났습니다. 원본의 실제 네트워크 정보는 공개하지 않고 아래의 가상 예시 이미지만 사용합니다.

![익명화된 HTTP 디렉터리 목록 예시]({{ '/assets/blog/http-directory-listing-redacted.svg' | relative_url }})

공유하도록 승인된 파일만 전용 폴더에 두고 임시 HTTP 서버를 실행합니다.

```bash
mkdir -p ~/public-share
# Copy only files approved for sharing into ~/public-share
SHARE_IP="YOUR_AUTHORIZED_PRIVATE_IP"
SHARE_PORT="YOUR_APPROVED_PORT"
python3 -m http.server "$SHARE_PORT" --bind "$SHARE_IP" --directory "$HOME/public-share"
```

접속 권한이 있는 다른 컴퓨터에서 브라우저 주소창에 다음을 입력합니다.

```text
http://<HOST_IP>:<PORT>/
```

`HOST_IP`와 `PORT`는 실제 값이 아닌 **자리 표시자**입니다. 네트워크 연결, 가상 머신 설정과 방화벽 규칙이 맞아야 합니다. 파일을 클릭하면 브라우저와 파일 형식에 따라 미리 보거나 다운로드할 수 있습니다.

공유가 끝나면 서버를 실행한 터미널에서 `Ctrl+C`를 누릅니다.

## 5. 보안 주의 사항

Python `http.server`에는 기본적으로 로그인 인증이나 HTTPS 암호화가 없습니다. 해당 네트워크 주소에 접근할 수 있는 사용자는 공유 디렉터리의 파일을 열람하거나 다운로드할 수 있습니다. 민감한 정보는 공유하지 말고 SSH/SFTP 또는 적절하게 보호된 서버를 사용하세요.

## 결론

실험에서는 Ubuntu 호스트 이름과 ICMP 응답, 브라우저 디렉터리 목록을 확인했습니다. 인증과 암호화가 필요하면 SSH/SCP/SFTP를 사용하고, 임시 브라우저 공유는 신뢰할 수 있는 네트워크의 비민감 파일로 제한해야 합니다.

</div>

<div class="blog-language-panel" data-blog-lang="de" markdown="1">

> **Datenschutz:** Echte IP-Adressen, interne Hostnamen, Ports, vertrauliche Ordnernamen und unveränderte Bildschirmfotos werden nicht veröffentlicht. Alle Angaben sind Beispiele.

![Verschlüsselter Dateitransfer zwischen Windows und Ubuntu]({{ '/assets/blog/secure-ubuntu-file-transfer.svg' | relative_url }})

## Einführung

Bei Linux-I/O-Experimenten müssen Skripte, Protokolle und Berichte häufig zwischen Windows und einer Ubuntu-VM übertragen werden. SSH/SCP/SFTP bieten Authentifizierung und verschlüsselte Übertragung. In einem vertrauenswürdigen privaten Netzwerk erlaubt ein temporärer Python-HTTP-Server zusätzlich Downloads im Browser.

Der erste Test bestätigt Hostname, Namensauflösung und ICMP-Antworten. Ein späteres Bildschirmfoto zeigt eine Verzeichnisliste im Browser. **Daraus lässt sich jedoch weder ein abgeschlossener Download noch eine SSH-Übertragung ableiten.**

## 1. Hostname und Netzwerk prüfen

Mit `hostname` und `pwd` werden Hostname und Verzeichnis angezeigt. `ping -c 2 lab-vm.example.invalid` dient als Beispiel für eine ICMP-Prüfung. Die Domain `example.invalid` ist absichtlich ungültig.

Im aufgezeichneten Versuch kamen zwei Antworten bei 0 % Paketverlust an; die durchschnittliche Antwortzeit betrug etwa 0,404 ms. Das beweist keine Erreichbarkeit des SSH-Dienstes von einem anderen Rechner.

## 2. SSH unter Ubuntu einrichten

Nur auf einem von Ihnen verwalteten Ubuntu-System ausführen:

```bash
hostname
pwd
# SSH server (on a host you administer)
sudo apt update
sudo apt install openssh-server
sudo systemctl enable --now ssh
```

Ob andere Rechner zugreifen können, hängt zusätzlich von Firewall, VM-Netzwerkmodus und den Sicherheitsrichtlinien ab. Vermeiden Sie die unnötige Veröffentlichung im Internet und bevorzugen Sie SSH-Schlüssel.

## 3. Verbindung und Dateiübertragung unter Windows

Folgende Befehle werden in Windows PowerShell verwendet. Ersetzen Sie Platzhalter durch autorisierte Angaben und überprüfen Sie bei der ersten Verbindung den Host-Schlüssel-Fingerabdruck.

```powershell
ssh labuser@YOUR_AUTHORIZED_HOST
scp labuser@YOUR_AUTHORIZED_HOST:~/io-experiment/result.txt "$HOME\Downloads\"
scp -r labuser@YOUR_AUTHORIZED_HOST:~/io-experiment "$HOME\Downloads\"
scp "$HOME\Documents\test.txt" labuser@YOUR_AUTHORIZED_HOST:~/io-experiment/
sftp labuser@YOUR_AUTHORIZED_HOST
```

SCP kopiert Dateien und Verzeichnisse; SFTP ermöglicht eine interaktive Übertragung. Bei wichtigen Daten können SHA-256-Prüfsummen verglichen werden.

## 4. Dateien über IP-Adresse und Port im Browser herunterladen

Der weitere Versuch zeigt eine Seite mit dem Titel `Directory listing for /` und anklickbaren Ordnern. Die öffentliche Abbildung enthält keine echten Netzwerkadressen oder Forschungsordner:

![Anonymisierte HTTP-Verzeichnisliste]({{ '/assets/blog/http-directory-listing-redacted.svg' | relative_url }})

Bereiten Sie ein Verzeichnis mit ausschließlich freigegebenen Dateien vor und starten Sie einen temporären HTTP-Server:

```bash
mkdir -p ~/public-share
# Copy only files approved for sharing into ~/public-share
SHARE_IP="YOUR_AUTHORIZED_PRIVATE_IP"
SHARE_PORT="YOUR_APPROVED_PORT"
python3 -m http.server "$SHARE_PORT" --bind "$SHARE_IP" --directory "$HOME/public-share"
```

Geben Sie auf einem berechtigten Client im Browser Folgendes ein:

```text
http://<HOST_IP>:<PORT>/
```

`HOST_IP` und `PORT` sind **Platzhalter** und müssen durch die genehmigten privaten Netzwerkdaten ersetzt werden. VM-NAT, Bridge-Modus und Firewalls beeinflussen die Erreichbarkeit. Dateien können je nach Browser angezeigt oder heruntergeladen werden. Beenden Sie den Server anschließend mit `Ctrl+C`.

## 5. Sicherheitsgrenzen

Pythons `http.server` besitzt standardmäßig weder Anmeldung noch HTTPS-Verschlüsselung. Jeder, der den Server erreichen kann, könnte die freigegebenen Dateien lesen und herunterladen. Für vertrauliche Inhalte sind SSH/SFTP oder ein abgesicherter Dateidienst vorzuziehen.

## Fazit

Bestätigt wurden Namensauflösung, ICMP-Antworten und eine sichtbare HTTP-Verzeichnisliste. Für geschützte Übertragungen eignen sich SSH/SCP/SFTP; temporäre HTTP-Freigaben sollten auf unkritische Dateien in einem vertrauenswürdigen Netzwerk begrenzt bleiben.

</div>

<div class="blog-language-panel" data-blog-lang="fr" markdown="1">

> **Confidentialité :** les véritables adresses IP, noms d’hôte internes, ports, noms de dossiers sensibles et captures d’écran originales ne sont pas publiés. Toutes les données réseau présentées sont fictives.

![Transfert chiffré entre Windows et Ubuntu]({{ '/assets/blog/secure-ubuntu-file-transfer.svg' | relative_url }})

## Introduction

Dans les expériences Linux et d’E/S, il faut souvent déplacer du code, des journaux et des rapports entre Windows et une machine virtuelle Ubuntu. SSH/SCP/SFTP permettent des transferts authentifiés et chiffrés. Sur un réseau privé de confiance, un serveur HTTP Python temporaire peut aussi proposer un téléchargement via le navigateur.

Le premier test montre la résolution du nom d’hôte et les réponses ICMP. Une capture ultérieure affiche une liste de dossiers dans le navigateur. **Ces images ne prouvent ni le téléchargement complet d’un fichier ni la réussite d’une session SSH.**

## 1. Vérifier le nom d’hôte et le réseau

Les commandes `hostname` et `pwd` indiquent le nom de la machine et le dossier courant. `ping -c 2 lab-vm.example.invalid` illustre un test ICMP ; `example.invalid` est un domaine volontairement non fonctionnel.

L’expérience enregistrée a reçu deux réponses, avec 0 % de perte et un temps aller-retour moyen d’environ 0,404 ms. Cela ne prouve pas qu’un service SSH soit accessible depuis un autre ordinateur.

## 2. Activer SSH sur Ubuntu

Sur un système Ubuntu que vous êtes autorisé à administrer :

```bash
hostname
pwd
# SSH server (on a host you administer)
sudo apt update
sudo apt install openssh-server
sudo systemctl enable --now ssh
```

L’accès distant dépend également du pare-feu, du réseau NAT ou pont de la VM et de la politique de l’établissement. Évitez toute exposition inutile à Internet et privilégiez les clés SSH.

## 3. Se connecter et transférer depuis Windows

Dans Windows PowerShell, remplacez les identifiants fictifs par ceux d’une machine autorisée et vérifiez l’empreinte de la clé hôte lors de la première connexion.

```powershell
ssh labuser@YOUR_AUTHORIZED_HOST
scp labuser@YOUR_AUTHORIZED_HOST:~/io-experiment/result.txt "$HOME\Downloads\"
scp -r labuser@YOUR_AUTHORIZED_HOST:~/io-experiment "$HOME\Downloads\"
scp "$HOME\Documents\test.txt" labuser@YOUR_AUTHORIZED_HOST:~/io-experiment/
sftp labuser@YOUR_AUTHORIZED_HOST
```

SCP copie des fichiers ou des dossiers et SFTP permet une gestion interactive. Pour des données importantes, comparez les empreintes SHA-256 des fichiers.

## 4. Télécharger depuis le navigateur avec une IP et un port

Une autre capture affiche `Directory listing for /` avec des dossiers cliquables. L’illustration publique masque toutes les coordonnées réseau et les noms de dossiers réels :

![Liste de fichiers HTTP anonymisée]({{ '/assets/blog/http-directory-listing-redacted.svg' | relative_url }})

Créez un dossier ne contenant que des fichiers approuvés pour le partage, puis lancez un serveur HTTP temporaire :

```bash
mkdir -p ~/public-share
# Copy only files approved for sharing into ~/public-share
SHARE_IP="YOUR_AUTHORIZED_PRIVATE_IP"
SHARE_PORT="YOUR_APPROVED_PORT"
python3 -m http.server "$SHARE_PORT" --bind "$SHARE_IP" --directory "$HOME/public-share"
```

Dans le navigateur d’un autre ordinateur autorisé, saisissez :

```text
http://<HOST_IP>:<PORT>/
```

`HOST_IP` et `PORT` sont des **espaces réservés**, pas de véritables coordonnées. La connexion dépend du réseau, du pare-feu et des réglages de la VM. Selon le type de fichier et le navigateur, un clic ouvre ou télécharge le document. Arrêtez ensuite le serveur avec `Ctrl+C`.

## 5. Limites de sécurité

Le module Python `http.server` n’intègre par défaut ni authentification ni chiffrement HTTPS. Toute personne pouvant joindre le service peut potentiellement consulter et télécharger les fichiers partagés. Pour des documents confidentiels, préférez SSH/SFTP ou un serveur correctement sécurisé.

## Conclusion

Les expériences ont confirmé la résolution du nom de machine, les réponses ICMP et l’affichage d’un répertoire HTTP. SSH/SCP/SFTP convient aux transferts sécurisés ; le serveur HTTP temporaire doit rester limité aux fichiers non sensibles d’un réseau de confiance.

</div>
