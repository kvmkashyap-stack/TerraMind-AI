"use client";

import React from "react";
import Link from "next/link";
import { Satellite } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FBFBF8]/95 backdrop-blur-md border-b border-[#D5E2D6]/70 py-3.5 px-4 sm:px-8 transition-all shadow-2xs">
      <div className="relative max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <Link href="/" className="flex items-center gap-3 group focus:outline-none min-w-0">
          <div className="h-10 w-10 rounded-xl overflow-hidden shadow-sm border border-[#D5E2D6] shrink-0 bg-white flex items-center justify-center p-0.5 group-hover:shadow-md transition-shadow">
            <img src="/logo.jpg" alt="Conservation Intelligence Logo" className="h-full w-full object-contain rounded-lg" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-xl tracking-tight text-[#14281D] font-sans truncate">
                TerraMind AI
              </span>
            </div>
            <p className="text-[11px] text-stone-500 hidden sm:block tracking-wide font-medium">
              Measure • Act • Verify — Environmental Intelligence Platform
            </p>
          </div>
        </Link>

        {/* Centered Navigation Links: Home, Features, How It Works */}
        <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-semibold bg-white/80 border border-[#D5E2D6] px-3.5 py-1 rounded-full shadow-2xs backdrop-blur-sm">
          <a
            href="#hero"
            className="px-3.5 py-1.5 rounded-full text-stone-700 hover:text-[#14281D] hover:bg-[#E8F3E9] transition-all"
          >
            Home
          </a>
          <a
            href="#features"
            className="px-3.5 py-1.5 rounded-full text-stone-700 hover:text-[#14281D] hover:bg-[#E8F3E9] transition-all"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="px-3.5 py-1.5 rounded-full text-stone-700 hover:text-[#14281D] hover:bg-[#E8F3E9] transition-all"
          >
            How It Works
          </a>
        </nav>
      </div>
    </header>
  );
}
