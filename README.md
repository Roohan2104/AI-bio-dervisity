# Darukaa.Earth — AI Biodiversity Intelligence Platform

An AI-powered environmental science platform featuring a retrievable scientific knowledge base (RAG), multi-metric biogeochemical reasoning, and evidence-backed ecological interventions.

## Overview

Darukaa.Earth is built for the **Darukaa.Earth AI Biodiversity Intelligence Challenge**. Rather than behaving as a generic conversational chatbot, it functions as an empirical **AI Environmental Scientist** capable of diagnosing agroecosystems, coupling multiple biophysical variables, retrieving evidence from peer-reviewed scientific literature, and generating quantified, non-obvious restoration prescriptions.

---

## Core Capabilities

1. **Retrievable Scientific Knowledge Base (RAG Layer)**:
   - Indexes peer-reviewed studies and institutional reports (FAO, IPCC AR6, IPBES, Nature Ecology & Evolution, Science Advances).
   - Domain-chunked by Soil Health, Land Use, Biodiversity Indicators, Climate & Hydrology, and Human Disturbance Pressures.
   - Hybrid BM25 lexical ranking and multi-metric overlap scoring with transparent similarity scores and chunk inspection.

2. **AI Environmental Scientist**:
   - Evaluates multi-turn queries using Gemini with structured domain grounding.
   - Detects ambiguous or incomplete baseline parameters (e.g. *"Biodiversity is declining on my land"*) and prompts for critical missing metrics (SOC %, rainfall, land use history) before prescribing interventions.
   - Generates non-obvious, concrete interventions (e.g. reverse-phenology *Faidherbia albida* agroforestry, legume strip polycultures with arbuscular mycorrhizae, native beetle banks).
   - Supplies quantified projected metrics, estimated $\Delta\%$, time horizons (Short: 0–6 mo, Medium: 1–3 yr, Long: 3–7 yr), and confidence ratings.

3. **Multi-Metric Ecological Nexus (Coupled Variables)**:
   - Evaluates $\ge 3$ coupled variables simultaneously: *Soil Organic Carbon $\leftrightarrow$ Water Infiltration / Hydraulic Lift $\leftrightarrow$ Mycorrhizal Aggregation $\leftrightarrow$ Epigeal Invertebrate & Pollinator Diversity*.
   - Includes an interactive real-time multi-variable feedback simulator.

4. **Multi-Modal Input Support**:
   - **Interactive Chat**: Natural dialogue with pre-built scientific scenario chips.
   - **Structured Telemetry (Form & JSON)**: Interactive parameter sliders and raw JSON console with schema validation.
   - **Benchmark Presets**: One-click loading of the official Hackathon benchmark (0.3% SOC, 280mm rainfall, monoculture wheat, semi-arid).
   - **Geo-Spatial Context**: Coordinate mapping with biomes, USDA/FAO soil orders, and aridity index calculations.

5. **Transparency & Portability**:
   - **RAG Knowledge Inspector**: Inspect indexed studies, search similarity scores, and review DOIs.
   - **Export Report**: Download full diagnostic assessments in structured JSON.

---

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **Backend / API**: Express, Node.js (`tsx` in development, bundled with `esbuild` for production)
- **AI & RAG**: Google Gen AI SDK (`@google/genai`), server-side RAG indexing & hybrid retrieval pipeline

---

## Local Development & Setup

### Prerequisites
- Node.js 18+ (Node 20+ recommended)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>

# Install dependencies
npm install
```

### Environment Configuration

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Add your Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Running the Application

```bash
# Start the full-stack development server (Express + Vite on port 3000)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

---

## License

MIT License. Designed for ecological restoration and biodiversity research.
