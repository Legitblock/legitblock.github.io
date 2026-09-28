"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Sun, 
  Moon, 
  BookOpen, 
  Terminal, 
  Palette, 
  Check, 
  ChevronDown 
} from "lucide-react";

export type ThemeMode = "light" | "dark" | "sepia" | "cyber";

export interface ThemeOption {
  id: ThemeMode;
  name: string;
  tagline: string;
  icon: React.ReactNode;
  previewBg: string;
  previewBorder: string;
  previewAccent: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "light",
    name: "Statutory Light",
    tagline: "Crisp slate & Delaware emerald",
    icon: <Sun className="w-4 h-4 text-amber-500" />,
    previewBg: "#ffffff",
    previewBorder: "#e2e8f0",
    previewAccent: "#10b981"
  },
  {
    id: "dark",
    name: "Obsidian Dark",
    tagline: "Cryptographic deep ledger night",
    icon: <Moon className="w-4 h-4 text-indigo-400" />,
    previewBg: "#0f172a",
    previewBorder: "#334155",
    previewAccent: "#10b981"
  },
  {
    id: "sepia",
    name: "Chancery Parchment",
    tagline: "Delaware archival warm legal record",
    icon: <BookOpen className="w-4 h-4 text-amber-700" />,
    previewBg: "#faf6ee",
    previewBorder: "#e7ded0",
    previewAccent: "#b45309"
  },
  {
    id: "cyber",
    name: "Cyber Terminal",
    tagline: "Neon phosphor & hacker terminal",
    icon: <Terminal className="w-4 h-4 text-emerald-400" />,
    previewBg: "#030712",
    previewBorder: "rgba(34, 197, 94, 0.4)",
    previewAccent: "#22c55e"
  }
];

export function ThemeChooser({ compact = false }: { compact?: boolean }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>("light");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize theme from localStorage or document attribute
  useEffect(() => {
    const saved = localStorage.getItem("legitblock_theme") as ThemeMode | null;
    if (saved && ["light", "dark", "sepia", "cyber"].includes(saved)) {
      applyTheme(saved);
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      applyTheme("dark");
    } else {
      applyTheme("light");
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const applyTheme = (theme: ThemeMode) => {
    setCurrentTheme(theme);
    localStorage.setItem("legitblock_theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "dark" || theme === "cyber") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const activeOption = THEME_OPTIONS.find(t => t.id === currentTheme) || THEME_OPTIONS[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 rounded-lg border transition-all text-xs font-semibold ${
          compact
            ? "p-2 bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700"
            : "px-3 py-1.5 bg-white/90 hover:bg-slate-100 border-slate-200 text-slate-700 shadow-sm"
        }`}
        title={`Theme: ${activeOption.name} (Click to change)`}
        aria-label="Choose theme"
      >
        <span className="shrink-0">{activeOption.icon}</span>
        {!compact && (
          <>
            <span className="hidden sm:inline font-medium">{activeOption.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-emerald-600" />
              <span>Theme Chooser</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">4 Modes</span>
          </div>

          <div className="p-1.5 space-y-1">
            {THEME_OPTIONS.map((option) => {
              const isSelected = option.id === currentTheme;
              return (
                <button
                  key={option.id}
                  onClick={() => {
                    applyTheme(option.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                    isSelected
                      ? "bg-emerald-50 text-emerald-950 font-semibold border border-emerald-200"
                      : "hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Visual Color Swatch */}
                    <div 
                      className="w-5 h-5 rounded-md shrink-0 flex items-center justify-center border shadow-xs"
                      style={{ 
                        backgroundColor: option.previewBg,
                        borderColor: option.previewBorder
                      }}
                    >
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: option.previewAccent }}
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
                        <span>{option.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate leading-tight">
                        {option.tagline}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
