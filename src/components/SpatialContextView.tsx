import React, { useState } from 'react';
import { FieldTelemetryInput, GeoSpatialContext } from '../types.js';
import {
  Compass,
  MapPin,
  Globe2,
  Mountain,
  AlertTriangle,
  Layers,
  Sparkles,
  Check
} from 'lucide-react';

interface SpatialContextViewProps {
  telemetry: FieldTelemetryInput;
  setTelemetry: React.Dispatch<React.SetStateAction<FieldTelemetryInput>>;
  onAnalyzeWithSpatial: () => void;
}

interface GeoHotspot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  biome: string;
  soilOrder: string;
  annualRainfall: number;
  aridityIndex: number;
  vulnerabilityStatus: string;
  recommendedFocus: string;
}

const GLOBAL_HOTSPOTS: GeoHotspot[] = [
  {
    id: 'sahel-acacia',
    name: 'Sahelian Semi-Arid Belt (Niger / Senegal)',
    lat: 14.49,
    lng: -14.45,
    biome: 'Sahelian Acacia Savanna & Thorn Shrub',
    soilOrder: 'Arenosols / Calcisols',
    annualRainfall: 240,
    aridityIndex: 0.18,
    vulnerabilityStatus: 'Critical Desertification & Wind Erosion',
    recommendedFocus: 'Reverse-phenology Faidherbia albida agroforestry, hydraulic lift, micro-catchment demi-lunes.',
  },
  {
    id: 'great-plains-wheat',
    name: 'North American Dryland Wheat Matrix (Kansas / Colorado)',
    lat: 38.52,
    lng: -101.32,
    biome: 'Temperate Shortgrass Prairie / Steppe',
    soilOrder: 'Mollisols / Ustolls',
    annualRainfall: 360,
    aridityIndex: 0.32,
    vulnerabilityStatus: 'Aquifer Depletion & Wind Blown Soil Loss',
    recommendedFocus: 'Continuous no-till with legume cover crops, stripper headers for standing stubble.',
  },
  {
    id: 'mediterranean-basin',
    name: 'Mediterranean Semi-Arid Basin (Southern Spain / Jordan)',
    lat: 37.99,
    lng: -1.13,
    biome: 'Mediterranean Sclerophyllous Scrub & Dry Steppe',
    soilOrder: 'Calcisols / Leptosols',
    annualRainfall: 290,
    aridityIndex: 0.25,
    vulnerabilityStatus: 'Extreme Summer Drought & Secondary Salinization',
    recommendedFocus: 'Halophytic vegetative strips, mycorrhizal fungal inoculants, contour swales.',
  },
  {
    id: 'murray-darling',
    name: 'Australian Semi-Arid Agricultural Matrix (Murray-Darling)',
    lat: -34.18,
    lng: 142.16,
    biome: 'Mallee Shrubland & Dry Woodland',
    soilOrder: 'Vertisols / Sodosols',
    annualRainfall: 270,
    aridityIndex: 0.21,
    vulnerabilityStatus: 'Subsoil Sodicity & Native Pollinator Loss',
    recommendedFocus: 'Saltbush (Atriplex) windbreaks, deep-rooted native Chenopods, biodiversity corridors.',
  },
  {
    id: 'indo-gangetic',
    name: 'Indo-Gangetic Intensified Grain Basin (Punjab / Haryana)',
    lat: 30.73,
    lng: 76.77,
    biome: 'Subtropical Semi-Arid Alluvial Plain',
    soilOrder: 'Inceptisols / Entisols',
    annualRainfall: 580,
    aridityIndex: 0.45,
    vulnerabilityStatus: 'Paddy Stubble Burning & Groundwater Collapse',
    recommendedFocus: 'Happy Seeder zero-till direct drilling, bio-decomposers, multi-tier agroforestry.',
  },
];

export const SpatialContextView: React.FC<SpatialContextViewProps> = ({
  telemetry,
  setTelemetry,
  onAnalyzeWithSpatial,
}) => {
  const currentGeo = telemetry.geo || {
    latitude: 31.85,
    longitude: 35.45,
    locationName: 'Judean Semi-Arid Dryland Matrix',
    biome: 'Mediterranean / Semi-Arid Steppe',
    soilOrder: 'Aridisols / Calcisols',
    vulnerabilityStatus: 'Critical Desertification Threat',
  };

  const [lat, setLat] = useState(currentGeo.latitude);
  const [lng, setLng] = useState(currentGeo.longitude);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);

  const handleSelectHotspot = (hotspot: GeoHotspot) => {
    setSelectedHotspot(hotspot.id);
    setLat(hotspot.lat);
    setLng(hotspot.lng);

    const geoData: GeoSpatialContext = {
      latitude: hotspot.lat,
      longitude: hotspot.lng,
      locationName: hotspot.name,
      biome: hotspot.biome,
      soilOrder: hotspot.soilOrder,
      vulnerabilityStatus: hotspot.vulnerabilityStatus,
    };

    setTelemetry((prev) => ({
      ...prev,
      geo: geoData,
      climate: {
        ...prev.climate,
        annualRainfallMm: hotspot.annualRainfall,
        aridityIndex: hotspot.aridityIndex,
      },
      land: {
        ...prev.land,
        region: hotspot.biome,
      },
    }));
  };

  const handleCustomCoordinatesApply = () => {
    const geoData: GeoSpatialContext = {
      latitude: lat,
      longitude: lng,
      locationName: `Custom Coordinates (${lat}°, ${lng}°)`,
      biome: lat > 30 ? 'Temperate Dryland Matrix' : 'Subtropical Semi-Arid Basin',
      soilOrder: 'Aridisols / Entisols',
      vulnerabilityStatus: 'Elevated Microclimatic Vulnerability',
    };

    setTelemetry((prev) => ({
      ...prev,
      geo: geoData,
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Title Header */}
      <div>
        <div className="flex items-center space-x-2">
          <h2 className="text-base font-semibold text-white flex items-center space-x-2">
            <Compass className="w-5 h-5 text-emerald-400" />
            <span>Geo-Spatial Environmental Context (Assessment Bonus)</span>
          </h2>
          <span className="text-xs px-2 py-0.5 rounded font-mono font-medium bg-emerald-950 text-emerald-300 border border-emerald-800">
            Spatial Grounding Active
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Geo-spatial positioning integrates local biome taxonomy, macro-soil classification, and macroclimatic aridity regimes directly into the scientific reasoning engine.
        </p>
      </div>

      {/* Global Hotspots Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
          <Globe2 className="w-3.5 h-3.5 text-teal-400" />
          <span>Global Dryland & Agricultural Biome Presets</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {GLOBAL_HOTSPOTS.map((spot) => {
            const isSelected = selectedHotspot === spot.id || (currentGeo.latitude === spot.lat && currentGeo.longitude === spot.lng);
            return (
              <div
                key={spot.id}
                onClick={() => handleSelectHotspot(spot)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-900 border-emerald-500 ring-1 ring-emerald-500'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-xs font-semibold text-white">{spot.name}</span>
                  </div>
                  {isSelected && (
                    <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Coordinates:</span>
                    <span className="font-mono text-slate-200">{spot.lat}&deg;N, {spot.lng}&deg;E</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Biome:</span>
                    <span className="text-teal-300 text-right font-medium">{spot.biome}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Soil Classification:</span>
                    <span className="font-mono text-amber-300">{spot.soilOrder}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Rainfall & Aridity:</span>
                    <span className="font-mono text-cyan-300">{spot.annualRainfall}mm (P/PET: {spot.aridityIndex})</span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-amber-200/90 leading-relaxed">
                  <strong>Intervention Focus:</strong> {spot.recommendedFocus}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Coordinate Input & Active Spatial Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Custom Coordinates Setter */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Custom Geographic Coordinates</span>
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Latitude (&deg;N/S)</label>
              <input
                type="number"
                step="0.01"
                value={lat}
                onChange={(e) => setLat(parseFloat(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Longitude (&deg;E/W)</label>
              <input
                type="number"
                step="0.01"
                value={lng}
                onChange={(e) => setLng(parseFloat(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            onClick={handleCustomCoordinatesApply}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition"
          >
            Apply Coordinates to Spatial Profile
          </button>
        </div>

        {/* Current Linked Spatial Telemetry Card */}
        <div className="bg-slate-900 border border-emerald-900/50 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
              <Layers className="w-4 h-4" />
              <span>Active Landscape Spatial Envelope</span>
            </h3>
            <span className="font-mono text-xs text-emerald-400">
              {currentGeo.latitude}&deg;, {currentGeo.longitude}&deg;
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950 p-3 rounded border border-slate-800">
              <span className="text-slate-500 text-[10px] uppercase font-semibold block mb-0.5">Location</span>
              <span className="text-white font-medium">{currentGeo.locationName}</span>
            </div>

            <div className="bg-slate-950 p-3 rounded border border-slate-800">
              <span className="text-slate-500 text-[10px] uppercase font-semibold block mb-0.5">Biome Eco-Region</span>
              <span className="text-teal-300 font-medium">{currentGeo.biome}</span>
            </div>

            <div className="bg-slate-950 p-3 rounded border border-slate-800">
              <span className="text-slate-500 text-[10px] uppercase font-semibold block mb-0.5">Dominant Soil Order</span>
              <span className="text-amber-300 font-mono">{currentGeo.soilOrder}</span>
            </div>

            <div className="bg-slate-950 p-3 rounded border border-slate-800">
              <span className="text-slate-500 text-[10px] uppercase font-semibold block mb-0.5">Ecosystem Status</span>
              <span className="text-red-300 font-medium">{currentGeo.vulnerabilityStatus}</span>
            </div>
          </div>

          <button
            onClick={onAnalyzeWithSpatial}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium flex items-center justify-center space-x-2 transition shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Evaluate Ecosystem Interventions with Spatial Context</span>
          </button>
        </div>
      </div>
    </div>
  );
};
