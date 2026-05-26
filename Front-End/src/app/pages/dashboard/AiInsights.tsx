// import React from "react";
// import { Bot } from "lucide-react";

// interface AiInsightsProps {
//   consistencyScore: number;
//   aiLoading: boolean;
//   aiInsights: {
//     icon: any;
//     text: string;
//     color: string;
//   }[];
// }

// export function AiInsights({ consistencyScore, aiLoading, aiInsights }: AiInsightsProps) {
//   return (
//     <div className="lg:col-span-5">
//       <div className="relative h-full">
//         <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-50" />
//         <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full">
//           <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
//             <Bot className="w-5 h-5 text-violet-400" /> AI Performance Insights
//           </h2>
//           <div className="mb-5">
//             <div className="flex items-center justify-between text-sm mb-2">
//               <span className="text-zinc-400">Placement Readiness</span>
//               <span className="font-bold text-emerald-400">{consistencyScore}%</span>
//             </div>
//             <div className="h-2 bg-white/5 rounded-full overflow-hidden">
//               <div className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 rounded-full transition-all duration-500" style={{ width: `${consistencyScore}%` }} />
//             </div>
//           </div>

//           {aiLoading ? (
//             <div className="flex items-center justify-center py-8">
//               <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
//               <span className="ml-2 text-sm text-zinc-400">Gemini AI analyzing...</span>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {aiInsights.map(({ icon: Icon, text, color }, idx) => (
//                 <div key={idx} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
//                   <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${color}`} />
//                   <span className="text-sm text-zinc-300">{text}</span>
//                 </div>
//               ))}
//             </div>
//           )}

//           <p className="text-xs text-zinc-600 mt-4 text-center">
//             {aiLoading ? "Analyzing your coding patterns..." : "Powered by Gemini AI"}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }


import React from "react";
import { Bot, Lock, CheckCircle2 } from "lucide-react";

interface AiInsightsProps {
  isUnlocked: boolean;
  aiLoading: boolean;
  aiData?: {
    platform: string;
    accepted: boolean;
    problemName: string;
    topic: string;
    difficulty: string;
    recommendation: string;
    motivationLine: string;
  };
}

export function AiInsights({
  isUnlocked,
  aiLoading,
  aiData,
}: AiInsightsProps) {
  return (
    <div className="lg:col-span-5">
      <div className="relative h-full">
        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-2xl blur-2xl opacity-40" />

        {/* Main Card */}
        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 overflow-hidden">

          {/* Header */}
          <div className="flex items-center gap-2 mb-5">
            <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-violet-400" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">
                AI Proof Analysis
              </h2>

              <p className="text-xs text-zinc-500">
                Today's coding proof intelligence
              </p>
            </div>
          </div>

          {/* LOADING STATE */}
          {aiLoading ? (
            <div className="flex flex-col items-center justify-center py-14">
              <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mb-4" />

              <p className="text-sm text-zinc-300 font-medium">
                Gemini AI verifying proof...
              </p>

              <p className="text-xs text-zinc-500 mt-1">
                Analyzing screenshot submission
              </p>
            </div>
          ) : !isUnlocked ? (
            /* LOCKED STATE */
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5">

              {/* Blur Preview Background */}
              <div className="absolute inset-0 opacity-20 blur-md pointer-events-none">
                <div className="space-y-3">
                  <div className="h-4 bg-violet-500/30 rounded w-3/4" />
                  <div className="h-4 bg-white/10 rounded w-1/2" />
                  <div className="h-4 bg-emerald-500/20 rounded w-2/3" />
                  <div className="h-4 bg-white/10 rounded w-1/3" />
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4">
                  <Lock className="w-5 h-5 text-violet-400" />
                </div>

                <h3 className="text-white font-semibold text-lg mb-3">
                  Unlock Today's AI Analysis
                </h3>

                <div className="space-y-2 text-sm text-zinc-400">
                  <p>• Topic analysis</p>
                  <p>• Difficulty tracking</p>
                  <p>• Smart recommendations</p>
                  <p>• Placement progress insights</p>
                </div>

                <div className="mt-5 p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
                  <p className="text-xs text-violet-300">
                    Upload today's coding proof to unlock personalized AI insights.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* UNLOCKED STATE */
            <div className="space-y-5">

              {/* Verification */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />

                <div>
                  <p className="text-sm font-semibold text-emerald-300">
                    Accepted {aiData?.platform} submission detected
                  </p>

                  <p className="text-xs text-zinc-500 mt-1">
                    AI successfully verified today's coding proof
                  </p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <div className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-medium text-violet-300">
                  {aiData?.platform?.toUpperCase()}
                </div>

                <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-medium text-cyan-300">
                  {aiData?.topic?.toUpperCase()}
                </div>

                <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-300">
                  {aiData?.difficulty?.toUpperCase()}
                </div>
              </div>

              {/* Problem Name */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
                  Problem
                </p>

                <h3 className="text-white font-semibold text-lg">
                  {aiData?.problemName}
                </h3>
              </div>

              {/* Recommendation */}
              <div className="p-4 rounded-2xl bg-violet-500/10 border border-violet-500/20">
                <p className="text-xs uppercase tracking-wide text-violet-300 mb-2">
                  Next Step
                </p>

                <p className="text-sm text-zinc-200 leading-relaxed">
                  {aiData?.recommendation}
                </p>
              </div>

              {/* Motivation */}
              <div className="pt-2 border-t border-white/5">
                <p className="text-xs italic text-zinc-500">
                  "{aiData?.motivationLine}"
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}