import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
} from "lucide-react";

export function CommunityProjectsMarketplaceView() {
  const [section, setSection] = useState<"projects" | "marketplace">("projects");
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "in-progress" | "completed">("all");

  const projects = [
    {
      id: "p1",
      title: "AI Customer Support Agent",
      domain: "AI / Agents",
      budget: "$5,800",
      timeLeft: "12 days left",
      matchScore: 94,
      progress: 41,
      status: "in-progress",
      desc: "Full automated ticket triage and response agent integrating Nova Vector indexing and multi-channel webhooks.",
    },
    {
      id: "p2",
      title: "Mobile App for African Farmers",
      domain: "Agriculture & Logistics",
      budget: "$8,500",
      timeLeft: "18 days left",
      matchScore: 87,
      progress: 33,
      status: "in-progress",
      desc: "Offline-first mobile platform providing real-time commodity pricing, weather forecasts, and direct grain buyer matching.",
    },
    {
      id: "p3",
      title: "DeFi Payment Integration",
      domain: "Blockchain / Payments",
      budget: "$10,000",
      timeLeft: "25 days left",
      matchScore: 82,
      progress: 55,
      status: "in-progress",
      desc: "Smart contract automated escrow system enabling non-custodial cross-currency payroll disbursement.",
    },
  ];

  const marketplaceItems = [
    {
      id: "m1",
      title: "Nova Vector Indexing Engine v2",
      domain: "Code / Library",
      price: "$240",
      rating: "4.9 (38 sales)",
      seller: "David Okafor",
      desc: "Production-ready Rust/Wasm vector similarity index for edge deployment with zero memory leaks.",
    },
    {
      id: "m2",
      title: "FinTech Mobile UI Design System (Figma)",
      domain: "Design Assets",
      price: "$95",
      rating: "5.0 (62 sales)",
      seller: "Aisha Bello",
      desc: "240+ responsive dark-mode screens, auto-layout tokens, micro-interactions, and design tokens.",
    },
    {
      id: "m3",
      title: "Automated Paystack & Webhook Suite",
      domain: "Full-Stack Kit",
      price: "$180",
      rating: "4.8 (44 sales)",
      seller: "Yunusa Lukman",
      desc: "Idempotent payment webhook listeners, USSD fallback triggers, and reconciliation pipelines.",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Header & Main Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold font-['Space_Grotesk'] text-white">
            {section === "projects" ? "Projects" : "Marketplace"}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {section === "projects"
              ? "Verified community builds with AI match scoring and progress telemetry."
              : "Pre-built software assets, design systems, and developer kits."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-[#0b101b] border border-white/10 rounded-xl">
            <button
              type="button"
              onClick={() => setSection("projects")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                section === "projects"
                  ? "bg-[#22d3ee] text-[#07090e] shadow-md shadow-[#22d3ee]/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Projects
            </button>
            <button
              type="button"
              onClick={() => setSection("marketplace")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                section === "marketplace"
                  ? "bg-[#22d3ee] text-[#07090e] shadow-md shadow-[#22d3ee]/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Marketplace
            </button>
          </div>
        </div>
      </div>

      {section === "projects" ? (
        <div className="space-y-4">
          {/* Status Subtabs */}
          <div className="flex items-center gap-2">
            {(["all", "open", "in-progress", "completed"] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize ${
                  statusFilter === st
                    ? "bg-[#22d3ee]/15 text-[#22d3ee] border border-[#22d3ee]/30 font-bold"
                    : "bg-[#0b101b] text-slate-400 hover:text-white border border-white/5"
                }`}
              >
                {st.replace("-", " ")}
              </button>
            ))}
          </div>

          {/* Projects Cards */}
          <div className="space-y-3.5">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="bg-[#0b101b] border border-white/10 hover:border-[#22d3ee]/40 rounded-2xl p-5 shadow-xl transition-all group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#22d3ee] bg-[#22d3ee]/10 border border-[#22d3ee]/30 px-2.5 py-0.5 rounded-full">
                        {proj.domain}
                      </span>
                      <span className="text-xs font-bold text-white font-mono">
                        {proj.budget}
                      </span>
                      <span className="text-[11px] text-slate-500">•</span>
                      <span className="text-[11px] text-slate-400">
                        {proj.timeLeft}
                      </span>
                    </div>

                    <h3 className="text-base font-bold font-['Space_Grotesk'] text-white group-hover:text-[#22d3ee] transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {proj.desc}
                    </p>

                    {/* Progress Bar & Match Score */}
                    <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
                      <div className="flex-1 max-w-xs">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                          <span>Milestone Progress</span>
                          <span className="font-mono font-bold text-white">{proj.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#22d3ee] to-[#38bdf8] rounded-full"
                            style={{ width: `${proj.progress}%` }}
                          />
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                        <Sparkles className="w-3 h-3" />
                        Match: {proj.matchScore}%
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 md:pt-0 shrink-0">
                    <button
                      type="button"
                      className="px-5 py-2.5 rounded-xl bg-[#22d3ee] hover:bg-[#06b6d4] text-[#07090e] font-bold text-xs transition-all shadow-md shadow-[#22d3ee]/20 flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>View Project</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Marketplace Grid */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {marketplaceItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#0b101b] border border-white/10 hover:border-[#22d3ee]/40 rounded-2xl p-5 shadow-xl transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#22d3ee] bg-[#22d3ee]/10 border border-[#22d3ee]/30 px-2.5 py-0.5 rounded-full">
                    {item.domain}
                  </span>
                  <span className="text-base font-extrabold font-['Space_Grotesk'] text-emerald-400">
                    {item.price}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-[#22d3ee] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {item.desc}
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  By {item.seller} • {item.rating}
                </p>
              </div>

              <button
                type="button"
                className="w-full py-2 rounded-xl bg-[#22d3ee] hover:bg-[#06b6d4] text-[#07090e] font-bold text-xs shadow-md shadow-[#22d3ee]/20 transition-all cursor-pointer"
              >
                Purchase Asset
              </button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
