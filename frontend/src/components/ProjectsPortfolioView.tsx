"use client";

import React, { useState } from "react";
import { ProjectMapHover } from "../services/api";
import GlobalSiteHeader from "./GlobalSiteHeader";
import { Compass, CheckCircle2, AlertTriangle, AlertCircle, Landmark, ShieldCheck, MapPin, IndianRupee } from "lucide-react";

interface ProjectsPortfolioViewProps {
  projects: ProjectMapHover[];
  selectedProjectId: string;
  onSelectProject: (id: string) => void;
  onAddDynamicProject?: (project: ProjectMapHover) => void;
}

export default function ProjectsPortfolioView({
  projects,
  selectedProjectId,
  onSelectProject,
  onAddDynamicProject,
}: ProjectsPortfolioViewProps) {
  const [filterQuery, setFilterQuery] = useState("");

  const selectedProj =
    projects.find((p) => p.project_id === selectedProjectId) || projects[0];

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      p.location_name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      p.project_id.toLowerCase().includes(filterQuery.toLowerCase()) ||
      p.intervention_type.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Top Global Site Header & Cross-View Sync Search Bar */}
      <GlobalSiteHeader
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={onSelectProject}
        onAddDynamicProject={onAddDynamicProject}
        sectionTitle="Conservation Projects Portfolio"
        sectionIcon={Compass}
      />

      {/* Featured Card for Currently Selected Site */}
      {selectedProj && (
        <div className="bg-white border border-[#D5E2D6] rounded-2xl p-5 sm:p-6 shadow-md space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#D5E2D6] pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 text-[11px] font-mono font-bold rounded-full bg-[#0F172A] text-sky-300 border border-indigo-500/30">
                  ID: {selectedProj.project_id}
                </span>
                <span className="text-xs text-stone-500 font-bold uppercase tracking-wider font-mono">
                  {selectedProj.intervention_type}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#14281D] mt-1.5 leading-snug">
                {selectedProj.title}
              </h2>
              <div className="text-xs text-stone-600 flex items-center space-x-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>{selectedProj.location_name}</span>
              </div>
            </div>

            {/* Health Status Pill */}
            <div className="flex flex-col items-end gap-1.5">
              <span
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black shadow-2xs border ${
                  selectedProj.health_status === "Green"
                    ? "bg-indigo-100 text-indigo-900 border-indigo-300"
                    : selectedProj.health_status === "Yellow"
                    ? "bg-amber-100 text-amber-800 border-amber-300"
                    : "bg-rose-100 text-rose-800 border-rose-300"
                }`}
              >
                STATUS: {selectedProj.health_status.toUpperCase()}
              </span>
              <span className="text-[11px] text-stone-500 font-mono font-bold">
                Sufficiency: <span className="text-emerald-800">{selectedProj.budget_sufficiency}</span>
              </span>
            </div>
          </div>

          {/* Government Proposed Funds vs Implemented Funds Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-[#F6F8F3] p-4 rounded-xl border border-[#D5E2D6] space-y-1">
              <span className="text-stone-500 font-mono font-bold text-[11px]">Proposed Government Funds</span>
              <div className="text-xl font-black text-slate-900 flex items-center gap-1">
                <IndianRupee className="w-4 h-4 text-indigo-600" />
                <span>{(selectedProj.allocated_funds_inr / 10000000).toFixed(2)} Crore</span>
              </div>
              <span className="text-[10px] text-stone-500 font-mono block">
                ₹{selectedProj.allocated_funds_inr.toLocaleString("en-IN")} Allocated
              </span>
            </div>

            <div className="bg-[#F6F8F3] p-4 rounded-xl border border-[#D5E2D6] space-y-1">
              <span className="text-stone-500 font-mono font-bold text-[11px]">Implemented / Expended Funds</span>
              <div className="text-xl font-black text-emerald-800 flex items-center gap-1">
                <IndianRupee className="w-4 h-4 text-emerald-700" />
                <span>{(selectedProj.expended_funds_inr / 10000000).toFixed(2)} Crore</span>
              </div>
              <span className="text-[10px] text-emerald-800 font-mono font-bold block">
                {((selectedProj.expended_funds_inr / selectedProj.allocated_funds_inr) * 100).toFixed(1)}% Utilized
              </span>
            </div>

            <div className="bg-[#0F172A] text-white p-4 rounded-xl border border-indigo-900/50 space-y-1 shadow-md">
              <span className="text-sky-300 font-mono font-bold text-[11px]">Estimated Corrective Cost</span>
              <div className="text-xl font-black text-amber-300 flex items-center gap-1">
                <IndianRupee className="w-4 h-4 text-amber-400" />
                <span>{(selectedProj.estimated_cost.estimated_cost_inr / 100000).toFixed(2)} Lakhs</span>
              </div>
              <span className="text-[10px] text-slate-300 font-mono truncate block">
                Scheme: {selectedProj.estimated_cost.funding_scheme_recommended}
              </span>
            </div>
          </div>

          {/* Corrective Action Plan Breakdown */}
          <div className="bg-[#F6F8F3] p-4 rounded-xl border border-[#D5E2D6] space-y-2 text-xs">
            <div className="font-extrabold text-[#14281D] flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Recommended Action Plan: {selectedProj.estimated_cost.corrective_action_required}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              {selectedProj.estimated_cost.cost_breakdown.map((item, idx) => (
                <div key={idx} className="bg-white p-2 rounded-lg border border-[#D5E2D6] font-medium text-stone-700 flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0"></span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Alert Banner & Probable Cause Analysis — for Red or Yellow sites */}
          {(selectedProj.health_status === "Red" || selectedProj.health_status === "Yellow" || selectedProj.smuggling_alert_active) && (
            <div className={`rounded-xl px-4 py-4 text-xs font-bold flex flex-col gap-3 border shadow-md ${
              selectedProj.health_status === "Red"
                ? "bg-rose-950 border-rose-700 text-rose-100"
                : "bg-amber-950 border-amber-700 text-amber-100"
            }`}>
              <div className="flex items-start gap-3">
                <AlertCircle className={`w-5 h-5 shrink-0 mt-0.5 animate-pulse ${selectedProj.health_status === "Red" ? "text-rose-400" : "text-amber-400"}`} />
                <div className="space-y-1">
                  <div className={`font-black uppercase tracking-wide text-[11px] ${selectedProj.health_status === "Red" ? "text-rose-300" : "text-amber-300"}`}>
                    {selectedProj.health_status === "Red"
                      ? "🔴 CRITICAL SITE — Probable Root Cause Analysis"
                      : "🟡 MONITORING REQUIRED — Probable Cause Analysis"}
                  </div>
                  <div className="font-medium leading-relaxed text-[12px]">
                    {selectedProj.probable_cause?.primary_factor ||
                      (selectedProj.health_status === "Red"
                        ? `NDVI dropped from ${selectedProj.baseline_ndvi} to ${selectedProj.current_ndvi} (${Math.abs(Math.round((selectedProj.current_ndvi - selectedProj.baseline_ndvi) * 100))}% loss). Severe deficit caused by delayed fund disbursement, illegal encroachment, and rainfall shortage.`
                        : `NDVI at ${selectedProj.current_ndvi}. Moderate index stagnation due to pre-monsoon evaporative drawdown and partial grant delay.`)
                    }
                  </div>
                </div>
              </div>

              {/* 4 Category Factor Grid: Funds, People, Resources, Labour */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-white/10 text-xs">
                <div className="bg-black/40 p-2.5 rounded-lg border border-white/10 space-y-0.5">
                  <div className="font-extrabold text-amber-300 font-mono text-[10.5px]">💰 Financial & Grants</div>
                  <p className="text-[11px] opacity-90 leading-snug">{selectedProj.probable_cause?.funds_cause || (selectedProj.health_status === "Red" ? "CAMPA / DRIP emergency fund release pending approval." : "Grant utilization at 68% with delayed invoicing.")}</p>
                </div>
                <div className="bg-black/40 p-2.5 rounded-lg border border-white/10 space-y-0.5">
                  <div className="font-extrabold text-rose-300 font-mono text-[10.5px]">👥 Encroachment & Human</div>
                  <p className="text-[11px] opacity-90 leading-snug">{selectedProj.probable_cause?.people_encroachment_cause || (selectedProj.health_status === "Red" ? "Nocturnal illegal timber logging & boundary encroachment." : "Cattle grazing & crop planting along 50m buffer.")}</p>
                </div>
                <div className="bg-black/40 p-2.5 rounded-lg border border-white/10 space-y-0.5">
                  <div className="font-extrabold text-sky-300 font-mono text-[10.5px]">🌿 Resource & Climate</div>
                  <p className="text-[11px] opacity-90 leading-snug">{selectedProj.probable_cause?.resource_availability_cause || (selectedProj.health_status === "Red" ? "34% monsoon runoff deficit & acute canopy moisture drop." : "Seasonal water table drawdown & evaporation.")}</p>
                </div>
                <div className="bg-black/40 p-2.5 rounded-lg border border-white/10 space-y-0.5">
                  <div className="font-extrabold text-emerald-300 font-mono text-[10.5px]">🚜 Labour & Execution</div>
                  <p className="text-[11px] opacity-90 leading-snug">{selectedProj.probable_cause?.labour_execution_cause || (selectedProj.health_status === "Red" ? "Anti-logging patrol squad & desilting machine delay." : "Manual labour shortage during harvest season.")}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Portfolio Grid of All Conservation Sites across India */}
      <div className="bg-white border border-[#D5E2D6] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D5E2D6] pb-3">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-black text-[#14281D]">All Conservation Sites ({filteredProjects.length})</h3>
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold">
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                🟢 {projects.filter(p => p.health_status === "Green").length} Green
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                🟡 {projects.filter(p => p.health_status === "Yellow").length} Yellow
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                🔴 {projects.filter(p => p.health_status === "Red").length} Red
              </span>
            </div>
          </div>
          <span className="text-xs text-stone-500 font-mono">Click any site card to select & sync views</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {filteredProjects.map((p) => {
            const isSelected = p.project_id === selectedProjectId;
            return (
              <div
                key={p.project_id}
                onClick={() => onSelectProject(p.project_id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                  isSelected
                    ? "bg-[#0F172A] text-white border-indigo-500 shadow-md ring-2 ring-indigo-500/40"
                    : "bg-[#F6F8F3] hover:bg-[#E8F3E9] text-[#14281D] border-[#D5E2D6] hover:border-emerald-500"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                      isSelected ? "bg-indigo-900 text-sky-300" : "bg-stone-200 text-stone-700"
                    }`}>
                      {p.project_id}
                    </span>
                    <h4 className="font-extrabold text-sm leading-snug mt-1">{p.title}</h4>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full shrink-0 ${
                    p.health_status === "Green"
                      ? "bg-emerald-100 text-emerald-800"
                      : p.health_status === "Yellow"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-rose-100 text-rose-800"
                  }`}>
                    {p.health_status}
                  </span>
                </div>

                <div className={`text-[11px] flex items-center gap-1 ${isSelected ? "text-slate-300" : "text-stone-500"}`}>
                  <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span className="truncate">{p.location_name}</span>
                </div>

                <div className="pt-2 border-t border-stone-200/40 flex items-center justify-between text-[11px] font-mono">
                  <span>Proposed: ₹{(p.allocated_funds_inr / 10000000).toFixed(1)} Cr</span>
                  <span className={isSelected ? "text-emerald-400 font-bold" : "text-emerald-800 font-bold"}>
                    Used: ₹{(p.expended_funds_inr / 10000000).toFixed(1)} Cr
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
