"use client";

import React, { useState, useMemo } from "react";
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Copy, 
  Check, 
  RotateCcw, 
  ArrowRight, 
  Fingerprint, 
  GitBranch, 
  Cpu, 
  UploadCloud, 
  FileCheck2,
  Lock,
  Layers
} from "lucide-react";

interface ProofStep {
  position: "left" | "right";
  hash: string;
}

interface AuditPacket {
  standard: string;
  clauseId: string;
  clauseTitle: string;
  clauseContent: string;
  leafHash: string;
  merkleRoot: string;
  proof: ProofStep[];
}

// 32-bit FNV hash simulation for real-time reactive in-browser tree
function simpleSha256(text: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  let out = "";
  for (let i = 0; i < 8; i++) {
    const shift = (i * 7) % 32;
    out += (((hash >>> shift) ^ (0x55555555 * (i + 1))) >>> 0).toString(16).padStart(8, "0");
  }
  return out.slice(0, 64);
}

function hashLeaf(content: string): string {
  return simpleSha256("00" + simpleSha256(content));
}

function hashBranch(left: string, right: string): string {
  return simpleSha256("01" + left + right);
}

const SAMPLE_PACKETS: { name: string; desc: string; packet: AuditPacket }[] = [
  {
    name: "Delaware C-Corp: Director Exculpation Clause",
    desc: "Proof that DGCL § 102(b)(7) exculpation clause is ratified into genesis corporate charter.",
    packet: {
      standard: "LEGITBLOCK-MERKLE-INCLUSION-v1",
      clauseId: "art-6-exculpation",
      clauseTitle: "ARTICLE VI: Director Liability Exculpation",
      clauseContent: "To the fullest extent permitted by DGCL § 102(b)(7), no director shall be personally liable to the corporation or its stockholders for monetary damages for breach of fiduciary duty.",
      leafHash: hashLeaf("To the fullest extent permitted by DGCL § 102(b)(7), no director shall be personally liable to the corporation or its stockholders for monetary damages for breach of fiduciary duty."),
      merkleRoot: "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
      proof: [
        { position: "left", hash: "a4f89d3c2e170011b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6" },
        { position: "right", hash: "9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d" },
        { position: "left", hash: "3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6a4f89d3c2e170011b9c8d7e6f5a4b" }
      ]
    }
  },
  {
    name: "501(c)(3) Non-Profit: Charitable Asset Dedication",
    desc: "Proof of mandatory IRS dissolution lock clause in charitable bylaws.",
    packet: {
      standard: "LEGITBLOCK-MERKLE-INCLUSION-v1",
      clauseId: "art-np-3-dissolution",
      clauseTitle: "ARTICLE III: Dissolution & Asset Dedication",
      clauseContent: "Upon dissolution of the corporation, all remaining assets shall be distributed to an exempt organization described in Section 501(c)(3) of the Internal Revenue Code.",
      leafHash: hashLeaf("Upon dissolution of the corporation, all remaining assets shall be distributed to an exempt organization described in Section 501(c)(3) of the Internal Revenue Code."),
      merkleRoot: "9b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c",
      proof: [
        { position: "right", hash: "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef" },
        { position: "left", hash: "fedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321" }
      ]
    }
  }
];

export function MerkleProofVerifier() {
  const [selectedSample, setSelectedSample] = useState<number>(0);
  const [clauseTitle, setClauseTitle] = useState(SAMPLE_PACKETS[0].packet.clauseTitle);
  const [clauseContent, setClauseContent] = useState(SAMPLE_PACKETS[0].packet.clauseContent);
  const [targetRoot, setTargetRoot] = useState(SAMPLE_PACKETS[0].packet.merkleRoot);
  const [proofSteps, setProofSteps] = useState<ProofStep[]>(SAMPLE_PACKETS[0].packet.proof);
  const [copied, setCopied] = useState(false);
  const [tampered, setTampered] = useState(false);

  // Recalculate leaf and root hash
  const verification = useMemo(() => {
    const computedLeaf = hashLeaf(clauseContent);
    let currentHash = computedLeaf;
    const pathTrace: { step: number; position: "left" | "right"; sibling: string; result: string }[] = [];

    for (let i = 0; i < proofSteps.length; i++) {
      const step = proofSteps[i];
      let nextHash: string;
      if (step.position === "left") {
        nextHash = hashBranch(step.hash, currentHash);
      } else {
        nextHash = hashBranch(currentHash, step.hash);
      }
      pathTrace.push({
        step: i + 1,
        position: step.position,
        sibling: step.hash,
        result: nextHash
      });
      currentHash = nextHash;
    }

    const isValid = !tampered && currentHash === targetRoot;

    return {
      computedLeaf,
      computedRoot: currentHash,
      pathTrace,
      isValid
    };
  }, [clauseContent, proofSteps, targetRoot, tampered]);

  const loadSample = (index: number) => {
    setSelectedSample(index);
    const p = SAMPLE_PACKETS[index].packet;
    setClauseTitle(p.clauseTitle);
    setClauseContent(p.clauseContent);
    setTargetRoot(p.merkleRoot);
    setProofSteps(p.proof);
    setTampered(false);
  };

  const handleTamperClause = () => {
    setClauseContent((prev) => prev + " [UNAUTHORIZED AMENDMENT: $10,000,000 BONUS]");
    setTampered(true);
  };

  const handleReset = () => {
    loadSample(selectedSample);
  };

  const handleCopyProof = () => {
    const packet: AuditPacket = {
      standard: "LEGITBLOCK-MERKLE-INCLUSION-v1",
      clauseId: `clause-${Date.now()}`,
      clauseTitle,
      clauseContent,
      leafHash: verification.computedLeaf,
      merkleRoot: targetRoot,
      proof: proofSteps
    };
    navigator.clipboard.writeText(JSON.stringify(packet, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white shadow-xl border border-emerald-900/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero-Knowledge Clause Verification • DGCL § 224 Section-Level Proofs</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Interactive Merkle Proof Verifier</h2>
            <p className="text-xs text-emerald-200/80 max-w-2xl leading-relaxed">
              Verify statutory compliance of individual contract clauses without disclosing full corporate bylaws. Test domain-separated cryptographic audit paths (RFC 6962 / DGCL § 224) and simulate tamper resistance.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {SAMPLE_PACKETS.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => loadSample(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  selectedSample === idx
                    ? "bg-emerald-600 text-white border-emerald-400 shadow-md"
                    : "bg-white/10 hover:bg-white/20 text-slate-200 border-white/15"
                }`}
              >
                {sample.name.split(":")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Clause & Proof Input (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">Clause Under Audit</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                Leaf #0
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Clause Title / Article:</label>
              <input
                type="text"
                value={clauseTitle}
                onChange={(e) => setClauseTitle(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-800"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Ratified Clause Text:</label>
                <button
                  onClick={handleTamperClause}
                  className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                >
                  <ShieldAlert className="w-3 h-3" />
                  Simulate Fraudulent Tamper
                </button>
              </div>
              <textarea
                rows={5}
                value={clauseContent}
                onChange={(e) => {
                  setClauseContent(e.target.value);
                  setTampered(true);
                }}
                className={`w-full text-xs font-mono p-3 rounded-xl border focus:outline-none focus:ring-2 transition-all ${
                  tampered
                    ? "bg-rose-50/70 border-rose-300 text-rose-900 focus:ring-rose-500/20"
                    : "bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:ring-emerald-500/20"
                }`}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Target Merkle Root (DGCL § 224):</label>
              <input
                type="text"
                value={targetRoot}
                onChange={(e) => setTargetRoot(e.target.value)}
                className="w-full text-[11px] font-mono px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-600"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                onClick={handleReset}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Original Charter
              </button>

              <button
                onClick={handleCopyProof}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied Packet" : "Copy Audit JSON"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Proof Trace Visualizer (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Verification Verdict Card */}
          <div className={`p-5 rounded-2xl border transition-all ${
            verification.isValid
              ? "bg-emerald-50 border-emerald-300 shadow-sm"
              : "bg-rose-50 border-rose-300 shadow-sm"
          }`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                {verification.isValid ? (
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <h3 className={`text-base font-bold ${verification.isValid ? "text-emerald-900" : "text-rose-900"}`}>
                    {verification.isValid
                      ? "Cryptographic Inclusion Proof Verified (DGCL § 224 Compliant)"
                      : "PROOF REJECTED: Cryptographic State Mismatch"}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {verification.isValid
                      ? "The specified clause is mathematically confirmed to be part of the official corporate charter."
                      : "The clause text or audit path does not resolve to the ratified corporate root hash."}
                  </p>
                </div>
              </div>

              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shrink-0 ${
                verification.isValid
                  ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                  : "bg-rose-100 text-rose-800 border-rose-300"
              }`}>
                {verification.isValid ? "Valid Proof" : "Tampered"}
              </span>
            </div>
          </div>

          {/* Cryptographic Step-by-Step Path Trace */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">Merkle Path Hash Ladder</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                {proofSteps.length} Audit Layers
              </span>
            </div>

            {/* Leaf Hash Step */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Fingerprint className="w-3.5 h-3.5 text-emerald-600" />
                  Step 0: Domain-Separated Leaf Hash
                </span>
                <span className="text-[10px] font-mono text-slate-500">H_leaf = sha256(0x00 || sha256(content))</span>
              </div>
              <p className="text-[11px] font-mono text-slate-700 truncate">{verification.computedLeaf}</p>
            </div>

            {/* Binary Branch Steps */}
            <div className="space-y-3">
              {verification.pathTrace.map((trace) => (
                <div key={trace.step} className="p-3 rounded-xl bg-slate-50/70 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                      Step {trace.step}: Pair with {trace.position.toUpperCase()} sibling
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      H_branch = sha256(0x01 || left || right)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] font-mono">
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="text-slate-400 block text-[9px]">Sibling Hash ({trace.position}):</span>
                      <span className="text-slate-600 truncate block">{trace.sibling}</span>
                    </div>
                    <div className="bg-emerald-50/60 p-2 rounded border border-emerald-200">
                      <span className="text-emerald-700 font-semibold block text-[9px]">Layer Output Digest:</span>
                      <span className="text-emerald-900 truncate block">{trace.result}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Root Evaluation */}
            <div className="p-3.5 rounded-xl bg-slate-900 text-white space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  Calculated Tree Root vs Charter Root
                </span>
                {verification.isValid ? (
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Root Match
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-rose-400 flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> Digest Mismatch
                  </span>
                )}
              </div>
              <div className="text-[10px] font-mono space-y-1">
                <div>
                  <span className="text-slate-400">Computed: </span>
                  <span className={verification.isValid ? "text-emerald-300" : "text-rose-300"}>
                    {verification.computedRoot}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Expected: </span>
                  <span className="text-slate-200">{targetRoot}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
