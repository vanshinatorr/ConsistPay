import React from "react";
import { 
  Dumbbell, BookOpen, Bike, Flower2, GraduationCap, 
  Wallet, Sparkles, Lock, TrendingUp, Clock, Footprints, 
  Compass, ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "./dashboard/Navbar";

interface CategoryData {
  title: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
  imageUrl?: string;
  features: {
    title: string;
    description: string;
    icon: React.ReactNode;
  }[];
  roadmap: string[];
}

function CategoryPlaceholder({ data }: { data: CategoryData }) {
  // Retrieve user data from cache to make the header look fully integrated and authentic
  const cachedUserStr = localStorage.getItem("consistpay_user_data");
  let initials = "U";
  let plan = "free";
  if (cachedUserStr) {
    try {
      const parsed = JSON.parse(cachedUserStr);
      initials = parsed.username ? parsed.username.substring(0, 2).toUpperCase() : "U";
      plan = parsed.plan || "free";
    } catch (e) {}
  }

  const [requestedAccess, setRequestedAccess] = React.useState(false);

  const handleRequestAccess = () => {
    setRequestedAccess(true);
    toast.success(`Early access request submitted for ${data.title}! We will notify you.`);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0F0F13] text-zinc-900 dark:text-white flex flex-col transition-colors duration-300">
      {/* Module Navbar at top */}
      <Navbar initials={initials} plan={plan} />

      {/* Main Content Container */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col justify-center relative z-10 w-full">
        {/* Glow ambient background elements */}
        <div className="absolute -left-12 top-1/4 w-80 h-80 bg-violet-500/[0.03] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -right-12 bottom-1/4 w-80 h-80 bg-emerald-500/[0.03] rounded-full blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Premium Pitch & Roadmap */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 rounded-full text-[10px] font-extrabold uppercase tracking-widest mb-5">
                <Sparkles className="w-3 h-3 animate-pulse" />
                <span>Future Module</span>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-500/10 to-emerald-500/10 border border-zinc-200 dark:border-white/[0.08] flex items-center justify-center text-violet-500 dark:text-violet-400 shadow-sm">
                  {data.icon}
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900 dark:text-white leading-none mb-1">
                    {data.title}
                  </h1>
                  <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    {data.tagline}
                  </p>
                </div>
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed mb-6 max-w-2xl">
                {data.description}
              </p>

              {/* Roadmap Timeline Inside Left Column */}
              <div className="w-full rounded-2xl border border-zinc-200 dark:border-white/[0.06] bg-white dark:bg-gradient-to-b dark:from-[#141522]/50 dark:to-[#0F1018]/50 p-5 shadow-sm mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-violet-500 dark:text-violet-400" />
                  Implementation Timeline
                </h3>

                <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-zinc-200 dark:before:bg-white/[0.08]">
                  {data.roadmap.map((step, idx) => (
                    <div key={idx} className="flex gap-4 items-start relative pl-1">
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 text-[10px] font-black z-10 ${
                        idx === 0 
                          ? "bg-violet-500/10 border-violet-500/30 text-violet-600 dark:text-violet-400" 
                          : "bg-zinc-100 dark:bg-[#0F0F13] border-zinc-200 dark:border-white/[0.08] text-zinc-500 dark:text-zinc-400"
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1 pt-0.5">
                        <h4 className={`text-xs font-bold ${idx === 0 ? "text-zinc-800 dark:text-white" : "text-zinc-500"}`}>
                          {step.split(" - ")[0]}
                        </h4>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-normal">
                          {step.split(" - ")[1]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Early Access Action Button */}
              <button
                onClick={handleRequestAccess}
                disabled={requestedAccess}
                className={`w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold tracking-wide transition-all duration-150 shadow-sm cursor-pointer border ${
                  requestedAccess 
                    ? "bg-zinc-150 dark:bg-zinc-800/20 border-zinc-200 dark:border-white/[0.04] text-zinc-400 cursor-default" 
                    : "bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white hover:bg-zinc-800 dark:hover:bg-zinc-100 active:scale-[0.98]"
                }`}
              >
                <span>{requestedAccess ? "Waiting List Joined" : "Request Early Beta Access"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Premium System Preview Mockup Card */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            <div className="relative rounded-2xl border border-zinc-200 dark:border-white/[0.06] bg-white dark:bg-gradient-to-b dark:from-[#141522]/70 dark:to-[#0F1018]/70 p-4 shadow-sm dark:shadow-2xl overflow-hidden flex-1 flex flex-col justify-between">
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.001)_1px,transparent_1px)] bg-[size:100%_12px] pointer-events-none" />
              
              <div className="flex items-center justify-between mb-3.5 px-1">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    System Preview
                  </span>
                </div>
                <span className="text-[9px] font-black text-violet-600 dark:text-violet-400 bg-violet-500/10 border border-violet-500/20 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                  Alpha v0.1
                </span>
              </div>

              {/* Framing container for image mockup */}
              <div className="relative rounded-xl overflow-hidden border border-zinc-200/60 dark:border-white/[0.06] bg-zinc-950/20 dark:bg-zinc-950/40 flex-1 flex items-center justify-center p-1 select-none min-h-[220px]">
                {data.imageUrl ? (
                  <img
                    src={data.imageUrl}
                    alt={`${data.title} Preview`}
                    className="max-h-[340px] w-auto object-contain rounded-lg shadow-lg hover:scale-[1.01] transition-transform duration-300"
                  />
                ) : (
                  <div className="text-zinc-500 text-[10px] uppercase font-bold">Preview Loading...</div>
                )}
              </div>

              <div className="mt-3.5 pt-3.5 border-t border-zinc-200 dark:border-white/[0.04] flex items-center justify-between text-[10px] text-zinc-500 font-semibold uppercase tracking-wider px-1">
                <span>Staking Escrow Pools</span>
                <span>Active Q3 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid Below columns */}
        <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-white/[0.04] w-full text-left">
          <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-4">
            Key Modular Systems
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.features.map((feat, idx) => (
              <div 
                key={idx} 
                className="p-4.5 rounded-xl border border-zinc-200/80 dark:border-white/[0.03] bg-white dark:bg-white/[0.01] hover:bg-zinc-100/50 dark:hover:bg-white/[0.02] transition-all flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="text-violet-600 dark:text-violet-400 shrink-0">
                      {feat.icon}
                    </div>
                    <h4 className="text-xs font-extrabold text-zinc-800 dark:text-white">
                      {feat.title}
                    </h4>
                  </div>
                  <p className="text-[10.5px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                  <span className="text-[8px] font-black text-violet-600/80 dark:text-violet-400/80 uppercase tracking-wider">
                    Planned Feature
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 1. FITNESS
export function FitnessPage() {
  const data: CategoryData = {
    title: "Fitness",
    tagline: "AI Live Camera Form & Habit Verification",
    description: "Connect your workout routine directly to your stakes. Open the camera, perform your set, and let our computer-vision engine verify your reps automatically to secure your streak.",
    icon: <Dumbbell className="w-6 h-6" />,
    imageUrl: "/mockups/fitness_mockup.png",
    features: [
      {
        title: "AI Exercise Tracking",
        description: "Verify pushups, squats, and pullups in real time using the live camera feed.",
        icon: <Sparkles className="w-4 h-4" />
      },
      {
        title: "Daily Staked Routine",
        description: "Set commitment budgets (e.g. ₹50/day) on gym consistency to prevent slacking.",
        icon: <Lock className="w-4 h-4" />
      },
      {
        title: "Health Integration",
        description: "Sync runs, heart rates, and active calories directly with Apple Health & Google Fit.",
        icon: <TrendingUp className="w-4 h-4" />
      },
      {
        title: "Duels & Battles",
        description: "Create workout battles with friends. First to miss a workout forfeits their stake.",
        icon: <Dumbbell className="w-4 h-4" />
      }
    ],
    roadmap: [
      {
        text: "Private Beta - AI pose estimation prototype verification"
      },
      {
        text: "Health Connect Syncing - Direct dashboard sync with popular wearable devices"
      },
      {
        text: "Global Fitness Battles - Stake on gym streaks against regional leaderboard participants"
      }
    ].map((r, idx) => `${idx === 0 ? "Private Beta" : idx === 1 ? "Wearable Sync" : "Multiplayer Battles"} - ${r.text}`)
  };

  return <CategoryPlaceholder data={data} />;
}

// 2. STUDY
export function StudyPage() {
  const data: CategoryData = {
    title: "Study",
    tagline: "Proof-of-Focus Accountability Timer",
    description: "Stake on your daily reading or coursework goals. Our smart timer verifies that you stay inside the study interface, automatically penalizing tab-switching to ensure absolute focus.",
    icon: <BookOpen className="w-6 h-6" />,
    imageUrl: "/mockups/study_mockup.png",
    features: [
      {
        title: "Anti-Distraction Lock",
        description: "Active timers auto-detect leaving the study window, tracking intervals cleanly.",
        icon: <Clock className="w-4 h-4" />
      },
      {
        title: "Exam Prep Milestones",
        description: "Commit daily hours leading up to GATE, UPSC, JEE, or placement exam dates.",
        icon: <Lock className="w-4 h-4" />
      },
      {
        title: "Focused Study Groups",
        description: "Join shared co-studying rooms with virtual stakes on joint focus goals.",
        icon: <TrendingUp className="w-4 h-4" />
      },
      {
        title: "Earn Coding Boosts",
        description: "Redeem focus hours to unlock grace coins for your coding streaks.",
        icon: <Sparkles className="w-4 h-4" />
      }
    ],
    roadmap: [
      {
        text: "Tab-Focus Trackers - Chrome Extension extension release to log active window timelines"
      },
      {
        text: "Staked Focus Rooms - Stake and focus on video rooms with active peers"
      },
      {
        text: "University Rankings - Compete in focus hours for university leaderboard bragging rights"
      }
    ].map((r, idx) => `${idx === 0 ? "Timer Release" : idx === 1 ? "Focus Rooms" : "Campus Boards"} - ${r.text}`)
  };

  return <CategoryPlaceholder data={data} />;
}

// 3. RUNNING
export function RunningPage() {
  const data: CategoryData = {
    title: "Running",
    tagline: "GPS Staked Distance & Pace Tracking",
    description: "Verify daily runs using Strava, GPS coords, or Google Fit logs. Set target distance goals and get penalised if you skip your morning cardio routine.",
    icon: <Footprints className="w-6 h-6" />,
    imageUrl: "/mockups/running_mockup.png",
    features: [
      {
        title: "GPS Verification",
        description: "Automatically process location paths to verify run distances.",
        icon: <Sparkles className="w-4 h-4" />
      },
      {
        title: "Pace Threshold Checks",
        description: "Ensure active cardio meets target pacing requirements to count towards stakes.",
        icon: <TrendingUp className="w-4 h-4" />
      },
      {
        title: "Strava Webhook Sync",
        description: "Instantly fetch activity records from Strava the moment you save your run.",
        icon: <Clock className="w-4 h-4" />
      },
      {
        title: "Cardio Duo Battles",
        description: "Duel friends on daily step counts or km runs. First to miss their daily run pays.",
        icon: <Lock className="w-4 h-4" />
      }
    ],
    roadmap: [
      {
        text: "Strava Direct API - Seamless run verification via Strava webhooks"
      },
      {
        text: "GPS Map Verification - Native geographical map overlays on run logs"
      },
      {
        text: "Virtual Marathon Stakes - Participate in stakes on global running events"
      }
    ].map((r, idx) => `${idx === 0 ? "Strava Sync" : idx === 1 ? "Map Dashboard" : "Marathon Stakes"} - ${r.text}`)
  };

  return <CategoryPlaceholder data={data} />;
}

// 4. CYCLING
export function CyclingPage() {
  const data: CategoryData = {
    title: "Cycling",
    tagline: "GPS Distance Tracking & Payouts",
    description: "Log your cycle trips through Strava or GPS integrations. Guarantee your commuting or sport cycling streaks with daily consistency stakes.",
    icon: <Bike className="w-6 h-6" />,
    imageUrl: "/mockups/cycling_mockup.png",
    features: [
      {
        title: "Strava Sync",
        description: "Link Strava profile to fetch completed rides with zero manual uploads.",
        icon: <Clock className="w-4 h-4" />
      },
      {
        title: "Daily Commute Stakes",
        description: "Earn consistency rebates on your daily work/college cycling commutes.",
        icon: <Lock className="w-4 h-4" />
      },
      {
        title: "Distance Milestones",
        description: "Set long-range weekly mileage targets (e.g. 50km/week) with rollover stakes.",
        icon: <TrendingUp className="w-4 h-4" />
      },
      {
        title: "Cycling Clubs",
        description: "Create groups to split staking pots based on total team mileage goals.",
        icon: <Sparkles className="w-4 h-4" />
      }
    ],
    roadmap: [
      {
        text: "Strava Integration - Hook cycling stats directly with automatic verification"
      },
      {
        text: "Clubs Dashboard - Staking groups and shared pots configuration"
      },
      {
        text: "Weekly Milestones - Multi-day rollover goals and payout schedules"
      }
    ].map((r, idx) => `${idx === 0 ? "API Sync" : idx === 1 ? "Clubs Rollout" : "Weekly Stakes"} - ${r.text}`)
  };

  return <CategoryPlaceholder data={data} />;
}

// 5. MEDITATION
export function MeditationPage() {
  const data: CategoryData = {
    title: "Meditation",
    tagline: "Mindfulness Duration & HRV Tracker",
    description: "Commit to daily mental health practices. Stake on daily mindfulness sessions verified through meditation timers or heart rate variability (HRV) syncs.",
    icon: <Flower2 className="w-6 h-6" />,
    imageUrl: "/mockups/meditation_mockup.png",
    features: [
      {
        title: "Guided Timer Sync",
        description: "Log sessions using our premium guided focus player or Apple Health logs.",
        icon: <Clock className="w-4 h-4" />
      },
      {
        title: "HRV Calibrations",
        description: "Track stress reduction scores automatically using Apple Watch / Fitbit sensors.",
        icon: <TrendingUp className="w-4 h-4" />
      },
      {
        title: "Habit Streaks",
        description: "Secure your mental focus streaks. Keep payouts active by committing 10m/day.",
        icon: <Lock className="w-4 h-4" />
      },
      {
        title: "Zen Rewards",
        description: "Collect consistency streaks to exchange for profile customization themes.",
        icon: <Sparkles className="w-4 h-4" />
      }
    ],
    roadmap: [
      {
        text: "Meditation Timer - Premium in-app mindfulness audio player releases"
      },
      {
        text: "Wearable Stress Sync - Calibrate bio-metric HRV parameters before/after sessions"
      },
      {
        text: "Streak Rewards - Unlock premium dashboard audio themes and soundscapes"
      }
    ].map((r, idx) => `${idx === 0 ? "In-app Player" : idx === 1 ? "Bio-metric HRV" : "Theme Rewards"} - ${r.text}`)
  };

  return <CategoryPlaceholder data={data} />;
}

// 6. SKILL LEARNING
export function SkillLearningPage() {
  const data: CategoryData = {
    title: "Skill Learning",
    tagline: "Dedicated Practice Hours & Milestone Logs",
    description: "Stake on learning any new habit - design, language, music, or writing. Log practice sessions verified with focus screenshots or portfolio milestone updates.",
    icon: <GraduationCap className="w-6 h-6" />,
    imageUrl: "/mockups/skills_mockup.png",
    features: [
      {
        title: "Custom Skill Hub",
        description: "Define learning targets like 'Learn Spanish' or 'UI Design' with custom metrics.",
        icon: <Clock className="w-4 h-4" />
      },
      {
        title: "Milestone Submissions",
        description: "Upload portfolio links or video snippets to prove practice completion.",
        icon: <Sparkles className="w-4 h-4" />
      },
      {
        title: "Daily Practice Stakes",
        description: "Commit to daily progress. Stay accountable by staking on your learning path.",
        icon: <Lock className="w-4 h-4" />
      },
      {
        title: "Peer Auditing",
        description: "Get verified by community peers who review uploaded milestone logs.",
        icon: <TrendingUp className="w-4 h-4" />
      }
    ],
    roadmap: [
      {
        text: "Custom Categories - Create customized milestones and targets"
      },
      {
        text: "Proof Upload Hub - Multi-media upload center (images, video, code repositories)"
      },
      {
        text: "Peer Review Network - AI + Peer community consensus verification system"
      }
    ].map((r, idx) => `${idx === 0 ? "Target Hub" : idx === 1 ? "Upload Portals" : "Peer Verification"} - ${r.text}`)
  };

  return <CategoryPlaceholder data={data} />;
}

// 7. WALLET PAGE
export function WalletPage() {
  const data: CategoryData = {
    title: "Staking Wallet",
    tagline: "Your Multi-Category Stakes Control Hub",
    description: "ConsistPay Wallet manages your deposits, stakes, and payout withdrawals. Currently, active stakes and commitments are configured directly under the Coding dashboard.",
    icon: <Wallet className="w-6 h-6" />,
    imageUrl: "/mockups/wallet_mockup.png",
    features: [
      {
        title: "Unified Balance",
        description: "Manage deposits across all upcoming habits - Coding, Fitness, and Running.",
        icon: <Wallet className="w-4 h-4" />
      },
      {
        title: "Secure Escrows",
        description: "Stakes are locked safely in daily commitment pools until verification.",
        icon: <Lock className="w-4 h-4" />
      },
      {
        title: "Payout Projections",
        description: "View month-end payout forecasts based on your active habit streaks.",
        icon: <TrendingUp className="w-4 h-4" />
      },
      {
        title: "Instant Cashouts",
        description: "Withdraw completed stakes directly to your registered UPI / bank account.",
        icon: <Clock className="w-4 h-4" />
      }
    ],
    roadmap: [
      {
        text: "Unified Ledger - Combine Coding, Fitness, and Study stakes under one page"
      },
      {
        text: "Automated Rollovers - Automatically roll over winning pots into next week's challenges"
      },
      {
        text: "Corporate Sponsors - Staking pools sponsored by placement prep platforms and tech firms"
      }
    ].map((r, idx) => `${idx === 0 ? "Global Wallet" : idx === 1 ? "Escrow Rollovers" : "Sponsor Pools"} - ${r.text}`)
  };

  return <CategoryPlaceholder data={data} />;
}
