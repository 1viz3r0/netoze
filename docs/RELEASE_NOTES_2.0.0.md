# NET0ZE 2.0.0

## Included

- NET0ZE desktop investigation workspace.
- Overview and globe-based evidence view.
- Capture Buddy with bounded native capture/file-analysis paths.
- Watchtower, Scan Buddy, local evidence, authentication, and forensic query
  workflows.
- Practical Labs catalog with honest `setup-required` behavior when the host
  Docker environment is unavailable.
- Linux DEB/AppImage and Windows x64 NSIS distribution artifacts.

## Security and integrity

- Verify the platform-specific SHA-256 file before installation.
- Linux live capture is limited to the installed capture-helper architecture;
  the portable AppImage does not install privileged capture access.
- Windows live capture requires an approved Npcap runtime and native Windows
  acceptance. It is not bundled in this release repository.
- The public release repository contains no source code or private backend data.
- Treat these artifacts as unsigned until an approved code-signing receipt is
  published with the release.

## Known validation limits

The release source was checked with frontend, Rust, Python room, packaging, and
isolated rendering checks. Full production validation still requires the
corresponding native host for live capture, Docker Labs lifecycle, Linux/Ryoku
GUI acceptance, Windows WebView2/Npcap runtime behavior, installer upgrade /
uninstall, and signing.

## Installation

Use the GitHub Release asset matching your platform. For Linux, prefer the DEB
when live capture helper installation is required. For Windows, install Npcap
separately according to the approved host policy before using live capture.
