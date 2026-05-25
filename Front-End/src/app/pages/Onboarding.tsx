import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Zap, IndianRupee } from "lucide-react";

export function Onboarding() {
  const [step, setStep] = useState(1);
  const [plan, setPlan] = useState<"Free" | "Pro" | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token") || "";
      
      // Step 1: Create Order
const orderRes = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
       body: JSON.stringify({ 
  plan, 
  dailyCommitment: amount,
  depositAmount: amount ? amount * 30 : 0,
  totalAmount: amount ? amount * 30 : 0
})
      });
      const orderData = await orderRes.json();

      // Step 2: Open Razorpay Checkout
      const options = {
       key: import.meta.env.VITE_RAZORPAY_KEY, // Placeholder Test Key
        amount: orderData.amount, // Amount is in currency subunits (paise)
        currency: "INR",
        name: "ConsistPay",
        description: `${plan} Plan - Daily Commitment: ₹${amount}`,
        order_id: orderData.order_id,
        handler: async function (response: any) {
          
          // Step 3: Verify Payment
          const verifyRes = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            })
          });
          const verifyData = await verifyRes.json();



         if (verifyData.onboardingComplete) {
  // Step 4: Redirect on success
  navigate("/dashboard");
} else {
  alert("Payment verification failed! Please contact support.");
}


        },
        prefill: {
          name: "Coding Warrior",
          email: "coder@consistpay.com",
        },
        theme: {
          color: "#7C3AED" // Purple accent
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any){
        alert("Payment Failed: " + response.error.description);
      });
      rzp.open();
      
    } catch (err) {
      console.error("Payment error:", err);
      alert("Something went wrong initializing the payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
        
        {/* Progress Bar */}
        <div className="flex justify-between mb-8 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -z-10 rounded-full translate-y-[-50%]"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-[#7C3AED] -z-10 rounded-full translate-y-[-50%] transition-all duration-300"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          ></div>
          {[1, 2, 3].map((num) => (
            <div 
              key={num} 
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                step >= num ? "bg-[#7C3AED] text-white shadow-[0_0_15px_rgba(124,58,237,0.5)]" : "bg-[#1a1a1a] text-zinc-500 border border-white/10"
              }`}
            >
              {num}
            </div>
          ))}
        </div>

        {/* ──────── STEP 1: PLAN SELECTION ──────── */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold mb-2 text-center">Choose Your Plan</h2>
            <p className="text-zinc-400 text-sm text-center mb-8">Select how you want to build your consistency.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => setPlan("Free")}
                className={`p-6 rounded-xl border text-left transition-all ${plan === "Free" ? "border-[#7C3AED] bg-[#7C3AED]/10" : "border-white/10 bg-white/5 hover:border-white/30"}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-white/10 rounded-lg"><CheckCircle className="w-5 h-5 text-zinc-300" /></div>
                  {plan === "Free" && <div className="w-4 h-4 bg-[#7C3AED] rounded-full shadow-[0_0_10px_rgba(124,58,237,0.8)]"></div>}
                </div>
                <h3 className="font-bold text-lg">Free Tier</h3>
                <p className="text-sm text-zinc-400 mt-2">Basic habit tracking with minimal daily stakes.</p>
              </button>
              
              <button 
                onClick={() => setPlan("Pro")}
                className={`p-6 rounded-xl border text-left transition-all ${plan === "Pro" ? "border-[#7C3AED] bg-[#7C3AED]/10" : "border-white/10 bg-white/5 hover:border-white/30"}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-gradient-to-br from-[#7C3AED] to-pink-500 rounded-lg"><Zap className="w-5 h-5 text-white" /></div>
                  {plan === "Pro" && <div className="w-4 h-4 bg-[#7C3AED] rounded-full shadow-[0_0_10px_rgba(124,58,237,0.8)]"></div>}
                </div>
                <h3 className="font-bold text-lg">Pro Tier</h3>
                <p className="text-sm text-zinc-400 mt-2">Higher stakes, exclusive challenges, and real rewards.</p>
              </button>
            </div>
            
            <button 
              onClick={handleNext}
              disabled={!plan}
              className="w-full mt-8 py-4 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 disabled:hover:bg-[#7C3AED] text-white font-bold rounded-xl transition-all"
            >
              Continue
            </button>
          </div>
        )}

        {/* ──────── STEP 2: COMMITMENT AMOUNT ──────── */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <h2 className="text-2xl font-bold mb-2 text-center">Daily Commitment</h2>
            <p className="text-zinc-400 text-sm text-center mb-8">Choose the stake you'll put on the line every day.</p>
            
            <div className="grid grid-cols-2 gap-4">
              {(plan === "Free" ? [5, 10] : [5, 10, 20, 50]).map((val) => (
                <button
                  key={val}
                  onClick={() => setAmount(val)}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${amount === val ? "border-[#7C3AED] bg-[#7C3AED]/10 shadow-[0_0_15px_rgba(124,58,237,0.15)]" : "border-white/10 bg-white/5 hover:border-white/30"}`}
                >
                  <IndianRupee className={`w-6 h-6 ${amount === val ? "text-[#7C3AED]" : "text-zinc-400"}`} />
                  <span className="font-bold text-xl">₹{val}</span>
                  <span className="text-xs text-zinc-500">/ day</span>
                </button>
              ))}
            </div>

            <div className="flex gap-4 mt-8">
              <button 
                onClick={handleBack}
                className="px-6 py-4 border border-white/10 hover:bg-white/5 text-white font-bold rounded-xl transition-all"
              >
                Back
              </button>
              <button 
                onClick={handleNext}
                disabled={!amount}
                className="flex-1 py-4 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 disabled:hover:bg-[#7C3AED] text-white font-bold rounded-xl transition-all"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* ──────── STEP 3: SUMMARY & PAY ──────── */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <h2 className="text-2xl font-bold mb-8 text-center">Summary</h2>
            
            <div className="bg-[#1a1a1a] rounded-xl p-6 mb-8 border border-white/5">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
                <span className="text-zinc-400">Selected Plan</span>
                <span className="font-bold text-lg">{plan} Tier</span>
              </div>
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
                <span className="text-zinc-400">Daily Stake</span>
                <span className="font-bold">₹{amount}</span>
              </div>
              <div className="flex justify-between items-center text-[#7C3AED]">
                <span className="font-medium">Total to Pay (Setup)</span>
                <span className="font-bold text-2xl">₹{amount ? amount * 30 : 0}</span>
              </div>
              <p className="text-xs text-zinc-500 mt-4 text-center">
                * We collect 30 days of stake upfront for your initial commitment wallet.
              </p>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleBack}
                className="px-6 py-4 border border-white/10 hover:bg-white/5 text-white font-bold rounded-xl transition-all"
              >
                Back
              </button>
              <button 
                onClick={handlePayment}
                disabled={loading}
                className="flex-1 py-4 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-70 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  `Pay ₹${amount ? amount * 30 : 0}`
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
