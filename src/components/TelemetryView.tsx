import React, { useState } from 'react';
import { FieldTelemetryInput, ScientificAnalysisResult } from '../types.js';
import { BENCHMARK_PRESETS } from '../data/presets.js';
import { AnalysisCard } from './AnalysisCard.js';
import {
  Layers,
  Code,
  Sliders,
  CheckCircle,
  Play,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';

interface TelemetryViewProps {
  telemetry: FieldTelemetryInput;
  setTelemetry: React.Dispatch<React.SetStateAction<FieldTelemetryInput>>;
}

export const TelemetryView: React.FC<TelemetryViewProps> = ({
  telemetry,
  setTelemetry,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'form' | 'json'>('form');
  const [jsonText, setJsonText] = useState(JSON.stringify(telemetry, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ScientificAnalysisResult | null>(null);

  const handleApplyPreset = (presetId: string) => {
    const found = BENCHMARK_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setTelemetry(found.telemetry);
      setJsonText(JSON.stringify(found.telemetry, null, 2));
      setJsonError(null);
    }
  };

  const handleJsonChange = (val: string) => {
    setJsonText(val);
    try {
      const parsed = JSON.parse(val);
      setTelemetry(parsed);
      setJsonError(null);
    } catch (err: any) {
      setJsonError(err.message);
    }
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(telemetry, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunAssessment = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(telemetry),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setAnalysisResult(data);
    } catch (err: any) {
      console.error('Assessment failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Benchmark Presets Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center space-x-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              <span>Agroecosystem Benchmark Scenarios</span>
            </h2>
            <p className="text-xs text-slate-400">
              Load verified empirical telemetry profiles or create custom multi-variable configurations.
            </p>
          </div>

          <button
            onClick={() => handleApplyPreset('hackathon-benchmark')}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center space-x-1.5 shadow-sm transition"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Load Hackathon Test Case (0.3% SOC, Wheat)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {BENCHMARK_PRESETS.map((preset) => {
            const isSelected =
              telemetry.soil?.organicCarbonPercent === preset.telemetry.soil?.organicCarbonPercent &&
              telemetry.land?.landUseType === preset.telemetry.land?.landUseType;

            return (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset.id)}
                className={`text-left p-3.5 rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-slate-900 border-emerald-500 ring-1 ring-emerald-500'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-white">{preset.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-slate-800 text-emerald-300 border border-slate-700">
                    {preset.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {preset.description}
                </p>
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <span>SOC: {preset.telemetry.soil?.organicCarbonPercent}%</span>
                  <span>Rain: {preset.telemetry.climate?.annualRainfallMm}mm</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Mode Selector: Form vs JSON (Requirement 5) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveSubTab('form')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition ${
                activeSubTab === 'form'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Interactive Telemetry Form</span>
            </button>

            <button
              onClick={() => {
                setActiveSubTab('json');
                setJsonText(JSON.stringify(telemetry, null, 2));
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition ${
                activeSubTab === 'json'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Structured JSON Console</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyJSON}
              className="flex items-center space-x-1 px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeSubTab === 'form' ? (
            <div className="space-y-6">
              {/* Section 1: Soil Health Metrics */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm font-semibold text-emerald-400 border-b border-slate-800 pb-2">
                  <span>1. Soil Health & Biogeochemistry</span>
                  <span className="text-xs text-slate-500 font-normal">(pH, organic carbon, microbial mass)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* SOC Slider */}
                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-medium text-slate-200">Soil Organic Carbon (SOC)</label>
                      <span className="font-mono text-emerald-300 font-bold">
                        {telemetry.soil?.organicCarbonPercent}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="5.0"
                      step="0.05"
                      value={telemetry.soil?.organicCarbonPercent ?? 0.3}
                      onChange={(e) =>
                        setTelemetry((prev) => ({
                          ...prev,
                          soil: { ...prev.soil, organicCarbonPercent: parseFloat(e.target.value) },
                        }))
                      }
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>0.1% (Critical)</span>
                      <span>1.5% (Fair)</span>
                      <span>4.0%+ (Regenerated)</span>
                    </div>
                  </div>

                  {/* Soil pH */}
                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-medium text-slate-200">Soil pH Reaction</label>
                      <span className="font-mono text-teal-300 font-bold">{telemetry.soil?.ph}</span>
                    </div>
                    <input
                      type="range"
                      min="4.5"
                      max="9.0"
                      step="0.1"
                      value={telemetry.soil?.ph ?? 7.8}
                      onChange={(e) =>
                        setTelemetry((prev) => ({
                          ...prev,
                          soil: { ...prev.soil, ph: parseFloat(e.target.value) },
                        }))
                      }
                      className="w-full accent-teal-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>4.5 (Acidic)</span>
                      <span>7.0 (Neutral)</span>
                      <span>9.0 (Alkaline/Saline)</span>
                    </div>
                  </div>

                  {/* Microbial Biomass C */}
                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-medium text-slate-200">Microbial Biomass C (mg/kg)</label>
                      <span className="font-mono text-cyan-300 font-bold">
                        {telemetry.soil?.microbialBiomassC ?? 110} mg/kg
                      </span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="600"
                      step="10"
                      value={telemetry.soil?.microbialBiomassC ?? 110}
                      onChange={(e) =>
                        setTelemetry((prev) => ({
                          ...prev,
                          soil: { ...prev.soil, microbialBiomassC: parseInt(e.target.value) },
                        }))
                      }
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>50 (Sterile)</span>
                      <span>250 (Moderate)</span>
                      <span>500+ (Fungal rich)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Climate & Precipitation Factors */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm font-semibold text-teal-400 border-b border-slate-800 pb-2">
                  <span>2. Climate Factors & Hydrology</span>
                  <span className="text-xs text-slate-500 font-normal">(Annual rainfall, seasonality, temperature)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Annual Rainfall */}
                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-medium text-slate-200">Annual Precipitation</label>
                      <span className="font-mono text-teal-300 font-bold">
                        {telemetry.climate?.annualRainfallMm} mm/year
                      </span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="2000"
                      step="20"
                      value={telemetry.climate?.annualRainfallMm ?? 280}
                      onChange={(e) =>
                        setTelemetry((prev) => ({
                          ...prev,
                          climate: { ...prev.climate, annualRainfallMm: parseInt(e.target.value) },
                        }))
                      }
                      className="w-full accent-teal-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>100mm (Arid)</span>
                      <span>500mm (Dryland)</span>
                      <span>1500mm+ (Humid)</span>
                    </div>
                  </div>

                  {/* Rainfall Pattern */}
                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
                    <label className="font-medium text-slate-200 text-xs block">Precipitation Pattern</label>
                    <select
                      value={telemetry.climate?.rainfallPattern || 'low'}
                      onChange={(e) =>
                        setTelemetry((prev) => ({
                          ...prev,
                          climate: { ...prev.climate, rainfallPattern: e.target.value as any },
                        }))
                      }
                      className="w-full bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded p-2 focus:outline-none focus:border-teal-500"
                    >
                      <option value="low">Low (&lt;300mm / semi-arid)</option>
                      <option value="moderate">Moderate (400-800mm)</option>
                      <option value="high">High (&gt;1000mm)</option>
                      <option value="erratic_seasonal">Erratic Seasonal / Monsoonal</option>
                      <option value="arid_bimodal">Arid Bimodal</option>
                    </select>
                  </div>

                  {/* Mean Temperature */}
                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-medium text-slate-200">Mean Annual Temperature</label>
                      <span className="font-mono text-amber-300 font-bold">{telemetry.climate?.meanTempC} &deg;C</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="38"
                      step="1"
                      value={telemetry.climate?.meanTempC ?? 24}
                      onChange={(e) =>
                        setTelemetry((prev) => ({
                          ...prev,
                          climate: { ...prev.climate, meanTempC: parseInt(e.target.value) },
                        }))
                      }
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>5&deg;C (Cool)</span>
                      <span>22&deg;C (Warm)</span>
                      <span>35&deg;C+ (Extreme)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Land Use, Crops, & Management Pressures */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm font-semibold text-cyan-400 border-b border-slate-800 pb-2">
                  <span>3. Land Use & Management Pressures</span>
                  <span className="text-xs text-slate-500 font-normal">(Crop type, tillage intensity, chemicals)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Land use / crop */}
                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
                    <label className="font-medium text-slate-200 text-xs block">Current Land Use / Crop</label>
                    <input
                      type="text"
                      value={telemetry.land?.landUseType || ''}
                      onChange={(e) =>
                        setTelemetry((prev) => ({
                          ...prev,
                          land: { ...prev.land, landUseType: e.target.value },
                        }))
                      }
                      placeholder="e.g. monoculture wheat"
                      className="w-full bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded p-2 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  {/* Region */}
                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
                    <label className="font-medium text-slate-200 text-xs block">Geoclimatic Region</label>
                    <input
                      type="text"
                      value={telemetry.land?.region || ''}
                      onChange={(e) =>
                        setTelemetry((prev) => ({
                          ...prev,
                          land: { ...prev.land, region: e.target.value },
                        }))
                      }
                      placeholder="e.g. semi-arid"
                      className="w-full bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded p-2 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  {/* Tillage Practice */}
                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
                    <label className="font-medium text-slate-200 text-xs block">Tillage Practice</label>
                    <select
                      value={telemetry.land?.tillagePractice || 'intensive_inversion'}
                      onChange={(e) =>
                        setTelemetry((prev) => ({
                          ...prev,
                          land: { ...prev.land, tillagePractice: e.target.value as any },
                        }))
                      }
                      className="w-full bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded p-2 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="intensive_inversion">Intensive Inversion / Moldboard</option>
                      <option value="reduced">Reduced / Minimum Tillage</option>
                      <option value="no_till">Continuous Conservation No-Till</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* JSON Raw Editor (Requirement 5) */
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Edit raw JSON telemetry object to feed the AI Scientist directly:</span>
                {jsonError ? (
                  <span className="text-red-400 font-mono">Syntax Error: {jsonError}</span>
                ) : (
                  <span className="text-emerald-400 font-mono">Valid JSON Schema</span>
                )}
              </div>

              <textarea
                value={jsonText}
                onChange={(e) => handleJsonChange(e.target.value)}
                rows={16}
                className="w-full font-mono text-xs bg-slate-950 text-emerald-300 p-4 rounded-lg border border-slate-800 focus:outline-none focus:border-emerald-500"
                spellCheck={false}
              />
            </div>
          )}

          {/* Primary Assessment Action Button */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <Info className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Executes RAG semantic retrieval over 10 peer-reviewed studies and evaluates multi-metric linkages.
              </span>
            </div>

            <button
              onClick={handleRunAssessment}
              disabled={isAnalyzing}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium text-sm flex items-center space-x-2 shadow-lg shadow-emerald-950/40 disabled:opacity-50 transition"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Computing Scientific Feedback Loops...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Run Multi-Metric Assessment</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Assessment Output Display */}
      {analysisResult && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Generated Ecological Report</h3>
            <button
              onClick={() => setAnalysisResult(null)}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Dismiss</span>
            </button>
          </div>

          <AnalysisCard analysis={analysisResult} />
        </div>
      )}
    </div>
  );
};
