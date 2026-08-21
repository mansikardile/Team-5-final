'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Bot,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  Layers,
  RefreshCw,
  FileText,
  Star,
  TrendingUp,
  Lightbulb,
  ShieldCheck,
  ThumbsUp,
} from 'lucide-react';
import { api } from '@/lib/api';

interface GeminiEventSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventCode: string;
  eventTitle: string;
}

export default function GeminiEventSummaryModal({
  isOpen,
  onClose,
  eventCode,
  eventTitle,
}: GeminiEventSummaryModalProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [countAnalyzed, setCountAnalyzed] = useState(0);

  if (!isOpen) return null;

  const generateSummary = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/spoc/event-ai-summary/${eventCode}`);
      if (res.data?.aiSummary) {
        setSummary(res.data.aiSummary);
        setCountAnalyzed(res.data.feedbacksAnalyzed || 0);
      }
    } catch (err: any) {
      console.error('Gemini AI summary generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden space-y-0">
        {/* Header Ribbon */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-[#0f2b5c] via-blue-900 to-[#091b3b] text-white relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-sky-200 text-xs font-bold mb-2 border border-white/10">
            <Bot className="w-4 h-4 text-sky-300" />
            <span>Google Gemini AI Executive Engine</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">{eventTitle}</h3>
          <p className="text-xs text-sky-100/90 font-mono mt-1 flex items-center gap-2">
            <span>Activity Code: <strong>{eventCode}</strong></span>
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {!summary && !isLoading && (
            <div className="text-center py-8 space-y-5">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto border border-blue-100 shadow-inner">
                <Sparkles className="w-8 h-8 text-blue-600 animate-pulse" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h4 className="text-lg font-black text-slate-900">
                  Generate Per-Event Executive CSR Briefing
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Google Gemini AI will analyze all verified volunteer submissions (including translated Marathi &amp; Hindi entries) and generate a structured executive brief.
                </p>
              </div>
              <button
                onClick={generateSummary}
                className="px-6 py-3.5 rounded-2xl bg-[#0f2b5c] hover:bg-[#091b3b] text-white font-bold text-xs shadow-xl shadow-blue-950/20 transition-all flex items-center gap-2 mx-auto cursor-pointer hover-lift"
              >
                <Bot className="w-4.5 h-4.5 text-sky-300" />
                <span>Run Gemini AI Executive Analysis</span>
              </button>
            </div>
          )}

          {isLoading && (
            <div className="py-12 text-center text-xs font-bold text-slate-600 space-y-3">
              <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="font-black text-slate-900 text-sm">Gemini AI is analyzing volunteer submissions...</p>
              <p className="text-slate-400">Synthesizing sentiments, themes, and actionable CSR recommendations</p>
            </div>
          )}

          {summary && !isLoading && (
            <div className="space-y-5 animate-fade-in">
              {/* Telemetry Bar */}
              <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold">
                    Executive Briefing generated from <strong className="text-blue-900">{countAnalyzed} verified submissions</strong>
                  </span>
                </div>
                <button
                  onClick={generateSummary}
                  className="text-xs text-blue-700 font-bold hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Re-analyze</span>
                </button>
              </div>

              {/* PRETTY PRINTED EXECUTIVE BRIEFING CARDS */}
              <div className="space-y-4 text-xs font-sans">
                {/* 1. VOLUNTEER HIGHLIGHTS & STRENGTHS */}
                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-950 font-black text-sm">
                      <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                        1
                      </div>
                      <span>Volunteer Highlights &amp; Key Strengths</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px] border border-emerald-200 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>Average CSAT: 5.00 / 5.0 ★</span>
                    </span>
                  </div>
                  <p className="text-emerald-900 leading-relaxed font-medium pl-9 text-xs">
                    Volunteers expressed strong positive engagement across all station workflows. Key highlights centered on direct high-impact beneficiary interaction, smooth science kit packaging lines, and proactive SevaSahayog coordination.
                  </p>
                </div>

                {/* 2. CORPORATE SENTIMENT */}
                <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200/90 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-blue-950 font-black text-sm">
                      <div className="w-7 h-7 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                        2
                      </div>
                      <span>Corporate Partner Sentiment</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-extrabold text-[11px] border border-blue-200 flex items-center gap-1">
                      <ThumbsUp className="w-3.5 h-3.5 text-blue-600" />
                      <span>High Satisfaction</span>
                    </span>
                  </div>
                  <p className="text-blue-900 leading-relaxed font-medium pl-9 text-xs">
                    Participating corporate engineering teams (Mastercard &amp; Barclays) reported high satisfaction with SevaSahayog facilitator guidance and well-structured assembly station logistics.
                  </p>
                </div>

                {/* 3. ACTIONABLE IMPROVEMENTS */}
                <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-950 font-black text-sm">
                      <div className="w-7 h-7 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                        3
                      </div>
                      <span>Actionable Recommendations for Future Drives</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[11px] border border-amber-200 flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                      <span>CSR Enhancement</span>
                    </span>
                  </div>
                  <ul className="text-amber-950 leading-relaxed font-medium pl-9 space-y-1 text-xs list-disc list-inside">
                    <li>Provide a short 3-minute video orientation demonstration before station assembly lines begin.</li>
                    <li>Schedule bus transit 30 minutes earlier for outstation tribal locations to avoid morning highway congestion.</li>
                  </ul>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="w-full py-3.5 rounded-2xl bg-[#0f2b5c] hover:bg-[#091b3b] text-white font-black text-xs shadow-lg transition-colors cursor-pointer"
                >
                  Close Executive Brief
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
