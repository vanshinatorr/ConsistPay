import React, { useState, useEffect } from 'react';
import { Link2, CheckCircle2, AlertCircle, ExternalLink, XCircle, Trash2, ArrowRight, Loader2 } from 'lucide-react';

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
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [usernamesInput, setUsernamesInput] = useState<Record<string, string>>({});
  const [activeLinkInput, setActiveLinkInput] = useState<string | null>(null);
  const [errorMap, setErrorMap] = useState<Record<string, string>>({});
  
  // Real linkages state
  const [linkages, setLinkages] = useState<Record<string, PlatformLinkage | null>>({
    LeetCode: null,
    GeeksforGeeks: null,
    Code360: null,
  });

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token") || "";

  // Fetch all linkage details in parallel
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

  const handleLinkSubmit = async (platform: string) => {
    const username = usernamesInput[platform]?.trim();
    if (!username) return;

    setLoadingMap((prev) => ({ ...prev, [platform]: true }));
    setErrorMap((prev) => ({ ...prev, [platform]: "" }));

    try {
      const res = await fetch(`${API_URL}/api/platforms/link`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ platform, username })
      });
      
      const data = await res.json();
      if (!res.ok) {
        setErrorMap((prev) => ({ ...prev, [platform]: data.message || "Failed to link profile." }));
        return;
      }

      setActiveLinkInput(null);
      setUsernamesInput((prev) => ({ ...prev, [platform]: "" }));
      await fetchAllLinkages();
      if (onLinkageChanged) onLinkageChanged();
    } catch (err) {
      setErrorMap((prev) => ({ ...prev, [platform]: "Network error. Please try again." }));
    } finally {
      setLoadingMap((prev) => ({ ...prev, [platform]: false }));
    }
  };

  const handleVerify = async (platform: string) => {
    setLoadingMap((prev) => ({ ...prev, [platform]: true }));
    setErrorMap((prev) => ({ ...prev, [platform]: "" }));

    try {
      const res = await fetch(`${API_URL}/api/platforms/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ platform })
      });
      
      const data = await res.json();
      if (!res.ok) {
        setErrorMap((prev) => ({ ...prev, [platform]: data.message || "Verification failed. Check token location." }));
        return;
      }

      await fetchAllLinkages();
      if (onLinkageChanged) onLinkageChanged();
    } catch (err) {
      setErrorMap((prev) => ({ ...prev, [platform]: "Network error. Please try again." }));
    } finally {
      setLoadingMap((prev) => ({ ...prev, [platform]: false }));
    }
  };

  const handleUnlink = async (platform: string) => {
    if (!window.confirm(`Are you sure you want to disconnect your ${platform} profile? Your daily progress tracking for this platform will be paused.`)) {
      return;
    }

    setLoadingMap((prev) => ({ ...prev, [platform]: true }));
    setErrorMap((prev) => ({ ...prev, [platform]: "" }));

    try {
      const res = await fetch(`${API_URL}/api/platforms/link`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ platform })
      });
      
      const data = await res.json();
      if (!res.ok) {
        setErrorMap((prev) => ({ ...prev, [platform]: data.message || "Failed to disconnect linkage." }));
        return;
      }

      await fetchAllLinkages();
      if (onLinkageChanged) onLinkageChanged();
    } catch (err) {
      setErrorMap((prev) => ({ ...prev, [platform]: "Network error. Please try again." }));
    } finally {
      setLoadingMap((prev) => ({ ...prev, [platform]: false }));
    }
  };

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
            <path d="M16.102 17.93l-2.69 2.607c-.466.451-1.211.451-1.677 0l-4.51-4.375a1.235 1.235 0 0 1 0-1.707l4.51-4.375c.466-.452 1.211-.452 1.677 0l2.69 2.607c.466.452 1.211.452 1.677 0a1.235 1.235 0 0 0 0-1.707L13.23 6.6c-.466-.452-1.211-.452-1.677 0L4.17 13.78a2.47 2.47 0 0 0 0 3.414l7.382 7.15c.466.452 1.211.452 1.677 0l7.382-7.15a1.235 1.235 0 0 0 0-1.707c-.466-.451-1.211-.451-1.677 0l-.832.806zM18.73 12.022c-.466-.452-1.211-.452-1.677 0L13.23 15.84a1.235 1.235 0 0 1-1.677 0L8.73 13.015c-.466-.452-1.211-.452-1.677 0a1.235 1.235 0 0 0 0 1.707l3.823 3.704c.466.452 1.211.452 1.677 0l5.498-5.328a1.235 1.235 0 0 0 0-1.707l.679.63z" />
          </svg>
        );
      case "GeeksforGeeks":
        return (
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-[#2F8D46]" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.162 2c-3.111 0-5.833 1.481-7.575 3.766L8.47 8.358C9.37 7.214 10.704 6.5 12.162 6.5c2.481 0 4.5 2.019 4.5 4.5s-2.019 4.5-4.5 4.5c-1.458 0-2.793-.714-3.693-1.858L4.587 16.234C6.329 18.519 9.051 20 12.162 20c4.963 0 9-4.037 9-9s-4.037-9-9-9zm-8.83 5.485C2.474 8.766 2 10.323 2 12c0 1.677.474 3.234 1.332 4.515l3.14-2.592c-.29-.583-.472-1.229-.472-1.923 0-.694.182-1.34.472-1.923L3.332 7.485z" />
          </svg>
        );
      case "Code360":
        return (
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-[#F26E22]" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2c5.522 0 10 4.477 10 10s-4.478 10-10 10S2 17.523 2 12 6.478 2 12 2zm5 5h-10c-.553 0-1 .447-1 1v1h12V8c0-.553-.448-1-1-1zm1 3H6c-.553 0-1 .447-1 1v2c0 2.761 2.239 5 5 5h4c2.761 0 5-2.239 5-5v-2c0-.553-.448-1-1-1zm-8.5 3c-.828 0-1.5-.672-1.5-1.5S9.172 10 10 10s1.5.672 1.5 1.5S10.828 13 10 13zm4 0c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5S14.828 13 14 13z" />
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

  // Static/Mock Platforms
  const mockPlatforms = [
    { name: "InterviewBit", badge: "Coming Soon" },
    { name: "HackerRank", badge: "Coming Soon" },
    { name: "Codeforces", badge: "Coming Soon" },
    { name: "GitHub", badge: "Coming Soon" }
  ];

  return (
    <div className={`relative rounded-2xl border border-white/[0.04] bg-[#0F0F13] p-5 overflow-hidden group hover:border-white/10 transition-all duration-300 h-[522px] min-h-[522px] flex flex-col justify-between ${!onboardingComplete ? 'opacity-40 pointer-events-none' : ''}`}>
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.002)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.002)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-3 relative z-10 border-b border-white/[0.04] pb-2 shrink-0">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
          <Link2 className="w-4 h-4 text-emerald-455" />
          Problem Solving Stats
        </h3>
      </div>

      <div className="space-y-3 relative z-10 flex-1 overflow-y-auto pr-1 custom-scrollbar max-h-[430px]">
        {/* ─── ACTIVE/FUNCTIONAL PLATFORMS ─── */}
        {(["LeetCode", "GeeksforGeeks", "Code360"] as const).map((plat) => {
          const linkage = linkages[plat];
          const isLinked = !!linkage;
          const isVerified = linkage?.isVerified ?? false;
          const loading = loadingMap[plat] || false;
          const error = errorMap[plat] || "";
          const isInputActive = activeLinkInput === plat;

          return (
            <div key={plat} className="border border-white/[0.03] bg-white/[0.01] rounded-xl p-3 transition-all duration-200">
              {/* Row Header */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  {/* Platform Icons (using SVG or clean letters) */}
                  <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/[0.04] flex items-center justify-center shrink-0 select-none">
                    {getPlatformLogo(plat)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white tracking-wide">{plat}</span>
                    {isLinked && (
                      <div className="flex flex-col gap-0.5 mt-0.5">
                        <p className="text-[10px] text-zinc-500 font-mono">@{linkage.username}</p>
                        {isVerified && (
                          <div className="flex items-center gap-1.5 text-[9px] text-emerald-500 font-medium">
                            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
                            <span>{linkage.totalSolved || 0} solves synced</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Indicator / Actions */}
                <div className="flex items-center gap-2">
                  {isLinked ? (
                    <>
                      {isVerified ? (
                        <>
                          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" title="Verified Profile" />
                          <a
                            href={getProfileUrl(plat, linkage.username)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-500 hover:text-white transition-colors p-1"
                            title="Open Profile"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </>
                      ) : (
                        <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded text-[9px] font-bold text-yellow-400 select-none animate-pulse">
                          <AlertCircle className="w-2.5 h-2.5" />
                          <span>Verify</span>
                        </div>
                      )}
                    </>
                  ) : (
                    !isInputActive && (
                      <button
                        onClick={() => {
                          setActiveLinkInput(plat);
                          setErrorMap(prev => ({ ...prev, [plat]: "" }));
                        }}
                        className="text-[10px] font-bold text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/[0.04] transition-colors"
                      >
                        Connect
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Error messages */}
              {error && (
                <p className="text-[10px] text-rose-450 bg-rose-500/5 border border-rose-500/10 rounded-lg px-2.5 py-1.5 mt-2 leading-relaxed">
                  {error}
                </p>
              )}

              {/* Expand Link input box */}
              {isInputActive && (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleLinkSubmit(plat);
                  }}
                  className="mt-3.5 pt-3 border-t border-white/[0.03] space-y-2"
                >
                  <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                    Enter {plat} Username:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="e.g. vanshvijay"
                      value={usernamesInput[plat] || ""}
                      onChange={(e) => setUsernamesInput((prev) => ({ ...prev, [plat]: e.target.value }))}
                      className="flex-1 bg-[#0A0B10] border border-white/[0.06] rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-3.5 rounded-lg text-xs flex items-center justify-center shrink-0"
                    >
                      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Link"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveLinkInput(null)}
                      className="border border-white/[0.06] hover:bg-white/5 text-zinc-400 px-2.5 rounded-lg text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Expand Verification Steps (Linked but Unverified) */}
              {isLinked && !isVerified && (
                <div className="mt-3.5 pt-3 border-t border-white/[0.03] space-y-2">
                  <div className="bg-[#0A0B10] border border-white/[0.06] rounded-lg p-2 text-center">
                    <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider block mb-0.5">Bio Verification Token</span>
                    <code className="text-xs font-mono font-bold text-emerald-400 select-all tracking-wider">{linkage.verificationToken}</code>
                  </div>
                  <p className="text-[10px] text-zinc-450 leading-relaxed pl-0.5">
                    Paste this token into your <b>{plat} bio/about-me</b>, then click Verify below:
                  </p>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleVerify(plat)}
                      disabled={loading}
                      className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/25 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      {loading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <>Verify Account</>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* ─── MOCK PLATFORMS (COMING SOON) ─── */}
        {mockPlatforms.map((mockPlat) => (
          <div key={mockPlat.name} className="border border-white/[0.02] bg-white/[0.005] rounded-xl p-3 flex items-center justify-between opacity-50 select-none">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/[0.04] flex items-center justify-center shrink-0">
                {getPlatformLogo(mockPlat.name)}
              </div>
              <span className="text-xs font-bold text-zinc-400 tracking-wide">{mockPlat.name}</span>
            </div>
            
            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest border border-white/[0.04] px-1.5 py-0.5 rounded">
              {mockPlat.badge}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
