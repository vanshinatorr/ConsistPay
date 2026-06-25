import os

file_path = "/Users/vansh/Desktop/ConsistPay  /Front-End/src/app/components/CommitmentModal.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Normalize line endings to LF
original_endings_are_crlf = "\r\n" in content
content = content.replace("\r\n", "\n")

replacements = [
    (
        '''                <h1 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
                  Build coding consistency that actually lasts.
                </h1>''',
        '''                <h1 className="text-3xl font-bold tracking-tight text-white leading-tight">
                  Build coding consistency that actually lasts.
                </h1>'''
    ),
    (
        '''                <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">Choose Your Accountability Tier</h2>''',
        '''                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Choose Your Accountability Tier</h2>'''
    ),
    (
        '''                  className={`p-6 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between min-h-[340px] relative overflow-hidden group ${
                    plan === "Free"
                      ? "border-zinc-700 bg-[#121217] shadow-[0_0_20px_rgba(255,255,255,0.01)] ring-1 ring-zinc-500/20"
                      : "border-zinc-800 bg-[#0A0A0E] hover:border-zinc-700 hover:bg-[#0D0D12]"
                  }`}''',
        '''                  className={`p-6 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between min-h-[340px] relative overflow-hidden group ${
                    plan === "Free"
                      ? "border-zinc-700 bg-white/[0.02] shadow-[0_0_20px_rgba(255,255,255,0.01)] ring-1 ring-zinc-500/20"
                      : "border-white/[0.04] bg-white/[0.01] hover:border-zinc-700 hover:bg-white/[0.02]"
                  }`}'''
    ),
    (
        '''                      <h3 className="font-extrabold text-white text-lg tracking-tight">Basic Accountability</h3>''',
        '''                      <h3 className="font-bold text-white text-lg tracking-tight">Basic Accountability</h3>'''
    ),
    (
        '''                      <li className="flex items-center gap-2.5 text-zinc-500">
                        <div className="w-4 h-4 rounded-full bg-zinc-850/50 flex items-center justify-center shrink-0">
                          <Info className="w-3 h-3 text-zinc-555" />
                        </div>
                        <span className="text-[10px]">Requires refundable deposit stake</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-4 flex justify-between items-center w-full border-t border-zinc-800/60 pt-3">
                    <span className="text-sm font-extrabold text-zinc-350">Free Forever</span>
                    {plan === "Free" && <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Selected</span>}''',
        '''                      <li className="flex items-center gap-2.5 text-zinc-550">
                        <div className="w-4 h-4 rounded-full bg-zinc-850/50 flex items-center justify-center shrink-0">
                          <Info className="w-3 h-3 text-zinc-500" />
                        </div>
                        <span className="text-[10px]">Requires refundable deposit stake</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-4 flex justify-between items-center w-full border-t border-white/[0.04] pt-3">
                    <span className="text-sm font-semibold text-zinc-350">Free Forever</span>
                    {plan === "Free" && <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Selected</span>}'''
    ),
    (
        '''                  className={`p-6 rounded-2xl border text-left transition-all duration-300 relative flex flex-col justify-between min-h-[340px] overflow-hidden group ${
                    plan === "Pro"
                      ? "border-violet-500 bg-violet-955/10 shadow-[0_0_30px_rgba(124,58,237,0.1)] ring-1 ring-violet-500/20"
                      : "border-zinc-800 bg-[#0A0A0E] hover:border-violet-500/20 hover:bg-[#0E0E14]"
                  }`}
                >
                  <div className="absolute top-0 right-0 bg-violet-600 text-white text-[8px] font-black px-4 py-1 uppercase tracking-wider rounded-bl-lg shadow-md">''',
        '''                  className={`p-6 rounded-2xl border text-left transition-all duration-300 relative flex flex-col justify-between min-h-[340px] overflow-hidden group ${
                    plan === "Pro"
                      ? "border-violet-500 bg-violet-950/10 shadow-[0_0_30px_rgba(124,58,237,0.1)] ring-1 ring-violet-500/20"
                      : "border-white/[0.04] bg-white/[0.01] hover:border-violet-500/20 hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="absolute top-0 right-0 bg-violet-600 text-white text-[8px] font-bold px-4 py-1 uppercase tracking-wider rounded-bl-lg shadow-md">'''
    ),
    (
        '''                      <h3 className="font-extrabold text-white text-lg tracking-tight">Premium Prep Mode</h3>''',
        '''                      <h3 className="font-bold text-white text-lg tracking-tight">Premium Prep Mode</h3>'''
    ),
    (
        '''                      <li className="flex items-center gap-2.5 text-violet-350">''',
        '''                      <li className="flex items-center gap-2.5 text-violet-350 font-semibold">'''
    ),
    (
        '''                    <div className="flex justify-between items-center w-full">
                      <span className="text-sm font-extrabold text-violet-450">₹49 setup + deposit</span>
                      {plan === "Pro" && <span className="text-[10px] text-violet-400 font-bold uppercase tracking-wider">Active</span>}
                    </div>
                    <div className="text-[10px] text-violet-300/80 leading-normal italic font-medium flex items-center gap-1.5 bg-violet-500/5 border border-violet-500/10 rounded-lg p-1.5 mt-0.5">
                      <span className="text-xs shrink-0">🍔</span>
                      <span>Less than a burger price to unlock Pro!</span>
                    </div>''',
        '''                    <div className="flex justify-between items-center w-full">
                      <span className="text-sm font-semibold text-violet-450">₹49 setup + deposit</span>
                      {plan === "Pro" && <span className="text-[10px] text-violet-400 font-semibold uppercase tracking-wider">Active</span>}
                    </div>
                    <div className="text-[10px] text-violet-300/80 leading-normal italic font-normal flex items-center gap-1.5 bg-violet-500/5 border border-violet-500/10 rounded-lg p-1.5 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                      <span>Less than a cup of coffee to unlock Pro!</span>
                    </div>'''
    ),
    (
        '''              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Select Daily Commitment</h2>
                <p className="text-zinc-400 text-sm">Choose the stake that will keep you accountable every single day.</p>
              </div>

              <div className="grid grid-cols-1 gap-4 pt-2">
                <button
                  onClick={() => setAmount(5)}
                  className={`p-5 rounded-2xl border text-left transition-all flex items-center gap-5 ${
                    amount === 5
                      ? "border-zinc-700 bg-zinc-900/40 ring-2 ring-zinc-500/10"
                      : "border-zinc-800 bg-[#0C0C10] hover:border-zinc-700"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-black text-zinc-300 text-xl shrink-0">
                    ₹5
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Casual Consistency</h4>
                    <p className="text-xs text-zinc-400 mt-1">₹150 refundable deposit pool. Great for building routine.</p>
                  </div>
                  <span className="ml-auto text-xs text-zinc-500 font-semibold uppercase tracking-wider">/ day</span>
                </button>

                <button
                  onClick={() => setAmount(20)}
                  className={`p-5 rounded-2xl border text-left relative flex items-center gap-5 overflow-hidden ${
                    amount === 20
                      ? "border-violet-500 bg-violet-955/10 ring-2 ring-violet-500/20"
                      : "border-zinc-800 bg-[#0C0C10] hover:border-violet-500/20"
                  }`}
                >
                  <div className="absolute top-0 right-0 bg-violet-600 text-white text-[8px] font-black px-3 py-0.5 uppercase tracking-widest rounded-bl-lg shadow-sm">
                    POPULAR
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center font-black text-violet-400 text-xl shrink-0">
                    ₹20
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      Serious Placement Prep
                    </h4>
                    <p className="text-xs text-zinc-300 mt-1">₹600 refundable deposit pool. Keep your focus locked.</p>
                  </div>
                  <span className="ml-auto text-xs text-zinc-400 font-semibold uppercase tracking-wider">/ day</span>
                </button>

                <button
                  onClick={() => setAmount(50)}
                  className={`p-5 rounded-2xl border text-left transition-all flex items-center gap-5 ${
                    amount === 50
                      ? "border-emerald-500 bg-emerald-955/10"
                      : "border-zinc-800 bg-[#0C0C10] hover:border-emerald-500/20"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-black text-emerald-400 text-xl shrink-0">
                    ₹50
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">High Accountability Mode</h4>
                    <p className="text-xs text-zinc-300 mt-1">₹1,500 refundable deposit pool. Maximum dedication.</p>
                  </div>
                  <span className="ml-auto text-xs text-zinc-500 font-semibold uppercase tracking-wider">/ day</span>
                </button>''',
        '''              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Select Daily Commitment</h2>
                <p className="text-zinc-405 text-sm">Choose the stake that will keep you accountable every single day.</p>
              </div>

              <div className="grid grid-cols-1 gap-4 pt-2">
                <button
                  onClick={() => setAmount(5)}
                  className={`p-5 rounded-2xl border text-left transition-all flex items-center gap-5 ${
                    amount === 5
                      ? "border-zinc-700 bg-white/[0.02] ring-2 ring-zinc-500/10"
                      : "border-white/[0.04] bg-white/[0.01] hover:border-zinc-700"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-[#131316] border border-white/[0.04] flex items-center justify-center font-bold text-zinc-300 text-xl shrink-0">
                    ₹5
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-white">Casual Consistency</h4>
                    <p className="text-xs text-zinc-400 mt-1">₹150 refundable deposit pool. Great for building routine.</p>
                  </div>
                  <span className="ml-auto text-xs text-zinc-500 font-medium uppercase tracking-wider">/ day</span>
                </button>

                <button
                  onClick={() => setAmount(20)}
                  className={`p-5 rounded-2xl border text-left relative flex items-center gap-5 overflow-hidden ${
                    amount === 20
                      ? "border-violet-500 bg-violet-950/10 ring-2 ring-violet-500/20"
                      : "border-white/[0.04] bg-white/[0.01] hover:border-violet-500/20"
                  }`}
                >
                  <div className="absolute top-0 right-0 bg-violet-600 text-white text-[8px] font-bold px-3 py-0.5 uppercase tracking-widest rounded-bl-lg shadow-sm">
                    POPULAR
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center font-bold text-violet-400 text-xl shrink-0">
                    ₹20
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-white flex items-center gap-2">
                      Serious Placement Prep
                    </h4>
                    <p className="text-xs text-zinc-300 mt-1">₹600 refundable deposit pool. Keep your focus locked.</p>
                  </div>
                  <span className="ml-auto text-xs text-zinc-400 font-medium uppercase tracking-wider">/ day</span>
                </button>

                <button
                  onClick={() => setAmount(50)}
                  className={`p-5 rounded-2xl border text-left transition-all flex items-center gap-5 ${
                    amount === 50
                      ? "border-emerald-500 bg-emerald-955/10"
                      : "border-zinc-800 bg-[#0C0C10] hover:border-emerald-500/20"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-400 text-xl shrink-0">
                    ₹50
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-white">High Accountability Mode</h4>
                    <p className="text-xs text-zinc-300 mt-1">₹1,500 refundable deposit pool. Maximum dedication.</p>
                  </div>
                  <span className="ml-auto text-xs text-zinc-550 font-medium uppercase tracking-wider">/ day</span>
                </button>'''
    ),
    (
        '''                  <div className="space-y-1">
                    <h3 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">Secure Checkout</h3>
                    <p className="text-xs text-zinc-405 leading-relaxed">
                      Complete your payment securely. Your refundable deposit will be returned after 30 days of consistency.
                    </p>
                  </div>

                  {/* Sandbox Banner */}
                  <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-start gap-2.5 text-amber-300/90 shadow-sm shadow-amber-500/2">
                    <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-405" />
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">🔒 Sandbox Mode Enabled — Production Gateway Pending</h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                        No real money will be charged. Please use the simulated checkout to complete onboarding verification and test the consistency flow.
                      </p>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-3">
                      <AlertTriangle className="w-4.5 h-4.5 text-red-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-red-350">{error}</p>
                    </div>
                  )}

                  <div className="p-5 rounded-2xl border border-zinc-800 bg-[#0C0C10] space-y-3 shadow-inner">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500">Selected Plan</span>
                      <span className="text-white font-bold capitalize flex items-center gap-1.5">
                        {plan === "Pro" && <Sparkles className="w-3.5 h-3.5 text-violet-400" />}
                        {plan} Mode
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500">Daily Commitment</span>
                      <span className="text-white font-bold">₹{amount}/day</span>
                    </div>
                    
                    <div className="h-px bg-zinc-800 w-full" />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-zinc-300 font-bold text-xs">Refundable Deposit</span>
                        <span className="text-zinc-550 text-[9px]">Held securely for 30 days. Fully refundable.</span>
                      </div>
                      <span className="text-white font-black text-sm">₹{amount ? amount * 30 : 0}</span>
                    </div>''',
        '''                  <div className="space-y-1">
                    <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">Secure Checkout</h3>
                    <p className="text-xs text-zinc-405 leading-relaxed">
                      Complete your payment securely. Your refundable deposit will be returned after 30 days of consistency.
                    </p>
                  </div>

                  {/* Sandbox Banner */}
                  <div className="p-3 bg-amber-500/5 border border-white/[0.04] rounded-xl flex items-start gap-2.5 text-amber-300/90 shadow-sm shadow-amber-500/2">
                    <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-450" />
                    <div>
                      <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        Sandbox Mode Enabled — Production Gateway Pending
                      </h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                        No real money will be charged. Please use the simulated checkout to complete onboarding verification and test the consistency flow.
                      </p>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-3">
                      <AlertTriangle className="w-4.5 h-4.5 text-red-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-red-300">{error}</p>
                    </div>
                  )}

                  <div className="p-5 rounded-2xl border border-white/[0.04] bg-white/[0.01] space-y-3 shadow-inner">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500">Selected Plan</span>
                      <span className="text-white font-semibold capitalize flex items-center gap-1.5">
                        {plan === "Pro" && <Sparkles className="w-3.5 h-3.5 text-violet-400" />}
                        {plan} Mode
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500">Daily Commitment</span>
                      <span className="text-white font-semibold">₹{amount}/day</span>
                    </div>
                    
                    <div className="h-px bg-white/[0.04] w-full" />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-zinc-300 font-semibold text-xs">Refundable Deposit</span>
                        <span className="text-zinc-550 text-[9px]">Held securely for 30 days. Fully refundable.</span>
                      </div>
                      <span className="text-white font-semibold text-sm">₹{amount ? amount * 30 : 0}</span>
                    </div>'''
    ),
    (
        '''                    {plan === "Pro" ? (
                      <>
                        <div className="flex items-center justify-between pt-1 border-b border-zinc-800/40 pb-1 text-xs">
                          <div className="flex flex-col">
                            <span className="text-violet-300 font-bold">Pro Setup & Subscription</span>
                            <span className="text-violet-550/60 text-[9px]">1 month feature access</span>
                          </div>
                          <span className="text-violet-400 font-black">₹49</span>
                        </div>
                        <div className="flex items-center justify-between pt-1 text-xs">
                          <div className="flex flex-col">
                            <span className="text-emerald-400 font-bold">Projected Monthly Refund Payout</span>
                            <span className="text-zinc-500 text-[9px]">Your ₹{amount ? amount * 30 : 0} deposit + 10% Cash Streak Bonus</span>
                          </div>
                          <span className="text-emerald-400 font-black text-sm">₹{Math.round((amount ? amount * 30 : 0) * 1.1)}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-between pt-1 text-xs">
                        <div className="flex flex-col">
                          <span className="text-emerald-400 font-bold">Projected Monthly Refund Payout</span>
                          <span className="text-zinc-500 text-[9px]">Your ₹{amount ? amount * 30 : 0} deposit returned on consistency</span>
                        </div>
                        <span className="text-emerald-400 font-black text-sm">₹{amount ? amount * 30 : 0}</span>
                      </div>
                    )}
                    
                    <div className="h-px bg-zinc-800 w-full" />

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex flex-col">
                        <span className="text-white font-extrabold text-sm">Total to Pay</span>
                        <span className="text-emerald-400/80 text-[10px] font-semibold">Includes all payment fees & taxes</span>
                      </div>
                      <span className="text-emerald-400 font-black text-xl">
                        ₹{plan === "Pro" ? (amount ? amount * 30 : 0) + 49 : (amount ? amount * 30 : 0)}
                      </span>
                    </div>''',
        '''                    {plan === "Pro" ? (
                      <>
                        <div className="flex items-center justify-between pt-1 border-b border-white/[0.04] pb-1 text-xs">
                          <div className="flex flex-col">
                            <span className="text-violet-300 font-semibold">Pro Setup & Subscription</span>
                            <span className="text-violet-550/60 text-[9px]">1 month feature access</span>
                          </div>
                          <span className="text-violet-400 font-semibold">₹49</span>
                        </div>
                        <div className="flex items-center justify-between pt-1 text-xs">
                          <div className="flex flex-col">
                            <span className="text-emerald-400 font-semibold">Projected Monthly Refund Payout</span>
                            <span className="text-zinc-550 text-[9px]">Your ₹{amount ? amount * 30 : 0} deposit + 10% Cash Streak Bonus</span>
                          </div>
                          <span className="text-emerald-400 font-semibold text-sm">₹{Math.round((amount ? amount * 30 : 0) * 1.1)}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-between pt-1 text-xs">
                        <div className="flex flex-col">
                          <span className="text-emerald-400 font-semibold">Projected Monthly Refund Payout</span>
                          <span className="text-zinc-555 text-[9px]">Your ₹{amount ? amount * 30 : 0} deposit returned on consistency</span>
                        </div>
                        <span className="text-emerald-400 font-semibold text-sm">₹{amount ? amount * 30 : 0}</span>
                      </div>
                    )}
                    
                    <div className="h-px bg-white/[0.04] w-full" />

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex flex-col">
                        <span className="text-white font-semibold text-sm">Total to Pay</span>
                        <span className="text-emerald-400/80 text-[10px] font-semibold">Includes all payment fees & taxes</span>
                      </div>
                      <span className="text-emerald-400 font-bold text-xl">
                        ₹{plan === "Pro" ? (amount ? amount * 30 : 0) + 49 : (amount ? amount * 30 : 0)}
                      </span>
                    </div>'''
    ),
    (
        '''                  {/* Payment Methods and Trust */}
                  <div className="space-y-3 pt-1">
                    <button
                      onClick={handleSkipPayment}
                      disabled={loading}
                      className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          ⚡ Simulate Secure Payment (Test Mode)
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleRazorpayPayment}
                      disabled={loading}
                      className="w-full py-3 bg-[#16161F] border border-zinc-800 hover:bg-[#1E1E2A] disabled:opacity-50 text-zinc-300 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-xs"
                    >
                      Razorpay Checkout (UPI, Cards, Netbanking)
                    </button>

                    <div className="flex gap-4">
                      <button
                        onClick={handleBack}
                        disabled={loading}
                        className="w-full py-2 border border-zinc-850 hover:bg-[#16161F] text-zinc-500 hover:text-zinc-300 font-semibold rounded-xl text-[10px] transition-all flex justify-center items-center"
                      >
                        Back to Review
                      </button>
                    </div>''',
        '''                  {/* Payment Methods and Trust */}
                  <div className="space-y-3 pt-1">
                    <button
                      onClick={handleSkipPayment}
                      disabled={loading}
                      className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Zap className="w-4 h-4 shrink-0 text-white" />
                          Simulate Secure Payment (Test Mode)
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleRazorpayPayment}
                      disabled={loading}
                      className="w-full py-3 bg-white/[0.01] border border-white/[0.04] hover:bg-white/[0.03] disabled:opacity-50 text-zinc-300 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-xs"
                    >
                      Razorpay Checkout (UPI, Cards, Netbanking)
                    </button>

                    <div className="flex gap-4">
                      <button
                        onClick={handleBack}
                        disabled={loading}
                        className="w-full py-2 border border-white/[0.04] hover:bg-white/[0.02] text-zinc-500 hover:text-zinc-300 font-semibold rounded-xl text-[10px] transition-all flex justify-center items-center"
                      >
                        Back to Review
                      </button>
                    </div>'''
    )
]

for old, new in replacements:
    # Normalize line endings in replacement strings to \n
    old_normalized = old.replace("\r\n", "\n")
    new_normalized = new.replace("\r\n", "\n")
    if old_normalized in content:
        content = content.replace(old_normalized, new_normalized)
        print(f"REPLACED successfully")
    else:
        print(f"FAILED TO REPLACE: {old_normalized[:50].replace(chr(10), ' ')}...")

# Restore CRLF if they were originally CRLF
if original_endings_are_crlf:
    content = content.replace("\n", "\r\n")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Replacement complete!")
