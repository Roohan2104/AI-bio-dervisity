import React from 'react';
import { Sprout, Database, Cpu, Compass, GitBranch, Layers, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: 'chat' | 'telemetry' | 'spatial' | 'rag' | 'nexus';
  setActiveTab: (tab: 'chat' | 'telemetry' | 'spatial' | 'rag' | 'nexus') => void;
  knowledgeBaseCount: number;
  hasGeminiKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  knowledgeBaseCount,
  hasGeminiKey,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-950/40">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white">Darukaa.Earth</span>
                <span className="text-xs px-2 py-0.5 rounded font-mono font-medium bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                  AI Scientist v2.4
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Biodiversity Intelligence & Multi-Metric Biogeochemical Reasoning
              </p>
            </div>
          </div>

          {/* Environmental Engine Status Pills */}
          <div className="hidden md:flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-slate-800/80 rounded-md border border-slate-700 text-slate-300">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>RAG Knowledge Base:</span>
              <span className="font-mono text-emerald-400 font-semibold">{knowledgeBaseCount || 10} Studies</span>
            </div>

            <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-slate-800/80 rounded-md border border-slate-700 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>Coupled Variables:</span>
              <span className="font-mono text-teal-300 font-semibold">&ge; 3 Metrics</span>
            </div>

            <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-slate-800/80 rounded-md border border-slate-700 text-slate-300">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span>Gemini 3.8:</span>
              <span className={`font-mono font-semibold ${hasGeminiKey ? 'text-emerald-400' : 'text-slate-400'}`}>
                {hasGeminiKey ? 'Online' : 'Active'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          <button
            id="tab-chat"
            onClick={() => setActiveTab('chat')}
            className={`flex items-center space-x-2 px-3.5 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'chat'
                ? 'border-emerald-400 text-emerald-300 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>AI Scientist Chat</span>
          </button>

          <button
            id="tab-telemetry"
            onClick={() => setActiveTab('telemetry')}
            className={`flex items-center space-x-2 px-3.5 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'telemetry'
                ? 'border-emerald-400 text-emerald-300 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Structured Telemetry (JSON & Form)</span>
          </button>

          <button
            id="tab-spatial"
            onClick={() => setActiveTab('spatial')}
            className={`flex items-center space-x-2 px-3.5 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'spatial'
                ? 'border-emerald-400 text-emerald-300 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Geo-Spatial Context (Bonus)</span>
          </button>

          <button
            id="tab-rag"
            onClick={() => setActiveTab('rag')}
            className={`flex items-center space-x-2 px-3.5 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'rag'
                ? 'border-emerald-400 text-emerald-300 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>RAG Knowledge Inspector</span>
          </button>

          <button
            id="tab-nexus"
            onClick={() => setActiveTab('nexus')}
            className={`flex items-center space-x-2 px-3.5 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'nexus'
                ? 'border-emerald-400 text-emerald-300 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            <span>Multi-Metric Nexus</span>
          </button>
        </div>
      </div>
    </header>
  );
};
