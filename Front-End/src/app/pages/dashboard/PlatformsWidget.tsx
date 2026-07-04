import React, { useState, useEffect } from 'react';
import { Link2, CheckCircle2, AlertCircle, ExternalLink, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PlatformLinkage {
  username: string;
  isVerified: boolean;
  verificationToken: string;
  totalSolved?: number;
}

interface PlatformsWidgetProps {
  onLinkageChanged?: () => void;
  onboardingComplete?: boolean;
}

export function PlatformsWidget({ onLinkageChanged, onboardingComplete = true }: PlatformsWidgetProps) {
  const navigate = useNavigate();
  const [linkages, setLinkages] = useState<Record<string, PlatformLinkage | null>>({
    LeetCode: null,
    GeeksforGeeks: null,
    Code360: null,
  });

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token") || "";

  const fetchAllLinkages = async () => {
    const platforms = ["LeetCode", "GeeksforGeeks", "Code360"];
    try {
      const results = await Promise.all(
        platforms.map(async (plat) => {
          const res = await fetch(`${API_URL}/api/platforms/linkage?platform=${plat}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            return { platform: plat, linkage: data.linkage };
          }
          return { platform: plat, linkage: null };
        })
      );
      
      const newLinkages: Record<string, PlatformLinkage | null> = {};
      results.forEach((item) => {
        newLinkages[item.platform] = item.linkage;
      });
      setLinkages(newLinkages);
    } catch (err) {
      console.error("Error loading linkages in PlatformsWidget:", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAllLinkages();
    }
  }, [token]);

  const getProfileUrl = (platform: string, username: string) => {
    switch (platform) {
      case "LeetCode":
        return `https://leetcode.com/${username}/`;
      case "GeeksforGeeks":
        return `https://www.geeksforgeeks.org/user/${username}/`;
      case "Code360":
        return `https://www.naukri.com/code360/profile/${username}`;
      default:
        return "#";
    }
  };

  const getPlatformLogo = (platform: string) => {
    switch (platform) {
      case "LeetCode":
        return (
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-[#FFA116]" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
          </svg>
        );
      case "GeeksforGeeks":
        return (
          <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-current text-[#2F8D46]" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.45 14.315c-.143.28-.334.532-.565.745a3.691 3.691 0 0 1-1.104.695 4.51 4.51 0 0 1-3.116-.016 3.79 3.79 0 0 1-2.135-2.078 3.571 3.571 0 0 1-.13-.353h7.418a4.26 4.26 0 0 1-.368 1.008zm-11.99-.654a3.793 3.793 0 0 1-2.134 2.078 4.51 4.51 0 0 1-3.117.016 3.7 3.7 0 0 1-1.104-.695 2.652 2.652 0 0 1-.564-.745 4.221 4.221 0 0 1-.368-1.006H9.59c-.038.12-.08.238-.13.352zm14.501-1.758a3.849 3.849 0 0 0-.082-.475l-9.634-.008a3.932 3.932 0 0 1 1.143-2.348c.363-.35.79-.625 1.26-.809a3.97 3.97 0 0 1 4.484.957l1.521-1.49a5.7 5.7 0 0 0-1.922-1.357 6.283 6.283 0 0 0-2.544-.49 6.35 6.35 0 0 0-2.405.457 6.007 6.007 0 0 0-1.963 1.276 6.142 6.142 0 0 0-1.325 1.94 5.862 5.862 0 0 0-.466 1.864h-.063a5.857 5.857 0 0 0-.467-1.865 6.13 6.13 0 0 0-1.325-1.939A6 6 0 0 0 8.21 6.34a6.698 6.698 0 0 0-4.949.031A5.708 5.708 0 0 0 1.34 7.73l1.52 1.49a4.166 4.166 0 0 1 4.484-.958c.47.184.898.46 1.26.81.368.36.66.792.859 1.268.146.344.242.708.285 1.08l-9.635.008A4.714 4.714 0 0 0 0 12.457a6.493 6.493 0 0 0 .345 2.127 4.927 4.927 0 0 0 1.08 1.783c.528.56 1.17 1 1.88 1.293a6.454 6.454 0 0 0 2.504.457c.824.005 1.64-.15 2.404-.457a5.986 5.986 0 0 0 1.964-1.277 6.116 6.116 0 0 0 1.686-3.076h.273a6.13 6.13 0 0 0 1.686 3.077 5.99 5.99 0 0 0 1.964 1.276 6.345 6.345 0 0 0 2.405.457 6.45 6.45 0 0 0 2.502-.457 5.42 5.42 0 0 0 1.882-1.293 4.928 4.928 0 0 0 1.08-1.783A6.52 6.52 0 0 0 24 12.457a4.757 4.757 0 0 0-.039-.554z" />
          </svg>
        );
      case "Code360":
        return (
          <svg viewBox="15 50 200 365" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
            <path fill="#DD6620" d="M148.767,320.924v82.624c0,3.306-2.898,5.133-8.64,5.541v3.556h62.861v-3.556c-5.641-0.407-8.488-2.235-8.488-5.541v-82.624c0-17.177-3.659-31.1-10.924-41.824c-7.318-10.721-17.175-18.394-29.677-23.068c-12.5-4.678-26.983-7.014-43.497-7.014c-16.566,0-31.1,2.336-43.6,7.014c-12.5,4.674-22.36,12.347-29.677,23.068c-7.266,10.724-10.925,24.647-10.925,41.824v39.214h45.736v-39.214c0-11.384,3.251-19.769,9.805-25.155c6.557-5.338,16.11-8.032,28.61-8.032C135.96,287.737,148.767,298.819,148.767,320.924L148.767,320.924z"/>
            <path fill-rule="evenodd" clip-rule="evenodd" fill="#678E7C" d="M71.391,123.168l35.492,6.383C106.884,129.552,78.627,154.595,71.391,123.168L71.391,123.168z"/>
            <path fill-rule="evenodd" clip-rule="evenodd" fill="#678E7C" d="M163.228,123.168l-35.489,6.383C127.739,129.552,155.992,154.595,163.228,123.168L163.228,123.168z"/>
            <path fill="#DD6620" d="M87.433,101.695h52.574h30.049h9.097V55.959h-9.097h-13.882H87.433c-17.175,0-31.101,3.656-41.821,10.924c-10.724,7.317-18.397,17.177-23.071,29.675c-4.677,12.502-7.013,26.985-7.013,43.5c0,16.566,2.336,31.1,7.013,43.6c4.674,12.5,12.348,22.36,23.071,29.677c10.721,7.266,24.646,10.925,41.821,10.925h76.469h6.155h9.097v-45.735h-9.097h-32.86H87.433c-11.384,0-19.769-3.251-25.155-9.805c-5.337-6.557-8.029-16.11-8.029-28.61C54.249,114.498,65.329,101.695,87.433,101.695L87.433,101.695z"/>
          </svg>
        );
      case "InterviewBit":
        return (
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-[#00A9E0]" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14H11V8h2v8z" />
          </svg>
        );
      case "HackerRank":
        return (
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-[#2EC866]" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.9 4.1L12 0 2.1 4.1C1.3 4.4.8 5.2.8 6.1v11.8c0 .9.5 1.7 1.3 2L12 24l9.9-4.1c.8-.3 1.3-1.1 1.3-2V6.1c0-.9-.5-1.7-1.3-2zM15 15.5h-2.1v2.1h-1.8v-2.1H9v-1.8h2.1v-2.1h1.8v2.1H15v1.8z" />
          </svg>
        );
      case "Codeforces":
        return (
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="11" width="4" height="10" fill="#3B5998" rx="0.5" />
            <rect x="10" y="5" width="4" height="16" fill="#FF0000" rx="0.5" />
            <rect x="17" y="8" width="4" height="13" fill="#FFC000" rx="0.5" />
          </svg>
        );
      case "GitHub":
        return (
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-white" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
          </svg>
        );
      default:
        return <Link2 className="w-4 h-4 text-zinc-400" />;
    }
  };

  const mockPlatforms = [
    { name: "InterviewBit", badge: "Coming Soon" },
    { name: "HackerRank", badge: "Coming Soon" },
    { name: "Codeforces", badge: "Coming Soon" },
    { name: "GitHub", badge: "Coming Soon" }
  ];

  const linkedPlatformsList = (["LeetCode", "GeeksforGeeks", "Code360"] as const).filter(
    (plat) => !!linkages[plat]
  );

  const unconnectedPlatforms = (["LeetCode", "GeeksforGeeks", "Code360"] as const).filter(
    (plat) => !linkages[plat]
  );

  return (
    <div className={`relative rounded-2xl border border-white/[0.04] bg-[#0F0F13] p-5 overflow-hidden group hover:border-white/10 transition-all duration-300 h-[522px] min-h-[522px] flex flex-col justify-between ${!onboardingComplete ? 'opacity-40 pointer-events-none' : ''}`}>
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.002)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.002)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5 relative z-10 border-b border-white/[0.04] pb-2.5 shrink-0">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
          <Link2 className="w-4 h-4 text-emerald-450" />
          Problem Solving Stats
        </h3>
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex-1 flex flex-col justify-between overflow-hidden">
        
        {/* Scroll-free layout content */}
        <div className="flex-1 flex flex-col gap-3">
          
          {/* Active linked platforms list */}
          <div className="space-y-1">
            {linkedPlatformsList.length > 0 ? (
              linkedPlatformsList.map((plat) => {
                const linkage = linkages[plat];
                if (!linkage) return null;
                const isVerified = linkage.isVerified;

                return (
                  <div key={plat} className="flex items-center justify-between py-2.5 border-b border-white/[0.03] transition-all duration-150">
                    <div className="flex items-center gap-3">
                      {/* Platform Logo */}
                      <div className="w-6.5 h-6.5 rounded-lg bg-white/5 border border-white/[0.04] flex items-center justify-center shrink-0 select-none">
                        {getPlatformLogo(plat)}
                      </div>
                      <span className="text-xs font-bold text-zinc-200 tracking-wide">{plat}</span>
                    </div>

                    {/* Status Action indicators */}
                    <div className="flex items-center gap-2">
                      {isVerified ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500/10" />
                          <a
                            href={getProfileUrl(plat, linkage.username)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-550 hover:text-white transition-colors p-0.5"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </>
                      ) : (
                        <button
                          onClick={() => navigate("/settings?tab=platforms")}
                          className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded text-[8px] font-bold text-yellow-400 select-none hover:bg-yellow-500/20 transition-all cursor-pointer animate-pulse"
                        >
                          <AlertCircle className="w-2.5 h-2.5" />
                          <span>Verify</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-6 border border-dashed border-white/[0.06] rounded-xl flex flex-col items-center justify-center text-center px-4">
                <Link2 className="w-5 h-5 text-zinc-650 mb-1.5" />
                <p className="text-[10px] text-zinc-450 font-bold">No Profiles Connected</p>
              </div>
            )}
          </div>

          {/* Add Platform dashed button */}
          {unconnectedPlatforms.length > 0 && (
            <button
              onClick={() => navigate("/settings?tab=platforms")}
              className="w-full py-2 border border-dashed border-white/[0.08] hover:border-amber-500/20 hover:bg-white/[0.01] text-amber-550 hover:text-amber-400 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95 mt-1"
            >
              <Plus className="w-3.5 h-3.5 text-amber-500" />
              <span>Add Platform</span>
            </button>
          )}

        </div>

        {/* ─── DEVELOPMENT STATS SECTION ─── */}
        <div className="mt-3 pt-3 border-t border-white/[0.04] shrink-0">
          <h4 className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-2 px-0.5">
            Development Stats
          </h4>
          <div className="flex items-center justify-between py-2 px-0.5 opacity-55">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded bg-white/5 border border-white/[0.04] flex items-center justify-center shrink-0">
                {getPlatformLogo("GitHub")}
              </div>
              <span className="text-[11px] font-bold text-zinc-350 tracking-wide">GitHub</span>
            </div>
            <span className="text-[7.5px] font-black tracking-widest text-zinc-550 bg-white/[0.03] border border-white/[0.06] px-1.5 py-0.5 rounded uppercase">
              Coming Soon
            </span>
          </div>
        </div>

        {/* ─── COMING SOON LIST (InterviewBit, HackerRank, Codeforces stacked vertically) ─── */}
        <div className="mt-3 pt-3 border-t border-white/[0.04] shrink-0">
          <h4 className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-2 px-0.5">
            Coming Soon
          </h4>
          <div className="space-y-1">
            {mockPlatforms.filter(p => p.name !== "GitHub").map((mockPlat) => (
              <div key={mockPlat.name} className="flex items-center justify-between py-1.5 px-0.5 opacity-40 select-none">
                <div className="flex items-center gap-3">
                  <div className="w-5.5 h-5.5 rounded bg-white/5 border border-white/[0.04] flex items-center justify-center shrink-0">
                    {getPlatformLogo(mockPlat.name)}
                  </div>
                  <span className="text-[10px] font-bold text-zinc-350 tracking-wide">{mockPlat.name}</span>
                </div>
                <span className="text-[7.5px] font-black tracking-widest text-zinc-550 bg-white/[0.03] border border-white/[0.06] px-1.5 py-0.5 rounded uppercase">
                  Coming Soon
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
