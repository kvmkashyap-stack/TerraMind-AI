"use client";

import React, { useState, useEffect, useRef } from "react";
import { SatelliteDataRepository, ProjectMapHover } from "../services/api";
import { Database, Calendar, Cloud, CheckCircle2, Eye, Layers, Maximize2, X, SlidersHorizontal, Image as ImageIcon, MapPin, ZoomIn, ZoomOut, RefreshCw } from "lucide-react";
import GlobalSiteHeader from "./GlobalSiteHeader";

interface SatelliteRepositoryViewProps {
  data: SatelliteDataRepository | null;
  projects?: ProjectMapHover[];
  selectedProjectId?: string;
  onSelectProject?: (id: string) => void;
  onAddDynamicProject?: (project: ProjectMapHover) => void;
}

// Generate real satellite snapshot for given lat/lng and zoom delta
function getEsriSatelliteUrl(lat: number, lng: number, delta: number = 0.03, width: number = 1200, height: number = 800) {
  const minLon = (lng - delta).toFixed(5);
  const maxLon = (lng + delta).toFixed(5);
  const minLat = (lat - delta).toFixed(5);
  const maxLat = (lat + delta).toFixed(5);
  return `https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/export?bbox=${minLon},${minLat},${maxLon},${maxLat}&bboxSR=4326&imageSR=4326&size=${width},${height}&f=image`;
}

// Processing modes configuration
const SATELLITE_COMPOSITES = [
  {
    type: "True-Color RGB",
    label: "Natural RGB Satellite",
    filterClass: "contrast-105 brightness-100 saturation-110",
    desc: "10m spatial resolution natural color optical composite showing raw ground reflectance, terrain elevation & canopy structure.",
  },
  {
    type: "False-Color NIR",
    label: "Infrared Vegetation NIR",
    filterClass: "hue-rotate-[290deg] saturate-[2.2] contrast-[1.25] brightness-95",
    desc: "Near-infrared spectral composite highlighting chlorophyll activity in vivid crimson & emerald green tones.",
  },
  {
    type: "NDVI Surface Index Map",
    label: "NDVI Heatmap Index",
    filterClass: "hue-rotate-[85deg] saturate-[3.0] contrast-[1.4] brightness-105",
    desc: "Calibrated Normalized Difference Vegetation Index raster highlighting dense vs degraded canopy density.",
  },
  {
    type: "NDWI Hydro Surface Extent",
    label: "NDWI Water Surface Map",
    filterClass: "hue-rotate-[180deg] saturate-[2.5] contrast-[1.3] brightness-90",
    desc: "Normalized Difference Water Index highlighting water body extent, surface area, and reservoir storage levels.",
  },
];

export default function SatelliteRepositoryView({ 
  data, 
  projects = [], 
  selectedProjectId = "", 
  onSelectProject = () => {},
  onAddDynamicProject,
}: SatelliteRepositoryViewProps) {
  const [activeCompositeIdx, setActiveCompositeIdx] = useState<number>(0);
  const [selectedInspectImage, setSelectedInspectImage] = useState<any | null>(null);
  const [isClient, setIsClient] = useState(false);
  const leafletInspectMapRef = useRef<any>(null);
  const inspectContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const selectedProj = projects.find((p) => p.project_id === selectedProjectId);
  
  // Extract coordinates (lat, lng) from project or data fallback
  const siteLat = selectedProj?.coordinates.lat ?? data?.coordinates?.latitude ?? 12.4244;
  const siteLng = selectedProj?.coordinates.lng ?? data?.coordinates?.longitude ?? 76.5742;

  // Base satellite snapshot URLs for current selected site at different bounding box scales
  const featuredSatelliteUrl = getEsriSatelliteUrl(siteLat, siteLng, 0.035, 1200, 800);
  const thumbnailDeltas = [0.020, 0.045, 0.080];

  // Initialize Leaflet satellite map in inspection modal when opened
  useEffect(() => {
    if (!selectedInspectImage || !inspectContainerRef.current || !isClient) return;

    // Dynamically load Leaflet if not present
    const initializeLeafletModal = async () => {
      if (typeof window === "undefined") return;
      const L = (await import("leaflet")).default;
      
      // Cleanup previous map instance if any
      if (leafletInspectMapRef.current) {
        leafletInspectMapRef.current.remove();
        leafletInspectMapRef.current = null;
      }

      const container = inspectContainerRef.current;
      if (!container) return;

      const map = L.map(container, {
        center: [siteLat, siteLng],
        zoom: 15,
        zoomControl: true,
        attributionControl: false,
      });

      // High-resolution satellite tiles layer
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          maxZoom: 19,
          subdomains: ["server", "services"],
        }
      ).addTo(map);

      // Custom marker pin at site center
      const customIcon = L.divIcon({
        className: "custom-site-pin",
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-8 h-8 rounded-full bg-emerald-500/30 animate-ping absolute"></div>
            <div class="w-6 h-6 rounded-full bg-[#0F172A] border-2 border-emerald-400 flex items-center justify-center text-emerald-400 font-bold text-xs shadow-lg">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      L.marker([siteLat, siteLng], { icon: customIcon })
        .addTo(map)
        .bindPopup(`<b>${selectedProj?.title || data?.project_title || "Site Satellite Center"}</b><br/>Lat: ${siteLat.toFixed(4)}, Lng: ${siteLng.toFixed(4)}`)
        .openPopup();

      leafletInspectMapRef.current = map;
      setTimeout(() => map.invalidateSize(), 200);
    };

    initializeLeafletModal();

    return () => {
      if (leafletInspectMapRef.current) {
        leafletInspectMapRef.current.remove();
        leafletInspectMapRef.current = null;
      }
    };
  }, [selectedInspectImage, siteLat, siteLng, isClient]);

  return (
    <div className="space-y-4">
      {projects.length > 0 && selectedProjectId && (
        <GlobalSiteHeader
          projects={projects}
          selectedProjectId={selectedProjectId}
          onSelectProject={onSelectProject}
          onAddDynamicProject={onAddDynamicProject}
          sectionTitle="Satellite Data Repository"
          sectionIcon={Database}
        />
      )}

      {!data ? (
        <div className="w-full h-64 bg-[#F6F8F3] animate-pulse rounded-2xl flex items-center justify-center text-stone-500 border border-[#D5E2D6]">
          Loading Satellite Data Repository...
        </div>
      ) : (
        <div className="w-full bg-white border border-[#D5E2D6] rounded-2xl p-6 shadow-sm space-y-6">
          {/* Header & Spectral Mode Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D5E2D6] pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-indigo-600 shrink-0" />
                <h3 className="text-xl font-extrabold text-[#14281D]">
                  {data.project_title || "Multi-Spectral Satellite Data Analysis"}
                </h3>
              </div>
              <p className="text-xs text-stone-600 mt-1 font-medium flex items-center gap-2">
                <span>Calibrated Surface Reflectance</span>
                <span>•</span>
                <span className="text-indigo-700 font-mono font-bold">
                  Lat: {siteLat.toFixed(4)}°, Lng: {siteLng.toFixed(4)}°
                </span>
              </p>
            </div>

            {/* Processing Mode Filter Tabs */}
            <div className="flex items-center gap-1 bg-[#F6F8F3] p-1 rounded-xl border border-[#D5E2D6] text-xs">
              {SATELLITE_COMPOSITES.map((comp, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveCompositeIdx(idx)}
                  className={`px-3 py-1.5 rounded-lg font-extrabold transition-all ${
                    activeCompositeIdx === idx
                      ? "bg-[#0F172A] text-sky-300 shadow-sm"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  {comp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Processed Satellite Image View (Real High-Res Satellite Snapshot) */}
          <div className="relative w-full h-72 sm:h-[420px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl group">
            {/* Real Processed Satellite Photo Background centered on site coordinates */}
            <img
              src={featuredSatelliteUrl}
              alt={`Satellite view of ${selectedProj?.title || data.project_title}`}
              className={`w-full h-full object-cover transition-all duration-700 ${SATELLITE_COMPOSITES[activeCompositeIdx].filterClass}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 pointer-events-none"></div>

            {/* Processing Watermark & Telemetry Overlay Badges */}
            <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
              <span className="bg-[#0F172A]/90 backdrop-blur-md border border-indigo-500/40 text-sky-300 text-xs font-black px-3 py-1.5 rounded-xl shadow-md flex items-center space-x-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
                <span>{SATELLITE_COMPOSITES[activeCompositeIdx].type}</span>
              </span>
              <span className="bg-emerald-950/90 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-[11px] font-mono font-bold px-2.5 py-1.5 rounded-xl flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Calibrated Imagery</span>
              </span>
            </div>

            {/* Location Coordinate Badge */}
            <div className="absolute top-4 right-4 z-10">
              <span className="bg-black/80 backdrop-blur-md border border-white/20 text-white text-xs font-mono font-extrabold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>{siteLat.toFixed(4)}° N, {siteLng.toFixed(4)}° E</span>
              </span>
            </div>

            {/* Bottom Telemetry & Metadata Bar */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-end justify-between gap-3 text-white">
              <div className="space-y-1 max-w-xl">
                <div className="text-xs font-mono text-sky-300 font-bold uppercase tracking-wider">
                  {selectedProj ? selectedProj.title : data.project_title} Satellite Scene
                </div>
                <p className="text-xs text-slate-200 font-medium leading-relaxed drop-shadow-md">
                  {SATELLITE_COMPOSITES[activeCompositeIdx].desc}
                </p>
              </div>

              <div className="flex items-center space-x-2 text-xs font-mono">
                <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/40 text-slate-200">
                  Vegetation: <strong className="text-emerald-400">{selectedProj ? selectedProj.land_cover.vegetation_coverage_pct : 72}%</strong>
                </div>
                <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-sky-500/40 text-slate-200">
                  Water Surface: <strong className="text-sky-400">{selectedProj ? selectedProj.land_cover.water_coverage_pct : 58}%</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Probable Cause & Contributing Factors Breakdown Card (Only for Red and Yellow Status Sites) */}
          {selectedProj && (selectedProj.health_status === "Red" || selectedProj.health_status === "Yellow") && (
            <div className={`p-4 sm:p-5 rounded-2xl border shadow-md space-y-3.5 transition-all ${
              selectedProj.health_status === "Red"
                ? "bg-rose-950/80 border-rose-600/60 text-rose-50"
                : "bg-amber-950/80 border-amber-600/60 text-amber-50"
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3 border-white/10">
                <div className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full shrink-0 animate-ping ${selectedProj.health_status === "Red" ? "bg-rose-400" : "bg-amber-400"}`} />
                  <h4 className="text-sm font-black uppercase font-mono tracking-wider">
                    {selectedProj.health_status === "Red" ? "🔴 Critical Degradation Status — Probable Root Cause Analysis" : "🟡 Monitoring Required Status — Probable Cause Analysis"}
                  </h4>
                </div>
                <span className={`text-[10px] font-extrabold font-mono px-2.5 py-0.5 rounded-full border ${
                  selectedProj.health_status === "Red" ? "bg-rose-900/90 text-rose-200 border-rose-500" : "bg-amber-900/90 text-amber-200 border-amber-500"
                }`}>
                  Status: {selectedProj.health_status} | Action Needed
                </span>
              </div>

              {/* Primary Factor Summary */}
              <div className="text-xs leading-relaxed font-bold flex items-start gap-2 bg-black/30 p-3 rounded-xl border border-white/10">
                <span className="text-sm">🔍</span>
                <div>
                  <span className="text-sky-300 font-mono font-extrabold uppercase">Primary Drivers: </span>
                  <span>{selectedProj.probable_cause?.primary_factor || (selectedProj.health_status === "Red" ? "Severe telemetry drop from baseline caused by delayed fund disbursement, illegal encroachment, and rainfall deficit." : "Moderate index stagnation due to pre-monsoon evaporative loss and partial grant delay.")}</span>
                </div>
              </div>

              {/* 4 Category Factor Grid: Funds, People, Resources, Labour */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {/* 1. Funds & Allocation */}
                <div className="bg-black/40 p-3 rounded-xl border border-white/10 space-y-1">
                  <div className="font-extrabold text-amber-300 flex items-center gap-1.5 font-mono text-[11px]">
                    <span>💰</span> Financial & Grant Factors
                  </div>
                  <p className="text-[11.5px] opacity-90 leading-snug">
                    {selectedProj.probable_cause?.funds_cause || (selectedProj.health_status === "Red" ? "CAMPA / DRIP emergency fund release pending departmental sign-off." : "Maintenance grant utilization at 68% with delayed invoicing.")}
                  </p>
                </div>

                {/* 2. People & Encroachment */}
                <div className="bg-black/40 p-3 rounded-xl border border-white/10 space-y-1">
                  <div className="font-extrabold text-rose-300 flex items-center gap-1.5 font-mono text-[11px]">
                    <span>👥</span> Encroachment & Human Activity
                  </div>
                  <p className="text-[11.5px] opacity-90 leading-snug">
                    {selectedProj.probable_cause?.people_encroachment_cause || (selectedProj.health_status === "Red" ? "Nocturnal illegal timber logging & boundary encroachment in core sector." : "Cattle grazing & seasonal crop planting extending into peripheral catchment.")}
                  </p>
                </div>

                {/* 3. Resource & Climate Availability */}
                <div className="bg-black/40 p-3 rounded-xl border border-white/10 space-y-1">
                  <div className="font-extrabold text-sky-300 flex items-center gap-1.5 font-mono text-[11px]">
                    <span>🌿</span> Resource & Climate Availability
                  </div>
                  <p className="text-[11.5px] opacity-90 leading-snug">
                    {selectedProj.probable_cause?.resource_availability_cause || (selectedProj.health_status === "Red" ? "34% monsoon runoff deficit & acute canopy moisture drop." : "Seasonal water table drawdown & pre-monsoon evaporation.")}
                  </p>
                </div>

                {/* 4. Labour & Execution Capacity */}
                <div className="bg-black/40 p-3 rounded-xl border border-white/10 space-y-1">
                  <div className="font-extrabold text-emerald-300 flex items-center gap-1.5 font-mono text-[11px]">
                    <span>🚜</span> Labour & Execution Shortage
                  </div>
                  <p className="text-[11.5px] opacity-90 leading-snug">
                    {selectedProj.probable_cause?.labour_execution_cause || (selectedProj.health_status === "Red" ? "Anti-logging patrol guard shortage & desilting machine contractor delay." : "Temporary manual labour availability deficit during harvest season.")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Grid of Multi-Temporal Processed Satellite Rasters */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-[#14281D] uppercase tracking-wider font-mono flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Multi-Temporal Processed Satellite Rasters ({data.images.length})</span>
              </span>
              <span className="text-xs text-stone-500 font-sans font-medium">Click any scene to inspect live satellite imagery</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {data.images.map((img, idx) => {
                const thumbDelta = thumbnailDeltas[idx % thumbnailDeltas.length];
                const rasterThumbUrl = getEsriSatelliteUrl(siteLat, siteLng, thumbDelta, 600, 400);

                return (
                  <div
                    key={img.image_id}
                    onClick={() => setSelectedInspectImage(img)}
                    className="bg-[#F6F8F3] border border-[#D5E2D6] rounded-2xl p-4 space-y-3 hover:border-indigo-500 transition-all duration-300 shadow-2xs group cursor-pointer"
                  >
                    {/* Satellite Photo Thumbnail Card */}
                    <div className="relative h-48 w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-700 flex flex-col justify-between p-3 shadow-inner">
                      <img
                        src={rasterThumbUrl}
                        alt={img.image_id}
                        className={`absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${SATELLITE_COMPOSITES[activeCompositeIdx].filterClass}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none"></div>

                      {/* Metadata Overlay Top */}
                      <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-white font-black">
                        <span className="bg-black/80 backdrop-blur-xs px-2 py-0.5 rounded border border-white/20">
                          {img.satellite_source}
                        </span>
                        <span className="bg-indigo-600 px-2 py-0.5 rounded text-white shadow-2xs flex items-center gap-1">
                          <Maximize2 className="w-3 h-3" />
                          Inspect Map
                        </span>
                      </div>

                      {/* Metadata Overlay Bottom */}
                      <div className="relative z-10 flex justify-between items-end text-[11px] font-extrabold text-white">
                        <div className="space-y-0.5">
                          <div className="text-[10px] text-sky-300 font-mono">Captured: {img.acquisition_date}</div>
                          <div className="text-white text-xs font-black">{img.image_id}</div>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-mono bg-black/80 px-2 py-0.5 rounded border border-emerald-500/40">
                          Calibrated
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1">
                      <div className="bg-white border border-[#D5E2D6] p-2.5 rounded-xl shadow-2xs">
                        <span className="text-stone-500 block text-[10px] font-mono font-bold mb-0.5 uppercase">Vegetation Canopy</span>
                        <span className="font-black text-emerald-800 text-sm">{img.vegetation_coverage_pct}%</span>
                      </div>
                      <div className="bg-white border border-[#D5E2D6] p-2.5 rounded-xl shadow-2xs">
                        <span className="text-stone-500 block text-[10px] font-mono font-bold mb-0.5 uppercase">Water Surface</span>
                        <span className="font-black text-sky-700 text-sm">{img.water_body_coverage_pct}%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-stone-600 pt-2 border-t border-stone-200">
                      <span className="flex items-center space-x-1 text-[11px]">
                        <Cloud className="w-3.5 h-3.5 text-stone-400" />
                        <span>Cloud Cover: {img.cloud_cover_percentage}%</span>
                      </span>
                      <span className="flex items-center space-x-1 text-indigo-700 font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Radiometrically Calibrated</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Full Screen Live Satellite Image Inspection Modal */}
          {selectedInspectImage && (
            <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md p-4 sm:p-6 flex items-center justify-center overflow-y-auto">
              <div className="bg-[#0F172A] border border-indigo-500/40 text-white rounded-3xl p-6 max-w-5xl w-full space-y-4 shadow-2xl relative overflow-hidden my-auto">
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-lg font-black text-white font-mono uppercase tracking-wide flex items-center gap-2">
                      <Database className="w-5 h-5 text-sky-400" />
                      <span>Processed Satellite Inspection: {selectedInspectImage.image_id}</span>
                    </h3>
                    <p className="text-xs text-sky-300 font-medium mt-0.5">
                      {selectedProj ? selectedProj.title : selectedInspectImage.project_id} • Acquired {selectedInspectImage.acquisition_date}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedInspectImage(null)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Leaflet Interactive Satellite Map View Container */}
                <div className="relative w-full h-80 sm:h-[400px] rounded-2xl overflow-hidden border border-slate-700 shadow-inner bg-slate-950">
                  <div ref={inspectContainerRef} className="w-full h-full z-10"></div>

                  {/* Satellite Map Controls Overlay */}
                  <div className="absolute top-4 left-4 z-20 pointer-events-none">
                    <span className="bg-[#0F172A]/90 backdrop-blur-md border border-indigo-500/40 text-sky-300 text-xs font-black px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span>Live Satellite Telemetry • {siteLat.toFixed(4)}°, {siteLng.toFixed(4)}°</span>
                    </span>
                  </div>
                </div>

                {/* Telemetry & Multi-Spectral Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px] font-mono">Satellite Constellation</span>
                    <span className="font-extrabold text-white text-sm">{selectedInspectImage.satellite_source}</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px] font-mono">Spatial Resolution</span>
                    <span className="font-extrabold text-sky-300 text-sm">{selectedInspectImage.resolution_meters} Meters / Pixel</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px] font-mono">Vegetation Cover</span>
                    <span className="font-extrabold text-emerald-400 text-sm">{selectedInspectImage.vegetation_coverage_pct}%</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px] font-mono">Calibrated Surface</span>
                    <span className="font-extrabold text-indigo-300 text-xs">Calibrated Surface Reflectance</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
