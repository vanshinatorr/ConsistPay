import React, { useState, useEffect } from "react";
import { Link2, CheckCircle2, AlertCircle, ExternalLink, Trash2, Loader2, Key, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";

interface PlatformLinkage {
  username: string;
  isVerified: boolean;
  verificationToken: string;
  totalSolved?: number;
}

export function PlatformsManager() {
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [usernamesInput, setUsernamesInput] = useState<Record<string, string>>({});
  const [errorMap, setErrorMap] = useState<Record<string, string>>({});
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});
  const [showStepsMap, setShowStepsMap] = useState<Record<string, boolean>>({});
  
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
      console.error("Error loading linkages in PlatformsManager:", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAllLinkages();
    }
  }, [token]);

  const copyToClipboard = (platform: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMap((prev) => ({ ...prev, [platform]: true }));
    setTimeout(() => {
      setCopiedMap((prev) => ({ ...prev, [platform]: false }));
    }, 2000);
  };

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

      setUsernamesInput((prev) => ({ ...prev, [platform]: "" }));
      await fetchAllLinkages();
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
    } catch (err) {
      setErrorMap((prev) => ({ ...prev, [platform]: "Network error. Please try again." }));
    } finally {
      setLoadingMap((prev) => ({ ...prev, [platform]: false }));
    }
  };

  const handleUnlink = async (platform: string) => {
    if (!window.confirm(`Are you sure you want to disconnect your ${platform} profile? Daily streak tracking for this platform will be paused.`)) {
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
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-[#2F8D46]" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.45 14.315c-.143.28-.334.532-.565.745a3.691 3.691 0 0 1-1.104.695 4.51 4.51 0 0 1-3.116-.016 3.79 3.79 0 0 1-2.135-2.078 3.571 3.571 0 0 1-.13-.353h7.418a4.26 4.26 0 0 1-.368 1.008zm-11.99-.654a3.793 3.793 0 0 1-2.134 2.078 4.51 4.51 0 0 1-3.117.016 3.7 3.7 0 0 1-1.104-.695 2.652 2.652 0 0 1-.564-.745 4.221 4.221 0 0 1-.368-1.006H9.59c-.038.12-.08.238-.13.352zm14.501-1.758a3.849 3.849 0 0 0-.082-.475l-9.634-.008a3.932 3.932 0 0 1 1.143-2.348c.363-.35.79-.625 1.26-.809a3.97 3.97 0 0 1 4.484.957l1.521-1.49a5.7 5.7 0 0 0-1.922-1.357 6.283 6.283 0 0 0-2.544-.49 6.35 6.35 0 0 0-2.405.457 6.007 6.007 0 0 0-1.963 1.276 6.142 6.142 0 0 0-1.325 1.94 5.862 5.862 0 0 0-.466 1.864h-.063a5.857 5.857 0 0 0-.467-1.865 6.13 6.13 0 0 0-1.325-1.939A6 6 0 0 0 8.21 6.34a6.698 6.698 0 0 0-4.949.031A5.708 5.708 0 0 0 1.34 7.73l1.52 1.49a4.166 4.166 0 0 1 4.484-.958c.47.184.898.46 1.26.81.368.36.66.792.859 1.268.146.344.242.708.285 1.08l-9.635.008A4.714 4.714 0 0 0 0 12.457a6.493 6.493 0 0 0 .345 2.127 4.927 4.927 0 0 0 1.08 1.783c.528.56 1.17 1 1.88 1.293a6.454 6.454 0 0 0 2.504.457c.824.005 1.64-.15 2.404-.457a5.986 5.986 0 0 0 1.964-1.277 6.116 6.116 0 0 0 1.686-3.076h.273a6.13 6.13 0 0 0 1.686 3.077 5.99 5.99 0 0 0 1.964 1.276 6.345 6.345 0 0 0 2.405.457 6.45 6.45 0 0 0 2.502-.457 5.42 5.42 0 0 0 1.882-1.293 4.928 4.928 0 0 0 1.08-1.783A6.52 6.52 0 0 0 24 12.457a4.757 4.757 0 0 0-.039-.554z" />
          </svg>
        );
      default:
        return <Link2 className="w-4 h-4 text-zinc-400" />;
    }
  };

  const toggleSteps = (platform: string) => {
    setShowStepsMap((prev) => ({ ...prev, [platform]: !prev[platform] }));
  };

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h2 className="text-lg font-bold text-zinc-800 dark:text-white tracking-tight">Connected Platforms</h2>
        <p className="text-xs text-zinc-450 mt-1.5 leading-relaxed">
          Link your profiles to automatically pull daily solved problem counts and verify active streak milestones.
        </p>
      </div>

      <div className="space-y-4">
        {(["LeetCode", "GeeksforGeeks"] as const).map((plat) => {
          const linkage = linkages[plat];
          const isLinked = !!linkage;
          const isVerified = linkage?.isVerified ?? false;
          const loading = loadingMap[plat] || false;
          const error = errorMap[plat] || "";
          const showSteps = showStepsMap[plat] || false;

          return (
            <div
              key={plat}
              className="bg-zinc-50 dark:bg-black/30 border border-zinc-200 dark:border-white/[0.04] rounded-2xl p-5 hover:border-zinc-300 dark:hover:border-white/[0.06] transition-all duration-200 shadow-sm text-left relative overflow-hidden"
            >
              {/* Row Header */}
              <div className="flex items-center justify-between flex-wrap gap-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/[0.04] flex items-center justify-center shrink-0 shadow-sm select-none">
                    {getPlatformLogo(plat)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-800 dark:text-white tracking-wide">{plat}</h3>
                    <p className="text-[11px] text-zinc-550 dark:text-zinc-450 mt-0.5 font-mono">
                      {isLinked ? `@${linkage.username}` : "Not linked"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Status Indicator */}
                  {isVerified ? (
                    <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-full text-[9px] font-extrabold text-emerald-650 dark:text-emerald-400 select-none shadow-sm uppercase tracking-wider">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>Connected</span>
                    </div>
                  ) : isLinked ? (
                    <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/25 px-2.5 py-1 rounded-full text-[9px] font-extrabold text-amber-600 dark:text-amber-400 select-none shadow-sm uppercase tracking-wider">
                      <AlertCircle className="w-3 h-3 text-amber-500" />
                      <span>Pending Setup</span>
                    </div>
                  ) : (
                    <span className="text-[9px] font-extrabold text-zinc-500 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/[0.04] px-2.5 py-1 rounded-full select-none uppercase tracking-wider">
                      Not connected
                    </span>
                  )}

                  {/* Actions / Dropdown trigger */}
                  {isLinked && (
                    <button
                      onClick={() => handleUnlink(plat)}
                      disabled={loading}
                      className="p-1.5 rounded-lg border border-zinc-200 dark:border-white/5 bg-white dark:bg-white/5 text-zinc-450 hover:text-red-500 hover:border-red-500/20 transition-all cursor-pointer active:scale-90"
                      title="Disconnect Profile"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Verified details stats summary row */}
              {isVerified && linkage && (
                <div className="mt-4 pt-3.5 border-t border-zinc-200 dark:border-white/[0.04] flex items-center justify-between text-xs text-zinc-550 dark:text-zinc-400">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Active Solves:</span>
                    <span className="font-mono font-extrabold text-zinc-800 dark:text-zinc-200">{linkage.totalSolved ?? 0} problems</span>
                  </div>
                  <a
                    href={getProfileUrl(plat, linkage.username)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-zinc-950 dark:hover:text-white transition-colors"
                  >
                    <span>View Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Pending setup toggle selector */}
              {isLinked && !isVerified && (
                <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-white/[0.04]">
                  <button
                    onClick={() => toggleSteps(plat)}
                    className="flex items-center gap-1.5 text-xs text-violet-600 dark:text-violet-400 hover:text-violet-750 dark:hover:text-violet-300 font-bold transition-all cursor-pointer select-none"
                  >
                    <span>{showSteps ? "Hide verification token guide" : "Show verification token guide"}</span>
                    {showSteps ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              )}

              {/* Error Box */}
              {error && (
                <div className="text-xs text-red-500 bg-red-500/5 border border-red-500/10 rounded-xl px-3 py-2 mt-3.5 leading-relaxed relative z-10 font-medium">
                  {error}
                </div>
              )}

              {/* Unified Collapsible Steps timelines (renders only if showSteps toggle is open or if user hasn't linked profile) */}
              {(!isLinked || (isLinked && !isVerified && showSteps)) && (
                <div className="mt-5 pt-4 border-t border-zinc-200 dark:border-white/[0.04] space-y-5 relative z-10 pl-6 border-l border-zinc-200 dark:border-white/[0.04] ml-3.5 text-left">
                  
                  {/* Step 1: Link Handle */}
                  <div className="relative">
                    {isLinked ? (
                      <span className="absolute -left-[32.5px] top-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-emerald-600 dark:text-emerald-400 font-extrabold shadow-sm select-none">
                        ✓
                      </span>
                    ) : (
                      <span className="absolute -left-[32.5px] top-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/[0.06] text-[9.5px] font-bold text-zinc-500 shadow-inner select-none">
                        1
                      </span>
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Connect Username / Handle</h4>
                      <p className="text-[11px] text-zinc-550 mt-1 leading-relaxed">
                        Provide your public coding profile username to generate a secure validation token.
                      </p>
                      
                      {!isLinked && (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleLinkSubmit(plat);
                          }}
                          className="mt-3 flex gap-2.5 max-w-md"
                        >
                          <div className="flex-1 relative">
                            <span className="absolute left-3 top-2 text-zinc-450 dark:text-zinc-650 font-mono text-xs select-none">@</span>
                            <input
                              type="text"
                              required
                              placeholder={`e.g. ${plat === "LeetCode" ? "leetcode_coder" : "gfg_geek"}`}
                              value={usernamesInput[plat] || ""}
                              onChange={(e) => setUsernamesInput((prev) => ({ ...prev, [plat]: e.target.value }))}
                              className="w-full bg-white dark:bg-black/30 border border-zinc-200 dark:border-white/[0.06] focus:border-zinc-300 dark:focus:border-white/15 rounded-lg pl-7 pr-3 py-1.5 text-xs text-zinc-850 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-650 focus:outline-none transition-all shadow-sm font-medium"
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={loading}
                            className="bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-extrabold px-3.5 rounded-lg text-xs flex items-center justify-center shrink-0 active:scale-[0.98] transition-all cursor-pointer"
                          >
                            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Link"}
                          </button>
                        </form>
                      )}
                    </div>
                  </div>

                  {/* Step 2: Verification Token */}
                  <div className="relative">
                    <span className="absolute -left-[32.5px] top-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/[0.06] text-[9.5px] font-bold text-zinc-500 shadow-inner select-none">
                      2
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Paste Token in Profile Bio</h4>
                      <p className="text-[11px] text-zinc-550 mt-1 leading-relaxed">
                        Copy the generated token below and paste it anywhere in your <b>{plat} profile bio / "About Me"</b> section.
                      </p>

                      {!isLinked ? (
                        <div className="mt-3 bg-zinc-100 dark:bg-white/[0.01] border border-dashed border-zinc-200 dark:border-white/[0.04] rounded-lg p-2.5 flex items-center gap-2 max-w-md text-zinc-400 select-none">
                          <Key className="w-3.5 h-3.5 shrink-0" />
                          <span className="text-[9px] font-extrabold uppercase tracking-wider">Token locked until Step 1 complete</span>
                        </div>
                      ) : (
                        <div className="mt-3 space-y-3 max-w-md">
                          <div
                            onClick={() => copyToClipboard(plat, linkage.verificationToken)}
                            className="bg-white dark:bg-black/30 border border-zinc-200 dark:border-white/[0.06] hover:border-zinc-300 dark:hover:border-white/15 rounded-xl p-3 flex items-center justify-between shadow-sm cursor-pointer transition-all active:scale-[0.99] group/token"
                          >
                            <div>
                              <span className="text-[8px] text-zinc-450 dark:text-zinc-500 font-bold uppercase tracking-wider block">Bio Token</span>
                              <code className="text-xs font-mono font-bold text-zinc-850 dark:text-white mt-0.5 block select-all">{linkage.verificationToken}</code>
                            </div>
                            <span className="text-[9px] text-zinc-455 font-bold uppercase group-hover/token:text-zinc-800 dark:group-hover/token:text-zinc-200 transition-colors flex items-center gap-1 shrink-0 select-none">
                              {copiedMap[plat] ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </span>
                          </div>
                          
                          <a
                            href={plat === "LeetCode" ? "https://leetcode.com/profile/" : `https://www.geeksforgeeks.org/user/${linkage.username}/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/5 hover:bg-zinc-50 dark:hover:bg-white/10 rounded-lg text-[10px] font-bold text-zinc-700 dark:text-zinc-350 transition-all select-none cursor-pointer"
                          >
                            <ExternalLink className="w-3 h-3 text-zinc-400" />
                            <span>Edit {plat} Bio</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Step 3: Run Check */}
                  <div className="relative">
                    <span className="absolute -left-[32.5px] top-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/[0.06] text-[9.5px] font-bold text-zinc-555 shadow-inner select-none">
                      3
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Verify Profile Connection</h4>
                      <p className="text-[11px] text-zinc-555 mt-1 leading-relaxed">
                        Confirm you have updated your bio. Our validator will scan your profile and connect consistency payouts.
                      </p>

                      {!isLinked ? (
                        <button
                          disabled
                          className="w-full max-w-xs mt-3 bg-zinc-100 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.04] text-zinc-400 font-extrabold py-2 rounded-lg text-xs cursor-not-allowed select-none"
                        >
                          Verify Connection
                        </button>
                      ) : (
                        <button
                          onClick={() => handleVerify(plat)}
                          disabled={loading}
                          className="w-full max-w-xs mt-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-extrabold py-2 rounded-lg text-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                        >
                          {loading ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <>Verify Connection</>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
}
