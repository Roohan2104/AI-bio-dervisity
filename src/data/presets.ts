import { FieldTelemetryInput } from '../types.js';

export interface BenchmarkPreset {
  id: string;
  name: string;
  description: string;
  badge: string;
  telemetry: FieldTelemetryInput;
}

export const BENCHMARK_PRESETS: BenchmarkPreset[] = [
  {
    id: 'hackathon-benchmark',
    name: 'Hackathon Official Benchmark',
    description: 'The exact test case from the Darukaa.Earth challenge specification: 0.3% SOC, low rainfall, monoculture wheat in semi-arid region.',
    badge: 'Official Case',
    telemetry: {
      soil: {
        organicCarbonPercent: 0.3,
        ph: 7.8,
        moisturePercent: 12,
        bulkDensityGPerCm3: 1.58,
        microbialBiomassC: 110,
      },
      climate: {
        annualRainfallMm: 280,
        rainfallPattern: 'low',
        meanTempC: 25,
        aridityIndex: 0.22,
      },
      land: {
        landUseType: 'monoculture wheat',
        region: 'semi-arid',
        tillagePractice: 'intensive_inversion',
        chemicalInputs: 'high_synthetic',
        habitatConnectivityPercent: 12,
        fieldSizeHectares: 120,
      },
      geo: {
        latitude: 31.85,
        longitude: 35.45,
        locationName: 'Judean / Semi-Arid Dryland Matrix',
        biome: 'Mediterranean / Semi-Arid Steppe',
        soilOrder: 'Aridisols / Calcisols',
        vulnerabilityStatus: 'Critical Desertification Threat',
      },
      additionalNotes: 'Continuous wheat monoculture for 18 years. Severe crusting after rare rain events and declining yield despite high nitrogen fertilizer application.',
    },
  },
  {
    id: 'degraded-tropical-pasture',
    name: 'Degraded Tropical Cattle Pasture',
    description: 'Compacted oxisol soils under extensive Brachiaria monoculture with high seasonal rainfall and low faunal diversity.',
    badge: 'Savanna / Pasture',
    telemetry: {
      soil: {
        organicCarbonPercent: 1.1,
        ph: 5.2,
        moisturePercent: 24,
        bulkDensityGPerCm3: 1.62,
        microbialBiomassC: 180,
      },
      climate: {
        annualRainfallMm: 1350,
        rainfallPattern: 'erratic_seasonal',
        meanTempC: 28,
        aridityIndex: 0.75,
      },
      land: {
        landUseType: 'degraded brachiaria pasture',
        region: 'tropical savanna',
        tillagePractice: 'reduced',
        chemicalInputs: 'low_organic',
        habitatConnectivityPercent: 25,
        fieldSizeHectares: 350,
      },
      geo: {
        latitude: -14.23,
        longitude: -51.92,
        locationName: 'Cerrado Transition Zone',
        biome: 'Tropical Savanna / Woodland Mosaic',
        soilOrder: 'Oxisols (Ferralsols)',
        vulnerabilityStatus: 'Severe Soil Compaction & Termite Dominance',
      },
      additionalNotes: 'Severe hoof compaction, sheet runoff during convective storms, unpalatable weed encroachment.',
    },
  },
  {
    id: 'intensive-corn-soy',
    name: 'Intensive Temperate Corn-Soy Belt',
    description: 'High chemical inputs, prophylactic neonicotinoid treatment, and tile-drained soil with severe microarthropod collapse.',
    badge: 'Industrial Grain',
    telemetry: {
      soil: {
        organicCarbonPercent: 1.8,
        ph: 6.4,
        moisturePercent: 32,
        bulkDensityGPerCm3: 1.48,
        microbialBiomassC: 240,
      },
      climate: {
        annualRainfallMm: 890,
        rainfallPattern: 'moderate',
        meanTempC: 14,
        aridityIndex: 0.88,
      },
      land: {
        landUseType: 'continuous corn-soy rotation',
        region: 'temperate continental',
        tillagePractice: 'intensive_inversion',
        chemicalInputs: 'high_synthetic',
        habitatConnectivityPercent: 8,
        fieldSizeHectares: 240,
      },
      geo: {
        latitude: 41.58,
        longitude: -93.62,
        locationName: 'Midwestern Prairie Corn Belt',
        biome: 'Temperate Grassland / Cropland Matrix',
        soilOrder: 'Mollisols',
        vulnerabilityStatus: 'Extreme Floral Homogeneity & Nitrate Runoff',
      },
      additionalNotes: 'Tile drains discharging nitrates into watercourses. Zero native pollinator habitat within 1.5km.',
    },
  },
  {
    id: 'arid-salinized-orchard',
    name: 'Salinized Arid Date & Olive Matrix',
    description: 'Secondary salinization from brackish borehole irrigation with pH > 8.3 and severe osmotic shock.',
    badge: 'Salinity / Arid',
    telemetry: {
      soil: {
        organicCarbonPercent: 0.45,
        ph: 8.4,
        moisturePercent: 9,
        bulkDensityGPerCm3: 1.65,
        microbialBiomassC: 85,
      },
      climate: {
        annualRainfallMm: 160,
        rainfallPattern: 'low',
        meanTempC: 29,
        aridityIndex: 0.12,
      },
      land: {
        landUseType: 'flood-irrigated olive orchard',
        region: 'hyper-arid basin',
        tillagePractice: 'intensive_inversion',
        chemicalInputs: 'high_synthetic',
        habitatConnectivityPercent: 15,
        fieldSizeHectares: 80,
      },
      geo: {
        latitude: 33.88,
        longitude: 9.53,
        locationName: 'North African Pre-Saharan Oasis Periphery',
        biome: 'Arid Desert / Steppe Margin',
        soilOrder: 'Solonchaks / Aridisols',
        vulnerabilityStatus: 'Severe Secondary Salinization (EC 6.8 dS/m)',
      },
      additionalNotes: 'White salt crusts forming on soil surface. Tree leaf necrosis and death of natural soil microfauna.',
    },
  },
];
