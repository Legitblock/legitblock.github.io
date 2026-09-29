"use client";

import React, { useState, useMemo } from "react";
import { 
  Globe, 
  Scale, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sliders, 
  ShieldCheck, 
  Layers, 
  Info, 
  Building2, 
  FileText,
  RotateCcw
} from "lucide-react";

interface JurisdictionRule {
  id: string;
  name: string;
  flag: string;
  primaryStatute: string;
  evaluate: (params: GovernanceParams) => {
    status: "COMPLIANT" | "WARNING" | "VIOLATION";
    citation: string;
    details: string;
    remedy?: string;
  };
}

interface GovernanceParams {
  quorumPercent: number;
  votingThreshold: "majority" | "supermajority_66" | "supermajority_75" | "unanimous";
  secretBallotEnabled: boolean;
  proxyDelegationEnabled: boolean;
  timelockHours: number;
  isNonProfitAssetLock: boolean;
  blockchainLedgerBooks: boolean;
}

const JURISDICTIONS: JurisdictionRule[] = [
  {
    id: "US-DE",
    name: "Delaware, USA (C-Corporation)",
    flag: "🇺🇸",
    primaryStatute: "Delaware General Corporation Law (DGCL)",
    evaluate: (p) => {
      // DGCL § 216: Quorum of stockholders cannot be less than one-third (33.3%)
      if (p.quorumPercent < 33.33) {
        return {
          status: "VIOLATION",
          citation: "DGCL § 216 (Quorum of Stockholders)",
          details: `Quorum is set to ${p.quorumPercent}%. Under DGCL § 216, in no event shall a quorum consist of less than one-third (33.33%) of the shares entitled to vote.`,
          remedy: "Increase stockholder quorum to at least 33.4% in corporate charter."
        };
      }

      // DGCL § 224: Form of Records
      if (!p.blockchainLedgerBooks) {
        return {
          status: "WARNING",
          citation: "DGCL § 224 (Form of Records)",
          details: "Ledger books are not maintained electronically. DGCL § 224 permits distributed electronic networks if convertible to legible written form within reasonable time."
        };
      }

      // DGCL § 212: Voting Rights of Stockholders; Proxies
      if (!p.proxyDelegationEnabled) {
        return {
          status: "WARNING",
          citation: "DGCL § 212(b) (Right to Proxy)",
          details: "Proxy voting is disabled. DGCL § 212 guarantees stockholders the statutory right to vote by proxy unless express waiver provisions apply."
        };
      }

      return {
        status: "COMPLIANT",
        citation: "DGCL § 141, § 216, § 224, § 242",
        details: "Fully compliant with Delaware corporate governance formalities. Blockchain records satisfy DGCL § 224; quorum exceeds statutory one-third minimum."
      };
    }
  },
  {
    id: "US-WY",
    name: "Wyoming, USA (DUNA / DAO)",
    flag: "🇺🇸",
    primaryStatute: "Wyoming Decentralized Unincorporated Nonprofit Association Act (W.S. 17-31)",
    evaluate: (p) => {
      // DUNA Act mandates nonprofit asset lock: no net earnings can inure to members
      if (!p.isNonProfitAssetLock) {
        return {
          status: "VIOLATION",
          citation: "W.S. § 17-31-105 (Nonprofit Character)",
          details: "Entity does not enforce a nonprofit asset lock. Wyoming DUNA statutes strictly prohibit distributing profits or dividends to members.",
          remedy: "Enable Non-Profit Asset Dedication Lock or re-incorporate as a Wyoming DAO LLC (W.S. 17-32)."
        };
      }

      if (p.timelockHours < 24) {
        return {
          status: "WARNING",
          citation: "W.S. § 17-31-109 (Member Protections)",
          details: `Statutory timelock is set to ${p.timelockHours}h. Best practice for decentralized governance under Wyoming law recommends at least 24h timelock for emergency member dissent.`
        };
      }

      return {
        status: "COMPLIANT",
        citation: "W.S. § 17-31-101 et seq.",
        details: "Complies with Wyoming DUNA statutory parameters. Legal personality and asset partition shielded under W.S. 17-31."
      };
    }
  },
  {
    id: "US-CA",
    name: "California, USA (Worker Co-op)",
    flag: "🇺🇸",
    primaryStatute: "California Consumer & Worker Cooperative Act (AB 816)",
    evaluate: (p) => {
      // California Worker Co-op strictly enforces One-Worker-One-Vote
      if (p.votingThreshold === "unanimous" && p.quorumPercent < 50) {
        return {
          status: "WARNING",
          citation: "Cal. Corp. Code § 12200 / AB 816",
          details: "Unanimous threshold with low quorum may lead to organizational paralysis in democratic worker cooperatives."
        };
      }

      if (!p.secretBallotEnabled) {
        return {
          status: "WARNING",
          citation: "Cal. Corp. Code § 12463 (Secret Ballots)",
          details: "Democratic worker cooperatives strongly favor secret ballots for director elections to protect workers against supervisory retaliation."
        };
      }

      return {
        status: "COMPLIANT",
        citation: "Cal. Corp. Code § 12200 et seq. (AB 816)",
        details: "Satisfies California democratic cooperative principles. Equal voting franchise preserved."
      };
    }
  },
  {
    id: "UK",
    name: "United Kingdom (Private Ltd / ETDA)",
    flag: "🇬🇧",
    primaryStatute: "UK Companies Act 2006 & Electronic Trade Documents Act 2023",
    evaluate: (p) => {
      // Companies Act 2006 s. 283: Special Resolutions require at least 75% majority
      if (p.votingThreshold === "majority" || p.votingThreshold === "supermajority_66") {
        return {
          status: "WARNING",
          citation: "UK Companies Act 2006 s. 283 (Special Resolutions)",
          details: `Voting threshold (${p.votingThreshold}) is below 75%. Constitutional charter articles amendment under UK law statutorily requires a 75% Special Resolution.`,
          remedy: "Require a 75% Supermajority threshold for constitutional articles amendments."
        };
      }

      return {
        status: "COMPLIANT",
        citation: "Companies Act 2006 s. 283; ETDA 2023",
        details: "Valid under UK law. Electronic documents and digital signatures recognized under Electronic Trade Documents Act 2023."
      };
    }
  },
  {
    id: "SG",
    name: "Singapore (MLETR / Co. Act)",
    flag: "🇸🇬",
    primaryStatute: "Singapore Electronic Transactions Act (MLETR) & Companies Act 1967",
    evaluate: (p) => {
      if (!p.blockchainLedgerBooks) {
        return {
          status: "WARNING",
          citation: "Singapore ETA (Cap. 88) / MLETR",
          details: "Singapore UNCITRAL Model Law on Electronic Transferable Records provides full legal equivalence for electronic records."
        };
      }

      return {
        status: "COMPLIANT",
        citation: "Singapore ETA 2021 (MLETR) & Co. Act s. 184",
        details: "Compliant with Singapore international corporate standards and statutory electronic registry recognition."
      };
    }
  }
];

export function ConflictOfLawsSimulator() {
  const [params, setParams] = useState<GovernanceParams>({
    quorumPercent: 50,
    votingThreshold: "supermajority_75",
    secretBallotEnabled: true,
    proxyDelegationEnabled: true,
    timelockHours: 48,
    isNonProfitAssetLock: false,
    blockchainLedgerBooks: true
  });

  const evaluations = useMemo(() => {
    return JURISDICTIONS.map((j) => ({
      jurisdiction: j,
      result: j.evaluate(params)
    }));
  }, [params]);

  const summary = useMemo(() => {
    let compliant = 0;
    let warnings = 0;
    let violations = 0;

    evaluations.forEach((e) => {
      if (e.result.status === "COMPLIANT") compliant++;
      else if (e.result.status === "WARNING") warnings++;
      else violations++;
    });

    return { compliant, warnings, violations };
  }, [evaluations]);

  const handleResetDefaults = () => {
    setParams({
      quorumPercent: 50,
      votingThreshold: "supermajority_75",
      secretBallotEnabled: true,
      proxyDelegationEnabled: true,
      timelockHours: 48,
      isNonProfitAssetLock: false,
      blockchainLedgerBooks: true
    });
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white shadow-xl border border-teal-800/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
              <Globe className="w-3.5 h-3.5 text-teal-400" />
              <span>Multi-Jurisdictional Cross-Border Statutory Analyzer</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Conflict-of-Laws Simulator
            </h2>
            <p className="text-xs text-teal-200/80 max-w-2xl leading-relaxed">
              Model cross-border corporate governance and evaluate statutory harmonisation across Delaware (DGCL), Wyoming (DUNA), California (Worker Co-op AB 816), UK (Companies Act 2006), and Singapore (MLETR).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDefaults}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Recommended Baseline
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Governance Controllers (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-teal-600" />
                <h3 className="font-bold text-sm text-slate-900">Governance Parameters</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-50 text-teal-700">
                Live Simulator
              </span>
            </div>

            {/* Quorum Percentage Slider */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs">
                <label className="font-bold text-slate-700">Stockholder / Member Quorum:</label>
                <span className={`font-mono font-bold ${params.quorumPercent < 33.33 ? "text-rose-600" : "text-teal-700"}`}>
                  {params.quorumPercent}%
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={params.quorumPercent}
                onChange={(e) => setParams({ ...params, quorumPercent: Number(e.target.value) })}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Delaware DGCL § 216 strictly requires ≥ 33.33% quorum for stockholder actions.
              </p>
            </div>

            {/* Voting Threshold */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Constitutional Voting Threshold:
              </label>
              <select
                value={params.votingThreshold}
                onChange={(e) => setParams({ ...params, votingThreshold: e.target.value as any })}
                className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-800"
              >
                <option value="majority">Simple Majority (50% + 1)</option>
                <option value="supermajority_66">Supermajority 2/3 (66.67%)</option>
                <option value="supermajority_75">Supermajority 3/4 (75% - UK Special Resolution)</option>
                <option value="unanimous">Unanimous Consent (100%)</option>
              </select>
            </div>

            {/* Statutory Timelock Queue */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs">
                <label className="font-bold text-slate-700">Execution Timelock Delay:</label>
                <span className="font-mono font-bold text-teal-700">{params.timelockHours} hours</span>
              </div>
              <input
                type="range"
                min={0}
                max={72}
                step={6}
                value={params.timelockHours}
                onChange={(e) => setParams({ ...params, timelockHours: Number(e.target.value) })}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>

            {/* Feature Toggles */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                <div>
                  <span className="font-bold block">Homomorphic Secret Ballots</span>
                  <span className="text-[10px] text-slate-400">Blinded Pedersen commitments for elections</span>
                </div>
                <input
                  type="checkbox"
                  checked={params.secretBallotEnabled}
                  onChange={(e) => setParams({ ...params, secretBallotEnabled: e.target.checked })}
                  className="w-4 h-4 accent-teal-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                <div>
                  <span className="font-bold block">Delegated Proxy Voting (DGCL § 212)</span>
                  <span className="text-[10px] text-slate-400">Permit shareholders to appoint voting agents</span>
                </div>
                <input
                  type="checkbox"
                  checked={params.proxyDelegationEnabled}
                  onChange={(e) => setParams({ ...params, proxyDelegationEnabled: e.target.checked })}
                  className="w-4 h-4 accent-teal-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                <div>
                  <span className="font-bold block">Non-Profit Asset Lock (W.S. 17-31)</span>
                  <span className="text-[10px] text-slate-400">Mandatory dissolution lock to charities</span>
                </div>
                <input
                  type="checkbox"
                  checked={params.isNonProfitAssetLock}
                  onChange={(e) => setParams({ ...params, isNonProfitAssetLock: e.target.checked })}
                  className="w-4 h-4 accent-teal-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                <div>
                  <span className="font-bold block">Blockchain Electronic Ledger (DGCL § 224)</span>
                  <span className="text-[10px] text-slate-400">Books &amp; records on distributed network</span>
                </div>
                <input
                  type="checkbox"
                  checked={params.blockchainLedgerBooks}
                  onChange={(e) => setParams({ ...params, blockchainLedgerBooks: e.target.checked })}
                  className="w-4 h-4 accent-teal-600 rounded"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Jurisdiction Evaluation Matrix (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Executive Harmonization Score Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Harmonization Scorecard
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                {summary.compliant} / {JURISDICTIONS.length} Jurisdictions Compliant
              </h3>
            </div>

            <div className="flex gap-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                {summary.compliant} Compliant
              </span>
              {summary.warnings > 0 && (
                <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300">
                  {summary.warnings} Warnings
                </span>
              )}
              {summary.violations > 0 && (
                <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold border border-rose-300">
                  {summary.violations} Incompatible
                </span>
              )}
            </div>
          </div>

          {/* Cards for Each Jurisdiction */}
          <div className="space-y-4">
            {evaluations.map(({ jurisdiction, result }) => (
              <div
                key={jurisdiction.id}
                className={`p-5 rounded-2xl border transition-all ${
                  result.status === "COMPLIANT"
                    ? "bg-white border-slate-200 shadow-sm"
                    : result.status === "WARNING"
                    ? "bg-amber-50/50 border-amber-200 shadow-sm"
                    : "bg-rose-50/60 border-rose-300 shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{jurisdiction.flag}</span>
                      <h4 className="text-sm font-bold text-slate-900">{jurisdiction.name}</h4>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 mt-0.5 block">
                      {jurisdiction.primaryStatute}
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shrink-0 ${
                    result.status === "COMPLIANT"
                      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                      : result.status === "WARNING"
                      ? "bg-amber-100 text-amber-800 border-amber-300"
                      : "bg-rose-100 text-rose-800 border-rose-300"
                  }`}>
                    {result.status}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>Statutory Citation: <code className="text-[11px] bg-slate-100 px-1 py-0.5 rounded text-slate-800">{result.citation}</code></span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">{result.details}</p>
                  {result.remedy && (
                    <div className="mt-2 p-2 rounded-lg bg-rose-100/70 border border-rose-200 text-rose-900 text-[11px] font-medium flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span><strong>Statutory Remedy:</strong> {result.remedy}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
