import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { runAIEvaluation, evaluateInputCompleteness } from './server/aiScientist.js';
import { ragRetriever } from './server/retrieval.js';
import { FieldTelemetryInput } from './src/types.js';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Darukaa.Earth AI Biodiversity Intelligence API',
      knowledgeBaseArticles: ragRetriever.getAllStudies().length,
      knowledgeBaseChunks: ragRetriever.getAllChunks().length,
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // RAG Knowledge Base browsing endpoint
  app.get('/api/knowledge-base', (req, res) => {
    try {
      const studies = ragRetriever.getAllStudies();
      const chunks = ragRetriever.getAllChunks();
      res.json({ studies, chunks });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Dedicated RAG Retrieval Search endpoint for testing & pipeline inspection
  app.post('/api/rag/search', (req, res) => {
    try {
      const { query, telemetry, topK } = req.body;
      const results = ragRetriever.search(query || '', telemetry, topK || 4);
      res.json({
        query,
        telemetry,
        count: results.length,
        retrievedChunks: results,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Structured Multi-Metric Assessment Endpoint
  app.post('/api/analyze', async (req, res) => {
    try {
      const telemetry: FieldTelemetryInput = req.body;
      const query = telemetry.additionalNotes || `Assessment for ${telemetry.land?.landUseType || 'cropland'} in ${telemetry.land?.region || 'semi-arid'} with SOC ${telemetry.soil?.organicCarbonPercent ?? 0.3}% and rainfall ${telemetry.climate?.annualRainfallMm ?? 280}mm`;

      const analysis = await runAIEvaluation(query, telemetry, []);
      res.json(analysis);
    } catch (err: any) {
      console.error('Analysis error:', err);
      res.status(500).json({ error: err.message || 'Failed to complete scientific assessment' });
    }
  });

  // Conversational Multi-turn Chat Endpoint
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, telemetry, conversationHistory } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message text is required' });
      }

      // Check completeness
      const completeness = evaluateInputCompleteness(message, telemetry);

      if (completeness.isIncomplete && (!telemetry || Object.keys(telemetry).length === 0)) {
        return res.json({
          reply: `I am your AI Environmental Scientist. To provide a rigorous, evidence-backed biodiversity prescription, I need to evaluate the coupled biogeochemical metrics of your landscape.\n\nCould you please provide:\n${completeness.clarifyingQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`,
          isClarificationNeeded: true,
          clarifyingQuestions: completeness.clarifyingQuestions,
          missingVariables: completeness.missingVariables,
          retrievedEvidence: [],
        });
      }

      const analysis = await runAIEvaluation(message, telemetry || {}, conversationHistory || []);

      let conversationalReply = analysis.summaryDiagnosis;
      if (analysis.recommendations && analysis.recommendations.length > 0) {
        const topRecs = analysis.recommendations.slice(0, 3).map((r, i) =>
          `**${i + 1}. ${r.title}**\n- **Action:** ${r.whatToDo}\n- **Mechanism:** ${r.whyItWorks}\n- **Multi-Metric Coupling:** ${r.multiMetricLinkage}\n- **Quantified Impact:** ${r.impactedMetrics.map(m => `${m.metricName}: ${m.deltaPercent} (${m.timeHorizon})`).join('; ')}\n- **Evidence Source:** ${r.primaryReference.source} (${r.primaryReference.citation})`
        ).join('\n\n');

        conversationalReply = `${analysis.summaryDiagnosis}\n\n### Evidence-Backed Interventions:\n\n${topRecs}`;
      }

      res.json({
        reply: conversationalReply,
        analysis,
        retrievedEvidence: analysis.retrievedEvidence,
        isClarificationNeeded: false,
      });
    } catch (err: any) {
      console.error('Chat error:', err);
      res.status(500).json({ error: err.message || 'Chat evaluation failed' });
    }
  });

  // Mount Vite or static file serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Darukaa.Earth AI Biodiversity Server listening on port ${PORT}`);
  });
}

startServer();
