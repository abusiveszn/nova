import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Check,
  Share2,
  UserPlus,
  Users,
  Activity,
  Globe,
  Sparkles,
  TrendingUp,
} from "lucide-react";

interface CommunityHubPageViewProps {
  onNavigateTab?: (tab: string) => void;
}

export function CommunityHubPageView({ onNavigateTab }: CommunityHubPageViewProps) {
  const [activeSubTab, setActiveSubTab] = useState("about");
  const [isJoined, setIsJoined] = useState(true);
  const [copied, setCopied] = useState(false);

  const subTabs = [
    { id: "about", label: "About" },
    { id: "media", label: "Media" },
    { id: "discussions", label: "Discussions" },
    { id: "missions", label: "Missions" },
    { id: "events", label: "Events" },
    { id: "projects", label: "Projects" },
    { id: "members", label: "Members" },
    { id: "opportunities", label: "Opportunities" },
    { id: "market", label: "Market" },
  ];

  const pulseMetrics = [
    { label: "Participation", value: 88 },
    { label: "Retention", value: 92 },
    { label: "Contribution", value: 91 },
    { label: "Trust", value: 95 },
    { label: "Collaboration", value: 87 },
    { label: "Opportunity Quality", value: 94 },
  ];

  const handleShare = () => {
    navigator.clipboard.writeText("https://nova.network/c/ai-builders");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Hero Banner with Futuristic AI Art Cover */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0c1420] shadow-2xl">
        {/* Cover Graphic */}
        <div className="h-44 sm:h-56 w-full relative overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-950 to-cyan-900">
          <div className="absolute inset-0 bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:20px_20px] opacity-25" />
          <div className="absolute -top-12 -right-12 w-80 h-80 bg-gradient-to-br from-[#22d3ee]/30 via-indigo-500/20 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#0b101b] to-transparent" />
        </div>

        {/* Profile / Hub Details Header */}
        <div className="px-6 pb-6 pt-0 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-16 sm:-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            {/* Logo Emblem */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[#080d14] border-2 border-[#22d3ee]/50 p-2 flex items-center justify-center text-2xl font-black text-[#22d3ee] shadow-2xl shadow-[#22d3ee]/20 shrink-0">
              <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#22d3ee]/20 to-black flex items-center justify-center font-['Space_Grotesk']">
                AI
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white">
                  AI BUILDERS
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#22d3ee] bg-[#22d3ee]/15 border border-[#22d3ee]/30 px-2.5 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Community
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                Building the future with artificial intelligence
              </p>

              {/* Stats pill row */}
              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5 text-white font-semibold">
                  <Users className="w-3.5 h-3.5 text-[#22d3ee]" />
                  15,421 Members
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  Health 94/100
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2 md:pt-0">
            <button
              type="button"
              onClick={() => setIsJoined(!isJoined)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                isJoined
                  ? "bg-white/10 text-white border border-white/15 hover:bg-white/15"
                  : "bg-[#22d3ee] text-[#07090e] hover:bg-[#06b6d4] shadow-[#22d3ee]/20"
              }`}
            >
              {isJoined ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#22d3ee]" />
                  <span>Joined</span>
                </>
              ) : (
                <span>Join Community</span>
              )}
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#22d3ee]" />
              <span>Invite</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? "Copied!" : "Share"}</span>
            </button>
          </div>
        </div>

        {/* Hub Navigation Subtabs */}
        <div className="px-6 border-t border-white/10 bg-[#080d14]/70 backdrop-blur-md flex items-center gap-1 overflow-x-auto no-scrollbar">
          {subTabs.map((tab) => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveSubTab(tab.id);
                  if (onNavigateTab && tab.id !== "about") {
                    onNavigateTab(tab.id);
                  }
                }}
                className={`py-3 px-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                  isActive
                    ? "border-[#22d3ee] text-[#22d3ee]"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid: Community Pulse & About Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Community Pulse Card */}
        <div className="lg:col-span-7 bg-[#0b101b] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#22d3ee]" />
                Community Pulse
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Real-time vitality, retention, trust, and execution velocity.
              </p>
            </div>
            <div className="text-right">
              <span className="text-lg font-black font-['Space_Grotesk'] text-[#22d3ee]">
                92<span className="text-xs text-slate-500 font-normal">/100</span>
              </span>
              <p className="text-[10px] text-emerald-400 font-medium">Optimal Health</p>
            </div>
          </div>

          {/* Metric Bars */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {pulseMetrics.map((metric) => (
              <div
                key={metric.label}
                className="p-3 rounded-xl bg-[#080d14] border border-white/5 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px] font-medium truncate">
                    {metric.label}
                  </span>
                  <span className="text-white font-bold font-mono">
                    {metric.value}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#22d3ee] to-[#38bdf8] rounded-full"
                    style={{ width: `${metric.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Overall Health Bar */}
          <div className="p-3.5 rounded-xl bg-[#080d14] border border-[#22d3ee]/20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#22d3ee]/20 text-[#22d3ee] flex items-center justify-center font-bold">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Community Health Index</p>
                <p className="text-[10px] text-slate-400">Score based on 14 verification signals</p>
              </div>
            </div>
            <span className="text-sm font-bold text-[#22d3ee] font-mono">92/100</span>
          </div>
        </div>

        {/* About Card */}
        <div className="lg:col-span-5 bg-[#0b101b] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            About AI Builders
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            A community of builders, creators, researchers and innovators using AI to
            solve real-world problems. We organize regular hackathons, open source agent labs,
            and connect top talent to capital and global opportunities.
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-1">
            {["AI", "ML", "Agents", "Autonomous", "LLMs"].map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-lg bg-[#22d3ee]/10 text-[#22d3ee] border border-[#22d3ee]/30 text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Location & Meta */}
          <div className="pt-3 border-t border-white/5 space-y-2 text-xs text-slate-400">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#22d3ee]" />
                <span>Coverage:</span>
              </span>
              <span className="text-slate-200 font-medium">Global Network</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#22d3ee]" />
                <span>Audience:</span>
              </span>
              <span className="text-slate-200 font-medium">18.4K Builders</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab("profile")}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition-colors cursor-pointer"
          >
            View Active Members &rarr;
          </button>
        </div>
      </div>
    </motion.div>
  );
}
