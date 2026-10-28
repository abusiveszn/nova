import { useState } from "react";
import { motion } from "framer-motion";
import {
  Target,
  Users,
  CheckCircle2,
} from "lucide-react";

interface CommunityMissionsViewProps {
  onNavigateTab?: (tab: string) => void;
}

export function CommunityMissionsView({ onNavigateTab: _onNavigateTab }: CommunityMissionsViewProps) {
  const [activeTab, setActiveTab] = useState<"all" | "trending" | "my-missions">("all");
  const [joinedMissions, setJoinedMissions] = useState<Record<string, boolean>>({});

  const missions = [
    {
      id: "m1",
      title: "Build an AI Customer Support Agent",
      domain: "AI / Agents",
      reward: "$5,000 reward",
      rewardAmount: 5000,
      participants: "87 participants",
      avatarBg: "bg-blue-600/20 text-blue-400 border-blue-500/30",
      category: "trending",
      desc: "Architect and benchmark an autonomous reasoning engine that resolves customer support inquiries with sub-2-second latency and automated escalation workflows.",
      requirements: ["Python", "LangChain", "Vector DB", "FastAPI"],
      deadline: "12 days left",
      verified: true,
    },
    {
      id: "m2",
      title: "Solve: African SME Payments",
      domain: "FinTech",
      reward: "Equity • Opportunity",
      rewardAmount: 8500,
      participants: "142 participants",
      avatarBg: "bg-emerald-600/20 text-emerald-400 border-emerald-500/30",
      category: "trending",
      desc: "Implement zero-fee instant settlement channels for cross-border African merchant payments utilizing decentralized liquidity pools.",
      requirements: ["Rust", "Node.js", "Payment APIs", "Smart Contracts"],
      deadline: "18 days left",
      verified: true,
    },
    {
      id: "m3",
      title: "Community Research Mission: AI in Agriculture",
      domain: "Research",
      reward: "$1,000 reward",
      rewardAmount: 1000,
      participants: "38 participants",
      avatarBg: "bg-cyan-600/20 text-[#22d3ee] border-[#22d3ee]/30",
      category: "all",
      desc: "Survey field datasets on crop disease detection in West Africa. Aggregate verified drone imagery into open access training bundles.",
      requirements: ["Computer Vision", "Data Analytics", "Field Research"],
      deadline: "24 days left",
      verified: true,
    },
    {
      id: "m4",
      title: "QA Resiliency Suite for Nova Core",
      domain: "Engineering",
      reward: "$3,200 reward",
      rewardAmount: 3200,
      participants: "64 participants",
      avatarBg: "bg-indigo-600/20 text-indigo-400 border-indigo-500/30",
      category: "all",
      desc: "Construct comprehensive Playwright and TypeScript test suites verifying automated failovers under peak concurrency.",
      requirements: ["TypeScript", "Playwright", "Docker"],
      deadline: "5 days left",
      verified: true,
    },
  ];

  const handleToggleJoin = (id: string) => {
    setJoinedMissions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredMissions = missions.filter((m) => {
    if (activeTab === "trending") return m.category === "trending";
    if (activeTab === "my-missions") return joinedMissions[m.id];
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold font-['Space_Grotesk'] text-white">
            Missions
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Bounties, collaborative challenges, and verified execution tasks with economic payouts.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1 bg-[#0b101b] border border-white/10 rounded-xl">
          {(["all", "trending", "my-missions"] as const).map((tab) => {
            const labelMap = {
              all: "All",
              trending: "Trending",
              "my-missions": "My Missions",
            };
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#22d3ee] text-[#07090e] shadow-md shadow-[#22d3ee]/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {labelMap[tab]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Missions List */}
      <div className="space-y-3.5">
        {filteredMissions.length === 0 ? (
          <div className="p-12 text-center bg-[#0b101b] border border-white/5 rounded-2xl">
            <Target className="w-10 h-10 text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-white">No missions in this view</p>
            <p className="text-xs text-slate-400 mt-1">
              Join active missions from the All or Trending tabs.
            </p>
          </div>
        ) : (
          filteredMissions.map((mission) => {
            const isJoined = joinedMissions[mission.id];
            return (
              <div
                key={mission.id}
                className="bg-[#0b101b] border border-white/10 hover:border-[#22d3ee]/40 rounded-2xl p-5 shadow-xl transition-all group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left Content */}
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#22d3ee]/10 text-[#22d3ee] border border-[#22d3ee]/30">
                        {mission.domain}
                      </span>
                      <span className="text-xs font-mono text-emerald-400 font-semibold">
                        {mission.reward}
                      </span>
                      <span className="text-[11px] text-slate-500">•</span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Users className="w-3 h-3 text-[#22d3ee]" />
                        {mission.participants}
                      </span>
                    </div>

                    <h3 className="text-base font-bold font-['Space_Grotesk'] text-white group-hover:text-[#22d3ee] transition-colors">
                      {mission.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {mission.desc}
                    </p>

                    {/* Requirements pills */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {mission.requirements.map((req) => (
                        <span
                          key={req}
                          className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300"
                        >
                          {req}
                        </span>
                      ))}
                      <span className="text-[10px] text-slate-500 ml-2">
                        Deadline: {mission.deadline}
                      </span>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-3 pt-2 md:pt-0 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleJoin(mission.id)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                        isJoined
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : "bg-[#22d3ee] text-[#07090e] hover:bg-[#06b6d4] shadow-[#22d3ee]/20"
                      }`}
                    >
                      {isJoined ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Joined Mission</span>
                        </>
                      ) : (
                        <span>Join Mission</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
