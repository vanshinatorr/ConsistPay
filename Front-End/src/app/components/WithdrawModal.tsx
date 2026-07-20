import { useState, useEffect } from "react";
import { X, ArrowRight, Loader2, Coins, Calendar, CheckCircle, Clock, AlertTriangle, Zap, Swords } from "lucide-react";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  consistencyBalance: number;
  battleBalance: number;
  walletType: "consistency" | "battle";
  onSuccess?: () => void;
}

export function WithdrawModal({ 
  isOpen: initialIsOpen, 
  onClose, 
  consistencyBalance,
  battleBalance,
  walletType: initialWalletType,
  onSuccess 
}: WithdrawModalProps) {
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const [walletType, setWalletType] = useState<"consistency" | "battle">(initialWalletType);
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token") || "";

  const availableBalance = walletType === "battle" ? battleBalance : consistencyBalance;

  // Sync props to state
  useEffect(() => {
    setIsOpen(initialIsOpen);
  }, [initialIsOpen]);

  useEffect(() => {
    setWalletType(initialWalletType);
  }, [initialWalletType]);

  // Global listener for banner click
  useEffect(() => {
    const handleOpen = (e: any) => {
      const type = e.detail?.walletType || "consistency";
      setWalletType(type);
      setIsOpen(true);
    };
    window.addEventListener("open-withdraw-modal", handleOpen);
    return () => window.removeEventListener("open-withdraw-modal", handleOpen);
  }, []);

  // Fetch withdrawals history
  const fetchWithdrawalsHistory = async () => {
    if (!isOpen) return;
    try {
      setHistoryLoading(true);
      const res = await fetch(`${API}/api/payment/withdrawals`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setWithdrawals(data);
      }
    } catch (err) {
      console.error("Failed to fetch withdrawals:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawalsHistory();
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const amountVal = parseFloat(Number(amount).toFixed(2));
    if (isNaN(amountVal) || amountVal <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    if (amountVal < 1) {
      setError("Minimum withdrawal amount is ₹1.");
      return;
    }
    if (amountVal > availableBalance) {
      setError(`Insufficient balance. You can only withdraw up to ₹${availableBalance}.`);
      return;
    }
    
    const trimmedUpi = upiId.trim();
    if (!trimmedUpi || !trimmedUpi.includes("@") || trimmedUpi.split("@").length !== 2 || trimmedUpi.startsWith("@") || trimmedUpi.endsWith("@")) {
      setError("Please enter a valid UPI ID format (e.g. username@bank).");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API}/api/payment/withdraw`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: amountVal,
          upiId: trimmedUpi,
          walletType
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to submit withdrawal request.");
      }

      setSuccess(true);
      setAmount("");
      setUpiId(trimmedUpi);
      if (onSuccess) onSuccess();
      fetchWithdrawalsHistory();
    } catch (err: any) {
      setError(err.message || "We encountered a network error while submitting your withdrawal. Please verify your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLocalClose = () => {
    setSuccess(false);
    setError("");
    setIsOpen(false);
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={handleLocalClose} />
      
      <div className="relative bg-white dark:bg-[#0C0D15]/95 border border-zinc-200 dark:border-white/[0.08] rounded-3xl p-6 w-full max-w-lg shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Ambient top light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 blur-md pointer-events-none" />
        
        {/* Close Button */}
        <button
          onClick={handleLocalClose}
          className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 border border-zinc-200/50 dark:border-white/[0.04] rounded-xl transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-4">
          <h2 className="text-lg font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
            <Coins className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
            Request Withdrawal
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-1">
            Withdraw secured consistency payouts or battle winnings directly to your UPI ID.
          </p>
        </div>

        {/* Dynamic Wallet Segment Selector */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-100 dark:bg-[#14151f] border border-zinc-200/60 dark:border-white/[0.04] rounded-xl mb-4">
          <button
            type="button"
            onClick={() => { setWalletType("consistency"); setAmount(""); setError(""); setSuccess(false); }}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
              walletType === "consistency" 
                ? "bg-white dark:bg-white/10 text-zinc-900 dark:text-white border border-zinc-200 dark:border-white/[0.08] shadow-sm" 
                : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-455 dark:hover:text-zinc-200"
            }`}
          >
            Habits Wallet (₹{consistencyBalance})
          </button>
          <button
            type="button"
            onClick={() => { setWalletType("battle"); setAmount(""); setError(""); setSuccess(false); }}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
              walletType === "battle" 
                ? "bg-white dark:bg-white/10 text-zinc-900 dark:text-white border border-zinc-200 dark:border-white/[0.08] shadow-sm" 
                : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-455 dark:hover:text-zinc-200"
            }`}
          >
            Battle Wallet (₹{battleBalance})
          </button>
        </div>

        {/* Balance Display */}
        <div className="bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.04] rounded-2xl p-4 mb-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-455 uppercase tracking-wider block font-bold">Available Payout Amount</span>
            <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1 block">₹{availableBalance}</span>
          </div>
          <span className="text-[10px] uppercase font-extrabold px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400 tracking-wider">
            {walletType === "battle" ? "Battle Stake" : "Habit Reward"}
          </span>
        </div>

        {/* Withdrawal Form or Success Screen */}
        <div className="shrink-0">
          {success ? (
            <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-6 text-center space-y-3.5 mb-4 animate-in fade-in duration-300">
              <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-zinc-950 dark:text-white font-extrabold text-sm">Request Submitted!</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed max-w-xs mx-auto mt-1">
                  Your withdrawal request has been received. Payout will be processed and sent to your UPI ID in 1-3 business days.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 mb-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-2.5 text-xs text-red-500 dark:text-red-400 animate-in fade-in duration-200">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-500 dark:text-zinc-400 font-bold block">UPI ID</label>
                <input
                  type="text"
                  placeholder="example@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-[#14151f] border border-zinc-200 dark:border-white/10 rounded-xl p-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-violet-500/70 focus:ring-4 focus:ring-violet-500/10 transition-all placeholder-zinc-400 dark:placeholder-zinc-650"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-500 dark:text-zinc-400 font-bold block">Withdraw Amount (₹)</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder={`Max ₹${availableBalance}`}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-[#14151f] border border-zinc-200 dark:border-white/10 rounded-xl p-3 pr-16 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-violet-500/70 focus:ring-4 focus:ring-violet-500/10 transition-all font-mono placeholder-zinc-400 dark:placeholder-zinc-650"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setAmount(String(availableBalance))}
                    disabled={availableBalance <= 0}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 text-[10px] font-bold text-violet-650 dark:text-violet-400 hover:text-violet-850 dark:hover:text-white bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/25 rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  >
                    MAX
                  </button>
                </div>

                {/* Quick Amount Pills */}
                {availableBalance > 0 && (
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {[50, 100, 200, 500].map((quickVal) => {
                      if (quickVal <= availableBalance) {
                        return (
                          <button
                            key={quickVal}
                            type="button"
                            onClick={() => setAmount(String(quickVal))}
                            className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 border border-zinc-200 dark:border-white/[0.04] rounded-lg text-[10px] text-zinc-600 dark:text-zinc-350 transition-all font-bold font-mono cursor-pointer"
                          >
                            ₹{quickVal}
                          </button>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !amount || !upiId || availableBalance <= 0}
                className="w-full py-3 bg-emerald-550 hover:bg-emerald-500 text-white dark:text-black font-extrabold rounded-xl shadow-lg shadow-emerald-500/10 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-40"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Confirm Payout Withdrawal
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Transaction History Log Section */}
        <div className="border-t border-zinc-200 dark:border-white/[0.08] pt-4 mt-1 flex-1 overflow-y-auto custom-scrollbar min-h-[140px]">
          <h4 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mb-2.5 uppercase tracking-widest flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Payout History Logs
          </h4>

          {historyLoading && withdrawals.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500 animate-pulse">Loading transaction database logs...</div>
          ) : withdrawals.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-600 font-medium">No previous withdrawal requests found.</div>
          ) : (
            <div className="space-y-2">
              {withdrawals.map((w) => (
                <div key={w._id} className="bg-zinc-50/50 hover:bg-zinc-100/50 dark:bg-white/[0.01] dark:hover:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.04] rounded-xl p-3 flex items-center justify-between text-xs transition-colors">
                  <div>
                    <div className="font-bold text-zinc-900 dark:text-zinc-200 font-mono">₹{w.amount}</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">UPI: {w.upiId}</div>
                    <div className="text-[9px] text-zinc-500 dark:text-zinc-600 mt-1 flex items-center gap-1 font-medium">
                      <Calendar className="w-3 h-3" />
                      {new Date(w.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase flex items-center gap-1 ${
                    w.status === "completed" 
                      ? "text-emerald-600 bg-emerald-500/10 border border-emerald-500/20"
                      : w.status === "failed"
                      ? "text-red-500 bg-red-500/10 border border-red-500/20"
                      : "text-amber-500 bg-amber-500/10 border border-amber-500/20"
                  }`}>
                    <span className={`w-1 h-1 rounded-full ${
                      w.status === "completed" ? "bg-emerald-600" : w.status === "failed" ? "bg-red-500" : "bg-amber-500"
                    }`} />
                    {w.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default WithdrawModal;
