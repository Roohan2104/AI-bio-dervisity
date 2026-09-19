export interface ScientificStudy {
  id: string;
  title: string;
  authors: string;
  publication: string;
  year: number;
  doi?: string;
  category: 'soil_health' | 'land_use' | 'biodiversity' | 'climate' | 'human_impact';
  keyFindings: string;
  metrics: string[];
  excerpt: string;
  tags: string[];
}

export interface KnowledgeChunk {
  id: string;
  studyId: string;
  studyTitle: string;
  source: string;
  category: string;
  content: string;
  keyMetrics: string[];
  quantitativeData: string;
  embeddingKeywords: string[];
}

export interface RetrievedChunk extends KnowledgeChunk {
  similarityScore: number;
  matchedMetrics: string[];
}

export interface SoilMetrics {
  organicCarbonPercent: number; // e.g. 0.3%
  ph: number; // e.g. 7.8
  moisturePercent?: number; // e.g. 14%
  bulkDensityGPerCm3?: number; // e.g. 1.55 g/cm3
  microbialBiomassC?: number; // mg/kg
}

export interface ClimateMetrics {
  annualRainfallMm: number; // e.g. 280 mm
  rainfallPattern: 'low' | 'moderate' | 'high' | 'erratic_seasonal' | 'arid_bimodal';
  meanTempC: number; // e.g. 24 C
  aridityIndex?: number; // P/PET
}

export interface LandMetrics {
  landUseType: string; // e.g. 'monoculture wheat'
  region: string; // e.g. 'semi-arid'
  tillagePractice?: 'intensive_inversion' | 'reduced' | 'no_till';
  chemicalInputs?: 'high_synthetic' | 'moderate' | 'low_organic';
  habitatConnectivityPercent?: number;
  fieldSizeHectares?: number;
}

export interface GeoSpatialContext {
  latitude: number;
  longitude: number;
  locationName: string;
  biome: string;
  soilOrder: string;
  vulnerabilityStatus: string;
}

export interface FieldTelemetryInput {
  soil: SoilMetrics;
  climate: ClimateMetrics;
  land: LandMetrics;
  geo?: GeoSpatialContext;
  additionalNotes?: string;
}

export interface ImpactMetric {
  metricName: string;
  baseline: string;
  projectedValue: string;
  deltaPercent: string;
  timeHorizon: 'short_term (0-6 mo)' | 'medium_term (1-3 yr)' | 'long_term (3-7 yr)';
  scientificMechanism: string;
  confidenceScore: number; // 0 - 100
}

export interface Recommendation {
  id: string;
  title: string;
  whatToDo: string;
  whyItWorks: string; // scientific reasoning
  impactedMetrics: ImpactMetric[];
  timeHorizon: 'Short-term (0-6 months)' | 'Medium-term (1-3 years)' | 'Long-term (3-7 years)';
  confidenceLevel: 'Very High (90-98%)' | 'High (80-89%)' | 'Moderate (65-79%)';
  confidenceScore: number;
  multiMetricLinkage: string; // connecting >= 3 variables
  primaryReference: {
    source: string;
    citation: string;
    doi?: string;
  };
}

export interface ScientificAnalysisResult {
  id: string;
  timestamp: string;
  summaryDiagnosis: string;
  multiMetricNexus: {
    variablesAnalyzed: string[];
    interactionSummary: string;
    limitingFactors: string[];
  };
  recommendations: Recommendation[];
  clarifyingQuestions?: string[];
  isClarificationNeeded: boolean;
  retrievedEvidence: RetrievedChunk[];
  citedStudies: {
    title: string;
    source: string;
    relevance: string;
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  structuredTelemetry?: Partial<FieldTelemetryInput>;
  analysis?: ScientificAnalysisResult;
  clarifyingQuestions?: string[];
  retrievedChunks?: RetrievedChunk[];
}
