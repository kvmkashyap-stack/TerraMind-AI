"use client";

import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { fetchMapProjects, ProjectMapHover } from "../../services/api";
import { Layers, ArrowRightLeft, ShieldAlert } from "lucide-react";

export default function ComparePage() {
  const [projects, setProjects] = useState<ProjectMapHover[]>([]);

  useEffect(() => {
    fetchMapProjects().then(setProjects).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBF8] text-[#14281D]">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#E8F3E9] text-[#14281D] border border-[#C2DEC6]">
            INTERVENTION COMPARATOR
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#14281D]">
            Intervention Side-by-Side Comparison
          </h1>
          <p className="text-stone-600 text-sm max-w-2xl">
            Benchmark performance across different conservation sites (Lake Rejuvenation vs. Watershed Restoration vs. Groundwater Recharge).
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-white border border-[#D5E2D6] rounded-2xl p-5 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 font-mono">
                <th className="py-3 px-4">Project Title & ID</th>
                <th className="py-3 px-4">Intervention Type</th>
                <th className="py-3 px-4">Health Status</th>
                <th className="py-3 px-4">Veg Cover (Before → Now)</th>
                <th className="py-3 px-4">Water Extent (NDWI)</th>
                <th className="py-3 px-4">Budget Utilization</th>
                <th className="py-3 px-4">Estimated Corrective Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {projects.map((p) => (
                <tr key={p.project_id} className="hover:bg-[#F6F8F3] transition-colors">
                  <td className="py-4 px-4 font-bold text-[#14281D]">
                    {p.title}
                    <div className="text-[10px] text-stone-400 font-mono">{p.project_id}</div>
                  </td>
                  <td className="py-4 px-4 text-emerald-800 font-semibold">{p.intervention_type}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${
                        p.health_status === "Green"
                          ? "bg-emerald-100 text-emerald-800"
                          : p.health_status === "Yellow"
                          ? "bg-amber-100 text-amber-900"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {p.health_status}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono font-bold">
                    {p.baseline_ndvi * 100}% → {p.land_cover.vegetation_coverage_pct}%
                  </td>
                  <td className="py-4 px-4 font-mono text-cyan-800 font-bold">
                    {p.current_ndwi}
                  </td>
                  <td className="py-4 px-4 font-mono">
                    ₹{(p.expended_funds_inr / 100000).toFixed(1)}L / ₹{(p.allocated_funds_inr / 100000).toFixed(1)}L
                  </td>
                  <td className="py-4 px-4 font-extrabold text-[#14281D]">
                    ₹{p.estimated_cost.estimated_cost_inr.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <Footer />
    </div>
  );
}
