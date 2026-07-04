import React, { useState, useEffect } from 'react';
import { Link2, AlertCircle, ExternalLink } from 'lucide-react';
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
  });

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token") || "";

  const fetchAllLinkages = async () => {
    const platforms = ["LeetCode", "GeeksforGeeks"];
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
      default:
        return "#";
    }
  };

  const getPlatformLogo = (platform: string) => {
    switch (platform) {
      case "LeetCode":
        return (
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current text-[#FFA116]" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
          </svg>
        );
      case "GeeksforGeeks":
        return (
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current text-[#2F8D46]" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.45 14.315c-.143.28-.334.532-.565.745a3.691 3.691 0 0 1-1.104.695 4.51 4.51 0 0 1-3.116-.016 3.79 3.79 0 0 1-2.135-2.078 3.571 3.571 0 0 1-.13-.353h7.418a4.26 4.26 0 0 1-.368 1.008zm-11.99-.654a3.793 3.793 0 0 1-2.134 2.078 4.51 4.51 0 0 1-3.117.016 3.7 3.7 0 0 1-1.104-.695 2.652 2.652 0 0 1-.564-.745 4.221 4.221 0 0 1-.368-1.006H9.59c-.038.12-.08.238-.13.352zm14.501-1.758a3.849 3.849 0 0 0-.082-.475l-9.634-.008a3.932 3.932 0 0 1 1.143-2.348c.363-.35.79-.625 1.26-.809a3.97 3.97 0 0 1 4.484.957l1.521-1.49a5.7 5.7 0 0 0-1.922-1.357 6.283 6.283 0 0 0-2.544-.49 6.35 6.35 0 0 0-2.405.457 6.007 6.007 0 0 0-1.963 1.276 6.142 6.142 0 0 0-1.325 1.94 5.862 5.862 0 0 0-.466 1.864h-.063a5.857 5.857 0 0 0-.467-1.865 6.13 6.13 0 0 0-1.325-1.939A6 6 0 0 0 8.21 6.34a6.698 6.698 0 0 0-4.949.031A5.708 5.708 0 0 0 1.34 7.73l1.52 1.49a4.166 4.166 0 0 1 4.484-.958c.47.184.898.46 1.26.81.368.36.66.792.859 1.268.146.344.242.708.285 1.08l-9.635.008A4.714 4.714 0 0 0 0 12.457a6.493 6.493 0 0 0 .345 2.127 4.927 4.927 0 0 0 1.08 1.783c.528.56 1.17 1 1.88 1.293a6.454 6.454 0 0 0 2.504.457c.824.005 1.64-.15 2.404-.457a5.986 5.986 0 0 0 1.964-1.277 6.116 6.116 0 0 0 1.686-3.076h.273a6.13 6.13 0 0 0 1.686 3.077 5.99 5.99 0 0 0 1.964 1.276 6.345 6.345 0 0 0 2.405.457 6.45 6.45 0 0 0 2.502-.457 5.42 5.42 0 0 0 1.882-1.293 4.928 4.928 0 0 0 1.08-1.783A6.52 6.52 0 0 0 24 12.457a4.757 4.757 0 0 0-.039-.554z" />
          </svg>
        );
      case "GitHub":
        return (
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current text-white" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
          </svg>
        );
      case "Code360":
        return (
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current text-[#E07A5F]" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14H11V8h2v8z" />
          </svg>
        );
      case "InterviewBit":
        return (
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current text-[#00A9E0]" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14H11V8h2v8z" />
          </svg>
        );
      case "HackerRank":
        return (
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current text-[#2EC866]" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.9 4.1L12 0 2.1 4.1C1.3 4.4.8 5.2.8 6.1v11.8c0 .9.5 1.7 1.3 2L12 24l9.9-4.1c.8-.3 1.3-1.1 1.3-2V6.1c0-.9-.5-1.7-1.3-2zM15 15.5h-2.1v2.1h-1.8v-2.1H9v-1.8h2.1v-2.1h1.8v2.1H15v1.8z" />
          </svg>
        );
      case "Codeforces":
        return (
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="11" width="4" height="10" fill="#3B5998" rx="0.5" />
            <rect x="10" y="5" width="4" height="16" fill="#FF0000" rx="0.5" />
            <rect x="17" y="8" width="4" height="13" fill="#FFC000" rx="0.5" />
          </svg>
        );
      case "CodeChef":
        return (
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current text-[#F0A500]" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2c-3.31 0-6 2.69-6 6 0 1.97 1.05 3.72 2.66 4.72-.88 1.09-1.66 2.37-2.28 3.82-.48 1.13.33 2.46 1.55 2.46h8.14c1.22 0 2.03-1.33 1.55-2.46-.62-1.45-1.4-2.73-2.28-3.82C16.95 11.72 18 9.97 18 8c0-3.31-2.69-6-6-6zm0 18H8v-2h8v2h-4z" />
          </svg>
        );
      case "AtCoder":
        return (
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current text-[#555]" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 22h20L12 2zm0 4l6.5 13H5.5L12 6z" />
          </svg>
        );
      case "HackerEarth":
        return (
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current text-[#323754]" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 12h-4v4h-2v-4H7V9h2v4h4V9h2v6z" />
          </svg>
        );
      default:
        return <Link2 className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  const mockPlatforms = [
    { name: "GitHub" },
    { name: "Code360" },
    { name: "InterviewBit" },
    { name: "HackerRank" },
    { name: "Codeforces" },
    { name: "CodeChef" },
    { name: "AtCoder" },
    { name: "HackerEarth" }
  ];

  return (
    <div className={`relative rounded-2xl border border-white/[0.02] bg-[#07070A]/90 px-4 py-4 overflow-hidden group hover:border-white/[0.05] transition-all duration-300 h-[522px] min-h-[522px] flex flex-col justify-between select-none ${!onboardingComplete ? 'opacity-40 pointer-events-none' : ''}`}>
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.001)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.001)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
      
      {/* Container wrapper for dynamic vertical distribution */}
      <div className="relative z-10 flex flex-col h-full justify-between">
        
        {/* SECTION 1: Available Platforms */}
        <div className="flex flex-col gap-2.5 shrink-0">
          <div className="flex items-center justify-between border-b border-white/[0.04] pb-2 shrink-0">
            <h3 className="text-[8.5px] font-extrabold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-emerald-455 shrink-0" />
              Available Platforms
            </h3>
          </div>

          <div className="space-y-0.5">
            {(["LeetCode", "GeeksforGeeks"] as const).map((plat) => {
              const linkage = linkages[plat];
              const isLinked = !!linkage;
              const isVerified = linkage?.isVerified ?? false;

              if (isLinked) {
                return (
                  <div key={plat} className="flex items-center justify-between py-2 border-b border-white/[0.02] flex-nowrap w-full min-w-0">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {/* Platform Logo */}
                      <div className="w-5.5 h-5.5 rounded bg-white/5 border border-white/[0.04] flex items-center justify-center shrink-0">
                        {getPlatformLogo(plat)}
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-[11px] font-bold text-zinc-250 tracking-wide truncate">{plat}</span>
                        <span className="text-[9px] text-zinc-500 font-mono truncate">@{linkage.username}</span>
                      </div>
                    </div>

                    {/* Status Action indicators */}
                    <div className="flex items-center gap-1.5 shrink-0 ml-1.5">
                      {isVerified ? (
                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Premium Verified Seal Badge */}
                          <div className="flex items-center justify-center w-4.5 h-4.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full shrink-0 shadow-sm" title="Verified Connect">
                            <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-emerald-400 fill-current" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                            </svg>
                          </div>
                          <a
                            href={getProfileUrl(plat, linkage.username)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-550 hover:text-zinc-350 transition-colors p-0.5 shrink-0"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ) : (
                        <button
                          onClick={() => navigate("/settings?tab=platforms")}
                          className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-full text-[8px] font-extrabold text-yellow-405 select-none hover:bg-yellow-500/20 transition-all cursor-pointer whitespace-nowrap active:scale-95 shrink-0"
                        >
                          <AlertCircle className="w-2.5 h-2.5" />
                          <span>Verify</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              } else {
                return (
                  <div
                    key={plat}
                    onClick={() => navigate("/settings?tab=platforms")}
                    className="flex items-center justify-between py-2 border-b border-white/[0.02] flex-nowrap w-full min-w-0 cursor-pointer group/item hover:bg-white/[0.01] rounded-lg transition-all px-1"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1 opacity-40 group-hover/item:opacity-75 transition-opacity">
                      {/* Platform Logo */}
                      <div className="w-5.5 h-5.5 rounded bg-white/5 border border-white/[0.04] flex items-center justify-center shrink-0">
                        {getPlatformLogo(plat)}
                      </div>
                      <span className="text-[11px] font-bold text-zinc-400 tracking-wide truncate">{plat}</span>
                    </div>
                    <span className="text-[9px] font-extrabold text-zinc-550 group-hover/item:text-amber-500 transition-colors shrink-0 uppercase tracking-widest select-none">
                      + Link
                    </span>
                  </div>
                );
              }
            })}
          </div>
        </div>

        {/* SECTION 2: Coming Soon Platforms */}
        <div className="flex flex-col gap-2 shrink-0">
          <h4 className="text-[8.5px] font-extrabold text-zinc-550 uppercase tracking-widest block border-b border-white/[0.02] pb-1.5 px-0.5 select-none">
            Coming Soon
          </h4>
          <div className="space-y-1">
            {mockPlatforms.map((mockPlat) => (
              <div key={mockPlat.name} className="flex items-center justify-between py-1 px-0.5 select-none transition-all group/coming">
                <div className="flex items-center gap-2.5 grayscale opacity-25 group-hover/coming:grayscale-0 group-hover/coming:opacity-50 transition-all duration-300">
                  <div className="w-5.5 h-5.5 rounded bg-white/5 border border-white/[0.02] flex items-center justify-center shrink-0">
                    {getPlatformLogo(mockPlat.name)}
                  </div>
                  <span className="text-[10.5px] font-bold text-zinc-450 tracking-wide">{mockPlat.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
