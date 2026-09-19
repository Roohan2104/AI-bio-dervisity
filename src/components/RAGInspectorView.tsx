import React, { useState, useEffect } from 'react';
import { KnowledgeChunk, ScientificStudy, RetrievedChunk } from '../types.js';
import {
  Database,
  Search,
  BookOpen,
  Filter,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Cpu
} from 'lucide-react';

export const RAGInspectorView: React.FC = () => {
  const [studies, setStudies] = useState<ScientificStudy[]>([]);
  const [chunks, setChunks] = useState<KnowledgeChunk[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [testQuery, setTestQuery] = useState('soil organic carbon dryland wheat low rainfall');
  const [retrievedResults, setRetrievedResults] = useState<RetrievedChunk[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [expandedStudyId, setExpandedStudyId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/knowledge-base')
      .then((res) => res.json())
      .then((data) => {
        if (data.studies) setStudies(data.studies);
        if (data.chunks) setChunks(data.chunks);
      })
      .catch((err) => console.error('Failed to load knowledge base:', err));

    // Run initial search
    handleTestSearch('soil organic carbon dryland wheat low rainfall');
  }, []);

  const handleTestSearch = async (queryToRun?: string) => {
    const q = queryToRun || testQuery;
    if (!q.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch('/api/rag/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, topK: 4 }),
      });
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setRetrievedResults(data.retrievedChunks || []);
    } catch (err) {
      console.error('RAG test search failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const filteredStudies =
    selectedCategory === 'all'
      ? studies
      : studies.filter((s) => s.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Title & Architecture Diagram Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white tracking-wide">
                RAG Knowledge System & Scientific Retrieval Pipeline
              </h2>
              <p className="text-xs text-slate-400">
                Peer-reviewed corpus indexing FAO, IPCC, IPBES, Nature, and Science empirical datasets.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <span className="px-3 py-1 rounded bg-slate-800 text-emerald-300 font-mono border border-slate-700">
              {studies.length} Indexed Studies
            </span>
            <span className="px-3 py-1 rounded bg-slate-800 text-teal-300 font-mono border border-slate-700">
              {chunks.length} Text Chunks
            </span>
            <span className="px-3 py-1 rounded bg-slate-800 text-cyan-300 font-mono border border-slate-700">
              Hybrid BM25 + Dense Vectors
            </span>
          </div>
        </div>

        {/* Pipeline Architecture Flow Graphic */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">1. Scientific Ingestion</span>
            <p className="text-slate-300 font-medium">Domain Dataset Indexing</p>
            <p className="text-[11px] text-slate-500">FAO, IPCC AR6, IPBES, Nature Ecology, Science Advances</p>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-teal-400 uppercase font-semibold">2. Multi-Metric Chunking</span>
            <p className="text-slate-300 font-medium">Biophysical Tagging</p>
            <p className="text-[11px] text-slate-500">Indexed by SOC %, pH, precipitation, trophic web, and mycorrhizae</p>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">3. Hybrid Retrieval</span>
            <p className="text-slate-300 font-medium">BM25 + Semantic Alignment</p>
            <p className="text-[11px] text-slate-500">Cosine score combined with metric overlap & empirical findings</p>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-amber-400 uppercase font-semibold">4. AI Grounding</span>
            <p className="text-slate-300 font-medium">Gemini 3.8 Flash Synthesis</p>
            <p className="text-[11px] text-slate-500">Generates quantified multi-metric prescriptions with study citations</p>
          </div>
        </div>
      </div>

      {/* Interactive RAG Retrieval Testing Console */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>Interactive RAG Pipeline Tester (Inspection Console)</span>
          </h3>
          <span className="text-xs text-slate-400">
            Real-time similarity ranking & chunk inspection
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              placeholder="Enter search query (e.g. 'Faidherbia albida hydraulic lift low rainfall semi-arid')"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            onClick={() => handleTestSearch()}
            disabled={isSearching}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium flex items-center space-x-1.5 transition"
          >
            {isSearching ? <Sparkles className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Run Query</span>
          </button>
        </div>

        {/* Quick Query Sample Chips */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="text-slate-500 self-center text-[11px]">Presets:</span>
          <button
            onClick={() => {
              const q = 'Soil organic carbon 0.3% semi-arid monoculture wheat';
              setTestQuery(q);
              handleTestSearch(q);
            }}
            className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition"
          >
            Hackathon Benchmark (SOC 0.3%, Wheat)
          </button>
          <button
            onClick={() => {
              const q = 'Faidherbia albida hydraulic lift microclimate drylands';
              setTestQuery(q);
              handleTestSearch(q);
            }}
            className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition"
          >
            Agroforestry Hydraulic Lift
          </button>
          <button
            onClick={() => {
              const q = 'glomalin arbuscular mycorrhizae macroaggregates tillage';
              setTestQuery(q);
              handleTestSearch(q);
            }}
            className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition"
          >
            Mycorrhizal Glomalin & Aggregates
          </button>
          <button
            onClick={() => {
              const q = 'beetle banks native hedgerows pollinator corridors';
              setTestQuery(q);
              handleTestSearch(q);
            }}
            className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition"
          >
            Beetle Banks & Habitat Corridors
          </button>
        </div>

        {/* Retrieved Chunks Display */}
        <div className="space-y-3 pt-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Retrieved Chunks & Relevance Ranking ({retrievedResults.length}):
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {retrievedResults.map((chunk, idx) => (
              <div
                key={chunk.id || idx}
                className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-semibold text-white block">{chunk.source}</span>
                    <span className="text-slate-400 text-[11px]">{chunk.studyTitle}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono text-[11px] shrink-0">
                    Similarity: {(chunk.similarityScore * 100).toFixed(1)}%
                  </span>
                </div>

                <p className="text-slate-300 leading-relaxed italic bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
                  "{chunk.content}"
                </p>

                <div className="text-amber-300/90 font-mono text-[11px]">
                  <strong>Quantitative Evidence:</strong> {chunk.quantitativeData}
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {chunk.matchedMetrics?.map((m, mIdx) => (
                    <span
                      key={mIdx}
                      className="px-2 py-0.5 rounded bg-slate-800 text-teal-300 text-[10px] font-mono border border-slate-700"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scientific Library Browser (Category Tabs) */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-teal-400" />
            <span>Indexed Peer-Reviewed Research Library ({filteredStudies.length})</span>
          </h3>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            {[
              { id: 'all', label: 'All Fields' },
              { id: 'soil_health', label: 'Soil Health (SOC, pH)' },
              { id: 'land_use', label: 'Land Use & Agroforestry' },
              { id: 'biodiversity', label: 'Biodiversity & Corridors' },
              { id: 'climate', label: 'Climate & Drought' },
              { id: 'human_impact', label: 'Human Impact & Salinity' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStudies.map((study) => {
            const isExpanded = expandedStudyId === study.id;
            return (
              <div
                key={study.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2.5 transition hover:border-slate-700"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-teal-400 border border-slate-700">
                      {study.category.replace('_', ' ')} &bull; {study.year}
                    </span>
                    <h4 className="text-xs font-semibold text-white mt-1.5 leading-snug">
                      {study.title}
                    </h4>
                    <p className="text-[11px] text-slate-400">{study.authors}</p>
                    <p className="text-[11px] text-emerald-400 font-medium">{study.publication}</p>
                  </div>
                </div>

                <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <strong>Key Finding:</strong> {study.keyFindings}
                </div>

                {isExpanded && (
                  <div className="pt-2 border-t border-slate-800 space-y-2 text-xs">
                    <p className="text-slate-400 italic">"{study.excerpt}"</p>
                    <div className="flex flex-wrap gap-1">
                      {study.tags?.map((t, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                  <button
                    onClick={() => setExpandedStudyId(isExpanded ? null : study.id)}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
                  >
                    <span>{isExpanded ? 'Less details' : 'Read scientific excerpt'}</span>
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  {study.doi && (
                    <span className="font-mono text-[10px] text-slate-500">
                      DOI: {study.doi}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
