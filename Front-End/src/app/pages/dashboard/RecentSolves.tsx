import React, { useState } from "react";
import { X, Calendar, Search, CheckCircle2, History, Code2 } from "lucide-react";

interface RecentSolve {
  platform: string;
  name: string;
  difficulty: string;
  topic: string;
  time: string;
  date: string;
  rawDate: string;
}

interface RecentSolvesProps {
  recentSolves: RecentSolve[];
}

export function RecentSolves({ recentSolves }: RecentSolvesProps) {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  const getDifficultyColor = (d: string) => {
    if (d === "Easy") return "text-emerald-400 border-emerald-500/20 bg-emerald-500/5";
    if (d === "Medium") return "text-orange-400 border-orange-500/20 bg-orange-500/5";
    if (d === "Hard") return "text-red-400 border-red-500/20 bg-red-500/5";
    return "text-zinc-400 border-white/10 bg-white/5";
  };

  const getPlatformStyle = (p: string) => {
    if (p === "LC" || p === "LeetCode") return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    if (p === "GFG" || p === "GeeksForGeeks") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (p === "C360" || p === "Code360") return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    return "bg-white/5 text-zinc-400 border-white/[0.04]";
  };

  // Filter solves based on search query & difficulty in history modal
  const filteredSolves = recentSolves.filter((solve) => {
    const matchesSearch = solve.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      solve.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      solve.platform.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDifficulty = selectedDifficulty === "All" || solve.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="w-full">
      <div className="relative h-full">
        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-violet-500/5 to-transparent rounded-2xl blur-xl opacity-50" />
        
        {/* Main Dashboard Widget */}
        <div className="relative bg-[#0C0D15]/90 border border-white/[0.03] rounded-2xl p-5 h-[249px] min-h-[249px] flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:border-white/[0.07] transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Code2 className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-white">Recent Solves</h2>
            </div>
            {recentSolves.length > 0 && (
              <button
                onClick={() => setShowModal(true)}
                className="text-[11px] font-bold text-zinc-400 hover:text-white transition-colors bg-white/5 border border-white/[0.04] hover:bg-white/10 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <History className="w-3.5 h-3.5" />
                View History
              </button>
            )}
          </div>

          {/* List of solves (Capped to 3 for clean UI layout) */}
          <div className="space-y-2.5">
            {recentSolves.length > 0 ? (
              recentSolves.slice(0, 3).map((solve, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-3 bg-white/[0.01] rounded-xl border border-white/[0.03] hover:border-white/10 hover:bg-white/[0.02] transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`shrink-0 px-2.5 py-0.5 text-[9px] font-extrabold rounded-md border tracking-wider uppercase ${getPlatformStyle(solve.platform)}`}>
                      {solve.platform}
                    </span>
                    <span className="font-bold text-sm text-zinc-200 truncate group-hover:text-white transition-colors max-w-[140px] sm:max-w-xs md:max-w-sm">
                      {solve.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-md border uppercase tracking-wider ${getDifficultyColor(solve.difficulty)}`}>
                      {solve.difficulty}
                    </span>
                    <span className="text-[11px] text-zinc-500 font-medium">
                      {solve.time}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-zinc-550 border border-dashed border-white/[0.06] rounded-xl">
                <p className="text-sm font-medium">No recent solves yet.</p>
                <p className="text-xs text-zinc-500 mt-1">Submit your first coding problem to begin!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= HISTORY HISTORY MODAL (SaaS Premium UI) ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-2xl bg-[#0F0F13] border border-white/[0.08] rounded-3xl p-6 shadow-2xl overflow-hidden max-h-[80vh] flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808003_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
            <div className="absolute -right-24 -top-24 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    Coding History
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Total {recentSolves.length} verified solutions logged
                  </p>
                </div>
              </div>
              <button 
                onClick={() => { setShowModal(false); setSearchQuery(""); setSelectedDifficulty("All"); }}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 py-4 relative z-10">
              {/* Search input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="text"
                  placeholder="Search by problem name or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#141419] border border-white/[0.06] rounded-xl py-2 pl-10 pr-4 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>

              {/* Difficulty Filter */}
              <div className="flex gap-1.5 bg-[#141419] border border-white/[0.06] rounded-xl p-1 shrink-0">
                {["All", "Easy", "Medium", "Hard"].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer
                      ${selectedDifficulty === diff 
                        ? "bg-blue-500/20 text-blue-300 border border-blue-500/25" 
                        : "text-zinc-400 hover:text-zinc-200"
                      }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Solves Timeline List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 relative z-10 space-y-3 min-h-[250px]">
              {filteredSolves.length > 0 ? (
                filteredSolves.map((solve, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-3.5 bg-white/[0.01] hover:bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] rounded-2xl transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                        <CheckCircle2 className="w-4 h-4 fill-emerald-500/10" />
                      </div>
                      
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-zinc-200 group-hover:text-white transition-colors truncate max-w-[200px] sm:max-w-sm">
                          {solve.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded border tracking-wider uppercase shrink-0 ${getPlatformStyle(solve.platform)}`}>
                            {solve.platform}
                          </span>
                          <span className="text-[10px] text-zinc-500 truncate max-w-[120px]">
                            {solve.topic}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0 ml-3">
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-md border uppercase tracking-wider ${getDifficultyColor(solve.difficulty)}`}>
                        {solve.difficulty}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                        <Calendar className="w-3 h-3" />
                        <span>{solve.date}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
                  <p className="text-sm font-medium">No matching solves found.</p>
                  <p className="text-xs text-zinc-600 mt-1">Try adjusting your filters or search keywords.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-500 relative z-10 shrink-0">
              <span>Showing {filteredSolves.length} of {recentSolves.length} submissions</span>
              <span>Keep up the daily coding! 🚀</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default RecentSolves;
