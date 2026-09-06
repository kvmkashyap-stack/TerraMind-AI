"use client";

import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SatelliteRepositoryView from "../../components/SatelliteRepositoryView";
import { fetchSatelliteRepository, SatelliteDataRepository } from "../../services/api";

export default function ReportsPage() {
  const [satelliteData, setSatelliteData] = useState<SatelliteDataRepository | null>(null);

  useEffect(() => {
    fetchSatelliteRepository("IND-KAR-02").then(setSatelliteData).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBF8] text-[#14281D]">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#E8F3E9] text-[#14281D] border border-[#C2DEC6]">
            SATELLITE DATA REPOSITORY & REPORTS
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#14281D]">
            Satellite Observation Data & Evidence Reports
          </h1>
          <p className="text-stone-600 text-sm max-w-2xl">
            View calibrated multi-spectral satellite rasters, cloud cover metrics, and automated progress audit reports.
          </p>
        </div>

        <SatelliteRepositoryView data={satelliteData} />
      </main>

      <Footer />
    </div>
  );
}
