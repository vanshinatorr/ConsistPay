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

  // Static/Mock Platforms
  const mockPlatforms = [
    { name: "InterviewBit", badge: "Coming Soon" },
    { name: "HackerRank", badge: "Coming Soon" },
    { name: "Codeforces", badge: "Coming Soon" },
    { name: "GitHub", badge: "Coming Soon" }
  ];

  return (
    <div className={`relative rounded-2xl border border-white/[0.04] bg-[#0F0F13] p-5 overflow-hidden group hover:border-white/10 transition-all duration-300 h-[480px] min-h-[480px] flex flex-col justify-between ${!onboardingComplete ? 'opacity-40 pointer-events-none' : ''}`}>
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.002)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.002)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10 border-b border-white/[0.04] pb-3 shrink-0">
        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
          <Link2 className="w-4 h-4 text-emerald-450" />
          Problem Solving Stats
        </h3>
      </div>

      <div className="space-y-3 relative z-10 flex-1 overflow-y-auto pr-1.5 custom-scrollbar">
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
                  <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/[0.04] flex items-center justify-center text-[10px] font-bold text-white uppercase select-none">
                    {plat.substring(0, 2)}
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
                      
                      <button
                        onClick={() => handleUnlink(plat)}
                        disabled={loading}
                        className="text-zinc-600 hover:text-rose-400 transition-colors p-1"
                        title="Disconnect Account"
                      >
                        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      </button>
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
              <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/[0.04] flex items-center justify-center text-[10px] font-bold text-zinc-500 uppercase">
                {mockPlat.name.substring(0, 2)}
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
