import React from "react";
import { Sidebar } from "../../components/Sidebar";
import { UniversalPacketVerifier } from "../../components/UniversalPacketVerifier";
import { 
  ShieldCheck, 
  FileCheck2, 
  Layers, 
  Lock, 
  Cpu, 
  Scale, 
  FileCode, 
  ExternalLink 
} from "lucide-react";

export const metadata = {
  title: "Universal Legal Packet Verifier | LegitBlock",
  description: "Verify cryptographic integrity, Merkle inclusion proofs, and digital signatures of any LegitBlock legal packet."
};

export default function VerifyPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex gap-10">
        <Sidebar />

        <article className="flex-1 max-w-5xl min-w-0 space-y-10">
          {/* Universal Verifier Interactive Tool */}
          <UniversalPacketVerifier />

          {/* Statutory and Cryptographic Standards Reference */}
          <section className="space-y-6 pt-4 border-t border-slate-200">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Statutory &amp; Cryptographic Standards
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                LegitBlock packets adhere to strict statutory evidence rules and open cryptographic standards.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <Scale className="w-4 h-4 text-emerald-600" />
                  Delaware DGCL § 224
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Authorizes corporations to maintain books and records exclusively on one or more distributed electronic networks or databases, provided the records can be converted into clearly legible paper form within a reasonable time.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  RFC 6962 Merkle Trees
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Cryptographic clause isolation utilizing 0x00 domain-separated leaf prefixes and 0x01 branch prefixes prevents length-extension and second-preimage collision attacks during contract audit path evaluation.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <Cpu className="w-4 h-4 text-cyan-600" />
                  PDF/A-3 (ISO 19005-3)
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Statutory human-readable PDF rendered with embedded machine-readable <code className="text-[11px] bg-slate-100 px-1 py-0.5 rounded">legitblock.xml</code> and cryptographic JSON manifests, ensuring long-term archival validity for courtroom discovery.
                </p>
              </div>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
