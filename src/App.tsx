import React, { useState, useEffect } from 'react';
import { FieldTelemetryInput } from './types.js';
import { BENCHMARK_PRESETS } from './data/presets.js';
import { Header } from './components/Header.js';
import { ChatView } from './components/ChatView.js';
import { TelemetryView } from './components/TelemetryView.js';
import { SpatialContextView } from './components/SpatialContextView.js';
import { RAGInspectorView } from './components/RAGInspectorView.js';
import { NexusVisualizerView } from './components/NexusVisualizerView.js';

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'telemetry' | 'spatial' | 'rag' | 'nexus'>('chat');
  
  // Default to the official hackathon benchmark
  const [telemetry, setTelemetry] = useState<FieldTelemetryInput>(
    BENCHMARK_PRESETS[0].telemetry
  );

  const [knowledgeBaseCount, setKnowledgeBaseCount] = useState<number>(10);
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.knowledgeBaseArticles) {
          setKnowledgeBaseCount(data.knowledgeBaseArticles);
        }
        if (data.hasGeminiKey !== undefined) {
          setHasGeminiKey(data.hasGeminiKey);
        }
      })
      .catch((err) => console.warn('Could not fetch server status:', err));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        knowledgeBaseCount={knowledgeBaseCount}
        hasGeminiKey={hasGeminiKey}
      />

      <main className="flex-1">
        {activeTab === 'chat' && (
          <ChatView
            telemetry={telemetry}
            setTelemetry={setTelemetry}
            onOpenTelemetry={() => setActiveTab('telemetry')}
          />
        )}

        {activeTab === 'telemetry' && (
          <TelemetryView
            telemetry={telemetry}
            setTelemetry={setTelemetry}
          />
        )}

        {activeTab === 'spatial' && (
          <SpatialContextView
            telemetry={telemetry}
            setTelemetry={setTelemetry}
            onAnalyzeWithSpatial={() => setActiveTab('chat')}
          />
        )}

        {activeTab === 'rag' && <RAGInspectorView />}

        {activeTab === 'nexus' && <NexusVisualizerView />}
      </main>
    </div>
  );
}
