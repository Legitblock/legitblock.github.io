"use client";

import React, { useState, useMemo } from "react";
import { 
  Building2, 
  Scale, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Sliders, 
  Globe, 
  FileText, 
  Check, 
  Copy, 
  ExternalLink,
  BookOpen,
  Award
} from "lucide-react";

interface JurisdictionRule {
  code: string;
  name: string;
  statute: string;
  governingAuthority: string;
  minimumQuorum: number;
  defaultQuorum: number;
  defaultPassThreshold: number;
  allowsWeightedVoting: boolean;
  requiresEqualWorkerVote: boolean;
  nonProfitAssetLock: boolean;
  specialResolutionThreshold?: number;
  description: string;
}

const JURISDICTIONS: JurisdictionRule[] = [
  {
    code: "US-DE-CORP",
    name: "Delaware General Corporation Law",
    statute: "DGCL 8 Del. C. § 101 et seq. / § 216",
    governingAuthority: "Delaware Court of Chancery / Secretary of State",
    minimumQuorum: 0.3333,
    defaultQuorum: 0.5,
    defaultPassThreshold: 0.5,
    allowsWeightedVoting: true,
    requiresEqualWorkerVote: false,
    nonProfitAssetLock: false,
    description: "The gold standard for venture-backed startups and public companies. DGCL § 216 strictly prohibits bylaws from reducing stockholder quorum below one-third (33.3%)."
  },
  {
    code: "US-WY-DUNA-2024",
    name: "Wyoming Decentralized Nonprofit Association (DUNA)",
    statute: "Wyo. Stat. § 17-31-101 et seq. (2024)",
    governingAuthority: "Wyoming Secretary of State",
    minimumQuorum: 0.20,
    defaultQuorum: 0.5,
    defaultPassThreshold: 0.5,
    allowsWeightedVoting: true,
    requiresEqualWorkerVote: false,
    nonProfitAssetLock: true,
    description: "Pioneering statutory framework for decentralized protocols and DAOs. Mandates an indivisible asset lock: net earnings cannot be distributed as private member dividends."
  },
  {
    code: "US-CA-COOP-AB816",
    name: "California Worker Cooperative Corporation Act",
    statute: "Cal. Corp. Code § 12200 et seq. (AB 816)",
    governingAuthority: "California Secretary of State / Dept of Corporations",
    minimumQuorum: 0.25,
    defaultQuorum: 0.5,
    defaultPassThreshold: 0.5,
    allowsWeightedVoting: false,
    requiresEqualWorkerVote: true,
    nonProfitAssetLock: false,
    description: "Democratic worker ownership statute. Strictly mandates 'One Member, One Vote' regardless of capital contributions. Weighted equity share voting is illegal."
  },
  {
    code: "GB-UK-CA-2006",
    name: "United Kingdom Companies Act 2006",
    statute: "UK Companies Act 2006 (c. 46) ss. 281-285",
    governingAuthority: "Companies House, United Kingdom",
    minimumQuorum: 0.20,
    defaultQuorum: 0.5,
    defaultPassThreshold: 0.5,
    specialResolutionThreshold: 0.75,
    allowsWeightedVoting: true,
    requiresEqualWorkerVote: false,
    nonProfitAssetLock: false,
    description: "Statutory framework dividing resolutions into Ordinary Resolutions (>50% approval) and constitutional Special Resolutions (>=75% approval for articles and capital reductions)."
  }
];

export function JurisdictionInspector() {
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<JurisdictionRule>(JURISDICTIONS[0]);
  const [proposedQuorum, setProposedQuorum] = useState<number>(50);
  const [proposedPassThreshold, setProposedPassThreshold] = useState<number>(55);
  const [enableWeightedVoting, setEnableWeightedVoting] = useState<boolean>(true);
  const [enableDividendDistributions, setEnableDividendDistributions] = useState<boolean>(false);
  const [isSpecialResolution, setIsSpecialResolution] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Evaluate compliance against selected jurisdiction
  const compliance = useMemo(() => {
    const issues: { type: "error" | "warning" | "success"; title: string; message: string; statuteRef: string }[] = [];

    // 1. Quorum Check
    const quorumFraction = proposedQuorum / 100;
    if (quorumFraction < selectedJurisdiction.minimumQuorum) {
      issues.push({
        type: "error",
        title: "Statutory Quorum Deficiency",
        message: `Proposed quorum (${proposedQuorum}%) is below the statutory minimum of ${(selectedJurisdiction.minimumQuorum * 100).toFixed(1)}%. Bylaws reducing quorum below this floor are void under state law.`,
        statuteRef: selectedJurisdiction.statute
      });
    } else {
      issues.push({
        type: "success",
        title: "Statutory Quorum Satisfied",
        message: `Proposed quorum (${proposedQuorum}%) complies with statutory floor (${(selectedJurisdiction.minimumQuorum * 100).toFixed(1)}%).`,
        statuteRef: selectedJurisdiction.statute
      });
    }

    // 2. California One-Member-One-Vote Rule
    if (selectedJurisdiction.requiresEqualWorkerVote && enableWeightedVoting) {
      issues.push({
        type: "error",
        title: "Illegal Weighted Share Voting",
        message: `California AB 816 strictly mandates democratic 'One Member, One Vote'. Corporate charters allocating weighted voting shares will be rejected by the California Secretary of State.`,
        statuteRef: "Cal. Corp. Code § 12200 (AB 816)"
      });
    } else if (selectedJurisdiction.requiresEqualWorkerVote) {
      issues.push({
        type: "success",
        title: "Democratic Member Equality Confirmed",
        message: `Charter satisfies cooperative democracy mandate (equal suffrage per worker).`,
        statuteRef: "Cal. Corp. Code § 12200"
      });
    }

    // 3. Wyoming DUNA Asset Lock
    if (selectedJurisdiction.nonProfitAssetLock && enableDividendDistributions) {
      issues.push({
        type: "error",
        title: "Statutory Asset Lock Breach",
        message: `Wyoming DUNA Act (W.S. 17-31) forbids distributions of dividends or profits to members. Engaging in profit distribution destroys DUNA limited liability protection.`,
        statuteRef: "Wyo. Stat. § 17-31-105"
      });
    } else if (selectedJurisdiction.nonProfitAssetLock) {
      issues.push({
        type: "success",
        title: "Non-Profit Asset Lock Intact",
        message: `Indivisible capital reserve verified; zero private dividends authorized.`,
        statuteRef: "Wyo. Stat. § 17-31-105"
      });
    }

    // 4. UK Special Resolution Threshold
    if (selectedJurisdiction.specialResolutionThreshold && isSpecialResolution) {
      const required = selectedJurisdiction.specialResolutionThreshold * 100;
      if (proposedPassThreshold < required) {
        issues.push({
          type: "error",
          title: "Special Resolution Threshold Deficiency",
          message: `UK Companies Act 2006 s. 283 requires a minimum 75% supermajority for Special Resolutions. Proposed threshold (${proposedPassThreshold}%) is legally insufficient.`,
          statuteRef: "UK Companies Act 2006 s. 283"
        });
      } else {
        issues.push({
          type: "success",
          title: "UK Special Resolution Supermajority Satisfied",
          message: `Approval threshold of ${proposedPassThreshold}% satisfies the 75% statutory requirement for constitutional amendments.`,
          statuteRef: "UK Companies Act 2006 s. 283"
        });
      }
    }

    const hasErrors = issues.some((i) => i.type === "error");
    return { issues, isFullyCompliant: !hasErrors };
  }, [selectedJurisdiction, proposedQuorum, proposedPassThreshold, enableWeightedVoting, enableDividendDistributions, isSpecialResolution]);

  const handleCopyAttestation = () => {
    const cert = {
      standard: "LEGITBLOCK-MULTI-JURISDICTIONAL-COMPLIANCE-v1",
      jurisdiction: selectedJurisdiction.name,
      statute: selectedJurisdiction.statute,
      governingAuthority: selectedJurisdiction.governingAuthority,
      parameters: {
        proposedQuorum: `${proposedQuorum}%`,
        proposedPassThreshold: `${proposedPassThreshold}%`,
        weightedVotingAllowed: enableWeightedVoting,
        dividendDistributions: enableDividendDistributions,
        specialResolution: isSpecialResolution
      },
      evaluation: {
        isFullyCompliant: compliance.isFullyCompliant,
        issues: compliance.issues
      },
      attestationDate: new Date().toISOString()
    };
    navigator.clipboard.writeText(JSON.stringify(cert, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white shadow-xl border border-teal-900/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
              <Globe className="w-3.5 h-3.5 text-teal-400" />
              <span>Multi-Jurisdictional Legal Ruleset • Real-Time Statutory Checker</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Statutory By-Law &amp; Jurisdiction Inspector</h2>
            <p className="text-xs text-teal-200/80 max-w-2xl leading-relaxed">
              Verify organizational charter bylaws against statutory company law across Delaware, Wyoming (DUNA 2024), California (AB 816), and the United Kingdom. Detect statutory violations before filing with corporate registrars.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {JURISDICTIONS.map((j) => (
              <button
                key={j.code}
                onClick={() => {
                  setSelectedJurisdiction(j);
                  setProposedQuorum(Math.round(j.defaultQuorum * 100));
                  setProposedPassThreshold(Math.round(j.defaultPassThreshold * 100));
                  setEnableWeightedVoting(j.allowsWeightedVoting);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  selectedJurisdiction.code === j.code
                    ? "bg-teal-600 text-white border-teal-400 shadow-md"
                    : "bg-white/10 hover:bg-white/20 text-slate-200 border-white/15"
                }`}
              >
                {j.name.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Governance By-Law Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-teal-600" />
                <h3 className="font-bold text-sm text-slate-900">Proposed By-Law Settings</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                {selectedJurisdiction.code}
              </span>
            </div>

            {/* Selected Jurisdiction Card */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-xs font-bold text-slate-900 block">{selectedJurisdiction.name}</span>
              <p className="text-[11px] text-slate-600 leading-relaxed">{selectedJurisdiction.description}</p>
              <div className="text-[10px] font-mono text-teal-800 pt-1">
                Statutory Code: {selectedJurisdiction.statute}
              </div>
            </div>

            {/* Quorum Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-700">Stockholder/Member Quorum Floor:</label>
                <span className="font-mono font-bold text-teal-700">{proposedQuorum}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={proposedQuorum}
                onChange={(e) => setProposedQuorum(Number(e.target.value))}
                className="w-full accent-teal-600"
              />
              <span className="text-[10px] text-slate-400 block">
                Statutory Floor: {(selectedJurisdiction.minimumQuorum * 100).toFixed(1)}% minimum required
              </span>
            </div>

            {/* Pass Threshold Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-700">Approval Threshold:</label>
                <span className="font-mono font-bold text-teal-700">{proposedPassThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                step="5"
                value={proposedPassThreshold}
                onChange={(e) => setProposedPassThreshold(Number(e.target.value))}
                className="w-full accent-teal-600"
              />
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Weighted Equity Shares</span>
                  <span className="text-[10px] text-slate-500">Allow disproportionate votes based on share ownership</span>
                </div>
                <input
                  type="checkbox"
                  checked={enableWeightedVoting}
                  onChange={(e) => setEnableWeightedVoting(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Private Member Dividends</span>
                  <span className="text-[10px] text-slate-500">Authorize profit distributions to equity/token holders</span>
                </div>
                <input
                  type="checkbox"
                  checked={enableDividendDistributions}
                  onChange={(e) => setEnableDividendDistributions(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
              </label>

              {selectedJurisdiction.specialResolutionThreshold && (
                <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">UK Special Resolution Mode</span>
                    <span className="text-[10px] text-slate-500">Resolutions for charter amendment or capital reduction</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isSpecialResolution}
                    onChange={(e) => setIsSpecialResolution(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                  />
                </label>
              )}
            </div>

            <button
              onClick={handleCopyAttestation}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied Legal Attestation" : "Copy Statutory Attestation JSON"}
            </button>
          </div>
        </div>

        {/* Right Column: Statutory Analysis & Live Findings (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Statutory Status Banner */}
          <div className={`p-5 rounded-2xl border transition-all ${
            compliance.isFullyCompliant
              ? "bg-teal-50 border-teal-300 shadow-sm"
              : "bg-rose-50 border-rose-300 shadow-sm"
          }`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                {compliance.isFullyCompliant ? (
                  <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <h3 className={`text-base font-bold ${compliance.isFullyCompliant ? "text-teal-900" : "text-rose-900"}`}>
                    {compliance.isFullyCompliant
                      ? "Statutory Charter Verified: Legally Compliant"
                      : "Statutory Violation Detected: Charter Unenforceable"}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Authority: {selectedJurisdiction.governingAuthority}
                  </p>
                </div>
              </div>

              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shrink-0 ${
                compliance.isFullyCompliant
                  ? "bg-teal-100 text-teal-800 border-teal-300"
                  : "bg-rose-100 text-rose-800 border-rose-300"
              }`}>
                {compliance.isFullyCompliant ? "Valid Charter" : "Deficient"}
              </span>
            </div>
          </div>

          {/* Detailed Legal Findings List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-teal-600" />
                <h3 className="font-bold text-sm text-slate-900">Statutory Analysis Findings</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                {compliance.issues.length} Evaluated Rules
              </span>
            </div>

            <div className="space-y-3">
              {compliance.issues.map((issue, idx) => {
                const isError = issue.type === "error";
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border space-y-1.5 ${
                      isError
                        ? "bg-rose-50/80 border-rose-200 text-rose-950"
                        : "bg-teal-50/80 border-teal-200 text-teal-950"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isError ? (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                        )}
                        <span className="font-bold text-xs">{issue.title}</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/70 border border-slate-200 text-slate-600">
                        {issue.statuteRef}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-700 pl-6">{issue.message}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
