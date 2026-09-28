# Legitblock Legal-Tech Playground Guide

The **Legitblock Playground** (`/playground`) is an interactive suite of client-side cryptographic tools designed for lawyers, enterprise risk officers, smart contract developers, and auditors.

This guide provides instructions and technical explanations for each interactive module in the playground.

---

## 🗂️ Table of Contents
1. [Merkle Clause Inspector & Proof Verifier](#1-merkle-clause-inspector--proof-verifier)
2. [Statutory PDF/A-3 Generator](#2-statutory-pdfa-3-generator)
3. [Dynamic Covenant Studio & Visual Redline Editor](#3-dynamic-covenant-studio--visual-redline-editor)
4. [Consortium Ledger & Multi-Party Consensus Simulator](#4-consortium-ledger--multi-party-consensus-simulator)
5. [Hardware-Backed WebAuthn Biometric Passkeys](#5-hardware-backed-webauthn-biometric-passkeys)
6. [Multi-Jurisdiction Compliance Inspector](#6-multi-jurisdiction-compliance-inspector)
7. [Chain Validator & State Replay Tool](#7-chain-validator--state-replay-tool)

---

## 1. Merkle Clause Inspector & Proof Verifier

### Purpose
Proves that a single clause within a 100-page commercial agreement belongs to an authorized, notarized contract without requiring the reviewer to read or reveal the rest of the agreement.

### How to Use
1. Navigate to **Playground** $\rightarrow$ **Merkle Tree Proofs**.
2. Select a pre-configured template (e.g., *Cross-Border Supply Chain Agreement*).
3. The interface displays:
   - **Calculated Merkle Root**: The 32-byte top-level cryptographic anchor.
   - **Clauses / Leaves**: Individual contractual clauses with their respective SHA-256 digests.
4. Click on any clause to inspect its **Audit Path**:
   - The right-hand panel reveals the exact chain of sibling hashes required to reconstruct the root.
   - Positional indicators (`LEFT` / `RIGHT`) illustrate pairwise concatenation order.
5. **Interactive Tamper Simulation**:
   - Click the **Simulate Clause Tampering** toggle.
   - Notice how modifying a single word in the selected clause immediately alters its leaf hash, cascades up the tree, and breaks the Merkle root match.
   - The proof indicator immediately switches from a green `VALID` badge to a red `PROOF REJECTED` alert.

---

## 2. Statutory PDF/A-3 Generator

### Purpose
Produces an archival-grade, court-admissible PDF document that satisfies the **ISO 19005-3** standard, embedding both human-readable text and machine-readable cryptographic manifests.

### How to Use
1. Navigate to the **Statutory PDF Generator** tab.
2. Select your target legal framework:
   - *Delaware General Corporation Law (DGCL § 224)*
   - *UK Electronic Trade Documents Act 2023*
   - *EU eIDAS Regulation (EU 910/2014)*
   - *Singapore Electronic Transactions Act 2021 (MLETR)*
3. Review the generated legal recitals and contractual clauses in the preview pane.
4. Click **Generate & Download Statutory PDF/A-3**:
   - The browser compiles the binary PDF streams entirely client-side.
   - Computes valid byte offsets for the PDF cross-reference (`xref`) table.
   - Automatically downloads the `.pdf` file to your local machine.
5. Open the downloaded file in Adobe Acrobat or any standard PDF reader to inspect the document structure, embedded SHA-256 hashes, and statutory attestation blocks.

---

## 3. Dynamic Covenant Studio & Visual Redline Editor

### Purpose
Allows commercial negotiators to adjust financial ratios, interest margin ratchets, and debt limits in real-time, observing immediate visual diffs and cryptographic recalculations.

### How to Use
1. Navigate to the **Covenant Studio** tab.
2. Adjust the interactive controls:
   - **Leverage Ratio Ceiling**: Move the slider between `2.5x` and `6.0x` EBITDA.
   - **Minimum Interest Coverage Ratio**: Adjust from `1.5x` to `4.0x`.
   - **CapEx Annual Limit**: Adjust permitted capital expenditure thresholds.
3. Observe the **Visual Redline View**:
   - Inserted covenants appear highlighted in green (`+`).
   - Removed or superseded covenant terms appear with red strikethroughs (`-`).
4. Watch the **Dynamic Merkle Digest**:
   - As you drag the sliders, the clause content updates in real-time.
   - The SHA-256 hash updates instantaneously, reflecting the exact cryptographic footprint of your negotiated terms.

---

## 4. Consortium Ledger & Multi-Party Consensus Simulator

### Purpose
Simulates how enterprise consortia (banks, logistics operators, customs authorities, and smart contract escrows) validate contractual amendments and state changes.

### How to Use
1. Navigate to the **Consortium Simulator** tab.
2. Review the simulated validator nodes:
   - **Node 1 (Enterprise Lead)**: Enterprise party submitting the proposal.
   - **Node 2 (Commercial Bank / Escrow)**: Financial covenant verification agent.
   - **Node 3 (Regulatory / Customs)**: Compliance validation node.
   - **Node 4 (Independent Auditor)**: Cryptographic integrity auditor.
3. Configure the **Fault-Tolerance / Quorum Threshold**:
   - Select between Simple Majority ($>50\%$), Supermajority ($\ge 67\%$), or Unanimous ($100\%$).
4. Click **Simulate Consensus Round**:
   - Watch the round progress through *Propose*, *Pre-Commit*, *Commit*, and *Finalize* phases.
   - Review live telemetry metrics: gas consumed, round-trip latency (ms), and validator signature attestations.

---

## 5. Hardware-Backed WebAuthn Biometric Passkeys

### Purpose
Binds contractual execution to physical hardware tokens (TouchID, FaceID, Windows Hello, YubiKey) using FIDO2 / WebAuthn, eliminating the risk of lost or stolen private key files.

### How to Use
1. In the **Contract Signing** section of the Playground, select **Biometric Hardware Passkey**.
2. Click **Sign with Hardware Token**:
   - The browser prompts your device's biometric authenticator (TouchID fingerprint, FaceID scan, or security key touch).
   - Your device generates a non-exportable ECDSA signature over the contract's SHA-256 Merkle root.
3. Inspect the signature manifest:
   - **Credential ID**: The unique identifier of your hardware key.
   - **Authenticator Data**: The raw binary assertion from the hardware enclave.
   - **Signature Hex**: The cryptographic proof verifying that the physical owner approved this specific contract state.
4. *Graceful Fallback*: If your machine lacks biometric hardware, the tool will automatically fall back to Web Crypto API (`crypto.subtle`) and display an informational badge.

---

## 6. Multi-Jurisdiction Compliance Inspector

### Purpose
Evaluates whether a smart contract meets the statutory requirements of the world's leading commercial jurisdictions.

### How to Use
1. In the **Jurisdiction Inspector** widget, select a target jurisdiction tab (Delaware, Wyoming, UK, EU, Singapore).
2. Review the statutory breakdown:
   - **Enforceability Rating**: Direct assessment of whether courts in that jurisdiction accept distributed ledger entries as legal evidence.
   - **Statutory Citation**: Explicit legislative code references (e.g., *DGCL 8 Del. C. § 224*, *Singapore ETA Section 16G*).
   - **Mandatory Requirements**: Checklist of criteria required by law (e.g., ability to convert into paper form, non-repudiation, tamper evidence).
   - **Compliance Status**: Automated verification checking that the current contract payload satisfies all criteria.

---

## 7. Chain Validator & State Replay Tool

### Purpose
Enables deterministic state auditing. Users can step backwards and forwards through each block and transaction in the contract's lifecycle to verify compliance history.

### How to Use
1. Navigate to the **Chain Validator** tab.
2. Use the **Step Controls**:
   - Click `Next Block` or `Previous Block` to inspect state evolution.
   - Observe how contractual state changes from `DRAFTED` $\rightarrow$ `NOTARIZED` $\rightarrow$ `FUNDED` $\rightarrow$ `EXECUTED` $\rightarrow$ `SETTLED`.
3. Check **Cryptographic Linkage**:
   - Verify that each block's `previousBlockHash` accurately matches the SHA-256 digest of the preceding block header.
   - Click **Verify Full Chain**: Audits the entire sequence from Genesis to the latest block, confirming zero broken links.
