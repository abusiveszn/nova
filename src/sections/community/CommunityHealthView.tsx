import { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  CheckSquare,
  Square,
} from "lucide-react";

export function CommunityHealthView() {
  const [checkedActions, setCheckedActions] = useState<Record<number, boolean>>({
    0: true,
    2: true,
  });

  const healthMetrics = [
    { label: "Participation", score: 88 },
    { label: "Retention", score: 94 },
    { label: "Contribution", score: 91 },
    { label: "Trust", score: 95 },
    { label: "Moderation", score: 94 },
    { label: "Collaboration", score: 93 },
    { label: "Knowledge", score: 95 },
    { label: "Innovation", score: 82 },
    { label: "Economic Health", score: 87 },
    { label: "Leadership", score: 91 },
  ];

  const recommendedActions = [
    "Add 2 moderation stars",
    "Delegate event management",
    "Create FAQ knowledge base",
    "Automate repetitive questions",
  ];

  const toggleAction = (index: number) => {
    setCheckedActions((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="pb-3 border-b border-white/10">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-1">
          <Activity className="w-3 h-3" />
          Health Scorecard
        </div>
        <h1 className="text-2xl font-bold font-['Space_Grotesk'] text-white">
          Community Health — AI Builders
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Algorithmic health scoring, engagement velocity, and autonomous operational recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Overall Health & 10 Metric Bars */}
        <div className="lg:col-span-8 bg-[#0b101b] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
          {/* Top Score & Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Overall Health Index
              </span>
              <p className="text-xs text-emerald-400 font-medium mt-0.5">
                Top 5% among all global Nova networks
              </p>
            </div>

            {/* Big Circular Score */}
            <div className="w-20 h-20 rounded-full border-4 border-[#22d3ee] bg-[#080d14] flex flex-col items-center justify-center shadow-lg shadow-[#22d3ee]/20">
              <span className="text-2xl font-black font-['Space_Grotesk'] text-[#22d3ee]">
                92
              </span>
              <span className="text-[9px] text-slate-400 uppercase font-bold">/ 100</span>
            </div>
          </div>

          {/* 10 Metrics Bars */}
          <div className="space-y-3">
            {healthMetrics.map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium text-xs">{item.label}</span>
                  <span className="text-[#22d3ee] font-mono font-bold">{item.score}</span>
                </div>
                <div className="w-full h-1.5 bg-[#080d14] rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-[#22d3ee] to-[#38bdf8] rounded-full transition-all duration-700"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Attention Alert & Action Checklist */}
        <div className="lg:col-span-4 space-y-4">
          {/* Attention Alert */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 shadow-xl space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>Attention!</span>
            </div>
            <h4 className="text-sm font-bold text-white">
              Moderation Workload: 2.4k flags this week
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Community managers are reporting response delays under high post volume.
              Delegate routine approvals to community stars.
            </p>
          </div>

          {/* Recommended Actions */}
          <div className="bg-[#0b101b] border border-white/10 rounded-2xl p-5 shadow-xl space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Recommended Actions
            </h3>

            <div className="space-y-2.5">
              {recommendedActions.map((action, idx) => {
                const isChecked = checkedActions[idx];
                return (
                  <button
                    key={action}
                    type="button"
                    onClick={() => toggleAction(idx)}
                    className="w-full flex items-start gap-2.5 p-2.5 rounded-xl bg-[#080d14] hover:bg-white/5 border border-white/5 text-left transition-colors cursor-pointer group"
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-[#22d3ee] shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-500 group-hover:text-slate-300 shrink-0 mt-0.5" />
                    )}
                    <span
                      className={`text-xs ${
                        isChecked ? "text-slate-400 line-through" : "text-white"
                      }`}
                    >
                      {action}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
