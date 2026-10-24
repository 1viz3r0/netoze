# NET0ZE Releases

This repository is the public download and release page for **NET0ZE**.

It intentionally contains release artifacts and user-facing documentation only.
The application source, backend implementation, tests, development tooling,
private data, and build workspace are maintained separately and are not
distributed from this repository.

## Current release

**NET0ZE 2.0.0**

| Platform | Package | Location |
|---|---|---|
| Linux x64 | AppImage | `artifacts/linux/2.0.0/NET0ZE_2.0.0_amd64.AppImage` |
| Linux x64 | Debian package | `artifacts/linux/2.0.0/NET0ZE_2.0.0_amd64.deb` |
| Windows x64 | NSIS installer | `artifacts/windows/2.0.0/NET0ZE_2.0.0_x64-setup.exe` |

Verify downloads against the platform-specific `SHA256SUMS.txt` before
installing. The canonical GitHub Release is the preferred download surface;
the artifact paths in this repository are a durable release mirror.

## Important platform requirements

- Linux live capture requires the installed package's capture helper and the
  host's approved libpcap/capability configuration. The AppImage is portable
  and does not install privileged capture access.
- Windows live capture requires an approved Npcap runtime. Npcap is not bundled
  here. NET0ZE reports capture as unavailable when the runtime is missing.
- Labs require a supported local Docker environment. If it is unavailable,
  NET0ZE reports `setup-required`; it does not use a simulated fallback.
- Windows cross-builds are not Windows runtime acceptance. WebView2, Npcap,
  installer, upgrade, uninstall, and signing acceptance must be performed on a
  native Windows host.

## Source and security boundary

The public release repository does not contain the NET0ZE source or backend.
Do not add source archives, debug symbols, private keys, credentials, local
databases, crash dumps, build caches, or raw operational logs here.

Public executable files cannot be made impossible to reverse-engineer: a user
who can run a binary can inspect it. NET0ZE therefore uses the practical
controls described in [`SECURITY.md`](SECURITY.md): source separation,
release minimization, checksums, future code-signing requirements, no embedded
secrets, and fail-closed native capability checks. Encryption is not used as a
fake guarantee; encrypting an executable would require a runtime decryption key
that could itself be recovered by the user.

## Release notes

See [`docs/RELEASE_NOTES_2.0.0.md`](docs/RELEASE_NOTES_2.0.0.md).
