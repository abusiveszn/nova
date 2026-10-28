import { useState } from "react";
import { motion } from "framer-motion";
import {
  Network,
} from "lucide-react";

export function MyNetworkOrbitView() {
  const [activeTab, setActiveTab] = useState<"people" | "communities" | "teams" | "projects" | "mentors">("people");
  const [selectedNode, setSelectedNode] = useState<string>("communities");

  const orbitNodes = [
    {
      id: "communities",
      label: "Communities",
      count: "12 Hubs",
      color: "#22d3ee",
      pos: "top-4 left-1/2 -translate-x-1/2",
      desc: "Connected across AI Builders, QA Engineering, and African Builders.",
    },
    {
      id: "projects",
      label: "Projects",
      count: "8 Active",
      color: "#38bdf8",
      pos: "top-14 right-12 sm:right-24",
      desc: "Contracted on 8 verified builds with active milestone escrows.",
    },
    {
      id: "teams",
      label: "Teams",
      count: "4 Guilds",
      color: "#10b981",
      pos: "right-4 top-1/2 -translate-y-1/2",
      desc: "Core member of Nova AI Swarms and Lagos Dev Labs.",
    },
    {
      id: "mentors",
      label: "Mentors",
      count: "6 Advisors",
      color: "#a855f7",
      pos: "bottom-14 right-12 sm:right-24",
      desc: "Mentored by veteran engineering leads and venture partners.",
    },
    {
      id: "founders",
      label: "Founders",
      count: "18 Matched",
      color: "#ec4899",
      pos: "bottom-4 left-1/2 -translate-x-1/2",
      desc: "Direct advisory and technical co-founder relationships.",
    },
    {
      id: "investors",
      label: "Investors",
      count: "9 Angels",
      color: "#f59e0b",
      pos: "bottom-14 left-12 sm:left-24",
      desc: "Connected to syndicates and venture scouts watching your missions.",
    },
    {
      id: "collaborators",
      label: "Collaborators",
      count: "42 Builders",
      color: "#6366f1",
      pos: "top-14 left-12 sm:left-24",
      desc: "Active cross-discipline network of designers, frontend and backend specialists.",
    },
  ];

  const activeNodeData = orbitNodes.find((n) => n.id === selectedNode) || orbitNodes[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#22d3ee]/10 text-[#22d3ee] text-[10px] font-bold uppercase tracking-wider mb-1">
            <Network className="w-3 h-3" />
            Social Graph & Nexus
          </div>
          <h1 className="text-2xl font-bold font-['Space_Grotesk'] text-white">
            My Network
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Living topological graph of verified collaborators, teams, capital, and communities.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-[#0b101b] border border-white/10 rounded-xl overflow-x-auto no-scrollbar">
          {(["people", "communities", "teams", "projects", "mentors"] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer capitalize ${
                  isActive
                    ? "bg-[#22d3ee] text-[#07090e] shadow-md shadow-[#22d3ee]/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orbit Visualization Canvas */}
      <div className="relative w-full h-[420px] sm:h-[480px] bg-[#080d14] border border-white/10 rounded-3xl overflow-hidden flex items-center justify-center shadow-2xl">
        {/* Orbital rings */}
        <div className="absolute w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute w-[360px] h-[360px] sm:w-[440px] sm:h-[440px] rounded-full border border-[#22d3ee]/10 pointer-events-none" />

        {/* Ambient Radial Glow */}
        <div className="absolute w-72 h-72 rounded-full bg-[#22d3ee]/10 blur-3xl pointer-events-none" />

        {/* Center Node: You */}
        <div className="relative z-20 flex flex-col items-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#22d3ee] via-[#0284c7] to-indigo-600 p-1 flex items-center justify-center shadow-2xl shadow-[#22d3ee]/40 animate-pulse">
            <div className="w-full h-full rounded-full bg-[#07090e] flex flex-col items-center justify-center text-white">
              <span className="text-xs font-bold font-mono text-[#22d3ee]">YOU</span>
              <span className="text-[10px] text-slate-300">Victor</span>
            </div>
          </div>
        </div>

        {/* Orbiting Satellite Nodes */}
        {orbitNodes.map((node) => {
          const isSelected = selectedNode === node.id;
          return (
            <button
              key={node.id}
              type="button"
              onClick={() => setSelectedNode(node.id)}
              className={`absolute z-20 ${node.pos} transition-all duration-300 cursor-pointer group flex flex-col items-center`}
            >
              <div
                className={`px-3 py-2 rounded-2xl border text-center transition-all ${
                  isSelected
                    ? "bg-[#0b101b] border-[#22d3ee] shadow-xl shadow-[#22d3ee]/30 scale-110 ring-2 ring-[#22d3ee]/40"
                    : "bg-[#0b101b]/90 border-white/10 hover:border-white/30 hover:scale-105"
                }`}
              >
                <p className="text-[11px] font-bold text-white group-hover:text-[#22d3ee]">
                  {node.label}
                </p>
                <span className="text-[9px] font-mono text-slate-400 block mt-0.5">
                  {node.count}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Node Details Card */}
      <div className="bg-[#0b101b] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white font-['Space_Grotesk']">
              {activeNodeData.label} Connections
            </h3>
            <span className="text-[10px] text-[#22d3ee] font-mono bg-[#22d3ee]/10 px-2 py-0.5 rounded-full border border-[#22d3ee]/20">
              {activeNodeData.count}
            </span>
          </div>
          <p className="text-xs text-slate-300">
            {activeNodeData.desc}
          </p>
        </div>

        <button
          type="button"
          className="px-4 py-2 rounded-xl bg-[#22d3ee] hover:bg-[#06b6d4] text-[#07090e] font-bold text-xs shadow-md shadow-[#22d3ee]/20 transition-all cursor-pointer shrink-0"
        >
          Explore Circle &rarr;
        </button>
      </div>
    </motion.div>
  );
}
