# NET0ZE release security policy

## What this repository is

This is a public distribution repository. It contains installers, checksums,
release notes, and user-facing security guidance. It must never contain the
NET0ZE source tree, backend source, private build outputs, signing keys,
credentials, databases, captured traffic, or debug symbols.

The private source/backend repository is maintained separately. A public
binary release is not a cryptographic secrecy boundary.

## Reverse-engineering limits

No desktop executable that runs on a user's machine can be guaranteed to be
unbreakable or impossible to reverse-engineer. Runtime encryption does not
solve that problem because the application must obtain a decryption key or
decryption logic on the user's machine.

The supported protection model is:

1. Keep source and backend code out of the public release repository.
2. Never embed API keys, passwords, signing keys, cloud credentials, or private
   service endpoints in the application.
3. Build release binaries without debug symbols and publish only required
   runtime resources.
4. Sign installers and binaries with a protected code-signing key before a
   production release. The current artifacts must be treated as unsigned until
   a native signing receipt is attached to a release.
5. Publish SHA-256 checksums and verify them before installation.
6. Use authenticated release/update metadata and HTTPS for future update
   delivery; checksums alone authenticate integrity only when obtained through
   an independently trusted channel.
7. Keep privileged operations isolated in the smallest native helper and make
   unavailable capabilities report honestly instead of bypassing permission
   boundaries.
8. Keep sensitive operations server-side when confidentiality is required.
   A local desktop binary cannot protect a secret from its operator.

## Reporting a vulnerability

Do not publish exploit details in an issue. Contact the project maintainer
through the private security channel configured by the project owner and include
the affected release, platform, reproduction steps, and impact. Do not include
credentials, private captures, or personal data in a report.

## Release checklist

- [ ] Source/backend absent from the release repository.
- [ ] No secrets, private keys, tokens, databases, logs, or debug symbols.
- [ ] Native package built from the intended source revision.
- [ ] Artifact checksums regenerated and independently verified.
- [ ] Native Windows/Linux runtime checks completed where applicable.
- [ ] Code-signing receipt attached, or release clearly marked unsigned.
- [ ] Release notes state unsupported and unverified host behavior honestly.
