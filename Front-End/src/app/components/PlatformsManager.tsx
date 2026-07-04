import React, { useState, useEffect } from "react";
import { Link2, CheckCircle2, AlertCircle, ExternalLink, Trash2, Loader2, Key } from "lucide-react";

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
        <h2 className="text-xl font-bold text-white">Connected Coding Profiles</h2>
        <p className="text-xs text-zinc-400 mt-1">
          Link your active competitive programming profiles. We verify ownership and pull solve stats to secure your streak payouts.
        </p>
      </div>

      <div className="space-y-4">
        {(["LeetCode", "GeeksforGeeks"] as const).map((plat) => {
          const linkage = linkages[plat];
          const isLinked = !!linkage;
          const isVerified = linkage?.isVerified ?? false;
          const loading = loadingMap[plat] || false;
          const error = errorMap[plat] || "";

          return (
            <div
              key={plat}
              className="bg-[#12131A] border border-white/[0.04] rounded-2xl p-5 hover:border-white/[0.08] transition-all duration-300 shadow-md"
            >
              {/* Row Header */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/[0.04] flex items-center justify-center shrink-0 shadow-inner">
                    {getPlatformLogo(plat)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-wide">{plat}</h3>
                    {isLinked && (
                      <p className="text-xs text-zinc-400 font-mono mt-0.5">Linked handle: <span className="text-emerald-400 font-bold">@{linkage.username}</span></p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isLinked ? (
                    <>
                      {isVerified ? (
                        <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Connected</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded-full text-xs font-bold text-yellow-400 animate-pulse">
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
                          className="p-2 bg-white/5 border border-white/[0.04] hover:bg-white/10 text-zinc-400 hover:text-white rounded-xl transition-all"
                          title="View Profile"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}

                      {/* Unlink */}
                      <button
                        onClick={() => handleUnlink(plat)}
                        disabled={loading}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl transition-all cursor-pointer"
                        title="Disconnect Profile"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-bold text-zinc-550 select-none">Not Linked</span>
                  )}
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <p className="text-xs text-rose-400 bg-rose-500/5 border border-rose-500/10 rounded-xl px-3 py-2 mt-3 leading-relaxed">
                  {error}
                </p>
              )}

              {/* Action Forms */}
              {!isLinked ? (
                /* Link Form */
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleLinkSubmit(plat);
                  }}
                  className="mt-4 pt-4 border-t border-white/[0.04] space-y-3"
                >
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    Enter {plat} Username / Handle:
                  </label>
                  <div className="flex gap-2 max-w-md">
                    <input
                      type="text"
                      required
                      placeholder={`e.g. ${plat === "LeetCode" ? "lc_user" : "gfg_user"}`}
                      value={usernamesInput[plat] || ""}
                      onChange={(e) => setUsernamesInput((prev) => ({ ...prev, [plat]: e.target.value }))}
                      className="flex-1 bg-[#0A0B10] border border-white/[0.06] rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-755 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-emerald-500 hover:bg-emerald-450 text-black font-bold px-4 rounded-xl text-xs flex items-center justify-center shrink-0 active:scale-95 transition-all cursor-pointer"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Link Profile"}
                    </button>
                  </div>
                </form>
              ) : (
                !isVerified && (
                  /* Verify Form */
                  <div className="mt-4 pt-4 border-t border-white/[0.04] space-y-3 max-w-xl">
                    <div className="flex items-center gap-2 text-zinc-400 text-xs">
                      <Key className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Ownership Verification Steps:</span>
                    </div>

                    <div className="bg-[#0A0B10] border border-white/[0.06] rounded-xl p-3.5 flex items-center justify-between shadow-inner">
                      <div>
                        <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider block">Bio Token</span>
                        <code className="text-sm font-mono font-bold text-emerald-400 mt-0.5 block select-all">{linkage.verificationToken}</code>
                      </div>
                      <span className="text-[9px] text-zinc-500 select-all cursor-pointer hover:text-emerald-400 transition-all font-bold uppercase">Click to Copy</span>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed pl-1">
                      1. Copy the bio token above.<br/>
                      2. Paste this token into your <b>{plat} account bio / description</b> settings.<br/>
                      3. Click the verify button below to sync ownership.
                    </p>

                    <button
                      onClick={() => handleVerify(plat)}
                      disabled={loading}
                      className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/25 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>Verify Profile Ownership</>
                      )}
                    </button>
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
