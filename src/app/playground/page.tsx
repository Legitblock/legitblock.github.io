"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sidebar } from "../../components/Sidebar";
import { InteractiveChainSimulator } from "../../components/InteractiveChainSimulator";
import { ScenarioSimulator } from "../../components/ScenarioSimulator";
import { VisualRedlineEditor } from "../../components/VisualRedlineEditor";
import { MerkleClauseInspector } from "../../components/MerkleClauseInspector";
import { CovenantStudio } from "../../components/CovenantStudio";
import { ConsortiumSimulator } from "../../components/ConsortiumSimulator";
import { 
  PlayCircle, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  Hammer, 
  Lock,
  Layers,
  Scale,
  FileDiff,
  GitBranch,
  Sliders,
  Network
} from "lucide-react";

export default function PlaygroundPage() {
  const [activeTab, setActiveTab] = useState<"chain" | "scenarios" | "redline" | "merkle" | "covenants" | "consortium">("chain");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex gap-10">
        <Sidebar />

        <article className="flex-1 max-w-5xl min-w-0 space-y-8">
          {/* Header */}
          <div className="border-b border-slate-200 pb-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-300">
              <PlayCircle className="w-4 h-4 text-emerald-600" />
              <span>Browser-Based Simulator Suite</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Interactive Blockchain &amp; Governance Sandbox
            </h1>
            <p className="text-base text-slate-600 leading-relaxed">
              Explore how LegitBlock maintains organizational integrity under statutory Delaware General Corporation Law (DGCL § 224). Test proof-of-work mining, simulate hostile board takeovers and founder deadlocks, or draft constitutional amendments in the visual redline studio.
            </p>

            {/* Sandbox Tabs */}
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => setActiveTab("chain")}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition border ${
                  activeTab === "chain"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>1. Core Chain Sandbox</span>
              </button>

              <button
                onClick={() => setActiveTab("scenarios")}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition border ${
                  activeTab === "scenarios"
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Scale className="w-4 h-4" />
                <span>2. Crisis Stress Simulator</span>
              </button>

              <button
                onClick={() => setActiveTab("redline")}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition border ${
                  activeTab === "redline"
                    ? "bg-cyan-600 text-white border-cyan-600 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <FileDiff className="w-4 h-4" />
                <span>3. Visual Redline Studio</span>
              </button>

              <button
                onClick={() => setActiveTab("merkle")}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition border ${
                  activeTab === "merkle"
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <GitBranch className="w-4 h-4" />
                <span>4. Merkle Clause Inspector</span>
              </button>

              <button
                onClick={() => setActiveTab("covenants")}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition border ${
                  activeTab === "covenants"
                    ? "bg-violet-600 text-white border-violet-600 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>5. Covenant Studio</span>
              </button>

              <button
                onClick={() => setActiveTab("consortium")}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition border ${
                  activeTab === "consortium"
                    ? "bg-slate-800 text-white border-slate-800 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Network className="w-4 h-4" />
                <span>6. P2P Consortium Simulator</span>
              </button>
            </div>
          </div>

          {/* Active Tab View */}
          {activeTab === "chain" && (
            <div className="space-y-8">
              <InteractiveChainSimulator />

              {/* Explanation of Exercises */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                    <Hammer className="w-4 h-4 text-emerald-600" />
                    Exercise 1: Reach Quorum
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Click &quot;Yes&quot; on 2 board member ballots above to satisfy the 2/3 Supermajority requirement. Notice how the &quot;Mine Block&quot; button unlocks only when quorum is achieved.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                    <Lock className="w-4 h-4 text-emerald-600" />
                    Exercise 2: Mine Block
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Click &quot;Mine Block&quot;. Watch the client-side mining loop calculate SHA-256 hashes until a valid nonce is discovered, permanently appending the ratified amendment to the chain.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Exercise 3: Test Tampering
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Click &quot;Simulate Tampering with #1&quot;. Watch the entire chain turn RED as the cryptographic hash link breaks, mathematically proving that past corporate records cannot be altered.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "scenarios" && (
            <div>
              <ScenarioSimulator />
            </div>
          )}

          {activeTab === "redline" && (
            <div>
              <VisualRedlineEditor />
            </div>
          )}

          {activeTab === "merkle" && (
            <div>
              <MerkleClauseInspector />
            </div>
          )}

          {activeTab === "covenants" && (
            <div>
              <CovenantStudio />
            </div>
          )}

          {activeTab === "consortium" && (
            <div>
              <ConsortiumSimulator />
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
