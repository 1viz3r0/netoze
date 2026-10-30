# netoze — Elite Digital Infrastructure & Secure Solutions

[![Release](https://img.shields.io/badge/release-v2.0.0-blue.svg)](https://github.com/1viz3r0/netoze/releases/tag/v2.0.0)
[![Platform](https://img.shields.io/badge/platform-Windows%2010%2F11%20%7C%20Linux%20x86__64-brightgreen.svg)](https://www.netoze.com/compatibilities.html)
[![Telemetry](https://img.shields.io/badge/telemetry-0%25%20(Local%20First)-success.svg)](https://www.netoze.com/about.html)
[![License](https://img.shields.io/badge/license-Authorized%20Local%20Use-lightgrey.svg)](SECURITY.md)
[![RSS Feed](https://img.shields.io/badge/feed-RSS%202.0-orange.svg)](https://www.netoze.com/feed.xml)

**netoze** is an elite digital infrastructure and local-first network security desktop platform engineered for Windows 10/11 and Linux. Built for security researchers, infrastructure architects, SOC analysts, and network engineers, netoze provides deterministic network monitoring, packet capture, and native host socket telemetry with zero cloud egress.

🌐 **Official Website:** [https://www.netoze.com/](https://www.netoze.com/)  
📦 **Release Downloads:** [v2.0.0 Release Assets](https://github.com/1viz3r0/netoze/releases/tag/v2.0.0) · [Downloads & Checksums](https://www.netoze.com/downloads.html)  
👤 **Founder & Architecture Lead:** [1vi-z3r0](https://www.linkedin.com/in/1vi-z3r0/)

---

## Table of Contents
- [Why netoze?](#why-netoze)
- [Core Capabilities](#core-capabilities)
- [Architectural Superiority](#architectural-superiority)
- [Verified Release Artifacts (v2.0.0)](#verified-release-artifacts-v200)
- [Installation Quickstart](#installation-quickstart)
- [Source & Security Boundary](#source--security-boundary)
- [Documentation & Resources](#documentation--resources)

---

## Why netoze?

Traditional network analysis imposes severe friction:
- **Legacy Disconnected Inspectors:** Exhibit bit-level byte dumps, but remain completely blind to operating system process lifecycles.
- **Invasive Cloud SIEM Platforms:** Require intrusive background daemons, continuous proprietary metadata upload to external servers, and high costs.

**netoze** introduces high-speed proprietary digital infrastructure:
1. **100% Local-First Architecture:** Packet captures, host socket bindings, and incident forensics remain strictly on local disk and physical RAM.
2. **Orient → Trace → Explain Loop:** A streamlined investigation methodology transitioning from system topology to correlated socket flows.
3. **100% In-House Proprietary Engine:** Built from scratch with native packet processing and socket correlation algorithms.

---

## Core Capabilities

- **Native Host Process Binding:** Directly maps incoming wire frames and sockets to local process names and PIDs.
- **Deterministic Packet Capture:** Microsecond-precise interface capture with zero background overhead.
- **Incident Briefing & Evidence Export:** Generate portable evidence bundles with cryptographic timestamps.
- **Zero Cloud Footprint:** No accounts, no sign-ins, and zero background services.

---

## Architectural Superiority

| Feature | netoze Core Architecture | Legacy Byte Inspectors | Distributed Script Daemons | Cloud SIEM Monitoring |
|---|---|---|---|---|
| **Data Privacy** | **100% Local (Zero Egress)** | 100% Local | 100% Local | Cloud Synced / Telemetry |
| **Host Process Binding** | **Built-in (UI Unified)** | Missing / Disconnected | Requires custom tooling | Agent required |
| **Learning Curve** | **Low (Guided 3-step loop)** | Steep (Raw frames/hex) | High (CLI / Scripting) | Complex Query DSL |
| **Architecture** | **100% In-House Engine** | Legacy monolithic codebase | Cluster-based daemon | Proprietary cloud agent |
| **Operating Systems** | **Windows 10/11 & Linux** | Multiplatform | Linux / Unix | Windows / Linux / macOS |

---

## Verified Release Artifacts (v2.0.0)

Current stable release: **v2.0.0** (Published Oct 24, 2026).

| Platform | Format | Artifact Path / Package Name | Verified SHA-256 Checksum |
|---|---|---|---|
| **Windows x64** | NSIS Setup | `artifacts/windows/2.0.0/NET0ZE_2.0.0_x64-setup.exe` | `489e223bf9a764724b17a14e91f16599298379baee6cb8d6263ae22dd1d735f4` |
| **Linux x64** | Debian (.deb) | `artifacts/linux/2.0.0/NET0ZE_2.0.0_amd64.deb` | `a3fb522ca687e1f4e150937a898b58a1c97a2cbaf58a1a2bb2436d4df61b4a92` |
| **Linux x64** | AppImage | `artifacts/linux/2.0.0/NET0ZE_2.0.0_amd64.AppImage` | `c51d977c769d7b884468af40bfb618f5a907d24a7c72c2e1f277bd3b6299c924` |

---

## Installation Quickstart

### Windows (10 / 11 64-bit)
1. Download `NET0ZE_2.0.0_x64-setup.exe` from [GitHub Releases](https://github.com/1viz3r0/netoze/releases/tag/v2.0.0).
2. Run the installer for the current workstation user.
3. If Windows SmartScreen prompts on unsigned build, select **More info → Run anyway**.

### Linux (Debian, Ubuntu, Fedora, Arch)
**Via Debian package (`.deb`):**
```bash
# Verify checksum and install
sudo apt install ./NET0ZE_2.0.0_amd64.deb

# Launch netoze
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

- **Official Website:** [https://www.netoze.com/](https://www.netoze.com/)
- **How It Works:** [https://www.netoze.com/how-it-works.html](https://www.netoze.com/how-it-works.html)
- **Compatibility Matrix:** [https://www.netoze.com/compatibilities.html](https://www.netoze.com/compatibilities.html)
- **Verified Downloads:** [https://www.netoze.com/downloads.html](https://www.netoze.com/downloads.html)
- **About & Facts Policy:** [https://www.netoze.com/about.html](https://www.netoze.com/about.html)
- **RSS Updates Feed:** [https://www.netoze.com/feed.xml](https://www.netoze.com/feed.xml)
- **LLM/AI System Index:** [https://www.netoze.com/llms.txt](https://www.netoze.com/llms.txt)

---

© 2026 netoze · Founder: [1vi-z3r0](https://www.linkedin.com/in/1vi-z3r0/) · Authorized Local Use Only
