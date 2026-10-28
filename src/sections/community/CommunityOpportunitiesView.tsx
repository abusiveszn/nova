import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
} from "lucide-react";

export function CommunityOpportunitiesView() {
  const [activeTab, setActiveTab] = useState<"all" | "for-you" | "missions" | "jobs" | "projects">("all");
  const [appliedMap, setAppliedMap] = useState<Record<string, boolean>>({});

  const opportunities = [
    {
      id: "op1",
      title: "AI Research Mission",
      category: "AI / Research",
      compensation: "$1,500",
      type: "missions",
      tags: ["Python", "ML", "Research", "Community"],
      desc: "Perform comprehensive benchmarking on open weights LLM inference speed across edge devices with structured evaluation metrics.",
      timeAgo: "1 day ago",
      positions: "2 Openings",
    },
    {
      id: "op2",
      title: "Senior Product Designer",
      category: "Design / Product",
      compensation: "Full-Time • Competitive",
      type: "jobs",
      tags: ["Figma", "UI/UX", "Design Systems", "Product"],
      desc: "Lead customer journey mapping and interactive mobile design for our core fintech and community products.",
      timeAgo: "3 days ago",
      positions: "1 Opening",
    },
    {
      id: "op3",
      title: "FinTech Developer",
      category: "FinTech / Engineering",
      compensation: "$3,500",
      type: "projects",
      tags: ["Rust", "Node.js", "WebSockets", "FinTech"],
      desc: "Develop low-latency order routing modules and banking transfer webhook listeners with 99.99% uptime guarantees.",
      timeAgo: "Just now",
      positions: "3 Openings",
    },
    {
      id: "op4",
      title: "Smart Contract Security Auditor",
      category: "Security / Web3",
      compensation: "$4,200",
      type: "missions",
      tags: ["Solidity", "Security", "Auditing"],
      desc: "Conduct fuzz testing and formal verification for multi-signature treasury and escrow smart contracts.",
      timeAgo: "2 days ago",
      positions: "1 Opening",
    },
  ];

  const handleToggleApply = (id: string) => {
    setAppliedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredOps = opportunities.filter((op) => {
    if (activeTab === "all") return true;
    if (activeTab === "for-you") return true;
    return op.type === activeTab;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Header & Category Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold font-['Space_Grotesk'] text-white">
            Opportunities
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Contract roles, design bounties, engineering gigs, and venture-backed missions.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-[#0b101b] border border-white/10 rounded-xl overflow-x-auto no-scrollbar">
          {(["all", "for-you", "missions", "jobs", "projects"] as const).map((tab) => {
            const labelMap = {
              all: "All",
              "for-you": "For You",
              missions: "Missions",
              jobs: "Jobs",
              projects: "Projects",
            };
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
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

      {/* Opportunities List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredOps.map((op) => {
          const isApplied = appliedMap[op.id];
          return (
            <div
              key={op.id}
              className="bg-[#0b101b] border border-white/10 hover:border-[#22d3ee]/40 rounded-2xl p-5 shadow-xl transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#22d3ee] bg-[#22d3ee]/10 border border-[#22d3ee]/30 px-2 py-0.5 rounded-full">
                      {op.category}
                    </span>
                    <h3 className="text-base font-bold font-['Space_Grotesk'] text-white mt-2 group-hover:text-[#22d3ee] transition-colors">
                      {op.title}
                    </h3>
                  </div>

                  <span className="text-sm font-black font-['Space_Grotesk'] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-xl shrink-0">
                    {op.compensation}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {op.desc}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {op.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-slate-300 font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {op.positions} • {op.timeAgo}
                </span>

                <button
                  type="button"
                  onClick={() => handleToggleApply(op.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isApplied
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-[#22d3ee] text-[#07090e] hover:bg-[#06b6d4] shadow-md shadow-[#22d3ee]/20"
                  }`}
                >
                  {isApplied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Application Sent</span>
                    </>
                  ) : (
                    <span>Apply Now</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
