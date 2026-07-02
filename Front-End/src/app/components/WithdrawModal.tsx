import { useState, useEffect } from "react";
import { X, Shield, ArrowRight, Loader2, Coins, Calendar, CheckCircle, Clock, AlertTriangle } from "lucide-react";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  walletType: "consistency" | "battle";
  onSuccess?: () => void;
}

export function WithdrawModal({ 
  isOpen: initialIsOpen, 
  onClose, 
  availableBalance: initialAvailableBalance, 
  walletType: initialWalletType,
  onSuccess 
}: WithdrawModalProps) {
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const [walletType, setWalletType] = useState(initialWalletType);
  const [availableBalance, setAvailableBalance] = useState(initialAvailableBalance);
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token") || "";

  // Sync props to state when modal state changes
  useEffect(() => {
    setIsOpen(initialIsOpen);
  }, [initialIsOpen]);

  useEffect(() => {
    setWalletType(initialWalletType);
  }, [initialWalletType]);

  useEffect(() => {
    setAvailableBalance(initialAvailableBalance);
  }, [initialAvailableBalance]);

  // Global listener for banner click
  useEffect(() => {
    const handleOpen = (e: any) => {
      setWalletType("consistency");
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

    const amountVal = Number(amount);
    if (isNaN(amountVal) || amountVal <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    if (amountVal > availableBalance) {
      setError(`Insufficient balance. You can only withdraw up to ₹${availableBalance}.`);
      return;
    }
    if (!upiId || !upiId.includes("@")) {
      setError("Please enter a valid UPI ID (e.g. name@upi).");
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
          upiId,
          walletType
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to submit withdrawal request.");
      }

      setSuccess(true);
      setAmount("");
      // Refresh user balance on dashboard
      if (onSuccess) onSuccess();
      // Refresh local list
      fetchWithdrawalsHistory();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={handleLocalClose} />
      
      <div className="relative bg-[#0A0A0C] border border-white/10 rounded-3xl p-6 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <button
          onClick={handleLocalClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Coins className="w-5 h-5 text-emerald-400" />
          Request Withdrawal
        </h2>
        <p className="text-zinc-400 text-xs mb-4">
          Withdraw secured consistency payouts or battle winnings directly to your UPI account.
        </p>

        {/* Balance Display */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">Available for Payout</span>
            <span className="text-2xl font-black font-mono text-emerald-400">₹{availableBalance}</span>
          </div>
          <span className="text-[10px] uppercase font-bold px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-zinc-400 tracking-wider">
            {walletType === "battle" ? "⚔️ Versus Stakes" : "⚡ Habits Payout"}
          </span>
        </div>

        {success ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center space-y-3 mb-4">
            <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-white font-bold text-sm">Request Submitted!</h3>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-xs mx-auto">
              Your withdrawal request has been received. Payout will be sent to your UPI ID in 1-3 business days.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mb-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-2.5 text-xs text-red-400">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-semibold">UPI ID</label>
              <input
                type="text"
                placeholder="example@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full bg-[#0F0F13] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-semibold">Withdraw Amount (₹)</label>
              <input
                type="number"
                placeholder={`Max ₹${availableBalance}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[#0F0F13] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors font-mono"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !amount || !upiId}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Confirm Withdrawal
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Withdrawals Log History */}
        <div className="border-t border-white/10 pt-4 flex-1 overflow-y-auto min-h-[150px]">
          <h4 className="text-xs font-bold text-white mb-2.5 uppercase tracking-wider flex items-center gap-1.5 text-zinc-400">
            <Clock className="w-3.5 h-3.5" /> Transaction History
          </h4>

          {historyLoading && withdrawals.length === 0 ? (
            <div className="py-6 text-center text-xs text-zinc-500 animate-pulse">Loading transaction logs...</div>
          ) : withdrawals.length === 0 ? (
            <div className="py-6 text-center text-xs text-zinc-600">No previous withdrawals found.</div>
          ) : (
            <div className="space-y-2">
              {withdrawals.map((w) => (
                <div key={w._id} className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-zinc-300 font-mono">₹{w.amount}</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">UPI: {w.upiId}</div>
                    <div className="text-[9px] text-zinc-550 mt-0.5">
                      {new Date(w.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    w.status === "completed" 
                      ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                      : w.status === "failed"
                      ? "text-red-400 bg-red-500/10 border border-red-500/20"
                      : "text-amber-400 bg-amber-500/10 border border-amber-500/20"
                  }`}>
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
