"use client";

import React, { useState } from "react";
import { 
  ShieldAlert, 
  Scale, 
  Flame, 
  Users, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Hammer, 
  RotateCcw,
  Sparkles,
  Lock,
  ChevronRight
} from "lucide-react";

interface ScenarioVoter {
  id: string;
  name: string;
  role: string;
  weight: number;
  vote: "yes" | "no" | "abstain";
}

interface ScenarioConfig {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  legalContext: string;
  statute: string;
  quorumRequired: number;
  thresholdRequired: number;
  initialVoters: ScenarioVoter[];
  proposalTitle: string;
  resolutionText: string;
}

const SCENARIOS: ScenarioConfig[] = [
  {
    id: "deadlock",
    title: "50/50 Founder vs VC Deadlock",
    subtitle: "Tiebreaker & Independent Director Escalation",
    icon: <Scale className="w-5 h-5 text-amber-500" />,
    legalContext: "Under Delaware DGCL § 141, equal board divisions without an odd-numbered tiebreaker paralyze corporate decision-making, risking court-appointed custodianship. LegitBlock requires affirmative supermajority or an independent casting vote.",
    statute: "Delaware Code Title 8 § 141 / § 226",
    quorumRequired: 66.67,
    thresholdRequired: 60.0,
    proposalTitle: "Series B Term Sheet & Capital Restructuring",
    resolutionText: "Authorize Series B issuance of 5,000,000 Preferred Shares with a 2x liquidation preference and expanded investor board seat.",
    initialVoters: [
      { id: "founder1", name: "Alice (CEO & Co-Founder)", role: "Director", weight: 25, vote: "no" },
      { id: "founder2", name: "Bob (CTO & Co-Founder)", role: "Director", weight: 25, vote: "no" },
      { id: "vc1", name: "Horizon Ventures (Lead Series A)", role: "Investor Director", weight: 35, vote: "yes" },
      { id: "vc2", name: "Nexus Capital", role: "Investor Director", weight: 15, vote: "yes" },
      { id: "indep", name: "Judge Miller (Independent Arbitrator)", role: "Independent Director", weight: 0, vote: "abstain" }
    ]
  },
  {
    id: "takeover",
    title: "Hostile Board Takeover Defense",
    subtitle: "Staggered Board & 75% Supermajority Shield",
    icon: <Flame className="w-5 h-5 text-rose-500" />,
    legalContext: "An activist hedge fund attempts a hostile proxy raid to remove management. LegitBlock's constitutional covenant enforces a 75% supermajority threshold and staggered board voting to protect incumbent equity holders.",
    statute: "Delaware DGCL § 141(k) / Poison Pill Governance",
    quorumRequired: 75.0,
    thresholdRequired: 75.0,
    proposalTitle: "Hostile Proxy: Total Board Removal & Liquidation",
    resolutionText: "Remove all Class I and Class II Directors without cause and immediately initiate orderly corporate dissolution and asset distribution.",
    initialVoters: [
      { id: "activist", name: "Vulture Arbitrage Fund", role: "Activist Shareholder", weight: 45, vote: "yes" },
      { id: "insider1", name: "Founder & Executive Trust", role: "Class I Director", weight: 30, vote: "no" },
      { id: "insider2", name: "Employee Stock Pool", role: "Class II Director", weight: 15, vote: "no" },
      { id: "retail", name: "Retail Public Shareholders", role: "Common Shareholders", weight: 10, vote: "no" }
    ]
  },
  {
    id: "attrition",
    title: "Quorum Failure under Attrition",
    subtitle: "Absenteeism & Meeting Invalidation Guard",
    icon: <Users className="w-5 h-5 text-blue-500" />,
    legalContext: "When directors boycott or fail to attend a meeting, fraudulent resolutions often pass quietly. LegitBlock ledger validation mathematically blocks any block from being minted unless the minimum participation quorum is verified.",
    statute: "Delaware DGCL § 216 (Quorum of Stockholders)",
    quorumRequired: 60.0,
    thresholdRequired: 50.01,
    proposalTitle: "Q4 Executive Bonus & Compensation Package",
    resolutionText: "Approve $1.5M discretionary cash bonus pool allocated to senior executives during economic restructuring.",
    initialVoters: [
      { id: "exec1", name: "CEO Harrison", role: "Executive Director", weight: 20, vote: "yes" },
      { id: "exec2", name: "COO Martinez", role: "Executive Director", weight: 20, vote: "yes" },
      { id: "absent1", name: "Dr. Chen (Audit Chair)", role: "Outside Director", weight: 20, vote: "abstain" },
      { id: "absent2", name: "Sarah Jenkins (Compensation)", role: "Outside Director", weight: 20, vote: "abstain" },
      { id: "absent3", name: "Mutual Fund Proxy", role: "Institutional Shareholder", weight: 20, vote: "abstain" }
    ]
  },
  {
    id: "emergency",
    title: "Emergency Force Majeure Action",
    subtitle: "Rapid Disaster Response with Mandatory Post-Audit",
    icon: <ShieldAlert className="w-5 h-5 text-emerald-500" />,
    legalContext: "During unforeseen emergencies (cyber breach, infrastructure failure), DGCL § 110 empowers modified emergency bylaws. LegitBlock logs the emergency block immediately while tagging an unsealed audit obligation for full board review.",
    statute: "Delaware DGCL § 110 (Emergency Bylaws)",
    quorumRequired: 33.33,
    thresholdRequired: 50.01,
    proposalTitle: "Emergency Disaster Recovery Treasury Allocation",
    resolutionText: "Disburse $250,000 emergency contingency funds to mitigate catastrophic cloud datacenter failure and restore critical consumer operations.",
    initialVoters: [
      { id: "incident_commander", name: "Chief Security Officer", role: "Incident Commander", weight: 35, vote: "yes" },
      { id: "vp_infra", name: "VP Infrastructure", role: "Technical Lead", weight: 25, vote: "yes" },
      { id: "cfo", name: "CFO (Off-grid)", role: "Finance Officer", weight: 20, vote: "abstain" },
      { id: "board_chair", name: "Board Chair (Off-grid)", role: "Independent Chair", weight: 20, vote: "abstain" }
    ]
  }
];

export function ScenarioSimulator() {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("deadlock");
  const activeScenario = SCENARIOS.find(s => s.id === selectedScenarioId) || SCENARIOS[0];

  const [voters, setVoters] = useState<ScenarioVoter[]>(activeScenario.initialVoters);
  const [minedBlocks, setMinedBlocks] = useState<Array<{
    index: number;
    hash: string;
    scenario: string;
    passed: boolean;
    timestamp: string;
  }>>([]);
  const [isMining, setIsMining] = useState<boolean>(false);

  // Switch scenario
  const handleSelectScenario = (sc: ScenarioConfig) => {
    setSelectedScenarioId(sc.id);
    setVoters(sc.initialVoters);
  };

  // Toggle vote for a member
  const handleToggleVote = (voterId: string) => {
    setVoters(prev => prev.map(v => {
      if (v.id !== voterId) return v;
      const nextVote = v.vote === "yes" ? "no" : v.vote === "no" ? "abstain" : "yes";
      return { ...v, vote: nextVote };
    }));
  };

  // Reset current scenario
  const handleReset = () => {
    setVoters(activeScenario.initialVoters);
  };

  // Calculate tallies
  const totalEligibleWeight = voters.reduce((acc, v) => acc + v.weight, 0);
  const yesWeight = voters.filter(v => v.vote === "yes").reduce((acc, v) => acc + v.weight, 0);
  const noWeight = voters.filter(v => v.vote === "no").reduce((acc, v) => acc + v.weight, 0);
  const castWeight = yesWeight + noWeight;

  const quorumPercentage = totalEligibleWeight > 0 ? (castWeight / totalEligibleWeight) * 100 : 0;
  const quorumMet = quorumPercentage >= activeScenario.quorumRequired;

  const approvalPercentage = castWeight > 0 ? (yesWeight / castWeight) * 100 : 0;
  const thresholdMet = approvalPercentage >= activeScenario.thresholdRequired;

  const resolutionPassed = quorumMet && thresholdMet;

  // Simulate mining a block
  const handleMineBlock = async () => {
    setIsMining(true);
    try {
      const msg = `${activeScenario.id}-${Date.now()}-${yesWeight}-${noWeight}`;
      const msgBuffer = new TextEncoder().encode(msg);
      const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

      setMinedBlocks(prev => [
        {
          index: prev.length + 1,
          hash: hashHex,
          scenario: activeScenario.title,
          passed: resolutionPassed,
          timestamp: new Date().toLocaleTimeString()
        },
        ...prev
      ]);
    } finally {
      setIsMining(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-6">
      {/* Header bar */}
      <div className="bg-slate-900 text-white p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 mb-3">
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
              <span>Corporate Crisis Engine</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Corporate Governance Stress-Test Simulator
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Simulate high-stakes corporate disputes, hostile shareholder proxy battles, and founder deadlocks. Observe how LegitBlock’s cryptographic rules enforce statutory order under duress.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Scenario</span>
          </button>
        </div>

        {/* Scenario Selector Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-6 pt-6 border-t border-slate-800">
          {SCENARIOS.map(sc => {
            const isSelected = sc.id === selectedScenarioId;
            return (
              <button
                key={sc.id}
                onClick={() => handleSelectScenario(sc)}
                className={`flex items-center gap-2.5 p-3 rounded-xl text-left transition border ${
                  isSelected
                    ? "bg-slate-800 border-emerald-500 text-white shadow-sm"
                    : "bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <div className={`p-1.5 rounded-lg ${isSelected ? "bg-slate-700" : "bg-slate-900"}`}>
                  {sc.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">{sc.title}</div>
                  <div className="text-[10px] text-slate-400 truncate">{sc.subtitle}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Scenario Details */}
      <div className="px-6 sm:px-8 space-y-6">
        <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Legal Context &amp; Chancery Precedent:</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">{activeScenario.statute}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
              {activeScenario.legalContext}
            </p>
          </div>
          <div className="flex gap-4 shrink-0 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-6">
            <div>
              <div className="text-[10px] text-slate-500 font-medium">Quorum Req.</div>
              <div className="text-base font-bold text-slate-900">{activeScenario.quorumRequired}%</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-medium">Passing Req.</div>
              <div className="text-base font-bold text-slate-900">{activeScenario.thresholdRequired}%</div>
            </div>
          </div>
        </div>

        {/* Proposal Title Banner */}
        <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-300">
              Contested Resolution
            </span>
            <h3 className="font-bold text-slate-900 text-sm">{activeScenario.proposalTitle}</h3>
          </div>
          <p className="text-xs text-slate-600 font-mono bg-slate-50 p-3 rounded border border-slate-100">
            &ldquo;{activeScenario.resolutionText}&rdquo;
          </p>
        </div>

        {/* Voting & Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stakeholder Ballots List */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Stakeholder Ballots (Click to Cycle Vote)
              </h4>
              <span className="text-xs text-slate-400">Total Weight: {totalEligibleWeight}%</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {voters.map(v => {
                const isYes = v.vote === "yes";
                const isNo = v.vote === "no";
                return (
                  <div
                    key={v.id}
                    onClick={() => handleToggleVote(v.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                      isYes
                        ? "bg-emerald-50/70 border-emerald-300 hover:border-emerald-400"
                        : isNo
                        ? "bg-rose-50/70 border-rose-300 hover:border-rose-400"
                        : "bg-slate-50 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{v.name}</div>
                      <div className="text-[11px] text-slate-500">{v.role} &bull; <strong className="text-slate-700">{v.weight}% Weight</strong></div>
                    </div>
                    <div>
                      <span className={`px-2.5 py-1 rounded text-xs font-extrabold tracking-wide uppercase ${
                        isYes
                          ? "bg-emerald-600 text-white"
                          : isNo
                          ? "bg-rose-600 text-white"
                          : "bg-slate-300 text-slate-700"
                      }`}>
                        {v.vote}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real-time Quorum & Ledger Status */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Live Governance Metrics
            </h4>

            {/* Quorum Progress */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 font-medium">Quorum Participation</span>
                <span className={`font-bold ${quorumMet ? "text-emerald-600" : "text-amber-600"}`}>
                  {quorumPercentage.toFixed(1)}% / {activeScenario.quorumRequired}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${quorumMet ? "bg-emerald-500" : "bg-amber-500"}`}
                  style={{ width: `${Math.min(100, quorumPercentage)}%` }}
                />
              </div>
            </div>

            {/* Approval Progress */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 font-medium">Approval Majority (Yes / Cast)</span>
                <span className={`font-bold ${thresholdMet ? "text-emerald-600" : "text-rose-600"}`}>
                  {approvalPercentage.toFixed(1)}% / {activeScenario.thresholdRequired}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${thresholdMet ? "bg-emerald-500" : "bg-rose-500"}`}
                  style={{ width: `${Math.min(100, approvalPercentage)}%` }}
                />
              </div>
            </div>

            {/* Resolution Verdict Banner */}
            <div className={`p-3.5 rounded-xl border text-xs font-medium space-y-1 ${
              resolutionPassed
                ? "bg-emerald-100/70 border-emerald-300 text-emerald-900"
                : "bg-rose-100/70 border-rose-300 text-rose-900"
            }`}>
              <div className="flex items-center gap-1.5 font-bold">
                {resolutionPassed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Resolution Ratified by Blockchain</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>Resolution Blocked / Deadlocked</span>
                  </>
                )}
              </div>
              <p className="text-[11px] leading-relaxed">
                {resolutionPassed
                  ? "Both statutory quorum and required supermajority are satisfied. This amendment can be legally sealed to the ledger."
                  : !quorumMet
                  ? "Statutory quorum not met. Delaware law prohibits non-quorum votes from binding corporate assets."
                  : "Approval threshold not satisfied. Opposing votes or deadlock prevent ratification."}
              </p>
            </div>

            {/* Mine Block Button */}
            <button
              onClick={handleMineBlock}
              disabled={isMining || !resolutionPassed}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm ${
                resolutionPassed && !isMining
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
              }`}
            >
              <Hammer className="w-4 h-4" />
              <span>{isMining ? "Hashing Block..." : resolutionPassed ? "Mine Ratification Block" : "Ratification Blocked"}</span>
            </button>
          </div>
        </div>

        {/* Historical Simulation Ledger Logs */}
        {minedBlocks.length > 0 && (
          <div className="border-t border-slate-200 pt-6 space-y-3 pb-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Simulated Audit Ledger History ({minedBlocks.length})
            </h4>
            <div className="space-y-2">
              {minedBlocks.map(b => (
                <div key={b.index} className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-slate-800">Block #{b.index}</span>
                    <span className="text-slate-500 font-mono text-[11px] truncate max-w-xs">{b.hash}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[11px]">{b.timestamp}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      RATIFIED
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
