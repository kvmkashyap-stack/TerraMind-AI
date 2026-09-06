"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { fetchMapProjects, ProjectMapHover } from "../../services/api";
import { Search, Compass, ShieldAlert, IndianRupee, Layers, X } from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectMapHover[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    fetchMapProjects().then(setProjects).catch(console.error);
  }, []);

  const filteredProjects = projects.filter((p) => {
    const matchesFilter =
      filter === "All"
        ? true
        : filter === "Green"
        ? p.health_status === "Green"
        : filter === "Yellow"
        ? p.health_status === "Yellow"
        : p.health_status === "Red";
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location_name.toLowerCase().includes(search.toLowerCase()) ||
      p.project_id.toLowerCase().includes(search.toLowerCase()) ||
      p.intervention_type.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBF8] text-[#14281D] selection:bg-[#B7E4C7]">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 space-y-6">
        {/* Page Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#E8F3E9] text-[#14281D] border border-[#C2DEC6]">
            CONSERVATION PORTFOLIO
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#14281D]">
            Explore Conservation Projects
          </h1>
          <p className="text-stone-600 text-sm max-w-2xl">
            Monitor lake rejuvenation, watershed restoration, and groundwater recharge interventions across India with multi-spectral satellite observations.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#D5E2D6] shadow-sm">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by location, forest, lake, ID..."
              className="w-full pl-10 pr-8 py-2 bg-[#F6F8F3] border border-[#C2DEC6] rounded-xl text-xs text-[#14281D] focus:outline-none focus:border-[#14281D] focus:bg-white transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700 p-0.5 rounded-full"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {["All", "Green", "Yellow", "Red"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                  filter === cat
                    ? "bg-[#14281D] text-emerald-300 shadow-sm"
                    : "bg-[#F6F8F3] text-stone-700 hover:bg-[#E8F3E9] border border-[#C2DEC6]"
                }`}
              >
                {cat === "All"
                  ? "All Projects"
                  : cat === "Green"
                  ? "🟢 Successful"
                  : cat === "Yellow"
                  ? "🟡 Attention Required"
                  : "🔴 Underperforming"}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p) => (
            <div
              key={p.project_id}
              className="bg-white border border-[#D5E2D6] rounded-2xl p-5 space-y-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-800 bg-[#E8F3E9] px-2.5 py-0.5 rounded border border-[#C2DEC6]">
                    {p.project_id}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                      p.health_status === "Green"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : p.health_status === "Yellow"
                        ? "bg-amber-100 text-amber-900 border border-amber-300"
                        : "bg-rose-100 text-rose-800 border border-rose-300"
                    }`}
                  >
                    {p.health_status} Status
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-[#14281D]">{p.title}</h3>
                <p className="text-xs text-stone-500">{p.location_name}</p>

                {/* Land Cover Summary */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                  <div className="bg-[#F6F8F3] p-2 rounded-lg border border-[#D5E2D6]">
                    <span className="text-stone-500 block">Veg Cover:</span>
                    <span className="font-bold text-emerald-800">{p.land_cover.vegetation_coverage_pct}%</span>
                  </div>
                  <div className="bg-[#F6F8F3] p-2 rounded-lg border border-[#D5E2D6]">
                    <span className="text-stone-500 block">Water Extent:</span>
                    <span className="font-bold text-cyan-800">{p.land_cover.water_coverage_pct}%</span>
                  </div>
                </div>

                {/* Timber Smuggling Badge if Active */}
                {p.smuggling_alert_active && (
                  <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-xl text-xs text-rose-800 font-bold flex items-center space-x-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600 animate-bounce shrink-0" />
                    <span>Timber Deforestation Alert (60% → 42%)</span>
                  </div>
                )}
              </div>

              {/* Probable Cost & Action */}
              <div className="pt-3 border-t border-stone-200 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">Estimated Cost:</span>
                  <span className="font-extrabold text-[#14281D]">
                    ₹{p.estimated_cost.estimated_cost_inr.toLocaleString("en-IN")}
                  </span>
                </div>

                <Link
                  href="/map"
                  className="w-full py-2 bg-[#14281D] hover:bg-[#1E3A2B] text-white text-xs font-bold rounded-xl text-center block transition-colors shadow-xs"
                >
                  View Interactive Map
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
