"use client";

import React, { useState, useMemo } from "react";
import { 
  Scale, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Sliders, 
  FileCheck2, 
  Copy, 
  Check, 
  Download, 
  RefreshCw, 
  Lock, 
  Clock, 
  DollarSign, 
  UserCheck, 
  Sparkles 
} from "lucide-react";

interface CovenantConfig {
  budgetEnabled: boolean;
  budgetCeiling: number;
  budgetSupermajority: number;
  waitingPeriodEnabled: boolean;
  minWaitingHours: number;
  roleApprovalEnabled: boolean;
  sensitiveCategories: string[];
  requiredRole: string;
  quorumEnabled: boolean;
  minQuorum: number;
}

interface TestProposal {
  title: string;
  category: string;
  amount: number;
  reviewHours: number;
  quorumRate: number;
  voteRate: number;
  signatories: string[];
}

const PRESET_COVENANTS: { name: string; desc: string; config: CovenantConfig }[] = [
  {
    name: "Delaware Tech Startup (Standard)",
    desc: "Balanced controls for venture-backed startups with $50k expenditure cap and independent director veto.",
    config: {
      budgetEnabled: true,
      budgetCeiling: 50000,
      budgetSupermajority: 75,
      waitingPeriodEnabled: true,
      minWaitingHours: 48,
      roleApprovalEnabled: true,
      sensitiveCategories: ["Equity Issuance / Stock Plan", "Bylaw Amendment", "Officer Removal"],
      requiredRole: "Independent Director",
      quorumEnabled: true,
      minQuorum: 67
    }
  },
  {
    name: "Mission-Locked Benefit Corp (B-Corp)",
    desc: "Rigorous fiduciary governance requiring 72-hour review and Audit Chair approval for charter changes.",
    config: {
      budgetEnabled: true,
      budgetCeiling: 25000,
      budgetSupermajority: 80,
      waitingPeriodEnabled: true,
      minWaitingHours: 72,
      roleApprovalEnabled: true,
      sensitiveCategories: ["Bylaw Amendment", "Capital Expenditure", "Officer Removal"],
      requiredRole: "Audit Committee Chair",
      quorumEnabled: true,
      minQuorum: 75
    }
  },
  {
    name: "Decentralized Member Cooperative",
    desc: "High participatory threshold with 96-hour cooling period and 80% supermajority quorum.",
    config: {
      budgetEnabled: true,
      budgetCeiling: 15000,
      budgetSupermajority: 85,
      waitingPeriodEnabled: true,
      minWaitingHours: 96,
      roleApprovalEnabled: true,
      sensitiveCategories: ["Bylaw Amendment", "Equity Issuance / Stock Plan", "Capital Expenditure"],
      requiredRole: "General Counsel",
      quorumEnabled: true,
      minQuorum: 80
    }
  }
];

const AVAILABLE_ROLES = [
  "Chief Executive Officer",
  "Chief Technology Officer",
  "Independent Director",
  "Audit Committee Chair",
  "General Counsel",
  "Lead Series A Investor"
];

const AVAILABLE_CATEGORIES = [
  "Capital Expenditure",
  "Bylaw Amendment",
  "Equity Issuance / Stock Plan",
  "Officer Removal",
  "Routine Vendor Agreement"
];

// Browser-compatible SHA-256 with graceful fallback for insecure (non-HTTPS) contexts
async function sha256Hex(text: string): Promise<string> {
  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    try {
      const enc = new TextEncoder().encode(text);
      const hashBuf = await window.crypto.subtle.digest("SHA-256", enc);
      return Array.from(new Uint8Array(hashBuf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    } catch {
      // Fallback if digest fails
    }
  }

  // Deterministic 64-character hex fallback for insecure HTTP / legacy contexts
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

export function CovenantStudio() {
  const [config, setConfig] = useState<CovenantConfig>(PRESET_COVENANTS[0].config);
  const [proposal, setProposal] = useState<TestProposal>({
    title: "Authorization of GPU Cloud Infrastructure Contract",
    category: "Capital Expenditure",
    amount: 75000,
    reviewHours: 52,
    quorumRate: 80,
    voteRate: 78,
    signatories: ["Chief Executive Officer", "Chief Technology Officer", "Independent Director"]
  });

  const [receiptHash, setReceiptHash] = useState<string>("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
  const [copied, setCopied] = useState(false);
  const [simulatedBlock, setSimulatedBlock] = useState<number | null>(null);

  // Evaluate compliance
  const evaluation = useMemo(() => {
    const results: {
      covenant: string;
      passed: boolean;
      details: string;
      severity: "critical" | "warning" | "info";
    }[] = [];

    // 1. Budget Ceiling Covenant
    if (config.budgetEnabled) {
      if (proposal.amount <= config.budgetCeiling) {
        results.push({
          covenant: "Budget Ceiling",
          passed: true,
          details: `Requested $${proposal.amount.toLocaleString()} is within the $${config.budgetCeiling.toLocaleString()} ordinary threshold.`,
          severity: "info"
        });
      } else {
        // Exceeds ceiling: check if supermajority vote was reached
        if (proposal.voteRate >= config.budgetSupermajority) {
          results.push({
            covenant: "Budget Ceiling (Supermajority Override)",
            passed: true,
            details: `Requested $${proposal.amount.toLocaleString()} exceeds $${config.budgetCeiling.toLocaleString()} ceiling, but received ${proposal.voteRate}% approval (exceeds required ${config.budgetSupermajority}% supermajority).`,
            severity: "info"
          });
        } else {
          results.push({
            covenant: "Budget Ceiling Breach",
            passed: false,
            details: `Requested $${proposal.amount.toLocaleString()} exceeds $${config.budgetCeiling.toLocaleString()} cap. Failed to achieve ${config.budgetSupermajority}% supermajority approval (received only ${proposal.voteRate}%).`,
            severity: "critical"
          });
        }
      }
    }

    // 2. Minimum Review Waiting Period Covenant
    if (config.waitingPeriodEnabled) {
      if (proposal.reviewHours >= config.minWaitingHours) {
        results.push({
          covenant: "Statutory Waiting Period",
          passed: true,
          details: `${proposal.reviewHours} hours elapsed since proposal publication (exceeds required ${config.minWaitingHours} hours).`,
          severity: "info"
        });
      } else {
        results.push({
          covenant: "Waiting Period Premature Vote",
          passed: false,
          details: `Only ${proposal.reviewHours} hours elapsed. Mandatory cooling covenant requires at least ${config.minWaitingHours} hours prior to ballot.`,
          severity: "critical"
        });
      }
    }

    // 3. Mandatory Role Approval Covenant
    if (config.roleApprovalEnabled) {
      const isSensitive = config.sensitiveCategories.includes(proposal.category);
      if (isSensitive) {
        const hasRole = proposal.signatories.includes(config.requiredRole);
        if (hasRole) {
          results.push({
            covenant: "Mandatory Fiduciary Signatory",
            passed: true,
            details: `Sensitive action "${proposal.category}" confirmed with verified counter-signature from [${config.requiredRole}].`,
            severity: "info"
          });
        } else {
          results.push({
            covenant: "Missing Mandatory Signatory",
            passed: false,
            details: `Category "${proposal.category}" legally requires approval from [${config.requiredRole}]. Present signatories: ${proposal.signatories.join(", ") || "None"}.`,
            severity: "critical"
          });
        }
      } else {
        results.push({
          covenant: "Mandatory Fiduciary Signatory",
          passed: true,
          details: `Category "${proposal.category}" is non-sensitive; role veto is not invoked.`,
          severity: "info"
        });
      }
    }

    // 4. Quorum Rule
    if (config.quorumEnabled) {
      if (proposal.quorumRate >= config.minQuorum) {
        results.push({
          covenant: "Statutory Quorum",
          passed: true,
          details: `Board attendance of ${proposal.quorumRate}% satisfies required quorum of ${config.minQuorum}%.`,
          severity: "info"
        });
      } else {
        results.push({
          covenant: "Quorum Deficiency",
          passed: false,
          details: `Board attendance of ${proposal.quorumRate}% fails required quorum threshold of ${config.minQuorum}%.`,
          severity: "critical"
        });
      }
    }

    const allPassed = results.every((r) => r.passed);
    return { results, allPassed };
  }, [config, proposal]);

  // Update receipt hash when evaluation changes
  React.useEffect(() => {
    const payload = JSON.stringify({
      config,
      proposal,
      verdict: evaluation.allPassed ? "COMPLIANT" : "NON_COMPLIANT",
      timestamp: new Date().toISOString()
    });
    sha256Hex(payload).then(setReceiptHash);
  }, [config, proposal, evaluation]);

  const toggleSignatory = (role: string) => {
    setProposal((prev) => {
      const exists = prev.signatories.includes(role);
      return {
        ...prev,
        signatories: exists
          ? prev.signatories.filter((r) => r !== role)
          : [...prev.signatories, role]
      };
    });
  };

  const copyReceipt = () => {
    const receiptData = {
      specVersion: "DGCL-224-COVENANT-v1",
      attestation: "Delaware Statutory Smart Legal Covenant Verification",
      covenantsActive: {
        budgetCeiling: config.budgetEnabled ? `$${config.budgetCeiling}` : "disabled",
        waitingPeriod: config.waitingPeriodEnabled ? `${config.minWaitingHours}h` : "disabled",
        mandatoryRole: config.roleApprovalEnabled ? config.requiredRole : "disabled",
        minQuorum: config.quorumEnabled ? `${config.minQuorum}%` : "disabled"
      },
      evaluatedProposal: proposal,
      evaluationVerdict: evaluation.allPassed ? "RATIFICATION_PERMITTED" : "EXECUTION_REJECTED",
      rulesBreakdown: evaluation.results,
      complianceDigest: receiptHash,
      generatedAt: new Date().toISOString()
    };
    navigator.clipboard.writeText(JSON.stringify(receiptData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateCommit = () => {
    if (!evaluation.allPassed) return;
    setSimulatedBlock(Math.floor(1000 + Math.random() * 9000));
    setTimeout(() => {
      // auto-reset simulated block message after 5 seconds
      setSimulatedBlock(null);
    }, 6000);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-indigo-900/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
              <Scale className="w-3.5 h-3.5 text-indigo-400" />
              <span>Smart Legal Covenant Studio • DGCL § 141 / § 224 Compliant</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Constitutional Governance &amp; Covenant Engine</h2>
            <p className="text-xs text-indigo-200/80 max-w-2xl leading-relaxed">
              Define automated constitutional bylaws that cannot be breached by rogue board majorities. Test spending caps, cooling periods, and required fiduciary approvals against live amendment resolutions.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESET_COVENANTS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => setConfig(preset.config)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all text-left"
                title={preset.desc}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Covenant Rules Configuration (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">Active Governance Covenants</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Live Constraints
              </span>
            </div>

            {/* Rule 1: Budget Ceiling */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.budgetEnabled}
                    onChange={(e) => setConfig({ ...config, budgetEnabled: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  Budget Ceiling Cap
                </label>
                <span className="text-[10px] font-semibold text-slate-500">
                  {config.budgetEnabled ? "Active" : "Disabled"}
                </span>
              </div>

              {config.budgetEnabled && (
                <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-1">Max Ordinary Ceiling:</span>
                    <div className="flex items-center bg-white border border-slate-300 rounded-lg px-2 py-1">
                      <span className="text-slate-400 mr-1">$</span>
                      <input
                        type="number"
                        value={config.budgetCeiling}
                        onChange={(e) => setConfig({ ...config, budgetCeiling: Number(e.target.value) })}
                        step="5000"
                        className="w-full text-xs font-mono outline-none text-slate-800"
                      />
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-1">Supermajority Override:</span>
                    <div className="flex items-center bg-white border border-slate-300 rounded-lg px-2 py-1">
                      <input
                        type="number"
                        value={config.budgetSupermajority}
                        onChange={(e) => setConfig({ ...config, budgetSupermajority: Number(e.target.value) })}
                        max="100"
                        min="51"
                        className="w-full text-xs font-mono outline-none text-slate-800"
                      />
                      <span className="text-slate-400 ml-1">%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Rule 2: Minimum Waiting Period */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.waitingPeriodEnabled}
                    onChange={(e) => setConfig({ ...config, waitingPeriodEnabled: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  Statutory Waiting Period
                </label>
                <span className="text-[10px] font-semibold text-slate-500">
                  {config.waitingPeriodEnabled ? "Active" : "Disabled"}
                </span>
              </div>

              {config.waitingPeriodEnabled && (
                <div className="pt-1 text-xs">
                  <span className="text-[11px] text-slate-500 block mb-1">Notice to Ballot Buffer:</span>
                  <div className="flex items-center bg-white border border-slate-300 rounded-lg px-2 py-1">
                    <input
                      type="number"
                      value={config.minWaitingHours}
                      onChange={(e) => setConfig({ ...config, minWaitingHours: Number(e.target.value) })}
                      min="1"
                      className="w-full text-xs font-mono outline-none text-slate-800"
                    />
                    <span className="text-slate-500 text-[11px] font-medium ml-1">Hours</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Prevents flash amendments from passing without adequate member review.</p>
                </div>
              )}
            </div>

            {/* Rule 3: Mandatory Role Approval */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.roleApprovalEnabled}
                    onChange={(e) => setConfig({ ...config, roleApprovalEnabled: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                  Mandatory Fiduciary Signatory
                </label>
                <span className="text-[10px] font-semibold text-slate-500">
                  {config.roleApprovalEnabled ? "Active" : "Disabled"}
                </span>
              </div>

              {config.roleApprovalEnabled && (
                <div className="pt-1 text-xs space-y-2">
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-1">Required Role:</span>
                    <select
                      value={config.requiredRole}
                      onChange={(e) => setConfig({ ...config, requiredRole: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-800 font-medium"
                    >
                      {AVAILABLE_ROLES.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-1">Triggered on Sensitive Categories:</span>
                    <div className="flex flex-wrap gap-1">
                      {config.sensitiveCategories.map((c) => (
                        <span key={c} className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Rule 4: Quorum Requirement */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.quorumEnabled}
                    onChange={(e) => setConfig({ ...config, quorumEnabled: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  Statutory Quorum Rule
                </label>
                <span className="text-[10px] font-semibold text-slate-500">
                  {config.quorumEnabled ? "Active" : "Disabled"}
                </span>
              </div>

              {config.quorumEnabled && (
                <div className="pt-1 text-xs">
                  <span className="text-[11px] text-slate-500 block mb-1">Minimum Board Attendance:</span>
                  <div className="flex items-center bg-white border border-slate-300 rounded-lg px-2 py-1">
                    <input
                      type="number"
                      value={config.minQuorum}
                      onChange={(e) => setConfig({ ...config, minQuorum: Number(e.target.value) })}
                      min="50"
                      max="100"
                      className="w-full text-xs font-mono outline-none text-slate-800"
                    />
                    <span className="text-slate-400 ml-1">%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Proposal Sandbox & Live Evaluation (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Proposal Input Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-900">Draft Resolution to Evaluate</h3>
              </div>
              <span className="text-[11px] font-medium text-slate-500">
                Sandbox Mode
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Resolution Title:</label>
                <input
                  type="text"
                  value={proposal.title}
                  onChange={(e) => setProposal({ ...proposal, title: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Category:</label>
                  <select
                    value={proposal.category}
                    onChange={(e) => setProposal({ ...proposal, category: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 bg-white"
                  >
                    {AVAILABLE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Requested Expenditure ($ USD):</label>
                  <input
                    type="number"
                    value={proposal.amount}
                    onChange={(e) => setProposal({ ...proposal, amount: Number(e.target.value) })}
                    step="5000"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs font-mono text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Review Notice Duration: <strong>{proposal.reviewHours} hours</strong>
                  </label>
                  <input
                    type="range"
                    min="6"
                    max="120"
                    value={proposal.reviewHours}
                    onChange={(e) => setProposal({ ...proposal, reviewHours: Number(e.target.value) })}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Board Approval: <strong>{proposal.voteRate}%</strong> | Quorum: <strong>{proposal.quorumRate}%</strong>
                  </label>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={proposal.voteRate}
                    onChange={(e) => setProposal({ ...proposal, voteRate: Number(e.target.value) })}
                    className="w-full accent-emerald-600"
                  />
                </div>
              </div>

              {/* Signatories Checkboxes */}
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1.5">
                  Counter-Signing Board Directors &amp; Officers:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {AVAILABLE_ROLES.map((role) => {
                    const isChecked = proposal.signatories.includes(role);
                    return (
                      <label
                        key={role}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                          isChecked
                            ? "bg-indigo-50/80 border-indigo-300 text-indigo-950 font-medium"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSignatory(role)}
                          className="w-3.5 h-3.5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                        />
                        <span className="truncate">{role}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Real-Time Evaluation Result */}
          <div className={`p-5 rounded-2xl border transition-all ${
            evaluation.allPassed 
              ? "bg-emerald-50/70 border-emerald-300 shadow-sm"
              : "bg-rose-50/70 border-rose-300 shadow-sm"
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 mb-3">
              <div className="flex items-center gap-2">
                {evaluation.allPassed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600" />
                )}
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    {evaluation.allPassed ? "Constitutional Ratification Permitted" : "Constitutional Violation Detected"}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {evaluation.allPassed 
                      ? "Resolution meets all statutory covenants and can be submitted for cryptographic block commitment."
                      : "Resolution breaches one or more constitutional bylaws. The ledger consensus will reject this proposal."}
                  </p>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                evaluation.allPassed
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : "bg-rose-100 text-rose-800 border border-rose-300"
              }`}>
                {evaluation.allPassed ? "PASSED" : "REJECTED"}
              </span>
            </div>

            {/* Individual Rule Breakdown */}
            <div className="space-y-2 mb-4">
              {evaluation.results.map((rule, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2 p-2.5 rounded-xl border text-xs ${
                    rule.passed
                      ? "bg-white border-emerald-200 text-slate-700"
                      : "bg-white border-rose-200 text-rose-900 font-medium"
                  }`}
                >
                  {rule.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <span className="font-semibold block">{rule.covenant}</span>
                    <span className="text-[11px] text-slate-600">{rule.details}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions: Copy Statutory Receipt or Commit */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={copyReceipt}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Receipt Copied!" : "Copy Compliance Receipt"}</span>
                </button>

                <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-slate-500 bg-white/70 px-2 py-1 rounded-lg border border-slate-200">
                  <span className="text-slate-400">DGCL SHA:</span>
                  <span className="truncate max-w-[120px]">{receiptHash}</span>
                </div>
              </div>

              {evaluation.allPassed && (
                <button
                  onClick={handleSimulateCommit}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Ratify &amp; Mine Block
                </button>
              )}
            </div>

            {simulatedBlock && (
              <div className="mt-3 p-3 bg-emerald-100/80 border border-emerald-300 rounded-xl text-xs text-emerald-950 flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  <strong>Success!</strong> Amendment legally ratified and cryptographically committed into block <strong>#{simulatedBlock}</strong> with Delaware statutory seal.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
