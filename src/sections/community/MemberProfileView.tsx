import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Users,
  Target,
  Briefcase,
  MessageSquare,
  BookOpen,
  Calendar,
} from "lucide-react";

export function MemberProfileView() {
  const [collaborating, setCollaborating] = useState(false);
  const [invited, setInvited] = useState(false);

  const stats = [
    { label: "Missions", count: 12, icon: Target },
    { label: "Projects", count: 8, icon: Briefcase },
    { label: "Discussions", count: 43, icon: MessageSquare },
    { label: "Knowledge", count: 17, icon: BookOpen },
    { label: "Events", count: 6, icon: Calendar },
    { label: "Collaborations", count: 21, icon: Users },
  ];

  const communities = [
    "QA Engineering",
    "AI Builders",
    "Systems Architecture",
    "African Builders",
    "Future of Work",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Profile Banner & Identity Header */}
      <div className="bg-[#0b101b] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {/* Avatar with Status Ring */}
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#22d3ee]/20 to-[#0b101b] border-2 border-[#22d3ee] flex items-center justify-center text-xl font-bold text-[#22d3ee] shadow-xl shadow-[#22d3ee]/20">
                VO
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#0b101b] flex items-center justify-center text-[10px] text-black font-bold">
                ✓
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold font-['Space_Grotesk'] text-white">
                  Victor Okere
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#22d3ee] bg-[#22d3ee]/10 border border-[#22d3ee]/30 px-2.5 py-0.5 rounded-full font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  NOVA Bank • Score 94
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300">
                Systems Trust Architect • Autonomous AI & Multi-Agent Infrastructure
              </p>
              <p className="text-xs text-slate-500 font-mono">
                Lagos, Nigeria • Member since Jan 2025 • Verified Nova Identity #8402
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              View NOVA Identity
            </button>

            <button
              type="button"
              onClick={() => setCollaborating(!collaborating)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                collaborating
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-white/10 text-slate-200 hover:bg-white/15 border border-white/15"
              }`}
            >
              {collaborating ? "Connected ✓" : "Collaborate"}
            </button>

            <button
              type="button"
              onClick={() => setInvited(!invited)}
              className="px-4 py-2 rounded-xl bg-[#22d3ee] hover:bg-[#06b6d4] text-[#07090e] font-bold text-xs shadow-md shadow-[#22d3ee]/20 transition-all cursor-pointer"
            >
              {invited ? "Invite Sent ✓" : "Invite to Mission"}
            </button>
          </div>
        </div>

        {/* Community Contribution Stats Grid */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Community Contribution
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {stats.map((st) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.label}
                  className="p-3.5 rounded-2xl bg-[#080d14] border border-white/5 space-y-1 group hover:border-[#22d3ee]/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <Icon className="w-3.5 h-3.5 text-[#22d3ee]" />
                    <span className="text-lg font-black font-['Space_Grotesk'] text-white">
                      {st.count}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block">{st.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Communities & Leadership */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-white/5">
          {/* Active Communities */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Communities
            </span>
            <div className="flex flex-wrap gap-2">
              {communities.map((c) => (
                <span
                  key={c}
                  className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-slate-200"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Community Leadership */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Community Leadership
            </span>
            <div className="flex items-center gap-4 text-xs">
              <div className="p-3 rounded-xl bg-[#080d14] border border-white/5 flex-1">
                <span className="text-[10px] text-slate-400 block">Leadership Level</span>
                <span className="text-sm font-bold text-[#22d3ee]">Veteran Builder</span>
              </div>
              <div className="p-3 rounded-xl bg-[#080d14] border border-white/5 flex-1">
                <span className="text-[10px] text-slate-400 block">Contribution Health</span>
                <span className="text-sm font-bold text-emerald-400">94 / 100</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
