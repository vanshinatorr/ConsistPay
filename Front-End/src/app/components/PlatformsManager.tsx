import React, { useState, useEffect } from "react";
import { Link2, CheckCircle2, AlertCircle, ExternalLink, Trash2, Loader2, Key, Copy, Check } from "lucide-react";

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
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-[#FFA116]" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
          </svg>
        );
      case "GeeksforGeeks":
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-[#2F8D46]" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.45 14.315c-.143.28-.334.532-.565.745a3.691 3.691 0 0 1-1.104.695 4.51 4.51 0 0 1-3.116-.016 3.79 3.79 0 0 1-2.135-2.078 3.571 3.571 0 0 1-.13-.353h7.418a4.26 4.26 0 0 1-.368 1.008zm-11.99-.654a3.793 3.793 0 0 1-2.134 2.078 4.51 4.51 0 0 1-3.117.016 3.7 3.7 0 0 1-1.104-.695 2.652 2.652 0 0 1-.564-.745 4.221 4.221 0 0 1-.368-1.006H9.59c-.038.12-.08.238-.13.352zm14.501-1.758a3.849 3.849 0 0 0-.082-.475l-9.634-.008a3.932 3.932 0 0 1 1.143-2.348c.363-.35.79-.625 1.26-.809a3.97 3.97 0 0 1 4.484.957l1.521-1.49a5.7 5.7 0 0 0-1.922-1.357 6.283 6.283 0 0 0-2.544-.49 6.35 6.35 0 0 0-2.405.457 6.007 6.007 0 0 0-1.963 1.276 6.142 6.142 0 0 0-1.325 1.94 5.862 5.862 0 0 0-.466 1.864h-.063a5.857 5.857 0 0 0-.467-1.865 6.13 6.13 0 0 0-1.325-1.939A6 6 0 0 0 8.21 6.34a6.698 6.698 0 0 0-4.949.031A5.708 5.708 0 0 0 1.34 7.73l1.52 1.49a4.166 4.166 0 0 1 4.484-.958c.47.184.898.46 1.26.81.368.36.66.792.859 1.268.146.344.242.708.285 1.08l-9.635.008A4.714 4.714 0 0 0 0 12.457a6.493 6.493 0 0 0 .345 2.127 4.927 4.927 0 0 0 1.08 1.783c.528.56 1.17 1 1.88 1.293a6.454 6.454 0 0 0 2.504.457c.824.005 1.64-.15 2.404-.457a5.986 5.986 0 0 0 1.964-1.277 6.116 6.116 0 0 0 1.686-3.076h.273a6.13 6.13 0 0 0 1.686 3.077 5.99 5.99 0 0 0 1.964 1.276 6.345 6.345 0 0 0 2.405.457 6.45 6.45 0 0 0 2.502-.457 5.42 5.42 0 0 0 1.882-1.293 4.928 4.928 0 0 0 1.08-1.783A6.52 6.52 0 0 0 24 12.457a4.757 4.757 0 0 0-.039-.554z" />
          </svg>
        );
      default:
        return <Link2 className="w-5 h-5 text-zinc-450" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">Connected Coding Profiles</h2>
        <p className="text-xs text-zinc-400 mt-1">
          Link your active competitive programming profiles. We verify ownership and pull solve stats to secure your streak payouts.
        </p>
      </div>

      <div className="space-y-5">
        {(["LeetCode", "GeeksforGeeks"] as const).map((plat) => {
          const linkage = linkages[plat];
          const isLinked = !!linkage;
          const isVerified = linkage?.isVerified ?? false;
          const loading = loadingMap[plat] || false;
          const error = errorMap[plat] || "";

          return (
            <div
              key={plat}
              className="bg-[#12131C]/60 backdrop-blur-xl border border-white/[0.04] rounded-2xl p-6 hover:border-white/[0.08] transition-all duration-300 shadow-lg relative overflow-hidden"
            >
              {/* Radial gradient background highlight */}
              <div className="absolute top-0 right-0 w-44 h-44 bg-white/[0.005] rounded-full blur-2xl pointer-events-none" />

              {/* Row Header */}
              <div className="flex items-center justify-between flex-wrap gap-4 relative z-10">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/[0.04] flex items-center justify-center shrink-0 shadow-inner select-none">
                    {getPlatformLogo(plat)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-wide">{plat}</h3>
                    {isLinked && (
                      <p className="text-[11px] text-zinc-450 font-mono mt-0.5">
                        Linked handle: <span className="text-emerald-400 font-bold">@{linkage.username}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isLinked ? (
                    <>
                      {isVerified ? (
                        <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold text-emerald-450 select-none shadow-sm hover:scale-[1.02] transition-transform">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Connected</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-[10px] font-bold text-amber-450 select-none shadow-sm animate-pulse">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Awaiting Verification</span>
                        </div>
                      )}

                      {/* Open profile link */}
                      {isVerified && (
                        <a
                          href={getProfileUrl(plat, linkage.username)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white/5 border border-white/[0.04] hover:bg-white/10 text-zinc-400 hover:text-white rounded-xl transition-all shadow-inner cursor-pointer"
                          title="View Profile"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}

                      {/* Unlink trash */}
                      <button
                        onClick={() => handleUnlink(plat)}
                        disabled={loading}
                        className="p-2 bg-red-500/5 hover:bg-red-500/15 border border-red-500/10 hover:border-red-500/25 text-red-400 rounded-xl transition-all cursor-pointer active:scale-95"
                        title="Disconnect Profile"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="bg-white/5 border border-white/[0.04] text-zinc-550 text-[10px] font-bold px-3 py-1 rounded-full select-none shadow-inner">
                      Not Connected
                    </div>
                  )}
                </div>
              </div>

              {/* Error Alert Box */}
              {error && (
                <div className="text-xs text-rose-400 bg-rose-500/5 border border-rose-500/10 rounded-xl px-3.5 py-2.5 mt-4 leading-relaxed relative z-10">
                  {error}
                </div>
              )}

              {/* Action Forms & Guided Timeline Step sections */}
              {!isLinked ? (
                /* Link Form */
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleLinkSubmit(plat);
                  }}
                  className="mt-5 pt-5 border-t border-white/[0.04] space-y-3 relative z-10"
                >
                  <label className="block text-[9px] font-extrabold text-zinc-500 uppercase tracking-widest px-0.5">
                    Enter {plat} Handle / Username:
                  </label>
                  <div className="flex gap-2.5 max-w-md">
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-2.5 text-zinc-600 font-mono text-sm select-none">@</span>
                      <input
                        type="text"
                        required
                        placeholder={`e.g. ${plat === "LeetCode" ? "leetcode_coder" : "gfg_geek"}`}
                        value={usernamesInput[plat] || ""}
                        onChange={(e) => setUsernamesInput((prev) => ({ ...prev, [plat]: e.target.value }))}
                        className="w-full bg-[#0A0B10] border border-white/[0.06] hover:border-white/12 focus:border-emerald-500 rounded-xl pl-7 pr-3 py-2 text-xs text-white placeholder-zinc-700 focus:outline-none transition-all shadow-inner font-medium"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-450 hover:to-teal-450 text-black font-extrabold px-5 rounded-xl text-xs flex items-center justify-center shrink-0 active:scale-[0.97] transition-all cursor-pointer shadow-md shadow-emerald-500/5 hover:scale-[1.01]"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : "Link Profile"}
                    </button>
                  </div>
                </form>
              ) : (
                !isVerified && (
                  /* Guided Ownership Timeline Wizard */
                  <div className="mt-5 pt-5 border-t border-white/[0.04] space-y-5 relative z-10">
                    <div className="flex items-center gap-2 text-zinc-350 text-xs font-bold uppercase tracking-wider pl-0.5">
                      <Key className="w-4 h-4 text-emerald-450 shrink-0" />
                      <span>Ownership Verification Steps:</span>
                    </div>

                    <div className="relative pl-6 border-l border-white/[0.06] space-y-6 ml-3">
                      {/* Step 1 */}
                      <div className="relative">
                        <span className="absolute -left-[31px] top-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-[#161720] border border-white/[0.08] text-[9.5px] font-extrabold text-zinc-400 shadow-inner">
                          1
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-zinc-200">Copy Verification Token</h4>
                          <p className="text-[11px] text-zinc-450 mt-0.5 leading-relaxed mb-2.5">
                            This unique token secures ownership of your coding profile. Click the card below to copy it.
                          </p>
                          <div
                            onClick={() => copyToClipboard(plat, linkage.verificationToken)}
                            className="bg-[#0A0B10] border border-white/[0.06] hover:border-emerald-500/25 hover:bg-emerald-500/[0.01] rounded-xl p-3 flex items-center justify-between shadow-inner cursor-pointer transition-all group/token max-w-md active:scale-[0.99]"
                          >
                            <div>
                              <span className="text-[8px] text-zinc-550 font-bold uppercase tracking-wider block">Bio Token</span>
                              <code className="text-xs font-mono font-bold text-emerald-400 mt-0.5 block select-all">{linkage.verificationToken}</code>
                            </div>
                            <span className="text-[9px] text-zinc-500 font-bold uppercase group-hover/token:text-emerald-400 transition-colors flex items-center gap-1.5 select-none shrink-0">
                              {copiedMap[plat] ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-450" />
                                  <span className="text-emerald-400 font-black">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-zinc-650" />
                                  <span>Copy Token</span>
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="relative">
                        <span className="absolute -left-[31px] top-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-[#161720] border border-white/[0.08] text-[9.5px] font-extrabold text-zinc-400 shadow-inner">
                          2
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-zinc-200">Update Profile Bio</h4>
                          <p className="text-[11px] text-zinc-450 mt-0.5 leading-relaxed">
                            Paste this copied token into your <b>{plat} account bio / description settings</b>.
                          </p>
                          <a
                            href={plat === "LeetCode" ? "https://leetcode.com/profile/" : `https://www.geeksforgeeks.org/user/${linkage.username}/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 mt-2.5 px-3 py-1.5 bg-white/5 border border-white/[0.04] hover:bg-white/10 hover:border-white/10 rounded-lg text-[10px] font-bold text-zinc-300 transition-all select-none active:scale-95 cursor-pointer shadow-sm"
                          >
                            <ExternalLink className="w-3 h-3 text-zinc-450" />
                            <span>Go to {plat} Settings</span>
                          </a>
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="relative">
                        <span className="absolute -left-[31px] top-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-[#161720] border border-white/[0.08] text-[9.5px] font-extrabold text-zinc-400 shadow-inner">
                          3
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-zinc-200">Verify Profile Connection</h4>
                          <p className="text-[11px] text-zinc-450 mt-0.5 leading-relaxed">
                            Our automated validator will scan your {plat} bio. Once updated, click verify to sync.
                          </p>
                          <button
                            onClick={() => handleVerify(plat)}
                            disabled={loading}
                            className="w-full max-w-xs mt-3.5 bg-emerald-500 hover:bg-emerald-450 text-black font-extrabold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] shadow-md shadow-emerald-500/10 hover:scale-[1.01]"
                          >
                            {loading ? (
                              <Loader2 className="w-4 h-4 animate-spin text-black" />
                            ) : (
                              <>Verify Profile Ownership</>
                            )}
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                )
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
