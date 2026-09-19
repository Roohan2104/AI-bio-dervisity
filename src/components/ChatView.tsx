import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, FieldTelemetryInput } from '../types.js';
import { AnalysisCard } from './AnalysisCard.js';
import {
  Send,
  HelpCircle,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  RotateCcw,
  Check,
  AlertCircle
} from 'lucide-react';

interface ChatViewProps {
  telemetry: FieldTelemetryInput;
  setTelemetry: React.Dispatch<React.SetStateAction<FieldTelemetryInput>>;
  onOpenTelemetry: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  telemetry,
  setTelemetry,
  onOpenTelemetry,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      timestamp: new Date().toISOString(),
      text: "Welcome to the Darukaa.Earth AI Biodiversity Intelligence Platform. I am an AI Environmental Scientist specializing in dryland agroecology, soil biogeochemistry, and multi-metric ecosystem restoration.\n\nTo provide non-obvious, scientifically grounded interventions backed by peer-reviewed studies (FAO, IPCC, IPBES), I evaluate coupled environmental metrics—including Soil Organic Carbon (SOC %), rainfall regimes, pH, and crop history.\n\nHow can I analyze your landscape today?",
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || inputValue.trim();
    if (!messageText || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toISOString(),
      text: messageText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Build conversation history
      const history = messages.map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          telemetry,
          conversationHistory: history,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        text: data.reply || 'Scientific evaluation formulated.',
        analysis: data.analysis,
        clarifyingQuestions: data.clarifyingQuestions,
        retrievedChunks: data.retrievedEvidence,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Error during chat query:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toISOString(),
          text: `An error occurred while evaluating scientific models: ${err.message}. Please check that the server is operational.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyPresetAndSend = (presetQuery: string, presetTelemetry?: Partial<FieldTelemetryInput>) => {
    if (presetTelemetry) {
      setTelemetry((prev) => ({
        ...prev,
        ...presetTelemetry,
        soil: { ...prev.soil, ...(presetTelemetry.soil || {}) },
        climate: { ...prev.climate, ...(presetTelemetry.climate || {}) },
        land: { ...prev.land, ...(presetTelemetry.land || {}) },
      }));
    }
    handleSendMessage(presetQuery);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        text: 'Session reset. Provide field telemetry or describe your ecosystem conditions to begin a new scientific evaluation.',
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-slate-950">
      {/* Top Controls & Current Telemetry Indicator */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-slate-400">Coupled Context:</span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-300 font-mono border border-slate-700">
            SOC: {telemetry.soil?.organicCarbonPercent}%
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-teal-300 font-mono border border-slate-700">
            Rain: {telemetry.climate?.annualRainfallMm}mm
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono border border-slate-700">
            Crop: {telemetry.land?.landUseType}
          </span>
          <button
            onClick={onOpenTelemetry}
            className="text-xs text-emerald-400 hover:text-emerald-300 underline font-medium ml-1"
          >
            Edit Parameters
          </button>
        </div>

        <button
          onClick={handleClearHistory}
          className="flex items-center space-x-1 text-slate-400 hover:text-slate-200 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold ${
                  isUser
                    ? 'bg-slate-700 text-slate-200'
                    : 'bg-gradient-to-tr from-emerald-600 to-teal-800 text-white shadow-sm'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Content Bubble */}
              <div className={`max-w-3xl space-y-2 ${isUser ? 'items-end' : ''}`}>
                <div
                  className={`p-4 rounded-xl text-sm leading-relaxed ${
                    isUser
                      ? 'bg-emerald-900/60 text-slate-100 border border-emerald-700/50 rounded-tr-none'
                      : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Clarifying Questions Box (if user inquiry was incomplete) */}
                  {msg.clarifyingQuestions && msg.clarifyingQuestions.length > 0 && (
                    <div className="mt-4 p-3.5 bg-amber-950/30 border border-amber-800/60 rounded-lg space-y-2.5">
                      <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>Clarifying Parameters Required for Scientific Evaluation:</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        To compute accurate biological feedbacks and avoid superficial advice, please provide these 3 core variables:
                      </p>
                      <ul className="text-xs text-amber-200/90 space-y-1 pl-4 list-decimal">
                        {msg.clarifyingQuestions.map((q, qIdx) => (
                          <li key={qIdx}>{q}</li>
                        ))}
                      </ul>

                      <div className="pt-2 flex flex-wrap gap-2">
                        <button
                          onClick={() =>
                            handleApplyPresetAndSend(
                              'Here is my field data: Soil organic carbon is 0.3%, rainfall is low (280mm/year), current crop is continuous monoculture wheat in a semi-arid region.',
                              {
                                soil: { organicCarbonPercent: 0.3, ph: 7.8 },
                                climate: { annualRainfallMm: 280, rainfallPattern: 'low', meanTempC: 24 },
                                land: { landUseType: 'monoculture wheat', region: 'semi-arid' },
                              }
                            )
                          }
                          className="px-2.5 py-1 text-xs rounded bg-amber-900/60 hover:bg-amber-800 text-amber-100 border border-amber-700 flex items-center space-x-1 font-medium transition"
                        >
                          <Check className="w-3 h-3" />
                          <span>Supply Hackathon Benchmark Metrics (0.3% SOC, Semi-Arid Wheat)</span>
                        </button>

                        <button
                          onClick={onOpenTelemetry}
                          className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition"
                        >
                          Open Parameter Sliders
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Embedded Scientific Analysis Report Card */}
                {msg.analysis && <AnalysisCard analysis={msg.analysis} />}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-800 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl rounded-tl-none text-sm text-slate-300 space-y-2 max-w-md">
              <div className="flex items-center space-x-2 text-emerald-400 font-medium text-xs">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>Consulting RAG Knowledge Base & Synthesizing Multi-Metric Model...</span>
              </div>
              <p className="text-xs text-slate-400">
                Retrieving FAO, IPCC, and Nature studies &bull; Coupling soil, hydrological, and biodiversity parameters.
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="bg-slate-900/60 border-t border-slate-800/80 px-4 py-2 overflow-x-auto scrollbar-none flex items-center space-x-2 text-xs">
        <span className="text-slate-400 font-medium shrink-0 flex items-center space-x-1">
          <HelpCircle className="w-3 h-3 text-emerald-400" />
          <span>Quick Scenarios:</span>
        </span>

        <button
          onClick={() =>
            handleApplyPresetAndSend(
              'Analyze my land: Soil organic carbon is 0.3%, rainfall is low (280mm), crop is monoculture wheat in a semi-arid zone. What non-obvious evidence-backed interventions will restore biodiversity?',
              {
                soil: { organicCarbonPercent: 0.3, ph: 7.8 },
                climate: { annualRainfallMm: 280, rainfallPattern: 'low', meanTempC: 24 },
                land: { landUseType: 'monoculture wheat', region: 'semi-arid' },
              }
            )
          }
          className="px-2.5 py-1 rounded-full bg-emerald-950/70 text-emerald-300 border border-emerald-800/80 hover:bg-emerald-900 whitespace-nowrap transition"
        >
          Hackathon Benchmark: Semi-Arid Monoculture Wheat
        </button>

        <button
          onClick={() => handleSendMessage('Biodiversity is declining on my land')}
          className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 whitespace-nowrap transition"
        >
          Clarifying Test: "Biodiversity is declining on my land"
        </button>

        <button
          onClick={() =>
            handleApplyPresetAndSend(
              'How does soil compaction and excessive synthetic nitrogen in corn-soy rotations cause pest outbreaks and pollinator collapse?',
              {
                soil: { organicCarbonPercent: 1.8, ph: 6.4 },
                climate: { annualRainfallMm: 890, rainfallPattern: 'moderate', meanTempC: 14 },
                land: { landUseType: 'continuous corn-soy rotation', region: 'temperate continental' },
              }
            )
          }
          className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 whitespace-nowrap transition"
        >
          Pesticide & Compaction Trophic Cascades
        </button>

        <button
          onClick={() =>
            handleApplyPresetAndSend(
              'What phytoremediation interventions restore soil health and insect corridors in salinized arid lands with pH 8.4 and EC > 5 dS/m?',
              {
                soil: { organicCarbonPercent: 0.45, ph: 8.4 },
                climate: { annualRainfallMm: 160, rainfallPattern: 'low', meanTempC: 29 },
                land: { landUseType: 'flood-irrigated olive orchard', region: 'hyper-arid basin' },
              }
            )
          }
          className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 whitespace-nowrap transition"
        >
          Secondary Salinization & Halophytes
        </button>
      </div>

      {/* Input Message Box */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2 max-w-5xl mx-auto"
        >
          <input
            id="chat-input-field"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask your AI Environmental Scientist (e.g. 'Can Faidherbia albida reverse hydraulic drought in semi-arid wheat?')"
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            disabled={isLoading}
          />
          <button
            id="chat-send-btn"
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg font-medium text-sm flex items-center space-x-1.5 transition shadow-sm"
          >
            <span>Ask Scientist</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
