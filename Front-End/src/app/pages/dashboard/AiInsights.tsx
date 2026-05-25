import React from "react";
import { Bot } from "lucide-react";

interface AiInsightsProps {
  consistencyScore: number;
  aiLoading: boolean;
  aiInsights: {
    icon: any;
    text: string;
    color: string;
  }[];
}

export function AiInsights({ consistencyScore, aiLoading, aiInsights }: AiInsightsProps) {
  return (
    <div className="lg:col-span-5">
      <div className="relative h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-50" />
        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full">
          <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
            <Bot className="w-5 h-5 text-violet-400" /> AI Performance Insights
          </h2>
          <div className="mb-5">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-zinc-400">Placement Readiness</span>
              <span className="font-bold text-emerald-400">{consistencyScore}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 rounded-full transition-all duration-500" style={{ width: `${consistencyScore}%` }} />
            </div>
          </div>

          {aiLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
              <span className="ml-2 text-sm text-zinc-400">Gemini AI analyzing...</span>
            </div>
          ) : (
            <div className="space-y-3">
              {aiInsights.map(({ icon: Icon, text, color }, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${color}`} />
                  <span className="text-sm text-zinc-300">{text}</span>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-zinc-600 mt-4 text-center">
            {aiLoading ? "Analyzing your coding patterns..." : "Powered by Gemini AI"}
          </p>
        </div>
      </div>
    </div>
  );
}
