"use client";

import React, { useState, useEffect } from "react";
import { 
  FileDiff, 
  Copy, 
  Check, 
  Sparkles, 
  RotateCcw, 
  ShieldCheck, 
  Hash, 
  ChevronRight,
  FileCode2,
  Lock
} from "lucide-react";

interface RedlinePreset {
  id: string;
  title: string;
  entityType: string;
  documentTitle: string;
  originalText: string;
  defaultProposedText: string;
}

const PRESETS: RedlinePreset[] = [
  {
    id: "delaware_shares",
    title: "Delaware C-Corp: Expand Capital Stock",
    entityType: "Delaware For-Profit Corporation",
    documentTitle: "Certificate of Incorporation",
    originalText: `ARTICLE IV: AUTHORIZED CAPITAL STOCK

Section 4.1. Total Number of Shares. The total number of shares of all classes of stock which the Corporation shall have authority to issue is Ten Million (10,000,000) shares, consisting of:
(a) Eight Million (8,000,000) shares of Common Stock, par value $0.0001 per share; and
(b) Two Million (2,000,000) shares of Preferred Stock, par value $0.0001 per share.

Section 4.2. Voting Rights. Each holder of Common Stock shall be entitled to one (1) vote for each share of Common Stock held of record.`,
    defaultProposedText: `ARTICLE IV: AUTHORIZED CAPITAL STOCK

Section 4.1. Total Number of Shares. The total number of shares of all classes of stock which the Corporation shall have authority to issue is Twenty-Five Million (25,000,000) shares, consisting of:
(a) Eighteen Million (18,000,000) shares of Common Stock, par value $0.0001 per share; and
(b) Seven Million (7,000,000) shares of Preferred Stock, par value $0.0001 per share, designated as Series A Convertible Preferred Stock.

Section 4.2. Voting Rights. Each holder of Common Stock shall be entitled to one (1) vote for each share of Common Stock held of record.`
  },
  {
    id: "coop_patronage",
    title: "Worker Cooperative: Patronage Dividend Rule",
    entityType: "Worker-Owned Cooperative",
    documentTitle: "Cooperative Bylaws",
    originalText: `SECTION 6: NET EARNINGS AND PATRONAGE DIVIDENDS

6.1 Calculation: Net surplus derived from cooperative operations shall be apportioned annually among active worker-patrons based strictly on hours worked during the fiscal year.
6.2 Reserve Fund: Prior to distribution, ten percent (10%) of net surplus shall be retained in the permanent collective capital reserve account.
6.3 Member Approval: Distributions require approval by a simple majority vote of the General Assembly.`,
    defaultProposedText: `SECTION 6: NET EARNINGS AND PATRONAGE DIVIDENDS

6.1 Calculation: Net surplus derived from cooperative operations shall be apportioned annually among active worker-patrons based seventy percent (70%) on hours worked and thirty percent (30%) on member tenure milestones.
6.2 Reserve Fund: Prior to distribution, fifteen percent (15%) of net surplus shall be retained in the permanent collective capital reserve and community solidarity fund.
6.3 Member Approval: Distributions require approval by a two-thirds (66.7%) supermajority vote of the General Assembly.`
  },
  {
    id: "nonprofit_board",
    title: "Non-Profit 501(c)(3): Term Limits & Board Size",
    entityType: "Tax-Exempt 501(c)(3) Organization",
    documentTitle: "Non-Profit Bylaws",
    originalText: `ARTICLE III: BOARD OF DIRECTORS

Section 3.1. Number: The Board of Directors shall consist of not fewer than three (3) nor more than seven (7) directors.
Section 3.2. Term: Each director shall hold office for a term of one (1) year and until their successor is elected.
Section 3.3. Compensation: Directors shall serve without compensation, except for reasonable reimbursement of documented out-of-pocket expenses.`,
    defaultProposedText: `ARTICLE III: BOARD OF DIRECTORS

Section 3.1. Number: The Board of Directors shall consist of not fewer than five (5) nor more than eleven (11) directors, of which at least sixty percent (60%) must qualify as independent outside directors.
Section 3.2. Term: Each director shall serve a staggered three (3) year term, with a maximum consecutive service limit of two (2) full terms.
Section 3.3. Compensation: Directors shall serve strictly without compensation, except for reasonable reimbursement of documented out-of-pocket expenses.`
  }
];

async function sha256Hex(text: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export function VisualRedlineEditor() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>("delaware_shares");
  const preset = PRESETS.find(p => p.id === selectedPresetId) || PRESETS[0];

  const [proposedText, setProposedText] = useState<string>(preset.defaultProposedText);
  const [originalHash, setOriginalHash] = useState<string>("");
  const [proposedHash, setProposedHash] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    setProposedText(preset.defaultProposedText);
  }, [preset]);

  useEffect(() => {
    sha256Hex(preset.originalText).then(setOriginalHash);
  }, [preset.originalText]);

  useEffect(() => {
    sha256Hex(proposedText).then(setProposedHash);
  }, [proposedText]);

  // Compute line-by-line diff
  const originalLines = preset.originalText.split("\n");
  const proposedLines = proposedText.split("\n");

  const diffLines: Array<{ type: "equal" | "added" | "removed"; text: string }> = [];

  const maxLen = Math.max(originalLines.length, proposedLines.length);
  for (let i = 0; i < maxLen; i++) {
    const orig = originalLines[i];
    const prop = proposedLines[i];

    if (orig === prop) {
      if (orig !== undefined) diffLines.push({ type: "equal", text: orig });
    } else {
      if (orig !== undefined && !proposedLines.includes(orig)) {
        diffLines.push({ type: "removed", text: orig });
      }
      if (prop !== undefined && !originalLines.includes(prop)) {
        diffLines.push({ type: "added", text: prop });
      } else if (orig !== undefined && proposedLines.includes(orig)) {
        diffLines.push({ type: "equal", text: orig });
      }
    }
  }

  const addedCount = diffLines.filter(l => l.type === "added").length;
  const removedCount = diffLines.filter(l => l.type === "removed").length;

  const proposalPayload = {
    type: "AMENDMENT",
    title: `Amendment to ${preset.documentTitle}`,
    targetDocumentTitle: preset.documentTitle,
    documentData: {
      proposedVersion: "1.1",
      previousHash: originalHash,
      newContentHash: proposedHash,
      diffSummary: `+${addedCount} lines, -${removedCount} lines`,
      content: proposedText
    }
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(JSON.stringify(proposalPayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-6">
      {/* Header bar */}
      <div className="bg-slate-900 text-white p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30 mb-3">
              <FileDiff className="w-3.5 h-3.5 text-cyan-400" />
              <span>Legal Diff Engine</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Visual Corporate Redline Studio
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Draft amendments with real-time visual redlines. Watch cryptographic content hashes update keystroke-by-keystroke to ensure immutable version traceability.
            </p>
          </div>

          <button
            onClick={() => setProposedText(preset.defaultProposedText)}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Clause</span>
          </button>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-slate-800">
          {PRESETS.map(p => {
            const isSelected = p.id === selectedPresetId;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPresetId(p.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition border ${
                  isSelected
                    ? "bg-slate-800 border-cyan-500 text-white shadow-sm"
                    : "bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                {p.title}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-6 sm:px-8 space-y-6">
        {/* Document Metadata Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 gap-3 text-xs">
          <div>
            <span className="text-slate-500 font-medium">Document Target:</span>{" "}
            <strong className="text-slate-900">{preset.documentTitle} (v1.0)</strong>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Entity Type:</span>{" "}
            <span className="font-semibold text-slate-700">{preset.entityType}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
              +{addedCount} added
            </span>
            <span className="text-rose-700 font-bold bg-rose-100 px-2 py-0.5 rounded border border-rose-300">
              -{removedCount} deleted
            </span>
          </div>
        </div>

        {/* Side-by-side Editor Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Baseline Original Text */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Original Ratified Charter (Baseline v1.0)</span>
              </label>
              <span className="text-[11px] text-slate-400 font-mono">Immutable</span>
            </div>
            <textarea
              readOnly
              value={preset.originalText}
              className="w-full h-80 p-4 rounded-xl font-mono text-xs text-slate-700 bg-slate-100 border border-slate-200 resize-none focus:outline-none"
            />
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2 text-[11px] font-mono text-slate-600 truncate">
              <Hash className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-slate-400">SHA-256:</span>
              <span className="truncate">{originalHash}</span>
            </div>
          </div>

          {/* Editable Proposed Amendment */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-cyan-600 flex items-center gap-1.5">
                <FileCode2 className="w-3.5 h-3.5 text-cyan-600" />
                <span>Proposed Amendment (Edit In Real-Time)</span>
              </label>
              <span className="text-[11px] text-cyan-600 font-bold">Drafting v1.1</span>
            </div>
            <textarea
              value={proposedText}
              onChange={e => setProposedText(e.target.value)}
              placeholder="Type your proposed clause changes here..."
              className="w-full h-80 p-4 rounded-xl font-mono text-xs text-slate-900 bg-white border border-cyan-400 focus:border-cyan-600 focus:ring-1 focus:ring-cyan-500 resize-none outline-none shadow-sm"
            />
            <div className="p-2.5 rounded-lg bg-cyan-50/60 border border-cyan-200 flex items-center gap-2 text-[11px] font-mono text-cyan-900 truncate">
              <Hash className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
              <span className="text-cyan-600">Proposed SHA-256:</span>
              <span className="truncate font-bold">{proposedHash}</span>
            </div>
          </div>
        </div>

        {/* Real-time Visual Redline Diff Stream */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Cryptographic Legal Redline (Unified Structured Diff)</span>
          </h4>
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-900 font-mono text-xs max-h-64 overflow-y-auto space-y-1">
            {diffLines.map((line, idx) => {
              if (line.type === "added") {
                return (
                  <div key={idx} className="text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded">
                    + {line.text}
                  </div>
                );
              }
              if (line.type === "removed") {
                return (
                  <div key={idx} className="text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded line-through">
                    - {line.text}
                  </div>
                );
              }
              return (
                <div key={idx} className="text-slate-400 px-2 py-0.5">
                  &nbsp; {line.text}
                </div>
              );
            })}
          </div>
        </div>

        {/* Export Proposal Payload */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
          <div>
            <div className="text-xs font-bold text-slate-900">Ready for Quorum Ratification</div>
            <div className="text-[11px] text-slate-500">
              Export the compiled cryptographic amendment payload directly to LegitBlock CLI or SDK.
            </div>
          </div>

          <button
            onClick={handleCopyPayload}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied Proposal JSON!" : "Copy Proposal Payload"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
