"use client";

import React, { useState, useEffect } from "react";
import { ProjectMapHover } from "../services/api";
import { createDynamicLocationSite } from "../services/dynamicSiteGenerator";
import { Search, Loader2, X, MapPin } from "lucide-react";

interface GlobalSiteHeaderProps {
  projects: ProjectMapHover[];
  selectedProjectId: string;
  onSelectProject: (id: string) => void;
  onAddDynamicProject?: (project: ProjectMapHover) => void;
  sectionTitle: string;
  sectionIcon: React.ElementType;
}

export default function GlobalSiteHeader({
  projects,
  selectedProjectId,
  onSelectProject,
  onAddDynamicProject,
  sectionTitle,
  sectionIcon: SectionIcon,
}: GlobalSiteHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLiveLoading, setIsLiveLoading] = useState(false);
  const [liveSuggestions, setLiveSuggestions] = useState<
    Array<{ name: string; fullName: string; lat: number; lng: number }>
  >([]);

  const selectedProj =
    projects.find((p) => p.project_id === selectedProjectId) || projects[0];

  // Live debounced geocoder for ANY place name across India (Almatti Dam, Wular Lake, etc.)
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setLiveSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsLiveLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            searchQuery
          )}&countrycodes=in&limit=4`
        );
        if (res.ok) {
          const data = await res.json();
          const suggestions = data.map((item: any) => ({
            name: item.name || item.display_name.split(",")[0],
            fullName: item.display_name,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
          }));
          setLiveSuggestions(suggestions);
        }
      } catch (err) {
        console.error("Live geocode search error:", err);
      } finally {
        setIsLiveLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.project_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.intervention_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectItem = (id: string) => {
    onSelectProject(id);
    setSearchQuery("");
    setIsSearchFocused(false);
  };

  const handleSelectLiveSuggestion = (sug: {
    name: string;
    fullName: string;
    lat: number;
    lng: number;
  }) => {
    const dynamicSite = createDynamicLocationSite(sug.name, sug.lat, sug.lng, sug.fullName);
    if (onAddDynamicProject) {
      onAddDynamicProject(dynamicSite);
    }
    onSelectProject(dynamicSite.project_id);
    setSearchQuery("");
    setIsSearchFocused(false);
  };

  // ── color helpers ──────────────────────────────────────────────────────
  const statusDot = (s: string) =>
    s === "Green"
      ? "bg-emerald-400 shadow-[0_0_5px_rgba(16,185,129,0.8)]"
      : s === "Yellow"
      ? "bg-amber-400 shadow-[0_0_5px_rgba(245,158,11,0.8)]"
      : "bg-rose-500 shadow-[0_0_5px_rgba(239,68,68,0.8)]";

  const statusText = (s: string) =>
    s === "Green" ? "text-emerald-300" : s === "Yellow" ? "text-amber-300" : "text-rose-300";

  const statusBadge = (s: string) =>
    s === "Green"
      ? "bg-emerald-900/60 text-emerald-300 border-emerald-600/50"
      : s === "Yellow"
      ? "bg-amber-900/60 text-amber-300 border-amber-600/50"
      : "bg-rose-900/60 text-rose-300 border-rose-600/50";

  return (
    <div className="w-full bg-[#0F172A] text-white p-4 rounded-2xl border border-indigo-500/30 shadow-md space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Section Title */}
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-xl bg-indigo-600/80 border border-indigo-400/40 text-sky-300 flex items-center justify-center font-bold shadow-xs shrink-0">
            <SectionIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white tracking-wide uppercase font-mono">
              {sectionTitle}
            </h3>
            {selectedProj && (
              <div className="text-[11px] flex items-center gap-1.5 font-extrabold truncate">
                <span className={`w-2 h-2 rounded-full shrink-0 ${statusDot(selectedProj.health_status)}`} />
                <span className={`truncate ${statusText(selectedProj.health_status)}`}>
                  {selectedProj.title} ({selectedProj.project_id})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Search + Custom Dropdown */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 sm:w-72">
            <div className="relative flex items-center">
              {isLiveLoading ? (
                <Loader2 className="w-3.5 h-3.5 text-sky-400 animate-spin absolute left-3" />
              ) : (
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3" />
              )}
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                placeholder="Search any place in India (Almatti, KRS, Sariska...)..."
                className="w-full bg-slate-900/90 border border-indigo-500/40 text-white text-xs pl-8 pr-8 py-1.5 rounded-xl focus:outline-none focus:border-sky-400 transition-all font-medium placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setIsSearchFocused(false);
                  }}
                  className="absolute right-2.5 text-slate-400 hover:text-white p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {isSearchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 rounded-xl border border-indigo-500/40 shadow-2xl z-50 overflow-hidden text-xs max-h-80 overflow-y-auto divide-y divide-slate-800">
                {/* Local Projects */}
                {filteredProjects.length > 0 && (
                  <div>
                    <div className="p-2 bg-indigo-950/80 text-[10px] font-mono font-bold text-sky-300 uppercase flex justify-between">
                      <span>Matching Sites ({filteredProjects.length})</span>
                    </div>
                    {filteredProjects.map((p) => (
                      <div
                        key={p.project_id}
                        onClick={() => handleSelectItem(p.project_id)}
                        className="p-2.5 hover:bg-indigo-900/60 cursor-pointer transition-colors flex items-center justify-between gap-2 group"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${statusDot(p.health_status)}`} />
                          <div className="truncate">
                            <div className="font-extrabold text-white group-hover:text-sky-300 truncate">
                              {p.title}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">
                              {p.location_name} • {p.project_id}
                            </div>
                          </div>
                        </div>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border shrink-0 ${statusBadge(p.health_status)}`}>
                          {p.health_status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Live OpenStreetMap GIS Search Results */}
                {liveSuggestions.length > 0 && (
                  <div className="divide-y divide-slate-800 border-t border-slate-700">
                    <div className="p-2 bg-emerald-950/90 text-[10px] font-mono font-bold text-emerald-300 uppercase flex justify-between items-center">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Live GIS India Locations
                      </span>
                      {isLiveLoading && <Loader2 className="w-3 h-3 text-emerald-400 animate-spin" />}
                    </div>
                    {liveSuggestions.map((sug, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectLiveSuggestion(sug)}
                        className="p-2.5 hover:bg-emerald-900/40 cursor-pointer transition-colors flex items-center justify-between group"
                      >
                        <div className="space-y-0.5 min-w-0 pr-2">
                          <div className="font-extrabold text-white group-hover:text-emerald-300 flex items-center gap-1.5 truncate">
                            <span>📍 {sug.name}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">{sug.fullName}</div>
                        </div>
                        <span className="text-[10px] text-emerald-300 font-extrabold bg-emerald-900/60 px-2 py-0.5 rounded-md border border-emerald-600/50 shrink-0">
                          Create & View
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {filteredProjects.length === 0 && liveSuggestions.length === 0 && !isLiveLoading && (
                  <div className="p-3 text-slate-400 text-center">No site found matching "{searchQuery}"</div>
                )}
              </div>
            )}
          </div>

          {/* Custom Color-Coded Site Selector */}
          <div className="relative shrink-0">
            <button
              onClick={() => setIsDropdownOpen((o) => !o)}
              className="flex items-center gap-2 bg-slate-900 border border-indigo-500/40 text-xs px-3 py-1.5 rounded-xl font-black cursor-pointer hover:bg-slate-800 transition-colors max-w-[180px] sm:max-w-[200px]"
              title="Switch Conservation Site"
            >
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${statusDot(selectedProj?.health_status || "Green")}`} />
              <span className="text-sky-300 truncate max-w-[120px]">
                {selectedProj?.title || "Select Site"}
              </span>
              <svg
                className={`w-3 h-3 text-slate-400 shrink-0 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 w-72 bg-[#0F172A] border border-indigo-500/30 rounded-xl shadow-2xl z-50 overflow-hidden max-h-80 overflow-y-auto">
                {projects.map((p) => {
                  const isSelected = p.project_id === selectedProjectId;
                  return (
                    <button
                      key={p.project_id}
                      onClick={() => {
                        onSelectProject(p.project_id);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-xs transition-colors ${
                        isSelected
                          ? "bg-indigo-900/60 border-l-2 border-indigo-400"
                          : "hover:bg-white/10 border-l-2 border-transparent"
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${statusDot(p.health_status)}`} />
                      <div className="min-w-0">
                        <div className={`font-bold truncate ${isSelected ? "text-white" : "text-slate-200"}`}>
                          {p.title}
                        </div>
                        <div className={`text-[10px] font-mono ${statusText(p.health_status)}`}>
                          {p.project_id} · {p.health_status}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Site Summary Strip */}
      {selectedProj && (
        <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-3">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border font-mono flex items-center gap-1.5 ${statusBadge(selectedProj.health_status)}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusDot(selectedProj.health_status)}`} />
              STATUS: {selectedProj.health_status}
            </span>
            <span className="text-slate-300 font-medium">
              Location: <strong className="text-white">{selectedProj.location_name}</strong>
            </span>
          </div>
          <div className="text-slate-300 font-mono text-[11px]">
            Proposed Budget: <strong className="text-amber-300">₹{(selectedProj.allocated_funds_inr / 10000000).toFixed(2)} Cr</strong> | Expended: <strong className="text-emerald-400">₹{(selectedProj.expended_funds_inr / 10000000).toFixed(2)} Cr</strong>
          </div>
        </div>
      )}
    </div>
  );
}
