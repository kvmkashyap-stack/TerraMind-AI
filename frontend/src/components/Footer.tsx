"use client";

import React from "react";
import Link from "next/link";
import { Satellite } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white border-t border-indigo-900/50 py-8 px-4 sm:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl overflow-hidden border border-slate-700 shrink-0 bg-white flex items-center justify-center p-0.5">
            <img src="/logo.jpg" alt="Conservation Intelligence Logo" className="h-full w-full object-contain rounded-lg" />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-tight text-white">
              TerraMind AI
            </span>
            <p className="text-[11px] text-slate-400 font-mono">
              Measure • Act • Verify
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-6 text-slate-300 font-medium">
          <Link href="/map" className="hover:text-sky-400 transition-colors">Impact Map</Link>
          <Link href="/projects" className="hover:text-sky-400 transition-colors">Projects</Link>
          <Link href="/compare" className="hover:text-sky-400 transition-colors">Compare</Link>
          <Link href="/copilot" className="hover:text-sky-400 transition-colors">Copilot RAG</Link>
          <Link href="/reports" className="hover:text-sky-400 transition-colors">Data Repo</Link>
        </nav>

        <div className="text-sky-400 font-mono text-[11px]">
          © 2026 TerraMind AI
        </div>
      </div>
    </footer>
  );
}
