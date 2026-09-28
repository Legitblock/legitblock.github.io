"use client";

import React, { useState, useEffect } from "react";
import { 
  Network, 
  Server, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Radio, 
  Send, 
  RefreshCw, 
  Activity, 
  Globe, 
  Lock, 
  FileText, 
  Cpu, 
  AlertTriangle,
  ArrowRight
} from "lucide-react";

interface ValidatorNode {
  id: string;
  name: string;
  location: string;
  role: string;
  ip: string;
  blockHeight: number;
  status: "healthy" | "syncing" | "byzantine" | "quarantined";
  lastHash: string;
  latencyMs: number;
  signatures: number;
}

interface BlockPayload {
  height: number;
  title: string;
  category: string;
  merkleRoot: string;
  proposer: string;
  timestamp: string;
  signatures: string[];
  isByzantine?: boolean;
}

const INITIAL_NODES: ValidatorNode[] = [
  {
    id: "node-de-1",
    name: "Node-DE-1",
    location: "Wilmington, DE",
    role: "Delaware Corporate Core Registrar",
    ip: "192.168.1.101:8545",
    blockHeight: 142,
    status: "healthy",
    lastHash: "0000a4f89d3c2e17",
    latencyMs: 12,
    signatures: 142
  },
  {
    id: "node-nyc-2",
    name: "Node-NYC-2",
    location: "New York, NY",
    role: "Wall Street Financial & Treasury Node",
    ip: "192.168.1.102:8546",
    blockHeight: 142,
    status: "healthy",
    lastHash: "0000a4f89d3c2e17",
    latencyMs: 18,
    signatures: 142
  },
  {
    id: "node-sf-3",
    name: "Node-SF-3",
    location: "San Francisco, CA",
    role: "West Coast Technology & Audit Node",
    ip: "192.168.1.103:8547",
    blockHeight: 142,
    status: "healthy",
    lastHash: "0000a4f89d3c2e17",
    latencyMs: 44,
    signatures: 142
  },
  {
    id: "node-ldn-4",
    name: "Node-LDN-4",
    location: "London, UK",
    role: "Cross-Border Jurisdictional Node",
    ip: "192.168.1.104:8548",
    blockHeight: 142,
    status: "healthy",
    lastHash: "0000a4f89d3c2e17",
    latencyMs: 76,
    signatures: 142
  }
];

export function ConsortiumSimulator() {
  const [nodes, setNodes] = useState<ValidatorNode[]>(INITIAL_NODES);
  const [broadcasting, setBroadcasting] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [gossipLog, setGossipLog] = useState<{ time: string; msg: string; type: "info" | "success" | "danger" | "warn" }[]>([
    {
      time: "10:00:00",
      msg: "Consortium P2P mesh initialized across 4 geographic regions. BFT Consensus threshold: 3/4 validators.",
      type: "info"
    },
    {
      time: "10:00:01",
      msg: "All nodes synchronized at Genesis Block Height #142 with valid DGCL § 224 state roots.",
      type: "success"
    }
  ]);

  const [lastCommittedBlock, setLastCommittedBlock] = useState<BlockPayload>({
    height: 142,
    title: "Ratification of Annual Board Meeting Minutes",
    category: "Corporate Minutes",
    merkleRoot: "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
    proposer: "Node-DE-1",
    timestamp: "2026-09-28 10:00:00 UTC",
    signatures: ["Node-DE-1", "Node-NYC-2", "Node-SF-3", "Node-LDN-4"]
  });

  const addLog = (msg: string, type: "info" | "success" | "danger" | "warn" = "info") => {
    const time = new Date().toLocaleTimeString();
    setGossipLog((prev) => [{ time, msg, type }, ...prev.slice(0, 15)]);
  };

  const handleBroadcastValidBlock = async () => {
    if (broadcasting) return;
    setBroadcasting(true);
    setActiveStep(1);

    const nextHeight = nodes[0].blockHeight + 1;
    const newHash = "0000" + Math.random().toString(16).substring(2, 14);

    addLog(`[Node-DE-1] Proposing Block #${nextHeight}: "Ratification of Q3 Statutory Stock Option Grant"...`, "info");

    // Step 1: Proposal from DE
    await new Promise((r) => setTimeout(r, 600));
    setActiveStep(2);
    addLog(`[Node-DE-1] Gossip packet broadcast to peers. Transmitting Merkle root & DGCL signature...`, "info");

    // Step 2: Propagation to NYC & SF
    await new Promise((r) => setTimeout(r, 700));
    setActiveStep(3);
    setNodes((prev) =>
      prev.map((n) =>
        n.id === "node-de-1" || n.id === "node-nyc-2" || n.id === "node-sf-3"
          ? { ...n, status: "syncing" }
          : n
      )
    );
    addLog(`[Node-NYC-2 & Node-SF-3] Received Block #${nextHeight}. Fiduciary signature verified. Counter-signing...`, "info");

    // Step 3: Propagation to LDN & Consensus Reached
    await new Promise((r) => setTimeout(r, 800));
    setActiveStep(4);
    setNodes((prev) =>
      prev.map((n) => ({
        ...n,
        blockHeight: nextHeight,
        status: "healthy",
        lastHash: newHash,
        signatures: n.signatures + 1
      }))
    );

    setLastCommittedBlock({
      height: nextHeight,
      title: "Ratification of Q3 Statutory Stock Option Grant",
      category: "Equity Issuance",
      merkleRoot: "0x" + Math.random().toString(16).substring(2) + Math.random().toString(16).substring(2),
      proposer: "Node-DE-1",
      timestamp: new Date().toUTCString(),
      signatures: ["Node-DE-1", "Node-NYC-2", "Node-SF-3", "Node-LDN-4"]
    });

    addLog(`[Consortium Consensus] Block #${nextHeight} achieved 4/4 unanimous validator quorum. State committed!`, "success");
    setBroadcasting(false);
    setActiveStep(0);
  };

  const handleSimulateByzantineAttack = async () => {
    if (broadcasting) return;
    setBroadcasting(true);
    setActiveStep(1);

    addLog(`[ATTACK INJECTION] Rogue entity injects forged Block #${nodes[0].blockHeight + 1} into Node-NYC-2 (unauthorized $5M treasury withdrawal with falsified signature).`, "danger");

    // Step 1: Mark NYC-2 as byzantine
    setNodes((prev) =>
      prev.map((n) => (n.id === "node-nyc-2" ? { ...n, status: "byzantine" } : n))
    );

    await new Promise((r) => setTimeout(r, 800));
    setActiveStep(2);
    addLog(`[Node-NYC-2] Gossiping fraudulent block to Node-DE-1, Node-SF-3, and Node-LDN-4...`, "warn");

    // Step 2: Peers inspect and reject
    await new Promise((r) => setTimeout(r, 1000));
    setActiveStep(3);
    addLog(`[Node-DE-1] CRITICAL: Statutory Merkle proof evaluation failed! Missing Independent Director counter-signature.`, "danger");
    addLog(`[Node-SF-3 & LDN-4] BFT Byzantine check failed. Block signature digest mismatch. Dropping packet.`, "danger");

    // Step 3: Quarantine rogue node
    await new Promise((r) => setTimeout(r, 900));
    setActiveStep(4);
    setNodes((prev) =>
      prev.map((n) => (n.id === "node-nyc-2" ? { ...n, status: "quarantined" } : n))
    );

    addLog(`[Consortium Defense] Node-NYC-2 flagged as BYZANTINE and placed in quarantine isolation. 3/4 honest consensus maintained.`, "success");
    setBroadcasting(false);
    setActiveStep(0);
  };

  const handleResetMesh = () => {
    setNodes(INITIAL_NODES);
    addLog("Consortium network reset. Node-NYC-2 restored to healthy sync state.", "info");
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white shadow-xl border border-slate-700/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <Network className="w-3.5 h-3.5 text-emerald-400" />
              <span>P2P Multi-Node Consortium • BFT Statutory Consensus</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Decentralized Corporate Validator Mesh</h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              LegitBlock distributes corporate governance records across trusted statutory nodes (Delaware Registrar, Wall Street, West Coast tech, and London counsel). Observe live block gossip and cryptographic fault tolerance against hostile takeovers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleBroadcastValidBlock}
              disabled={broadcasting}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast New Block</span>
            </button>

            <button
              onClick={handleSimulateByzantineAttack}
              disabled={broadcasting}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Simulate Byzantine Attack</span>
            </button>

            <button
              onClick={handleResetMesh}
              disabled={broadcasting}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition-colors"
              title="Reset Network State"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Geographic Validator Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {nodes.map((node) => {
          const isQuarantined = node.status === "quarantined";
          const isByzantine = node.status === "byzantine";
          const isSyncing = node.status === "syncing";
          const isHealthy = node.status === "healthy";

          return (
            <div
              key={node.id}
              className={`p-5 rounded-2xl border transition-all ${
                isByzantine
                  ? "bg-rose-50 border-rose-300 shadow-lg ring-2 ring-rose-500/50"
                  : isQuarantined
                  ? "bg-amber-50 border-amber-300 opacity-80"
                  : isSyncing
                  ? "bg-blue-50 border-blue-300 shadow-md ring-2 ring-blue-500/30"
                  : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Server className={`w-4 h-4 ${
                    isByzantine ? "text-rose-600" : isQuarantined ? "text-amber-600" : "text-emerald-600"
                  }`} />
                  <span className="font-bold text-sm text-slate-900">{node.name}</span>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  isByzantine
                    ? "bg-rose-100 text-rose-800 border border-rose-300"
                    : isQuarantined
                    ? "bg-amber-100 text-amber-800 border border-amber-300"
                    : isSyncing
                    ? "bg-blue-100 text-blue-800 border border-blue-300 animate-pulse"
                    : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                }`}>
                  {node.status}
                </span>
              </div>

              <p className="text-xs font-medium text-slate-600 mb-3">{node.role}</p>

              <div className="space-y-2 text-[11px] text-slate-500 border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between">
                  <span>Location:</span>
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-slate-400" />
                    {node.location}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Endpoint IP:</span>
                  <span className="font-mono text-slate-600">{node.ip}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Block Height:</span>
                  <span className="font-bold text-slate-800 font-mono">#{node.blockHeight}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Network Latency:</span>
                  <span className="font-mono text-emerald-700">{node.latencyMs} ms</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>State Hash:</span>
                  <span className="font-mono text-slate-500 text-[10px] truncate max-w-[90px]">
                    {node.lastHash}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Network Gossip & Block Commitment Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Latest Block Details (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-sm text-slate-900">Consensus Block State</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Height #{lastCommittedBlock.height}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[11px] text-slate-400 block mb-0.5">Resolution Title:</span>
              <span className="font-semibold text-slate-800">{lastCommittedBlock.title}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-slate-400 block mb-0.5">Category:</span>
                <span className="font-medium text-slate-700">{lastCommittedBlock.category}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block mb-0.5">Proposing Peer:</span>
                <span className="font-semibold text-emerald-700">{lastCommittedBlock.proposer}</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block mb-0.5">Merkle State Root (DGCL § 224):</span>
              <p className="font-mono text-[10px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200 break-all">
                {lastCommittedBlock.merkleRoot}
              </p>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block mb-1">Validator Signature Quorum:</span>
              <div className="flex flex-wrap gap-1.5">
                {lastCommittedBlock.signatures.map((sig) => (
                  <span
                    key={sig}
                    className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {sig}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Gossip & Consensus Telemetry (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-sm text-white space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-sm">P2P Gossip &amp; BFT Consensus Telemetry</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[11px] font-mono text-emerald-400">Mesh Live</span>
            </div>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto font-mono text-xs pr-1">
            {gossipLog.map((log, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg border flex items-start gap-2 ${
                  log.type === "success"
                    ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-300"
                    : log.type === "danger"
                    ? "bg-rose-950/40 border-rose-800/60 text-rose-300"
                    : log.type === "warn"
                    ? "bg-amber-950/40 border-amber-800/60 text-amber-300"
                    : "bg-slate-800/60 border-slate-700/60 text-slate-300"
                }`}
              >
                <span className="text-slate-500 text-[10px] shrink-0 mt-0.5">{log.time}</span>
                <span className="flex-1 text-[11px] leading-relaxed">{log.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
