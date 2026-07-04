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

  const getPlatformLogo = (platform: string) => {
    const p = platform.toLowerCase();
    if (p === "lc" || p === "leetcode") {
      return (
        <div className="w-7 h-7 rounded-lg bg-[#FFA116]/10 border border-[#FFA116]/20 flex items-center justify-center text-[#FFA116] shrink-0" title="LeetCode">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
          </svg>
        </div>
      );
    }
    if (p === "gfg" || p === "geeksforgeeks") {
      return (
        <div className="w-7 h-7 rounded-lg bg-[#2F8D46]/10 border border-[#2F8D46]/20 flex items-center justify-center text-[#2F8D46] shrink-0" title="GeeksforGeeks">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.45 14.315c-.143.28-.334.532-.565.745a3.691 3.691 0 0 1-1.104.695 4.51 4.51 0 0 1-3.116-.016 3.79 3.79 0 0 1-2.135-2.078 3.571 3.571 0 0 1-.13-.353h7.418a4.26 4.26 0 0 1-.368 1.008zm-11.99-.654a3.793 3.793 0 0 1-2.134 2.078 4.51 4.51 0 0 1-3.117.016 3.7 3.7 0 0 1-1.104-.695 2.652 2.652 0 0 1-.564-.745 4.221 4.221 0 0 1-.368-1.006H9.59c-.038.12-.08.238-.13.352zm14.501-1.758a3.849 3.849 0 0 0-.082-.475l-9.634-.008a3.932 3.932 0 0 1 1.143-2.348c.363-.35.79-.625 1.26-.809a3.97 3.97 0 0 1 4.484.957l1.521-1.49a5.7 5.7 0 0 0-1.922-1.357 6.283 6.283 0 0 0-2.544-.49 6.35 6.35 0 0 0-2.405.457 6.007 6.007 0 0 0-1.963 1.276 6.142 6.142 0 0 0-1.325 1.94 5.862 5.862 0 0 0-.466 1.864h-.063a5.857 5.857 0 0 0-.467-1.865 6.13 6.13 0 0 0-1.325-1.939A6 6 0 0 0 8.21 6.34a6.698 6.698 0 0 0-4.949.031A5.708 5.708 0 0 0 1.34 7.73l1.52 1.49a4.166 4.166 0 0 1 4.484-.958c.47.184.898.46 1.26.81.368.36.66.792.859 1.268.146.344.242.708.285 1.08l-9.635.008A4.714 4.714 0 0 0 0 12.457a6.493 6.493 0 0 0 .345 2.127 4.927 4.927 0 0 0 1.08 1.783c.528.56 1.17 1 1.88 1.293a6.454 6.454 0 0 0 2.504.457c.824.005 1.64-.15 2.404-.457a5.986 5.986 0 0 0 1.964-1.277 6.116 6.116 0 0 0 1.686-3.076h.273a6.13 6.13 0 0 0 1.686 3.077 5.99 5.99 0 0 0 1.964 1.276 6.345 6.345 0 0 0 2.405.457 6.45 6.45 0 0 0 2.502-.457 5.42 5.42 0 0 0 1.882-1.293 4.928 4.928 0 0 0 1.08-1.783A6.52 6.52 0 0 0 24 12.457a4.757 4.757 0 0 0-.039-.554z" />
          </svg>
        </div>
      );
    }
    if (p === "c360" || p === "code360") {
      return (
        <div className="w-7 h-7 rounded-lg bg-[#E07A5F]/10 border border-[#E07A5F]/20 flex items-center justify-center text-[#E07A5F] shrink-0" title="Code360">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14H11V8h2v8z" />
          </svg>
        </div>
      );
    }
    return (
      <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 shrink-0" title={platform}>
        <Code2 className="w-3.5 h-3.5" />
      </div>
    );
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
        <div className="relative bg-white dark:bg-[#0C0D15]/90 border border-zinc-200 dark:border-white/[0.03] rounded-2xl p-5 h-[249px] min-h-[249px] flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.02)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:border-zinc-300 dark:hover:border-white/[0.07] transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Code2 className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-zinc-800 dark:text-white">Recent Solves</h2>
            </div>
            {recentSolves.length > 0 && (
              <button
                onClick={() => setShowModal(true)}
                className="text-[11px] font-bold text-zinc-650 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/[0.04] hover:bg-zinc-200 dark:hover:bg-white/10 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
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
                  className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-white/[0.01] rounded-xl border border-zinc-200 dark:border-white/[0.03] hover:border-zinc-300 dark:hover:border-white/10 hover:bg-zinc-100/50 dark:hover:bg-white/[0.02] transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {getPlatformLogo(solve.platform)}
                    <span className="font-bold text-sm text-zinc-700 dark:text-zinc-200 truncate group-hover:text-zinc-950 dark:group-hover:text-white transition-colors max-w-[140px] sm:max-w-xs md:max-w-sm">
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
                        <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
                          {getPlatformLogo(solve.platform)}
                          <span className="text-[11px] text-zinc-500 truncate max-w-[120px]">
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
