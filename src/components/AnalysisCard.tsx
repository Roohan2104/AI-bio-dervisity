import React, { useState } from 'react';
import { ScientificAnalysisResult } from '../types.js';
import {
  CheckCircle2,
  TrendingUp,
  Clock,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Award,
  Link,
  Download,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';

interface AnalysisCardProps {
  analysis: ScientificAnalysisResult;
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({ analysis }) => {
  const [expandedStudies, setExpandedStudies] = useState(false);
  const [expandedRecId, setExpandedRecId] = useState<string | null>(
    analysis.recommendations?.[0]?.id || null
  );

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(analysis, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `darukaa-biodiversity-analysis-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg shadow-black/20 my-4">
      {/* Top Banner: Scientific Assessment Status */}
      <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide">
              Empirical Agroecological Diagnosis
            </h3>
            <p className="text-xs text-slate-400">
              Evaluated {new Date(analysis.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &bull; RAG Grounded &bull; Multi-Variable Linked
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportJSON}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-slate-700 transition"
            title="Download complete JSON report"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Executive Scientific Diagnosis */}
        <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800/80">
          <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Biogeochemical Diagnosis</span>
          </h4>
          <p className="text-sm text-slate-200 leading-relaxed">
            {analysis.summaryDiagnosis}
          </p>
        </div>

        {/* Multi-Metric Variable Nexus (Requirement 4: Connect >= 3 variables together) */}
        {analysis.multiMetricNexus && (
          <div className="bg-slate-950/40 p-4 rounded-lg border border-teal-900/40">
            <h4 className="text-xs font-semibold text-teal-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Link className="w-3.5 h-3.5" />
              <span>Multi-Variable Interconnection Nexus (Coupled Dynamics)</span>
            </h4>
            <p className="text-xs text-slate-300 mb-3">
              {analysis.multiMetricNexus.interactionSummary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-800/80">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Variables Evaluated Simultaneously:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.multiMetricNexus.variablesAnalyzed?.map((v, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-0.5 rounded bg-slate-800 text-teal-300 border border-teal-900/60 font-mono"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Ecological Limiting Bottlenecks:
                </span>
                <ul className="text-xs text-amber-300 space-y-1">
                  {analysis.multiMetricNexus.limitingFactors?.map((lf, i) => (
                    <li key={i} className="flex items-start space-x-1.5">
                      <AlertTriangle className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" />
                      <span>{lf}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Evidence-Backed Recommendations List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Evidence-Backed Interventions ({analysis.recommendations?.length || 0})</span>
            </h4>
            <span className="text-[11px] text-slate-400">
              Non-obvious &bull; Quantitative &bull; Peer-Reviewed
            </span>
          </div>

          <div className="space-y-3">
            {analysis.recommendations?.map((rec, index) => {
              const isExpanded = expandedRecId === rec.id;
              return (
                <div
                  key={rec.id || index}
                  className={`rounded-lg border transition-colors ${
                    isExpanded
                      ? 'bg-slate-950/90 border-emerald-600/50'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <button
                    onClick={() => setExpandedRecId(isExpanded ? null : rec.id)}
                    className="w-full text-left p-4 flex items-start justify-between gap-4 focus:outline-none"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/80 font-mono font-medium">
                          Practice {index + 1}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{rec.timeHorizon}</span>
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-teal-950/80 text-teal-300 border border-teal-800/60 font-mono">
                          Confidence: {rec.confidenceLevel} ({rec.confidenceScore}%)
                        </span>
                      </div>
                      <h5 className="text-sm font-semibold text-white group-hover:text-emerald-300">
                        {rec.title}
                      </h5>
                    </div>
                    <div className="text-slate-400 mt-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-4 border-t border-slate-800/60 pt-3">
                      {/* What to do & Why it works */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="bg-slate-900/80 p-3 rounded border border-slate-800">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 block mb-1">
                            Action Protocol (What to do):
                          </span>
                          <p className="text-slate-200 leading-relaxed">
                            {rec.whatToDo}
                          </p>
                        </div>

                        <div className="bg-slate-900/80 p-3 rounded border border-slate-800">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-400 block mb-1">
                            Scientific Reasoning (Why it works):
                          </span>
                          <p className="text-slate-200 leading-relaxed">
                            {rec.whyItWorks}
                          </p>
                        </div>
                      </div>

                      {/* Multi-Metric Linkage Statement */}
                      {rec.multiMetricLinkage && (
                        <div className="bg-emerald-950/20 border border-emerald-900/50 p-2.5 rounded text-xs">
                          <span className="font-semibold text-emerald-400 block mb-0.5">
                            Coupled Multi-Metric Cascade:
                          </span>
                          <p className="text-slate-300 font-mono text-[11px]">
                            {rec.multiMetricLinkage}
                          </p>
                        </div>
                      )}

                      {/* Impacted Environmental Metrics Table */}
                      {rec.impactedMetrics && rec.impactedMetrics.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                            <FileSpreadsheet className="w-3 h-3 text-emerald-400" />
                            <span>Quantified Projected Environmental Metrics:</span>
                          </span>

                          <div className="overflow-x-auto rounded border border-slate-800">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-semibold">
                                <tr>
                                  <th className="p-2">Metric Target</th>
                                  <th className="p-2">Baseline</th>
                                  <th className="p-2">Projected Value</th>
                                  <th className="p-2">Estimated &Delta;</th>
                                  <th className="p-2">Time Horizon</th>
                                  <th className="p-2">Biophysical Mechanism</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-800/60 bg-slate-950/40 text-slate-300">
                                {rec.impactedMetrics.map((m, mIdx) => (
                                  <tr key={mIdx} className="hover:bg-slate-900/40">
                                    <td className="p-2 font-medium text-white">{m.metricName}</td>
                                    <td className="p-2 font-mono text-slate-400">{m.baseline}</td>
                                    <td className="p-2 font-mono text-emerald-300 font-semibold">{m.projectedValue}</td>
                                    <td className="p-2 font-mono text-teal-400 font-bold">{m.deltaPercent}</td>
                                    <td className="p-2 text-slate-400">{m.timeHorizon}</td>
                                    <td className="p-2 text-slate-300 max-w-xs">{m.scientificMechanism}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Peer-Reviewed Scientific Citation */}
                      {rec.primaryReference && (
                        <div className="flex items-center justify-between text-xs bg-slate-900 p-2.5 rounded border border-slate-800 text-slate-300">
                          <div className="flex items-center space-x-2">
                            <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>
                              <strong className="text-white">Primary Citation:</strong> {rec.primaryReference.citation} ({rec.primaryReference.source})
                            </span>
                          </div>
                          {rec.primaryReference.doi && (
                            <span className="font-mono text-[11px] text-slate-400 shrink-0">
                              DOI: {rec.primaryReference.doi}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Retrievable Scientific Knowledge Layer (Requirement 1 & 3) */}
        <div className="border-t border-slate-800 pt-4">
          <button
            onClick={() => setExpandedStudies(!expandedStudies)}
            className="flex items-center justify-between w-full text-xs font-semibold text-slate-400 hover:text-slate-200 transition"
          >
            <div className="flex items-center space-x-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                Retrieved Scientific Evidence Chunks (RAG Grounding Layer &bull; {analysis.retrievedEvidence?.length || 0} studies cited)
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <span>{expandedStudies ? 'Hide Sources' : 'Inspect Retrieved Chunks'}</span>
              {expandedStudies ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </div>
          </button>

          {expandedStudies && (
            <div className="mt-3 space-y-2.5">
              {analysis.retrievedEvidence?.map((chunk, idx) => (
                <div
                  key={chunk.id || idx}
                  className="bg-slate-950 p-3 rounded-md border border-slate-800 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-emerald-300">
                      {chunk.source} &bull; {chunk.studyTitle}
                    </span>
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700">
                      RAG Similarity: {(chunk.similarityScore * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-slate-300 italic leading-relaxed">
                    "{chunk.content}"
                  </p>
                  <div className="text-[11px] text-amber-300/90 font-mono">
                    <strong>Quantitative Findings:</strong> {chunk.quantitativeData}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
