# NET0ZE (Neetoze) — Local-First Desktop Network Monitoring & Cybersecurity Investigation Platform

[![Release](https://img.shields.io/badge/release-v2.0.0-blue.svg)](https://github.com/1viz3r0/netoze/releases/tag/v2.0.0)
[![Platform](https://img.shields.io/badge/platform-Windows%2010%2F11%20%7C%20Linux%20x86__64-brightgreen.svg)](https://1viz3r0.github.io/netoze-site/compatibilities.html)
[![Telemetry](https://img.shields.io/badge/telemetry-0%25%20(Local%20First)-success.svg)](https://1viz3r0.github.io/netoze-site/about.html)
[![License](https://img.shields.io/badge/license-Authorized%20Local%20Use-lightgrey.svg)](SECURITY.md)
[![RSS Feed](https://img.shields.io/badge/feed-RSS%202.0-orange.svg)](https://1viz3r0.github.io/netoze-site/feed.xml)

**NET0ZE** (frequently referred to phonetically as **Neetoze**) is a desktop network analysis and cybersecurity investigation application for Windows 10/11 and Linux. Built for security researchers, network engineers, SOC analysts, and students, NET0ZE bridges the gap between raw wire packet inspection and local host telemetry without sending sensitive data to external cloud servers.

🌐 **Official Website:** [1viz3r0.github.io/netoze-site](https://1viz3r0.github.io/netoze-site/)  
🚀 **Alternative Web Mirrors:** [neetoze.surge.sh](https://neetoze.surge.sh/) · [netoze.surge.sh](https://netoze.surge.sh/)  
📦 **Release Downloads:** [v2.0.0 Release Assets](https://github.com/1viz3r0/netoze/releases/tag/v2.0.0) · [Downloads & Checksums](https://1viz3r0.github.io/netoze-site/downloads.html)

---

## Table of Contents
- [Why NET0ZE?](#why-net0ze)
- [Core Capabilities](#core-capabilities)
- [How NET0ZE Compares to Traditional Tools](#how-net0ze-compares-to-traditional-tools)
- [Verified Release Artifacts (v2.0.0)](#verified-release-artifacts-v200)
- [Installation Quickstart](#installation-quickstart)
- [Source & Security Boundary](#source--security-boundary)
- [Documentation & Resources](#documentation--resources)

---

## Why NET0ZE?

Traditional network analysis forces a compromise:
- **Raw Packet Analyzers (e.g., Wireshark):** Unmatched at bit-level byte inspection, but completely isolated from operating system processes. You see packets, but cannot natively tell which process or PID initiated the flow.
- **Enterprise SIEM / EDR Clouds:** Require invasive corporate agents, continuous telemetry upload to third-party cloud servers, and expensive subscription models.

**NET0ZE** provides a privacy-first middle ground:
1. **100% Local-First Architecture:** Packet captures, host socket correlations, and evidence briefs stay strictly on local disk and RAM. Zero analytics, zero cloud egress.
2. **Orient → Trace → Explain Loop:** A guided investigation workflow that transitions from high-level topology into correlated packet flows, producing structured forensic evidence.
3. **100% Self-Made Local Engine:** Handcrafted packet analysis and socket tracking with zero third-party dependencies.

---

## Core Capabilities

- **Host Process Correlation:** Automatically maps network sockets and wire traffic to local process names and PIDs.
- **Native Live Packet Capture:** Custom high-performance local packet capture and socket correlation.
- **Incident Briefing & Evidence Export:** Generate portable SQLite/JSON evidence bundles with cryptographic timestamps for post-incident review.
- **Zero Cloud Footprint:** No accounts, no sign-ins, no licensing servers, and nothing installed into OS startup directories.

---

## How NET0ZE Compares to Traditional Tools

| Feature | NET0ZE (Neetoze) | Wireshark | Zeek / Bro | SaaS Network Monitoring |
|---|---|---|---|---|
| **Data Privacy** | **100% Local (Zero Egress)** | 100% Local | 100% Local | Cloud Synced / Telemetry |
| **Host Process Binding** | **Built-in (UI Unified)** | Missing / Disconnected | Requires custom tooling | Agent required |
| **Learning Curve** | **Low (Guided 3-step loop)** | Steep (Raw frames/hex) | High (CLI / Scripting) | Complex Query DSL |
| **Architecture** | **100% Self-Made Local** | Legacy C architecture | Cluster-based daemon | Proprietary cloud agent |
| **Operating Systems** | **Windows 10/11 & Linux** | Multiplatform | Linux / Unix | Windows / Linux / macOS |

---

## Verified Release Artifacts (v2.0.0)

Current stable release: **v2.0.0** (Published Oct 24, 2026).

| Platform | Format | Artifact Path / Package Name | Verified SHA-256 Checksum |
|---|---|---|---|
| **Windows x64** | NSIS Setup | `artifacts/windows/2.0.0/NET0ZE_2.0.0_x64-setup.exe` | `489e223bf9a764724b17a14e91f16599298379baee6cb8d6263ae22dd1d735f4` |
| **Linux x64** | Debian (.deb) | `artifacts/linux/2.0.0/NET0ZE_2.0.0_amd64.deb` | `a3fb522ca687e1f4e150937a898b58a1c97a2cbaf58a1a2bb2436d4df61b4a92` |
| **Linux x64** | AppImage | `artifacts/linux/2.0.0/NET0ZE_2.0.0_amd64.AppImage` | `c51d977c769d7b884468af40bfb618f5a907d24a7c72c2e1f277bd3b6299c924` |

> [!TIP]
> Always verify cryptographic integrity before executing downloaded packages:
> ```bash
> # Linux verification
> sha256sum -c SHA256SUMS-linux.txt
> 
> # Windows PowerShell verification
> Get-FileHash .\NET0ZE_2.0.0_x64-setup.exe -Algorithm SHA256
> ```

---

## Installation Quickstart

### Windows (10 / 11 64-bit)
1. Download `NET0ZE_2.0.0_x64-setup.exe` from [GitHub Releases](https://github.com/1viz3r0/netoze/releases/tag/v2.0.0).
2. Run the installer. It installs for the current user and checks for WebView2 runtime.
3. Because builds are self-published and unsigned, Windows SmartScreen may present a warning. Click **More info → Run anyway**.

### Linux (Debian, Ubuntu, Fedora, Arch)
**Via Debian package (`.deb`):**
```bash
# Download and install DEB package
sudo apt install ./NET0ZE_2.0.0_amd64.deb

# Launch NET0ZE
netoze
```

**Via Portable AppImage:**
```bash
chmod +x NET0ZE_2.0.0_amd64.AppImage
./NET0ZE_2.0.0_amd64.AppImage
```

---

## Source & Security Boundary

This repository is the official release mirror and user documentation portal. To ensure supply-chain integrity:
- Application source code, private signing keys, backend components, operational logs, and internal build tooling are segregated from public release mirrors.
- Software boundaries adhere to strict fail-closed security rules: no telemetry egress, no credential storage in memory caches, and transparent cryptographic receipts.
- For vulnerability disclosures, review [`SECURITY.md`](SECURITY.md).

---

## Documentation & Resources

- **Official Website:** [https://1viz3r0.github.io/netoze-site/](https://1viz3r0.github.io/netoze-site/)
- **How It Works:** [https://1viz3r0.github.io/netoze-site/how-it-works.html](https://1viz3r0.github.io/netoze-site/how-it-works.html)
- **Compatibility Matrix:** [https://1viz3r0.github.io/netoze-site/compatibilities.html](https://1viz3r0.github.io/netoze-site/compatibilities.html)
- **Verified Downloads:** [https://1viz3r0.github.io/netoze-site/downloads.html](https://1viz3r0.github.io/netoze-site/downloads.html)
- **About & Facts Policy:** [https://1viz3r0.github.io/netoze-site/about.html](https://1viz3r0.github.io/netoze-site/about.html)
- **RSS Updates Feed:** [https://1viz3r0.github.io/netoze-site/feed.xml](https://1viz3r0.github.io/netoze-site/feed.xml)
- **LLM/AI System Index:** [https://1viz3r0.github.io/netoze-site/llms.txt](https://1viz3r0.github.io/netoze-site/llms.txt)

---

© 2026 NET0ZE (Neetoze) · Maintained by [1viz3r0](https://github.com/1viz3r0) · Authorized Local Use Only
