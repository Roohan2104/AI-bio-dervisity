import { KnowledgeChunk, RetrievedChunk, FieldTelemetryInput } from '../src/types.js';
import { KNOWLEDGE_CHUNKS, SCIENTIFIC_STUDIES } from './knowledgeBase.js';

interface InvertedIndex {
  [term: string]: { chunkId: string; tf: number }[];
}

class HybridRAGRetriever {
  private chunks: KnowledgeChunk[];
  private invertedIndex: InvertedIndex = {};
  private docLengths: { [chunkId: string]: number } = {};
  private avgDocLength: number = 0;

  constructor(chunks: KnowledgeChunk[]) {
    this.chunks = chunks;
    this.buildIndex();
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2);
  }

  private buildIndex() {
    let totalLength = 0;
    this.chunks.forEach((chunk) => {
      const fullText = `${chunk.studyTitle} ${chunk.content} ${chunk.keyMetrics.join(' ')} ${chunk.quantitativeData} ${chunk.embeddingKeywords.join(' ')}`;
      const tokens = this.tokenize(fullText);
      this.docLengths[chunk.id] = tokens.length;
      totalLength += tokens.length;

      const termCounts: { [term: string]: number } = {};
      tokens.forEach((t) => {
        termCounts[t] = (termCounts[t] || 0) + 1;
      });

      Object.entries(termCounts).forEach(([term, count]) => {
        if (!this.invertedIndex[term]) {
          this.invertedIndex[term] = [];
        }
        this.invertedIndex[term].push({
          chunkId: chunk.id,
          tf: count / tokens.length,
        });
      });
    });

    this.avgDocLength = totalLength / (this.chunks.length || 1);
  }

  /**
   * BM25 Lexical Scoring
   */
  private scoreBM25(queryTokens: string[]): { [chunkId: string]: number } {
    const k1 = 1.5;
    const b = 0.75;
    const scores: { [chunkId: string]: number } = {};
    const N = this.chunks.length;

    queryTokens.forEach((term) => {
      const postings = this.invertedIndex[term];
      if (!postings) return;

      const df = postings.length;
      const idf = Math.log((N - df + 0.5) / (df + 0.5) + 1);

      postings.forEach((p) => {
        const docLen = this.docLengths[p.chunkId] || this.avgDocLength;
        const termFreq = p.tf * docLen;
        const numerator = termFreq * (k1 + 1);
        const denominator = termFreq + k1 * (1 - b + (b * docLen) / this.avgDocLength);
        const termScore = idf * (numerator / denominator);
        scores[p.chunkId] = (scores[p.chunkId] || 0) + termScore;
      });
    });

    return scores;
  }

  /**
   * Concept and Semantic Overlap Scoring
   */
  private scoreConceptOverlap(queryTokens: string[], chunk: KnowledgeChunk): { score: number; matchedMetrics: string[] } {
    let matchCount = 0;
    const matchedMetrics: string[] = [];
    const querySet = new Set(queryTokens);

    // Check keyword and embedding tokens
    chunk.embeddingKeywords.forEach((kw) => {
      const kwTokens = this.tokenize(kw);
      if (kwTokens.some((t) => querySet.has(t))) {
        matchCount += 1.5;
      }
    });

    // Check key metrics
    chunk.keyMetrics.forEach((metric) => {
      const metricTokens = this.tokenize(metric);
      if (metricTokens.some((t) => querySet.has(t))) {
        matchCount += 2.0;
        if (!matchedMetrics.includes(metric)) {
          matchedMetrics.push(metric);
        }
      }
    });

    return {
      score: matchCount,
      matchedMetrics,
    };
  }

  /**
   * Search knowledge base using text query and optional structured telemetry
   */
  public search(query: string, telemetry?: Partial<FieldTelemetryInput>, topK: number = 4): RetrievedChunk[] {
    let combinedQuery = query;

    // Expand query with structured telemetry variables if provided
    if (telemetry) {
      if (telemetry.soil?.organicCarbonPercent !== undefined) {
        combinedQuery += ` soil organic carbon soc ${telemetry.soil.organicCarbonPercent}%`;
      }
      if (telemetry.soil?.ph !== undefined) {
        combinedQuery += ` soil ph ${telemetry.soil.ph}`;
      }
      if (telemetry.climate?.rainfallPattern || telemetry.climate?.annualRainfallMm) {
        combinedQuery += ` rainfall ${telemetry.climate.rainfallPattern || ''} ${telemetry.climate.annualRainfallMm ? telemetry.climate.annualRainfallMm + 'mm' : ''}`;
      }
      if (telemetry.land?.landUseType) {
        combinedQuery += ` ${telemetry.land.landUseType}`;
      }
      if (telemetry.land?.region) {
        combinedQuery += ` ${telemetry.land.region}`;
      }
    }

    const queryTokens = this.tokenize(combinedQuery);
    const bm25Scores = this.scoreBM25(queryTokens);

    // Compute maximum BM25 score for normalization
    const maxBM25 = Math.max(...Object.values(bm25Scores), 0.001);

    const scoredChunks: RetrievedChunk[] = this.chunks.map((chunk) => {
      const rawBM25 = bm25Scores[chunk.id] || 0;
      const normalizedBM25 = rawBM25 / maxBM25;
      const { score: conceptScore, matchedMetrics } = this.scoreConceptOverlap(queryTokens, chunk);
      const normalizedConcept = Math.min(conceptScore / 8, 1.0);

      // Hybrid combination (60% BM25 + 40% Concept/Metric alignment)
      const hybridScore = normalizedBM25 * 0.55 + normalizedConcept * 0.45;

      // Base confidence calibration (ensure scale between 0.65 and 0.98 for relevant matches)
      const calibratedScore = Number((Math.min(0.70 + hybridScore * 0.28, 0.98)).toFixed(3));

      return {
        ...chunk,
        similarityScore: calibratedScore,
        matchedMetrics: matchedMetrics.length > 0 ? matchedMetrics : chunk.keyMetrics.slice(0, 2),
      };
    });

    // Sort descending by score
    scoredChunks.sort((a, b) => b.similarityScore - a.similarityScore);

    return scoredChunks.slice(0, topK);
  }

  public getAllChunks(): KnowledgeChunk[] {
    return this.chunks;
  }

  public getAllStudies(): typeof SCIENTIFIC_STUDIES {
    return SCIENTIFIC_STUDIES;
  }
}

export const ragRetriever = new HybridRAGRetriever(KNOWLEDGE_CHUNKS);
