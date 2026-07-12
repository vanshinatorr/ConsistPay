import React, { useState } from "react";
import { X, Loader2, CheckCircle2, AlertCircle, Coins, ShieldCheck, Zap } from "lucide-react";

interface TopupModalProps {
  onClose: () => void;
  onSuccess: (newBalance: number) => void;
}

const API = import.meta.env.VITE_API_URL;

export default function TopupModal({ onClose, onSuccess }: TopupModalProps) {
  const token = localStorage.getItem("token") || "";
  
  const [amount, setAmount] = useState<string>("100");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  const predefinedAmounts = [50, 100, 500, 1000];

  const handleRazorpayTopup = async () => {
    console.log("Razorpay dummy mode: Redirecting to simulated top-up...");
    await handleSkipTopup();
  };

  const handleSkipTopup = async () => {
    setError(null);
    const numAmount = parseInt(amount, 10);
    
    if (isNaN(numAmount) || numAmount < 10) {
      setError("Minimum top-up amount for demo is ₹10.");
      return;
    }
    
    setIsProcessing(true);
    setProcessingStep(1); // Connecting to Secure Server
    
    setTimeout(() => setProcessingStep(2), 1200); // Processing Payment
    
    setTimeout(async () => {
      try {
        const res = await fetch(`${API}/api/payment/topup/skip`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount: numAmount }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setSuccess(true);
        setTimeout(() => {
          onSuccess(data.battleBalance);
          onClose();
        }, 1500);
      } catch (err: any) {
        setError(err.message || "Demo top-up failed.");
        setIsProcessing(false);
        setProcessingStep(0);
      }
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={!isProcessing && !success ? onClose : undefined} 
      />
      
      <div className="relative w-full max-w-md bg-[#0D0D0F] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
              <Coins className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Add Funds</h2>
              <p className="text-xs text-zinc-400">Top-up your Battle wallet</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            disabled={isProcessing || success}
            className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {success ? (
            <div className="py-8 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Payment Successful!</h3>
              <p className="text-zinc-400 text-sm">₹{amount} has been added to your battle wallet.</p>
            </div>
          ) : isProcessing && processingStep > 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8 text-violet-400" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white animate-pulse">
                  {processingStep === 1 ? "Connecting to Bank..." : "Verifying Transaction..."}
                </h3>
                <p className="text-zinc-500 text-xs uppercase tracking-widest font-mono">
                  {processingStep === 1 ? "ESTABLISHING SECURE CONNECTION" : "PROCESSING PAYMENT OF ₹" + amount}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Preset Amounts */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3">Select Amount</label>
                <div className="grid grid-cols-4 gap-2">
                  {predefinedAmounts.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setAmount(preset.toString())}
                      className={`py-2 px-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        amount === preset.toString()
                          ? "bg-violet-600 text-white border-transparent"
                          : "bg-white/[0.02] text-zinc-450 border border-white/[0.04] hover:bg-white/[0.04] hover:text-zinc-250"
                      }`}
                    >
                      ₹{preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div>
                <label className="block text-sm font-medium text-zinc-350 mb-2">Or enter custom amount</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-zinc-500 text-lg font-medium">₹</span>
                  </div>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-[#101012] border border-white/[0.04] text-white rounded-xl pl-8 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500 transition-colors font-mono text-lg"
                    placeholder="Enter amount"
                    min="50"
                  />
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-300">{error}</p>
                </div>
              )}

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-4 text-zinc-500">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" /> 256-bit Encrypted
                </div>
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold">
                  <Zap className="w-3 h-3 text-violet-400" /> Instant Top-up
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {(!success && !(isProcessing && processingStep > 0)) && (
          <div className="p-6 pt-0 flex flex-col gap-3">
            <button
              onClick={handleSkipTopup}
              disabled={isProcessing || !amount || parseInt(amount) < 10}
              className="w-full bg-violet-600 hover:bg-violet-500 text-white rounded-xl py-3.5 font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Zap className="w-4 h-4 shrink-0 text-white" />
                  <span>1-Click Express Pay (₹{amount || "0"})</span>
                </>
              )}
            </button>
            
            <button
              onClick={handleRazorpayTopup}
              disabled={isProcessing || !amount || parseInt(amount) < 50}
              className="w-full bg-white/[0.01] hover:bg-white/[0.03] text-zinc-400 hover:text-zinc-300 border border-white/[0.04] rounded-xl py-3 text-xs font-semibold transition-colors disabled:opacity-50"
            >
              Other Methods (UPI / Card)
            </button>
          </div>
        )}
        
      </div>
    </div>
  );
}

// Utility to load Razorpay script
function loadScript(src: string) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}
