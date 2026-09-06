"use client";

import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import MapView from "../../components/MapView";
import { fetchMapProjects, ProjectMapHover } from "../../services/api";

export default function ImpactMapPage() {
  const [projects, setProjects] = useState<ProjectMapHover[]>([]);
  const [selectedId, setSelectedId] = useState<string>("IND-KAR-02");

  useEffect(() => {
    fetchMapProjects().then((res) => {
      setProjects(res);
      if (res.length > 0) setSelectedId(res[0].project_id);
    }).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBF8] text-[#14281D]">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 space-y-5">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#E8F3E9] text-[#14281D] border border-[#C2DEC6]">
            GEOSPATIAL IMPACT MAP
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#14281D]">
            Interactive Conservation Impact Map
          </h1>
          <p className="text-stone-600 text-sm max-w-2xl">
            Hover or click site markers to inspect zoom-level land cover breakdowns (vegetation, water, urban built-up), baseline indices, and probable estimated corrective costs.
          </p>
        </div>

        <MapView
          projects={projects}
          selectedProjectId={selectedId}
          onSelectProject={(id) => setSelectedId(id)}
          onAddDynamicProject={(newProj) => {
            setProjects((prev) => [newProj, ...prev.filter((p) => p.project_id !== newProj.project_id)]);
            setSelectedId(newProj.project_id);
          }}
        />
      </main>

      <Footer />
    </div>
  );
}
