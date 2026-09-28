"use client";

import React, { useState } from "react";
import { 
  Building2, 
  HeartHandshake, 
  Users2, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Terminal, 
  Copy, 
  Check,
  RotateCcw
} from "lucide-react";
import { TEMPLATES_DATA, TemplateItem } from "../content/templateData";

export function TemplateWizard() {
  const [step, setStep] = useState<number>(1);
  const [sector, setSector] = useState<"for-profit" | "non-profit" | "cooperative" | null>(null);
  const [governance, setGovernance] = useState<"board" | "democratic" | "consensus" | null>(null);
  const [quorum, setQuorum] = useState<"majority" | "supermajority" | "unanimous" | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Compute recommendation
  const recommendedTemplate: TemplateItem = React.useMemo(() => {
    if (sector === "for-profit") {
      if (quorum === "supermajority") {
        return TEMPLATES_DATA.find(t => t.id === "for-profit-c-corp") || TEMPLATES_DATA[0];
      } else if (governance === "consensus") {
        return TEMPLATES_DATA.find(t => t.id === "for-profit-close-corp") || TEMPLATES_DATA[0];
      }
      return TEMPLATES_DATA.find(t => t.id === "for-profit-llc-member") || TEMPLATES_DATA[0];
    } else if (sector === "non-profit") {
      if (governance === "consensus" || quorum === "unanimous") {
        return TEMPLATES_DATA.find(t => t.id === "nonprofit-private-foundation") || TEMPLATES_DATA[12];
      }
      return TEMPLATES_DATA.find(t => t.id === "nonprofit-501c3-charity") || TEMPLATES_DATA[12];
    } else if (sector === "cooperative") {
      if (governance === "consensus") {
        return TEMPLATES_DATA.find(t => t.id === "coop-consensus-collective") || TEMPLATES_DATA[24];
      }
      return TEMPLATES_DATA.find(t => t.id === "coop-worker") || TEMPLATES_DATA[24];
    }
    return TEMPLATES_DATA[0];
  }, [sector, governance, quorum]);

  const cliCommand = `npx @legitblock/cli init --template ${recommendedTemplate.id} --name "My Organization"`;

  const copyCli = () => {
    navigator.clipboard.writeText(cliCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetWizard = () => {
    setStep(1);
    setSector(null);
    setGovernance(null);
    setQuorum(null);
  };

  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-50/40 via-white to-slate-50 p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Interactive Governance Wizard</span>
          </div>
          <h3 className="text-lg font-extrabold text-slate-900">
            Find the Optimal Charter for Your Organization
          </h3>
        </div>

        {step > 1 && (
          <button
            onClick={resetWizard}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Start Over
          </button>
        )}
      </div>

      {/* Progress Indicators */}
      <div className="grid grid-cols-3 gap-2">
        <div className={`h-1.5 rounded-full transition-all ${step >= 1 ? "bg-emerald-500" : "bg-slate-200"}`} />
        <div className={`h-1.5 rounded-full transition-all ${step >= 2 ? "bg-emerald-500" : "bg-slate-200"}`} />
        <div className={`h-1.5 rounded-full transition-all ${step >= 3 ? "bg-emerald-500" : "bg-slate-200"}`} />
      </div>

      {/* Step 1: Sector */}
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <h4 className="text-sm font-bold text-slate-800">
            Step 1: What legal entity category are you forming?
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => { setSector("for-profit"); setStep(2); }}
              type="button"
              className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 bg-white hover:bg-emerald-50/30 text-left transition-all group space-y-2 shadow-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="font-bold text-sm text-slate-900 group-hover:text-emerald-700">For-Profit Business</div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Delaware C-Corp, Member/Manager LLC, Series LLC, B-Corp, Close Corp.
              </p>
            </button>

            <button
              onClick={() => { setSector("non-profit"); setStep(2); }}
              type="button"
              className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 bg-white hover:bg-blue-50/30 text-left transition-all group space-y-2 shadow-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div className="font-bold text-sm text-slate-900 group-hover:text-blue-700">Non-Profit / Charity</div>
              <p className="text-xs text-slate-500 leading-relaxed">
                501(c)(3) Public Charity, 501(c)(4) Social Welfare, Foundation, Trade Ass’n.
              </p>
            </button>

            <button
              onClick={() => { setSector("cooperative"); setStep(2); }}
              type="button"
              className="p-4 rounded-xl border border-slate-200 hover:border-amber-500 bg-white hover:bg-amber-50/30 text-left transition-all group space-y-2 shadow-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Users2 className="w-4 h-4" />
              </div>
              <div className="font-bold text-sm text-slate-900 group-hover:text-amber-700">Cooperative or DAO</div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Worker Co-op, Housing Co-op, Consumer Co-op, Platform DAO Co-op.
              </p>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Governance Stance */}
      {step === 2 && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <h4 className="text-sm font-bold text-slate-800">
            Step 2: What is your primary decision-making model?
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => { setGovernance("board"); setStep(3); }}
              type="button"
              className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 bg-white hover:bg-emerald-50/30 text-left transition-all group space-y-1.5 shadow-sm"
            >
              <div className="font-bold text-sm text-slate-900 group-hover:text-emerald-700">Centralized Board</div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Directors or equity-weighted shareholders sponsor and vote on resolutions.
              </p>
            </button>

            <button
              onClick={() => { setGovernance("democratic"); setStep(3); }}
              type="button"
              className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 bg-white hover:bg-emerald-50/30 text-left transition-all group space-y-1.5 shadow-sm"
            >
              <div className="font-bold text-sm text-slate-900 group-hover:text-emerald-700">1-Member, 1-Vote</div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Equal democratic balloting across all active accredited members.
              </p>
            </button>

            <button
              onClick={() => { setGovernance("consensus"); setStep(3); }}
              type="button"
              className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 bg-white hover:bg-emerald-50/30 text-left transition-all group space-y-1.5 shadow-sm"
            >
              <div className="font-bold text-sm text-slate-900 group-hover:text-emerald-700">Consensus &amp; Veto</div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Ratification requires zero sustained objections or explicit consent.
              </p>
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Quorum Threshold */}
      {step === 3 && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <h4 className="text-sm font-bold text-slate-800">
            Step 3: What voting threshold should block ratification require?
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => { setQuorum("majority"); setStep(4); }}
              type="button"
              className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 bg-white hover:bg-emerald-50/30 text-left transition-all group space-y-1.5 shadow-sm"
            >
              <div className="font-bold text-sm text-slate-900 group-hover:text-emerald-700">Simple Majority (&gt;50%)</div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Standard quorum threshold for fast operational updates.
              </p>
            </button>

            <button
              onClick={() => { setQuorum("supermajority"); setStep(4); }}
              type="button"
              className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 bg-white hover:bg-emerald-50/30 text-left transition-all group space-y-1.5 shadow-sm"
            >
              <div className="font-bold text-sm text-slate-900 group-hover:text-emerald-700">Supermajority (66.7% / 75%)</div>
              <p className="text-xs text-slate-500 leading-relaxed">
                High-security threshold for charter amendments and mergers.
              </p>
            </button>

            <button
              onClick={() => { setQuorum("unanimous"); setStep(4); }}
              type="button"
              className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 bg-white hover:bg-emerald-50/30 text-left transition-all group space-y-1.5 shadow-sm"
            >
              <div className="font-bold text-sm text-slate-900 group-hover:text-emerald-700">Unanimous (100%)</div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Required for core equity splits or dissolving the entity.
              </p>
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Results */}
      {step === 4 && (
        <div className="p-5 rounded-xl border border-emerald-300 bg-emerald-50/80 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Recommended Charter Template
              </div>
              <h4 className="text-xl font-black text-slate-900 mt-0.5">
                {recommendedTemplate.name}
              </h4>
              <p className="text-xs text-slate-600 mt-1 max-w-xl">
                {recommendedTemplate.description}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-emerald-200/80 text-emerald-900">
                {recommendedTemplate.id}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-emerald-200/60">
            <span className="text-[11px] font-bold text-slate-700 block mb-1.5">
              Quickstart CLI Command:
            </span>
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-950 font-mono text-xs text-emerald-400">
              <span className="truncate">{cliCommand}</span>
              <button
                onClick={copyCli}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors shrink-0"
                title="Copy Command"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
