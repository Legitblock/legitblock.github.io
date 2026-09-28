"use client";

import React, { useState, useEffect } from "react";
import { Globe, X, Maximize2, ExternalLink, Sparkles } from "lucide-react";

interface PresentationModalProps {
  buttonClassName?: string;
  presentationUrl?: string;
}

export function PresentationModal({
  buttonClassName,
  presentationUrl = "https://tekromancy.github.io/impressJS"
}: PresentationModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        className={
          buttonClassName ||
          "px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all flex items-center gap-2 border border-slate-700 shadow-md"
        }
      >
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        Preview In-Page 3D Constellation
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-6xl h-[88vh] bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-950/90 border-b border-slate-800 text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-mono font-bold tracking-wider text-cyan-400">
                  LEGITBLOCK // 3D ARCHITECTURAL TOUR
                </span>
                <span className="hidden sm:inline text-xs text-slate-400">
                  (impress.js + @tekromancy/tekromancy)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={presentationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Open Fullscreen in New Tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Close Preview (Escape)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Embedded Presentation Frame */}
            <div className="flex-1 w-full h-full bg-black relative">
              <iframe
                src={presentationUrl}
                title="LegitBlock 3D Interactive Presentation"
                className="w-full h-full border-0"
                allow="autoplay; fullscreen"
                loading="eager"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
