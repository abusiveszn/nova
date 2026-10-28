import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/state/AppContext";
import {
  ShieldCheck,
  Mail,
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Building2,
  Smartphone,
  QrCode,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Code,
  Rocket,
  GraduationCap,
  Briefcase,
  Eye,
  EyeOff,
  X,
  Calendar,
  Zap,
  AlertCircle,
  Terminal,
  Users,
  Compass,
  TrendingUp,
} from "lucide-react";

interface CommunityGatewayProps {
  onAccessGranted: () => void;
}

export type GatewayStep =
  | "landing"
  | "signin"
  | "join"
  | "onboarding"
  | "paystack"
  | "select-community";
export type PaymentChannel = "card" | "transfer" | "ussd" | "qr";

export interface MembershipPlan {
  id: "1m" | "2m" | "6m" | "1y" | "2y";
  label: string;
  durationText: string;
  months: number;
  price: number;
  naira: number;
  badge?: string;
  desc: string;
}

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: "1m",
    label: "1 Month",
    durationText: "1 month access",
    months: 1,
    price: 2,
    naira: 3200,
    desc: "$2.00 billed monthly",
  },
  {
    id: "2m",
    label: "2 Months",
    durationText: "2 months access",
    months: 2,
    price: 4,
    naira: 6400,
    desc: "$2/mo • $4.00 total",
  },
  {
    id: "6m",
    label: "6 Months",
    durationText: "6 months access",
    months: 6,
    price: 12,
    naira: 19200,
    badge: "Popular",
    desc: "$2/mo • $12.00 total",
  },
  {
    id: "1y",
    label: "1 Year",
    durationText: "12 months access",
    months: 12,
    price: 24,
    naira: 38400,
    badge: "Best Value",
    desc: "$2/mo • $24.00 total",
  },
  {
    id: "2y",
    label: "2 Years",
    durationText: "24 months access",
    months: 24,
    price: 48,
    naira: 76800,
    badge: "Long-Term",
    desc: "$2/mo • $48.00 total",
  },
];

export interface CommunityHubInfo {
  id: string;
  name: string;
  desc: string;
  fullDesc: string;
  icon: React.ElementType;
  members: string;
  online: string;
  badge: string;
  tags: string[];
  color: string;
}

export const AVAILABLE_COMMUNITIES: CommunityHubInfo[] = [
  {
    id: "engineers",
    name: "Tech Builders Community",
    desc: "Build. Collaborate. Grow.",
    fullDesc:
      "React, Next.js, Node, Rust, Flutter, Go, cloud infrastructure & dev architecture",
    icon: Code,
    members: "1.2K Members",
    online: "12 Online",
    badge: "Active Code Labs",
    tags: ["React", "TypeScript", "Next.js", "APIs"],
    color: "#22d3ee",
  },
  {
    id: "founders",
    name: "Founders Hub",
    desc: "Ideas to Impact.",
    fullDesc:
      "Early-stage fundraising, investor pitching, co-founder matching, & venture capital",
    icon: Rocket,
    members: "1.8K Members",
    online: "24 Online",
    badge: "Founders & VCs",
    tags: ["Fundraising", "Pitch Decks", "Co-founders"],
    color: "#a855f7",
  },
  {
    id: "investors",
    name: "Global Investors Community",
    desc: "Invest. Support. Grow.",
    fullDesc:
      "Cross-border deal flow, syndicate rounds, due diligence, & venture backing",
    icon: Briefcase,
    members: "940 Members",
    online: "8 Online",
    badge: "Venture Capital",
    tags: ["Due Diligence", "Syndicates", "Capital"],
    color: "#f97316",
  },
  {
    id: "learners",
    name: "Learning & Skills Community",
    desc: "Learn. Build. Advance.",
    fullDesc:
      "Junior devs, student builders, guided code labs, hackathons, & career upskilling",
    icon: GraduationCap,
    members: "2.9K Members",
    online: "45 Online",
    badge: "Academy & Mentorship",
    tags: ["Code Labs", "Career", "Study Groups"],
    color: "#10b981",
  },
  {
    id: "creatives",
    name: "Creative Professionals",
    desc: "Create. Connect. Thrive.",
    fullDesc:
      "Figma design systems, mobile UI, 3D motion, brand identity & product strategy",
    icon: Sparkles,
    members: "2.1K Members",
    online: "18 Online",
    badge: "Design Systems",
    tags: ["Figma", "UI/UX", "Brand", "Motion"],
    color: "#38bdf8",
  },
  {
    id: "fintech",
    name: "Fintech & Web3 Pioneers",
    desc: "Scale. Transact. Innovate.",
    fullDesc:
      "Payment rails, cross-border settlement, DeFi, crypto, & Paystack APIs",
    icon: CreditCard,
    members: "3.4K Members",
    online: "31 Online",
    badge: "High Deal Flow",
    tags: ["Payments", "DeFi", "APIs", "Escrow"],
    color: "#22d3ee",
  },
];

export function CommunityGateway({ onAccessGranted }: CommunityGatewayProps) {
  const { state, dispatch } = useApp();
  const [step, setStep] = useState<GatewayStep>("landing");

  // Sign In / Form State
  const [signInEmail, setSignInEmail] = useState(
    state.currentUser?.email || ""
  );
  const [signInPassword, setSignInPassword] = useState("");
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Join Now Form State
  const [joinFullName, setJoinFullName] = useState(
    state.currentUser?.fullName || ""
  );
  const [joinEmail, setJoinEmail] = useState(state.currentUser?.email || "");
  const [joinPassword, setJoinPassword] = useState("");
  const [joinConfirmPassword, setJoinConfirmPassword] = useState("");
  const [showJoinPassword, setShowJoinPassword] = useState(false);
  const [showJoinConfirmPassword, setShowJoinConfirmPassword] = useState(false);
  const [joinRole, setJoinRole] = useState<string>("Builder");
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([
    "BUILD",
    "CONNECT",
  ]);

  const [authError, setAuthError] = useState("");

  // Membership Plan Selection State ($2/month base)
  const [selectedPlanId, setSelectedPlanId] = useState<string>("1m");
  const selectedPlan =
    MEMBERSHIP_PLANS.find((p) => p.id === selectedPlanId) || MEMBERSHIP_PLANS[0];

  // Community Hub Selection State
  const [selectedCommunityHub, setSelectedCommunityHub] = useState<string>(
    () => localStorage.getItem("nova_selected_community") || "engineers"
  );

  // Paystack Payment State
  const [paymentChannel, setPaymentChannel] = useState<PaymentChannel>("card");
  const [cardNumber, setCardNumber] = useState("5399 •••• •••• 4028");
  const [cardExpiry, setCardExpiry] = useState("08/28");
  const [cardCvv, setCardCvv] = useState("912");
  const [selectedUssdBank, setSelectedUssdBank] = useState("gtbank");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStatusText, setPaymentStatusText] = useState(
    "Authorizing $2.00 with Paystack..."
  );
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedUssd, setCopiedUssd] = useState(false);

  // Check if member previously paid membership fee
  const hasPaid =
    typeof window !== "undefined" &&
    localStorage.getItem("nova_community_paid") === "true";
  const currentPlanName =
    typeof window !== "undefined"
      ? localStorage.getItem("nova_community_plan_name") || "1 Month Plan"
      : "1 Month Plan";
  const currentPlanExpiry =
    typeof window !== "undefined"
      ? localStorage.getItem("nova_community_plan_expiry")
      : null;

  // Helper to calculate future date
  const getExpiryDate = (months: number) => {
    const d = new Date();
    d.setMonth(d.getMonth() + months);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Back to main dashboard tab
  const handleBackToDashboard = () => {
    dispatch({ type: "SET_TAB", payload: "overview" });
  };

  // Copy helper
  const handleCopy = (text: string, type: "account" | "ussd") => {
    navigator.clipboard.writeText(text);
    if (type === "account") {
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2000);
    } else {
      setCopiedUssd(true);
      setTimeout(() => setCopiedUssd(false), 2000);
    }
  };

  // 1. Handle Google Sign In
  const handleGoogleSignIn = () => {
    const userEmail = state.currentUser?.email || "user@gmail.com";
    const userName = state.currentUser?.fullName || "Nova Member";

    localStorage.setItem("nova_community_email", userEmail);
    localStorage.setItem("nova_community_member_name", userName);
    localStorage.setItem("nova_community_auth_provider", "google");

    // Route to payment plan selection
    setStep("paystack");
  };

  // 1b. Handle Continue as Current Nova Core User
  const handleContinueAsNovaUser = () => {
    if (!state.currentUser) return;
    localStorage.setItem("nova_community_email", state.currentUser.email);
    localStorage.setItem(
      "nova_community_member_name",
      state.currentUser.fullName
    );
    localStorage.setItem("nova_community_role", state.currentUser.role);
    localStorage.setItem("nova_community_auth_provider", "nova_core");

    if (hasPaid) {
      setStep("select-community");
    } else {
      setStep("paystack");
    }
  };

  // 2. Handle Sign In Submission (Email / Nova Core Credentials)
  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail || !signInPassword) {
      setAuthError("Please fill in both email and password.");
      return;
    }
    setAuthError("");

    localStorage.setItem("nova_community_email", signInEmail);
    localStorage.setItem(
      "nova_community_member_name",
      signInEmail.split("@")[0] || "Nova Member"
    );
    localStorage.setItem("nova_community_auth_provider", "email");

    // As requested: After filling form and signing in, show payment plan selection before accessing listings/community
    setStep("paystack");
  };

  // 3. Handle Join Now (Create Profile) Submission
  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinFullName.trim() || !joinEmail.trim() || !joinPassword) {
      setAuthError("Please complete all required fields.");
      return;
    }
    if (joinPassword !== joinConfirmPassword) {
      setAuthError("Passwords do not match.");
      return;
    }
    setAuthError("");

    localStorage.setItem("nova_community_email", joinEmail.trim());
    localStorage.setItem(
      "nova_community_member_name",
      joinFullName.trim()
    );
    localStorage.setItem("nova_community_role", joinRole.toLowerCase());
    localStorage.setItem("nova_community_auth_provider", "email");

    // Proceed to Step 3: Onboarding - Enter the Nexus
    setStep("onboarding");
  };

  // 3b. Handle Onboarding Continue (Enter the Nexus)
  const handleOnboardingContinue = () => {
    localStorage.setItem(
      "nova_community_purposes",
      JSON.stringify(selectedPurposes)
    );
    // Proceed directly to Membership Plan & Payment (NO OTP!)
    setStep("paystack");
  };

  // 4. Handle Paystack Payment Simulation with Selected Plan Duration
  const handleProcessPayment = () => {
    setIsProcessingPayment(true);
    setPaymentStatusText("Connecting to Paystack 256-bit gateway...");

    setTimeout(() => {
      setPaymentStatusText(
        `Authorizing $${selectedPlan.price}.00 for ${selectedPlan.label} with bank...`
      );
    }, 700);

    setTimeout(() => {
      setPaymentStatusText("Verifying security token & payment receipt...");
    }, 1400);

    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccess(true);

      const expiryStr = getExpiryDate(selectedPlan.months);

      // Save verified payment and plan permanently
      localStorage.setItem("nova_community_paid", "true");
      localStorage.setItem("nova_community_plan_id", selectedPlan.id);
      localStorage.setItem("nova_community_plan_name", selectedPlan.label);
      localStorage.setItem(
        "nova_community_plan_amount",
        `$${selectedPlan.price}`
      );
      localStorage.setItem(
        "nova_community_plan_months",
        String(selectedPlan.months)
      );
      localStorage.setItem("nova_community_plan_expiry", expiryStr);
      localStorage.setItem("nova_community_access", "true");
      localStorage.setItem("nova_community_logged_in", "true");

      // Transition to Step 6: Choose Your Community!
      setTimeout(() => {
        setStep("select-community");
      }, 1200);
    }, 2100);
  };

  // 5. Handle Final Community Hub Confirmation
  const handleConfirmCommunityHub = () => {
    localStorage.setItem("nova_selected_community", selectedCommunityHub);
    localStorage.setItem("nova_community_logged_in", "true");
    localStorage.setItem("nova_community_access", "true");
    onAccessGranted();
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col items-center bg-[#07090e] text-[#f9fafb] relative overflow-x-hidden">
      {/* Dynamic Background Ambient Lighting (System colors: cyan #22d3ee and emerald #10b981) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] bg-gradient-to-b from-[#22d3ee]/10 via-[#10b981]/8 to-transparent rounded-full blur-[160px]" />
        <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-[#0284c7]/8 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 w-full flex-1 flex flex-col justify-center items-center">
        <AnimatePresence mode="wait">
          {/* ========================================================================= */}
          {/* SCREEN 1: COMMUNITY ENTRY PAGE (FROM DASHBOARD)                           */}
          {/* ========================================================================= */}
          {step === "landing" && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-5xl mx-auto my-auto p-4 sm:p-6"
            >
              <div className="bg-[#0b101b] border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
                {/* Left Side: Brand Identity with Cosmic Horizon */}
                <div className="lg:col-span-6 relative p-8 sm:p-10 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#070b13] via-[#091120] to-[#04070d] border-b lg:border-b-0 lg:border-r border-white/10">
                  <div className="absolute inset-0 bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
                  <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#22d3ee]/15 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[#0284c7]/20 via-indigo-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

                  {/* Top: ← Community Back to Dashboard */}
                  <div className="relative z-10 flex items-center justify-between">
                    <button
                      type="button"
                      id="community-back-to-dashboard"
                      onClick={handleBackToDashboard}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer group"
                    >
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                      <span>Community</span>
                    </button>

                    {hasPaid && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#22d3ee]/10 border border-[#22d3ee]/30 text-[#22d3ee] text-[11px] font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {currentPlanName} Active {currentPlanExpiry ? `(Until ${currentPlanExpiry})` : ""}
                      </span>
                    )}
                  </div>

                  {/* Center Emblem & Headline */}
                  <div className="relative z-10 my-auto py-8 space-y-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-black/60 border border-[#22d3ee]/40 p-2.5 flex items-center justify-center shadow-2xl shadow-[#22d3ee]/25 relative group">
                      <img
                        src="/Picsart_26-04-10_14-37-41-214.png"
                        alt="Nova Logo"
                        className="w-full h-full object-contain relative z-10"
                      />
                    </div>

                    <div>
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-['Space_Grotesk'] text-white tracking-tight leading-tight">
                        NETWORK OF VERIFIED INTELLIGENCE ASSETS
                      </h1>
                      <p className="text-xs sm:text-sm text-cyan-400 font-mono font-semibold tracking-wider mt-2">
                        Build • Connect • Create • Earn
                      </p>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                      Autonomous agent coordination, bounty execution, and decentralized community commerce.
                    </p>
                  </div>

                  {/* Cosmic Sunrise Bottom Graphic */}
                  <div className="relative z-10 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Nova Community Operating System</span>
                    <span className="text-[#22d3ee] font-mono font-semibold">v2.6 Verified</span>
                  </div>
                </div>

                {/* Right Side: Welcome & Login Form */}
                <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-between bg-[#0b101b]">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                        Welcome to NOVA
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Access your community identity and intelligence networks.
                      </p>
                    </div>

                    {authError && (
                      <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                        {authError}
                      </div>
                    )}

                    {/* Social Auth Buttons */}
                    <div className="space-y-2">
                      {state.currentUser && (
                        <button
                          type="button"
                          id="continue-nova-core-btn"
                          onClick={handleContinueAsNovaUser}
                          className="w-full py-2.5 px-4 rounded-xl bg-[#22d3ee]/15 hover:bg-[#22d3ee]/25 border border-[#22d3ee]/40 text-[#22d3ee] font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Continue as {state.currentUser.fullName} (Nova Core)</span>
                        </button>
                      )}
                      <button
                        type="button"
                        id="continue-google-btn"
                        onClick={handleGoogleSignIn}
                        className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs flex items-center justify-center gap-2.5 transition-all shadow-sm cursor-pointer"
                      >
                        <div className="w-4 h-4 flex items-center justify-center shrink-0">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                          </svg>
                        </div>
                        <span>Continue with Google</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer"
                      >
                        <span className="font-mono text-sm leading-none"></span>
                        <span>Continue with Apple</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setStep("signin")}
                        className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Mail className="w-3.5 h-3.5 text-[#22d3ee]" />
                        <span>Continue with Email</span>
                      </button>
                    </div>

                    <div className="relative flex items-center justify-center my-3">
                      <div className="absolute inset-x-0 h-px bg-white/10" />
                      <span className="relative bg-[#0b101b] px-3 text-[11px] text-slate-400 uppercase font-bold">
                        or
                      </span>
                    </div>

                    {/* Inline Login Form */}
                    <form onSubmit={handleSignInSubmit} className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-300 mb-1">
                          Email or Phone
                        </label>
                        <input
                          type="text"
                          value={signInEmail}
                          onChange={(e) => setSignInEmail(e.target.value)}
                          placeholder="you@example.com or +234..."
                          className="w-full bg-[#080d14] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#22d3ee] transition-colors"
                          required
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-[11px] font-medium text-slate-300">
                            Password
                          </label>
                          <button
                            type="button"
                            onClick={() => alert("Password reset instructions have been dispatched.")}
                            className="text-[11px] text-[#22d3ee] hover:underline cursor-pointer"
                          >
                            Forgot password?
                          </button>
                        </div>
                        <div className="flex items-center gap-2 bg-[#080d14] border border-white/10 rounded-xl px-3.5 py-2 text-xs focus-within:border-[#22d3ee] transition-colors">
                          <input
                            type={showSignInPassword ? "text" : "password"}
                            value={signInPassword}
                            onChange={(e) => setSignInPassword(e.target.value)}
                            placeholder="••••••••"
                            className="bg-transparent text-white placeholder-slate-500 focus:outline-none w-full"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowSignInPassword(!showSignInPassword)}
                            className="text-slate-500 hover:text-slate-300 cursor-pointer"
                          >
                            {showSignInPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 rounded-full bg-[#22d3ee] hover:bg-[#06b6d4] text-[#07090e] font-bold text-xs shadow-lg shadow-[#22d3ee]/25 transition-all cursor-pointer mt-2 active:scale-[0.99]"
                      >
                        Log In
                      </button>
                    </form>
                  </div>

                  {/* Create identity footer */}
                  <div className="pt-4 border-t border-white/5 text-center text-xs text-slate-400">
                    <span>New to NOVA? </span>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthError("");
                        setStep("join");
                      }}
                      className="text-[#22d3ee] font-bold hover:underline ml-1 cursor-pointer"
                    >
                      Create your NOVA Identity
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* SCREEN 2: SIGN IN (EMAIL / NOVA CORE CREDENTIALS)                         */}
          {/* ========================================================================= */}
          {step === "signin" && (
            <motion.div
              key="signin"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-md mx-auto my-auto p-4 sm:p-6"
            >
              <div className="bg-[#0b101b] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
                {/* Header: ← Community */}
                <button
                  type="button"
                  id="signin-back-btn"
                  onClick={() => setStep("landing")}
                  className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 cursor-pointer group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Community</span>
                </button>

                {/* Title & Subtitle */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white">
                    Sign In
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Welcome back! Sign in to your NOVA Community account.
                  </p>
                </div>

                {authError && (
                  <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                    {authError}
                  </div>
                )}

                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  {/* Email Address */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <div className="flex items-center gap-2.5 bg-[#080d14] border border-white/10 rounded-xl px-3.5 py-3 text-xs focus-within:border-[#22d3ee] transition-colors">
                      <User className="w-4 h-4 text-slate-500 shrink-0" />
                      <input
                        type="email"
                        id="signin-email"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="bg-transparent text-white placeholder-slate-500 focus:outline-none w-full"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Password
                    </label>
                    <div className="flex items-center gap-2.5 bg-[#080d14] border border-white/10 rounded-xl px-3.5 py-3 text-xs focus-within:border-[#22d3ee] transition-colors">
                      <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                      <input
                        type={showSignInPassword ? "text" : "password"}
                        id="signin-password"
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="bg-transparent text-white placeholder-slate-500 focus:outline-none w-full"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowSignInPassword(!showSignInPassword)
                        }
                        className="text-slate-500 hover:text-slate-300 cursor-pointer"
                      >
                        {showSignInPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Options row */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-white/20 bg-black/40 text-[#22d3ee] focus:ring-0"
                      />
                      <span>Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        alert(
                          "Password reset instructions have been dispatched to your email."
                        )
                      }
                      className="text-[#22d3ee] hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Sign In Button (Leads directly to plan payment before accessing community) */}
                  <button
                    type="submit"
                    id="signin-submit-btn"
                    className="w-full py-3.5 rounded-full bg-[#22d3ee] hover:bg-[#06b6d4] text-[#07090e] font-bold text-sm transition-all shadow-lg shadow-[#22d3ee]/25 mt-4 cursor-pointer active:scale-[0.99]"
                  >
                    Sign In
                  </button>
                </form>

                {/* Footer link */}
                <div className="mt-6 pt-4 border-t border-white/5 text-center text-xs text-slate-400">
                  <span>New to NOVA Community? </span>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthError("");
                      setStep("join");
                    }}
                    className="text-[#22d3ee] font-bold hover:underline ml-1 cursor-pointer"
                  >
                    Join Now
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* SCREEN 2: JOIN NOW - CREATE PROFILE & SELECT ROLE                         */}
          {/* ========================================================================= */}
          {step === "join" && (
            <motion.div
              key="join"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-xl mx-auto my-auto p-4 sm:p-6"
            >
              <div className="bg-[#0b101b] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
                {/* Step Indicator Header */}
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
                  <button
                    type="button"
                    id="join-back-btn"
                    onClick={() => setStep("landing")}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer group"
                  >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    <span>Back</span>
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-[#22d3ee] font-bold">STEP 1 OF 4</span>
                    <div className="flex gap-1">
                      <div className="w-5 h-1.5 rounded-full bg-[#22d3ee]"></div>
                      <div className="w-3 h-1.5 rounded-full bg-white/10"></div>
                      <div className="w-3 h-1.5 rounded-full bg-white/10"></div>
                      <div className="w-3 h-1.5 rounded-full bg-white/10"></div>
                    </div>
                  </div>
                </div>

                {/* Title & Subtitle */}
                <div className="mb-5">
                  <h2 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white">
                    Join Nexus Community
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Create your decentralized identity to participate in missions, access grants, and join working departments.
                  </p>
                </div>

                {authError && (
                  <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <form onSubmit={handleJoinSubmit} className="space-y-3.5">
                  {/* Full Name & Email grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Full Name
                      </label>
                      <div className="flex items-center gap-2.5 bg-[#080d14] border border-white/10 rounded-xl px-3 py-2 text-xs focus-within:border-[#22d3ee] transition-colors">
                        <User className="w-4 h-4 text-slate-500 shrink-0" />
                        <input
                          type="text"
                          id="join-fullname"
                          value={joinFullName}
                          onChange={(e) => setJoinFullName(e.target.value)}
                          placeholder="e.g. Victor Okere"
                          className="bg-transparent text-white placeholder-slate-500 focus:outline-none w-full text-xs"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Email Address
                      </label>
                      <div className="flex items-center gap-2.5 bg-[#080d14] border border-white/10 rounded-xl px-3 py-2 text-xs focus-within:border-[#22d3ee] transition-colors">
                        <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                        <input
                          type="email"
                          id="join-email"
                          value={joinEmail}
                          onChange={(e) => setJoinEmail(e.target.value)}
                          placeholder="you@nexus.org"
                          className="bg-transparent text-white placeholder-slate-500 focus:outline-none w-full text-xs"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password & Confirm Password grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Password
                      </label>
                      <div className="flex items-center gap-2.5 bg-[#080d14] border border-white/10 rounded-xl px-3 py-2 text-xs focus-within:border-[#22d3ee] transition-colors">
                        <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                        <input
                          type={showJoinPassword ? "text" : "password"}
                          id="join-password"
                          value={joinPassword}
                          onChange={(e) => setJoinPassword(e.target.value)}
                          placeholder="Create password"
                          className="bg-transparent text-white placeholder-slate-500 focus:outline-none w-full text-xs"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowJoinPassword(!showJoinPassword)}
                          className="text-slate-500 hover:text-slate-300 cursor-pointer"
                        >
                          {showJoinPassword ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Confirm Password
                      </label>
                      <div className="flex items-center gap-2.5 bg-[#080d14] border border-white/10 rounded-xl px-3 py-2 text-xs focus-within:border-[#22d3ee] transition-colors">
                        <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                        <input
                          type={showJoinConfirmPassword ? "text" : "password"}
                          id="join-confirm-password"
                          value={joinConfirmPassword}
                          onChange={(e) =>
                            setJoinConfirmPassword(e.target.value)
                          }
                          placeholder="Repeat password"
                          className="bg-transparent text-white placeholder-slate-500 focus:outline-none w-full text-xs"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowJoinConfirmPassword(!showJoinConfirmPassword)
                          }
                          className="text-slate-500 hover:text-slate-300 cursor-pointer"
                        >
                          {showJoinConfirmPassword ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Role Selection (Screen 2 8-card grid) */}
                  <div className="pt-2">
                    <label className="block text-xs font-medium text-slate-300 mb-2">
                      What best describes you? <span className="text-slate-500 font-normal">(Primary Ecosystem Role)</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: "Builder", desc: "AI dev, models, tools" },
                        { id: "Community Builder", desc: "Leader & organizer" },
                        { id: "Founder", desc: "Startups & ventures" },
                        { id: "Student", desc: "Learning & research" },
                        { id: "Investor", desc: "Capital & dealflow" },
                        { id: "Creator", desc: "Media, content & voice" },
                        { id: "Enterprise", desc: "Corporate & teams" },
                        { id: "Other", desc: "Ecosystem explorer" },
                      ].map((role) => {
                        const isSelected = joinRole === role.id;
                        return (
                          <button
                            key={role.id}
                            type="button"
                            onClick={() => setJoinRole(role.id)}
                            className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? "bg-[#22d3ee]/15 border-[#22d3ee] shadow-sm shadow-[#22d3ee]/20"
                                : "bg-[#080d14] border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
                            }`}
                          >
                            <span className={`text-xs font-bold ${isSelected ? "text-[#22d3ee]" : "text-white"}`}>
                              {role.id}
                            </span>
                            <span className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                              {role.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Continue Button */}
                  <button
                    type="submit"
                    id="join-submit-btn"
                    className="w-full py-3.5 rounded-full bg-[#22d3ee] hover:bg-[#06b6d4] text-[#07090e] font-bold text-sm transition-all shadow-lg shadow-[#22d3ee]/25 mt-4 cursor-pointer active:scale-[0.99] flex items-center justify-center gap-2"
                  >
                    <span>Continue to Objectives</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="mt-4 pt-3 border-t border-white/5 text-center text-xs text-slate-400">
                  <span>Already have an account? </span>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthError("");
                      setStep("signin");
                    }}
                    className="text-[#22d3ee] font-bold hover:underline ml-1 cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* SCREEN 3: ONBOARDING - ENTER THE NEXUS (PURPOSES / OBJECTIVES)             */}
          {/* ========================================================================= */}
          {step === "onboarding" && (
            <motion.div
              key="onboarding"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-2xl mx-auto my-auto p-4 sm:p-6"
            >
              <div className="bg-[#0b101b] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
                {/* Step Indicator Header */}
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
                  <button
                    type="button"
                    onClick={() => setStep("join")}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer group"
                  >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    <span>Back</span>
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-[#22d3ee] font-bold">STEP 2 OF 4</span>
                    <div className="flex gap-1">
                      <div className="w-3 h-1.5 rounded-full bg-[#22d3ee]"></div>
                      <div className="w-5 h-1.5 rounded-full bg-[#22d3ee]"></div>
                      <div className="w-3 h-1.5 rounded-full bg-white/10"></div>
                      <div className="w-3 h-1.5 rounded-full bg-white/10"></div>
                    </div>
                  </div>
                </div>

                {/* Title & Subtitle */}
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22d3ee]/10 border border-[#22d3ee]/30 text-[#22d3ee] text-[11px] font-bold uppercase tracking-wider mb-2.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Personalize Ecosystem</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white">
                    What brings you to Nexus?
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Select all that apply. This customizes your Media Feed, Missions Board, and Community Coordination layer.
                  </p>
                </div>

                {/* 6 Purpose Cards Grid (Screen 3) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {[
                    {
                      id: "BUILD",
                      title: "Build",
                      desc: "Build & ship AI agents, tools, and open protocols",
                      icon: Terminal,
                      tag: "Development",
                    },
                    {
                      id: "LEARN",
                      title: "Learn",
                      desc: "Learn from top engineers, research & masterclasses",
                      icon: GraduationCap,
                      tag: "Education",
                    },
                    {
                      id: "CONNECT",
                      title: "Connect",
                      desc: "Network with founders, contributors, & peers",
                      icon: Users,
                      tag: "Networking",
                    },
                    {
                      id: "LEAD",
                      title: "Lead",
                      desc: "Lead working groups, bounties & ecosystem governance",
                      icon: Compass,
                      tag: "Leadership",
                    },
                    {
                      id: "FUND",
                      title: "Fund",
                      desc: "Discover dealflow, fund projects & syndicate capital",
                      icon: TrendingUp,
                      tag: "Investment",
                    },
                    {
                      id: "GROW",
                      title: "Grow",
                      desc: "Access jobs, grants, contracts & active bounties",
                      icon: Rocket,
                      tag: "Opportunities",
                    },
                  ].map((p) => {
                    const isSelected = selectedPurposes.includes(p.id);
                    const IconComp = p.icon;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            if (selectedPurposes.length > 1) {
                              setSelectedPurposes(selectedPurposes.filter((id) => id !== p.id));
                            }
                          } else {
                            setSelectedPurposes([...selectedPurposes, p.id]);
                          }
                        }}
                        className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex items-start gap-3.5 relative overflow-hidden ${
                          isSelected
                            ? "bg-[#22d3ee]/10 border-[#22d3ee] shadow-md shadow-[#22d3ee]/15"
                            : "bg-[#080d14] border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                            isSelected
                              ? "bg-[#22d3ee] text-[#07090e] border-[#22d3ee]"
                              : "bg-white/5 text-slate-400 border-white/10"
                          }`}
                        >
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0 pr-4">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-bold text-white uppercase tracking-wider">
                              {p.title}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400 font-mono">
                              {p.tag}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            {p.desc}
                          </p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "bg-[#22d3ee] border-[#22d3ee] text-[#07090e]"
                              : "border-white/20 text-transparent"
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Continue Button to Plan Selection */}
                <button
                  type="button"
                  id="onboarding-continue-btn"
                  onClick={handleOnboardingContinue}
                  className="w-full py-3.5 rounded-full bg-[#22d3ee] hover:bg-[#06b6d4] text-[#07090e] font-bold text-sm transition-all shadow-lg shadow-[#22d3ee]/25 cursor-pointer active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  <span>Continue to Membership Plan ($2/mo)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-center text-[11px] text-slate-500 mt-3">
                  Step 2 of 4: Next, choose your membership duration before accessing the community feed.
                </p>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* SCREEN 5: PLAN SELECTION & PAYMENT ($2/MONTH BASE - 1M, 2M, 6M, 1Y, 2Y)    */}
          {/* ========================================================================= */}
          {step === "paystack" && (
            <motion.div
              key="paystack"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-xl mx-auto my-auto p-4 sm:p-6"
            >
              <div className="bg-[#0b101b] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
                {/* Header: ← Community */}
                <button
                  type="button"
                  id="paystack-back-btn"
                  onClick={() => setStep("landing")}
                  className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-4 cursor-pointer group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Community</span>
                </button>

                {/* Title & Subtitle */}
                <div className="mb-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22d3ee]/10 border border-[#22d3ee]/30 text-[#22d3ee] text-[11px] font-bold uppercase tracking-wider mb-2.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>$2 / Month Base Membership</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white">
                    Select Membership Plan
                  </h2>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Before you can access the community feed and marketplace
                    listings, choose your membership duration below.
                  </p>
                </div>

                {/* 5 PLAN DURATION CARDS (1 Month, 2 Months, 6 Months, 1 Year, 2 Years) */}
                <div className="space-y-2 mb-5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Choose Duration ($2 per month):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {MEMBERSHIP_PLANS.map((plan) => {
                      const isSelected = selectedPlanId === plan.id;
                      return (
                        <button
                          key={plan.id}
                          type="button"
                          id={`plan-card-${plan.id}`}
                          onClick={() => setSelectedPlanId(plan.id)}
                          className={`p-3 rounded-2xl text-left border transition-all cursor-pointer relative flex flex-col justify-between group ${
                            isSelected
                              ? "bg-[#22d3ee]/15 border-[#22d3ee] text-white shadow-lg shadow-[#22d3ee]/15 ring-1 ring-[#22d3ee]/40"
                              : "bg-[#080d14] border-white/10 hover:border-white/20 text-slate-300 hover:text-white"
                          }`}
                        >
                          {plan.badge && (
                            <span
                              className={`absolute -top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                isSelected
                                  ? "bg-[#22d3ee] text-[#07090e]"
                                  : "bg-white/10 text-[#22d3ee] border border-[#22d3ee]/30"
                              }`}
                            >
                              {plan.badge}
                            </span>
                          )}
                          <div className="flex items-center justify-between gap-1 mb-1.5">
                            <span className="text-xs font-bold">{plan.label}</span>
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                isSelected
                                  ? "border-[#22d3ee] bg-[#22d3ee]"
                                  : "border-white/20"
                              }`}
                            >
                              {isSelected && (
                                <div className="w-1.5 h-1.5 rounded-full bg-[#07090e]" />
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="flex items-baseline gap-1">
                              <span
                                className={`text-lg font-black font-['Space_Grotesk'] ${
                                  isSelected ? "text-[#22d3ee]" : "text-white"
                                }`}
                              >
                                ${plan.price}
                              </span>
                              <span className="text-[10px] text-slate-500">
                                USD
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {plan.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Plan Summary Banner */}
                <div className="bg-[#080d14] border border-white/10 rounded-2xl p-4 mb-5 space-y-3">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[#22d3ee]/15 text-[#22d3ee] flex items-center justify-center font-bold">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-xs">
                          {selectedPlan.label} Plan Selected
                        </h3>
                        <p className="text-[10px] text-slate-400">
                          Full community feed, listings, & marketplace access
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black text-[#22d3ee] font-['Space_Grotesk'] block">
                        ${selectedPlan.price}.00
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        ≈ ₦{selectedPlan.naira.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#22d3ee]" />
                      <span>
                        Access valid until:{" "}
                        <strong className="text-slate-200">
                          {getExpiryDate(selectedPlan.months)}
                        </strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[#22d3ee] font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>256-bit Secure Paystack</span>
                    </div>
                  </div>
                </div>

                {/* Paystack Channel Selector */}
                <div className="space-y-2 mb-5">
                  <label className="block text-[11px] font-semibold text-slate-300">
                    Paystack Payment Channel:
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#06090e] rounded-xl border border-white/5">
                    {[
                      { id: "card", label: "Card", icon: CreditCard },
                      { id: "transfer", label: "Transfer", icon: Building2 },
                      { id: "ussd", label: "USSD", icon: Smartphone },
                      { id: "qr", label: "QR Code", icon: QrCode },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const isSelected = paymentChannel === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setPaymentChannel(tab.id as any)}
                          className={`py-2 px-1 rounded-lg text-center flex flex-col items-center gap-1 transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#22d3ee] text-[#07090e] font-bold shadow-md shadow-[#22d3ee]/20"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span className="text-[10px]">{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Channel specifics */}
                  {paymentChannel === "card" && (
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full bg-[#080d14] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">
                            Expiry
                          </label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full bg-[#080d14] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">
                            CVV
                          </label>
                          <input
                            type="password"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="w-full bg-[#080d14] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentChannel === "transfer" && (
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs">
                      <div className="flex justify-between items-center text-slate-300">
                        <span>Bank:</span>
                        <strong className="text-white">
                          Titan Trust Bank / Paystack
                        </strong>
                      </div>
                      <div className="flex justify-between items-center text-slate-300">
                        <span>Amount in NGN:</span>
                        <strong className="text-[#22d3ee] font-mono">
                          ₦{selectedPlan.naira.toLocaleString()}
                        </strong>
                      </div>
                      <div className="flex justify-between items-center text-slate-300">
                        <span>Account:</span>
                        <div className="flex items-center gap-1.5">
                          <code className="text-[#22d3ee] font-bold font-mono">
                            9920148102
                          </code>
                          <button
                            type="button"
                            onClick={() => handleCopy("9920148102", "account")}
                            className="text-slate-400 hover:text-white cursor-pointer"
                          >
                            {copiedAccount ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentChannel === "ussd" && (
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs">
                      <select
                        value={selectedUssdBank}
                        onChange={(e) => setSelectedUssdBank(e.target.value)}
                        className="w-full bg-[#080d14] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      >
                        <option value="gtbank">GTBank (*737*...#)</option>
                        <option value="zenith">Zenith Bank (*966*...#)</option>
                        <option value="access">Access Bank (*901*...#)</option>
                      </select>
                      <div className="flex justify-between items-center text-slate-300 pt-1">
                        <span>Dial USSD:</span>
                        <div className="flex items-center gap-1.5">
                          <code className="text-[#22d3ee] font-bold font-mono">
                            *737*2*{selectedPlan.naira}#
                          </code>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(
                                `*737*2*${selectedPlan.naira}#`,
                                "ussd"
                              )
                            }
                            className="text-slate-400 hover:text-white cursor-pointer"
                          >
                            {copiedUssd ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentChannel === "qr" && (
                    <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col items-center justify-center text-center">
                      <div className="w-24 h-24 bg-white p-2 rounded-xl flex items-center justify-center mb-1">
                        <QrCode className="w-20 h-20 text-black" />
                      </div>
                      <span className="text-[10px] text-slate-400">
                        Scan with your banking app to pay ${selectedPlan.price}
                        .00 (₦{selectedPlan.naira.toLocaleString()})
                      </span>
                    </div>
                  )}
                </div>

                {/* Pay $X.00 & Continue Button */}
                <button
                  type="button"
                  id="paystack-submit-btn"
                  onClick={handleProcessPayment}
                  disabled={isProcessingPayment}
                  className="w-full py-4 rounded-full bg-[#22d3ee] hover:bg-[#06b6d4] text-[#07090e] font-bold text-sm transition-all shadow-lg shadow-[#22d3ee]/25 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-70"
                >
                  {isProcessingPayment ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#07090e]" />
                      <span>{paymentStatusText}</span>
                    </>
                  ) : paymentSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#07090e]" />
                      <span>
                        Payment Confirmed! Opening Community Hubs...
                      </span>
                    </>
                  ) : (
                    <>
                      <span>
                        Pay ${selectedPlan.price}.00 & Join Community (
                        {selectedPlan.label})
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Powered by paystack */}
                <div className="mt-5 pt-3.5 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span>Powered by</span>
                    <strong className="text-white font-semibold">paystack</strong>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono tracking-wider text-slate-400">
                    <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-bold text-blue-400">
                      VISA
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-bold text-orange-400">
                      Mastercard
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-bold text-emerald-400">
                      Verve
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* SCREEN 6: CHOOSE YOUR COMMUNITY                                           */}
          {/* ========================================================================= */}
          {step === "select-community" && (
            <motion.div
              key="select-community"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-lg mx-auto my-auto p-4 sm:p-6"
            >
              <div className="bg-[#0b101b] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                {/* Close Button top-right */}
                <button
                  type="button"
                  onClick={() => setStep("landing")}
                  className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Title & Subtitle */}
                <div className="mb-6 pr-8">
                  <h2 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white">
                    What community do you want to join?
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Select a community that matches your interests and goals. You
                    can join more than one later.
                  </p>
                </div>

                {/* Community Options List */}
                <div className="space-y-2.5 my-5 max-h-[380px] overflow-y-auto pr-1">
                  {AVAILABLE_COMMUNITIES.map((hub) => {
                    const Icon = hub.icon;
                    const isSelected = selectedCommunityHub === hub.id;
                    return (
                      <button
                        key={hub.id}
                        type="button"
                        id={`community-option-${hub.id}`}
                        onClick={() => setSelectedCommunityHub(hub.id)}
                        className={`w-full p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex items-center justify-between group ${
                          isSelected
                            ? "bg-[#22d3ee]/15 border-[#22d3ee] shadow-lg shadow-[#22d3ee]/10"
                            : "bg-[#080d14] border-white/5 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${
                              isSelected
                                ? "bg-[#22d3ee]/25 border-[#22d3ee] text-[#22d3ee]"
                                : "bg-white/5 border-white/10 text-slate-300 group-hover:text-white"
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3
                              className={`text-sm font-bold ${
                                isSelected ? "text-white" : "text-slate-200"
                              }`}
                            >
                              {hub.name}
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {hub.desc}
                            </p>
                          </div>
                        </div>

                        {/* Radio selection circle */}
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? "border-[#22d3ee] bg-[#22d3ee]"
                              : "border-white/20 group-hover:border-white/40"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-[#07090e]" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Join Selected Community Button */}
                <button
                  type="button"
                  id="confirm-selected-community-btn"
                  onClick={handleConfirmCommunityHub}
                  className="w-full py-4 rounded-full bg-[#22d3ee] hover:bg-[#06b6d4] text-[#07090e] font-bold text-sm transition-all shadow-lg shadow-[#22d3ee]/25 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] mt-6"
                >
                  <span>Join Selected Community</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
