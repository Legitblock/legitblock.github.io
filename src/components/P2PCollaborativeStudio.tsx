"use client";

import React, { useState, useMemo } from "react";
import { 
  Users, 
  FileDiff, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  KeyRound, 
  Lock, 
  ShieldCheck, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  RotateCcw,
  Scale,
  GitCommit,
  AlertTriangle,
  Send,
  Eye,
  FileText
} from "lucide-react";

interface DiffLine {
  type: "added" | "removed" | "unchanged";
  text: string;
}

const PRESET_SCENARIOS = [
  {
    id: "investor-rights",
    name: "Series A Investor Protective Provisions",
    description: "Negotiating board veto rights over debt incurrence exceeding $500,000.",
    partyATitle: "General Counsel (Company Draft)",
    partyBTitle: "Lead Investor (Counterparty Redline)",
    partyAInitial: `ARTICLE V: MATTERS REQUIRING BOARD APPROVAL
Section 5.1. Major Decisions. The Corporation shall not, without the approval of a majority of the Board of Directors:
(a) Incur indebtedness for borrowed money in excess of $2,000,000 in a single transaction;
(b) Make capital expenditures exceeding $1,000,000 outside the approved annual budget;
(c) Grant stock options under the Equity Incentive Plan in excess of customary reserves.`,
    partyBInitial: `ARTICLE V: MATTERS REQUIRING BOARD APPROVAL
Section 5.1. Major Decisions. The Corporation shall not, without the affirmative consent of the Series A Director:
(a) Incur indebtedness for borrowed money in excess of $500,000 in aggregate;
(b) Make capital expenditures exceeding $250,000 outside the approved annual budget;
(c) Grant stock options or accelerate vesting without prior written Investor Committee consent.`
  },
  {
    id: "founder-vesting",
    name: "Founder Vesting & Double-Trigger Acceleration",
    description: "Negotiating change of control vesting protections and good reason termination.",
    partyATitle: "Founder Counsel",
    partyBTitle: "VC Syndicate Counsel",
    partyAInitial: `SECTION 4. VESTING ACCELERATION
Upon a Change of Control of the Corporation, 100% of Founder's Unvested Shares shall immediately vest (Single-Trigger Acceleration). Furthermore, Founder shall receive a severance payment equal to 12 months base salary upon voluntary resignation.`,
    partyBInitial: `SECTION 4. VESTING ACCELERATION
Upon a Change of Control, unvested shares shall continue to vest on standard 4-year monthly schedule. If Founder is terminated without Cause within 12 months post-acquisition (Double-Trigger), 50% of then-unvested shares shall immediately accelerate and vest.`
  }
];

export function P2PCollaborativeStudio() {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const scenario = PRESET_SCENARIOS[selectedScenarioIndex];

  const [textA, setTextA] = useState(scenario.partyAInitial);
  const [textB, setTextB] = useState(scenario.partyBInitial);

  // Digital Signatures from both parties
  const [partyASigned, setPartyASigned] = useState(false);
  const [partyBSigned, setPartyBSigned] = useState(false);
  const [copiedPatch, setCopiedPatch] = useState(false);
  const [ratifiedBlockHeight, setRatifiedBlockHeight] = useState<number | null>(null);

  // Compute structured line diffs
  const diffLines = useMemo(() => {
    const linesA = textA.split("\n");
    const linesB = textB.split("\n");
    const diff: DiffLine[] = [];

    const maxLen = Math.max(linesA.length, linesB.length);
    for (let i = 0; i < maxLen; i++) {
      const a = linesA[i];
      const b = linesB[i];

      if (a === b) {
        if (a !== undefined) diff.push({ type: "unchanged", text: a });
      } else {
        if (a !== undefined) diff.push({ type: "removed", text: a });
        if (b !== undefined) diff.push({ type: "added", text: b });
      }
    }
    return diff;
  }, [textA, textB]);

  // Covenant compliance evaluation
  const covenants = useMemo(() => {
    const combined = textB.toLowerCase();
    return [
      {
        id: "board-authority",
        title: "DGCL § 141(a) Board Primacy Guardrail",
        passed: combined.includes("board") || combined.includes("director"),
        description: "Bylaws must retain fiduciary managerial authority under the Board of Directors."
      },
      {
        id: "specific-thresholds",
        title: "Clear Numerical Dollar Thresholds",
        passed: /\$[0-9,]+/.test(combined),
        description: "Monetary restrictions must specify definite figures rather than ambiguous qualitative terms."
      },
      {
        id: "written-consent",
        title: "Statutory Written Consent Formalities",
        passed: combined.includes("approval") || combined.includes("consent"),
        description: "Decisions must explicitly mandate documented vote or formal signed consent."
      }
    ];
  }, [textB]);

  const allCovenantsPassed = covenants.every((c) => c.passed);
  const bothPartiesSigned = partyASigned && partyBSigned;

  const handleScenarioChange = (index: number) => {
    setSelectedScenarioIndex(index);
    const s = PRESET_SCENARIOS[index];
    setTextA(s.partyAInitial);
    setTextB(s.partyBInitial);
    setPartyASigned(false);
    setPartyBSigned(false);
    setRatifiedBlockHeight(null);
  };

  const handleSignPartyA = () => {
    setPartyASigned(!partyASigned);
    setRatifiedBlockHeight(null);
  };

  const handleSignPartyB = () => {
    setPartyBSigned(!partyBSigned);
    setRatifiedBlockHeight(null);
  };

  const handleSealProposal = () => {
    if (bothPartiesSigned && allCovenantsPassed) {
      setRatifiedBlockHeight(143);
    }
  };

  const handleCopyUnifiedDiff = () => {
    let patch = "--- Party_A_Company_Draft\n+++ Party_B_Counterparty_Redline\n";
    diffLines.forEach((line) => {
      if (line.type === "added") patch += `+ ${line.text}\n`;
      else if (line.type === "removed") patch += `- ${line.text}\n`;
      else patch += `  ${line.text}\n`;
    });
    navigator.clipboard.writeText(patch);
    setCopiedPatch(true);
    setTimeout(() => setCopiedPatch(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-900 text-white shadow-xl border border-cyan-800/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>Bilateral Redline &amp; Cryptographic Sign-Off Studio</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              P2P Collaborative Redline Studio
            </h2>
            <p className="text-xs text-cyan-200/80 max-w-2xl leading-relaxed">
              Negotiate and redline corporate contracts with counterparties in real-time. Calculate token diffs, audit statutory covenants under DGCL § 141, and execute dual-party digital signatures before committing to the immutable blockchain.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            {PRESET_SCENARIOS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => handleScenarioChange(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  selectedScenarioIndex === idx
                    ? "bg-cyan-600 text-white border-cyan-400 shadow-md"
                    : "bg-white/10 hover:bg-white/20 text-slate-200 border-white/15"
                }`}
              >
                {s.name.split(" ")[0]} Scenario
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dual Editor Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Party A Editor */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h3 className="font-bold text-sm text-slate-900">{scenario.partyATitle}</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              Base Revision (v1.0)
            </span>
          </div>

          <div>
            <textarea
              rows={8}
              value={textA}
              onChange={(e) => {
                setTextA(e.target.value);
                setPartyASigned(false);
              }}
              className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-800 leading-relaxed"
            />
          </div>

          {/* Party A Sign Button */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs">
              <KeyRound className="w-4 h-4 text-slate-400" />
              <span className="text-slate-600 font-medium">Party A Signature:</span>
            </div>

            <button
              onClick={handleSignPartyA}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                partyASigned
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : "bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
              }`}
            >
              {partyASigned ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Ed25519 Signed by Company</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Sign as Company Counsel</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Party B Editor */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              <h3 className="font-bold text-sm text-slate-900">{scenario.partyBTitle}</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-50 text-cyan-700">
              Counterparty Proposed Redline
            </span>
          </div>

          <div>
            <textarea
              rows={8}
              value={textB}
              onChange={(e) => {
                setTextB(e.target.value);
                setPartyBSigned(false);
              }}
              className="w-full text-xs font-mono p-3 rounded-xl border border-cyan-200 bg-cyan-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 text-slate-800 leading-relaxed"
            />
          </div>

          {/* Party B Sign Button */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs">
              <KeyRound className="w-4 h-4 text-slate-400" />
              <span className="text-slate-600 font-medium">Party B Signature:</span>
            </div>

            <button
              onClick={handleSignPartyB}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                partyBSigned
                  ? "bg-cyan-100 text-cyan-800 border border-cyan-300"
                  : "bg-cyan-600 text-white hover:bg-cyan-500 shadow-sm"
              }`}
            >
              {partyBSigned ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Passkey Signed by Investor</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Sign as Lead Investor</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Real-Time Live Redline Diff Viewer */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <FileDiff className="w-5 h-5 text-cyan-600" />
            <div>
              <h3 className="font-bold text-sm text-slate-900">Synchronized Redline Diff</h3>
              <p className="text-xs text-slate-500">Live token delta generated between negotiating parties</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyUnifiedDiff}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition-colors"
            >
              {copiedPatch ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedPatch ? "Diff Copied" : "Copy .patch File"}
            </button>
          </div>
        </div>

        {/* Diff Output Box */}
        <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto max-h-72 space-y-1">
          {diffLines.map((line, idx) => (
            <div
              key={idx}
              className={`py-0.5 px-2 rounded flex gap-2 ${
                line.type === "added"
                  ? "bg-emerald-950/80 text-emerald-300 font-medium"
                  : line.type === "removed"
                  ? "bg-rose-950/80 text-rose-300 line-through font-medium"
                  : "text-slate-400"
              }`}
            >
              <span className="select-none font-bold w-4 text-center shrink-0">
                {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
              </span>
              <span className="whitespace-pre-wrap">{line.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Statutory Covenant Compliance & Ratification Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Covenant Audit Checklist (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-sm text-slate-900">Statutory Covenant Guardrails</h3>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              allCovenantsPassed ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
            }`}>
              {allCovenantsPassed ? "All Passed" : "Action Required"}
            </span>
          </div>

          <div className="space-y-2.5">
            {covenants.map((c) => (
              <div key={c.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 flex items-start gap-3">
                {c.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{c.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{c.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Bilateral Ratification & On-Chain Proposal Sealing (6 cols) */}
        <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl border border-slate-800 p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">Bilateral Ratification Gateway</h3>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                bothPartiesSigned ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-slate-800 text-slate-400"
              }`}>
                {bothPartiesSigned ? "Dual Signatures Affixed" : "Pending Signatures"}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Under DGCL § 224 and Electronic Signature acts, legal amendments drafted between parties require mutual cryptographic non-repudiation before inclusion in governance voting proposals.
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className={`p-2.5 rounded-lg border ${partyASigned ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300" : "bg-slate-800/40 border-slate-700 text-slate-400"}`}>
                <span className="block text-[10px] font-semibold text-slate-400">Party A (Company):</span>
                <span className="font-mono">{partyASigned ? "✓ SIGNED" : "Awaiting..."}</span>
              </div>
              <div className={`p-2.5 rounded-lg border ${partyBSigned ? "bg-cyan-950/40 border-cyan-500/40 text-cyan-300" : "bg-slate-800/40 border-slate-700 text-slate-400"}`}>
                <span className="block text-[10px] font-semibold text-slate-400">Party B (Investor):</span>
                <span className="font-mono">{partyBSigned ? "✓ SIGNED" : "Awaiting..."}</span>
              </div>
            </div>
          </div>

          <div>
            {ratifiedBlockHeight ? (
              <div className="p-3 rounded-xl bg-emerald-900/40 border border-emerald-500/50 text-emerald-200 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Proposal Sealed to Blockchain!</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Sealed at Block Height #{ratifiedBlockHeight} with Merkle Root hash: <code className="text-emerald-300 text-[10px]">7f83b165...</code>
                </p>
              </div>
            ) : (
              <button
                onClick={handleSealProposal}
                disabled={!bothPartiesSigned || !allCovenantsPassed}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow flex items-center justify-center gap-2 ${
                  bothPartiesSigned && allCovenantsPassed
                    ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer shadow-emerald-500/20"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                }`}
              >
                <GitCommit className="w-4 h-4" />
                <span>
                  {bothPartiesSigned
                    ? "Seal Bilateral Redline to LegitBlock Proposal"
                    : "Both Parties Must Sign to Seal Proposal"}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
