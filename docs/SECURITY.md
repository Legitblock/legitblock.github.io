# Security Policy & Cryptographic Threat Model

Security and data integrity are fundamental to the Legitblock architecture. Because Legitblock deals with commercial contracts, legal obligations, and decentralized ledger notarization, strict cryptographic guarantees are maintained across all platform modules.

---

## 🛡️ Supported Versions

We actively maintain and provide security patches for the latest release on the `master` branch.

| Branch / Version | Supported |
|:---|:---|
| `master` (`0.1.x`) | ✅ Yes |
| Historical branches (`gatsby`, `legacy`) | ❌ No (Deprecated) |

---

## 🔒 Non-Custodial Threat Model & Guarantees

### 1. Zero Plaintext Ingestion
- **Principle**: Legitblock's web application and interactive playground are strictly non-custodial.
- **Implementation**: Plaintext contracts, confidential financial covenants, counterparty identities, and raw agreement terms are processed exclusively within the client browser runtime.
- **Guarantee**: No contractual text, clauses, or documents are transmitted over the network or stored on any intermediate server.

### 2. Private Key Isolation & Hardware Passkeys
- **Principle**: Private keys must never be exposed to browser JavaScript or stored in unencrypted browser storage (`localStorage` or `sessionStorage`).
- **Implementation**: Legitblock utilizes the **W3C Web Authentication API (WebAuthn / FIDO2)**. When a user approves or signs a contract manifest:
  1. The browser passes the contract's SHA-256 Merkle root to the device's hardware enclave (e.g., Apple Secure Enclave, Windows Hello TPM, or physical YubiKey).
  2. The hardware enclave prompts for biometric or physical presence verification.
  3. The private key signs the challenge internally and emits an ECDSA signature assertion.
- **Guarantee**: The private signing key never enters application memory or leaves the hardware security module.

### 3. Cryptographic Primitives & Collision Resistance
- **Digest Algorithm**: NIST FIPS 180-4 **SHA-256**.
- **Collision Resistance**: Finding two distinct contractual clauses that produce the same 256-bit leaf hash requires approximately $2^{128}$ operations, making computational collision attacks unfeasible under current and anticipated cryptographic capabilities.
- **Merkle Tree Pre-Image Resistance**: Every inner node is computed as $\text{SHA-256}(H_L \mathbin{\Vert} H_R)$. Leaf hashes are explicitly distinguished from inner node digests to prevent second pre-image attacks.

### 4. Client-Side Cryptographic Runtime Isolation
- **Hardware Acceleration**: SHA-256 calculations rely on the native browser W3C Web Cryptography API (`window.crypto.subtle`).
- **Deterministic Pure-JS Fallback**: If `window.crypto.subtle` is blocked by browser security policies (e.g., non-secure contexts or sandboxed iframes), Legitblock utilizes a deterministic pure-JavaScript SHA-256 engine to prevent application crashes while maintaining hash parity.

### 5. Content Security & Supply Chain Integrity
- **Static Hosting**: Deployed as an immutable static export on GitHub Pages with HTTPS enforced.
- **Dependency Hygiene**: Dependencies are pinned and audited using `pnpm audit` and lockfile integrity verification.

---

## 🚨 Reporting a Vulnerability

If you identify a security vulnerability or potential cryptographic flaw in Legitblock, please report it responsibly:

1. **Do NOT open a public GitHub issue** describing the vulnerability.
2. Email your findings and reproduction steps to:
   **security@legitblock.com** (or contact the core maintainers privately via GitHub Security Advisories).
3. Please include:
   - Type of vulnerability (e.g., cryptographic proof flaw, XSS, PDF compilation injection, dependency issue).
   - Detailed step-by-step instructions or proof-of-concept (PoC).
   - Impact assessment and suggested remediation.

### Response Timeline
- **Initial Acknowledgement**: Within 48 hours.
- **Assessment & Triage**: Within 5 business days.
- **Patch & Public Advisory**: Coordinated release following patch deployment to `master`.
