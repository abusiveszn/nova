import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  CreditCard,
  CheckCircle2,
  X,
  RefreshCw,
} from "lucide-react";

export function CommunityStudioView() {
  const [activeStudioTab, setActiveStudioTab] = useState("overview");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const studioTabs = [
    { id: "overview", label: "Overview" },
    { id: "identity", label: "Identity" },
    { id: "members", label: "Members" },
    { id: "content", label: "Content" },
    { id: "programs", label: "Programs" },
    { id: "missions", label: "Missions" },
    { id: "events", label: "Events" },
    { id: "opportunities", label: "Opportunities" },
    { id: "moderation", label: "Moderation" },
    { id: "health", label: "Health" },
    { id: "analytics", label: "Analytics" },
    { id: "economy", label: "Economy" },
    { id: "team", label: "Team" },
    { id: "settings", label: "Settings" },
  ];

  const handleWithdraw = () => {
    setIsWithdrawing(true);
    setTimeout(() => {
      setIsWithdrawing(false);
      setWithdrawSuccess(true);
      setTimeout(() => {
        setWithdrawSuccess(false);
        setShowWithdrawModal(false);
      }, 1500);
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Top Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#22d3ee]/10 text-[#22d3ee] text-[10px] font-bold uppercase tracking-wider mb-1">
            Community Studio
          </div>
          <h1 className="text-2xl font-bold font-['Space_Grotesk'] text-white">
            AI Builders Studio
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Coordination telemetry, treasury analytics, and automated smart disbursements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowWithdrawModal(true)}
            className="px-4 py-2 rounded-xl bg-[#22d3ee] hover:bg-[#06b6d4] text-[#07090e] font-bold text-xs transition-all shadow-md shadow-[#22d3ee]/20 flex items-center gap-1.5 cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Withdraw with NOVA Pay</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Subtabs Rail */}
        <div className="lg:col-span-3 bg-[#0b101b] border border-white/10 rounded-2xl p-3 shadow-xl">
          <div className="space-y-1">
            {studioTabs.map((tab) => {
              const isActive = activeStudioTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveStudioTab(tab.id)}
                  className={`w-full py-2 px-3 rounded-xl text-left text-xs font-medium transition-colors cursor-pointer capitalize ${
                    isActive
                      ? "bg-[#22d3ee]/15 text-[#22d3ee] font-bold border border-[#22d3ee]/30"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-9 space-y-6">
          {/* Key Overview Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {[
              { label: "Members", value: "18,421", delta: "+12% this mo" },
              { label: "Active Members", value: "9,842", delta: "53% engagement" },
              { label: "Transactions", value: "1,247", delta: "Zero failure" },
              { label: "Events", value: "18", delta: "3 scheduled" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-[#0b101b] border border-white/10 rounded-2xl p-4 shadow-xl space-y-1.5"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {stat.label}
                </span>
                <p className="text-xl sm:text-2xl font-black font-['Space_Grotesk'] text-white">
                  {stat.value}
                </p>
                <span className="text-[10px] text-emerald-400 font-mono">
                  {stat.delta}
                </span>
              </div>
            ))}
          </div>

          {/* Economic Activity & Your Contribution */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Economic Activity Card */}
            <div className="md:col-span-7 bg-[#0b101b] border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#22d3ee]" />
                  Economic Activity
                </h3>
                <span className="text-sm font-black font-['Space_Grotesk'] text-[#22d3ee]">
                  Total: $72,700
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { label: "Member Services", amount: "$18,450" },
                  { label: "Events & Summits", amount: "$212,000" },
                  { label: "Projects Escrow", amount: "$51,800" },
                  { label: "Academy Programs", amount: "$4,900" },
                  { label: "Bounty Rewards", amount: "$8,890" },
                  { label: "Marketplace Sales", amount: "$9,300" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="p-3 rounded-xl bg-[#080d14] border border-white/5 space-y-1"
                  >
                    <span className="text-slate-400 text-[10px] block truncate">
                      {item.label}
                    </span>
                    <span className="text-sm font-bold text-white font-mono">
                      {item.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Your Contribution & Payout */}
            <div className="md:col-span-5 bg-[#0b101b] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Your Contribution Balance
                </h3>

                <div className="p-4 rounded-xl bg-[#080d14] border border-[#22d3ee]/20 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Eligible Earnings:</span>
                    <span className="font-bold text-white font-mono">$3,450.00</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Pending Clearance:</span>
                    <span className="font-bold text-amber-400 font-mono">$640.00</span>
                  </div>
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-[#22d3ee] font-semibold">Available Now:</span>
                    <span className="text-lg font-black text-[#22d3ee] font-['Space_Grotesk']">
                      $1,980.00
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Direct instant payout to your bank account or crypto wallet via NOVA Pay settlement network.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowWithdrawModal(true)}
                className="w-full py-3 rounded-xl bg-[#22d3ee] hover:bg-[#06b6d4] text-[#07090e] font-bold text-xs shadow-md shadow-[#22d3ee]/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>Withdraw $1,980.00</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Withdraw Modal */}
      <AnimatePresence>
        {showWithdrawModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-[#0b101b] border border-[#22d3ee]/30 rounded-3xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <h3 className="text-sm font-bold text-white font-['Space_Grotesk']">
                  NOVA Pay Settlement
                </h3>
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {withdrawSuccess ? (
                <div className="py-6 text-center space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h4 className="text-base font-bold text-white">Transfer Dispatched!</h4>
                  <p className="text-xs text-slate-400">
                    $1,980.00 has been sent to your primary payout account.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-[#080d14] border border-white/5 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">
                      Settlement Amount
                    </span>
                    <p className="text-2xl font-black text-[#22d3ee] font-['Space_Grotesk']">
                      $1,980.00
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono">
                      Destination: Titan Trust (••• 4810)
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleWithdraw}
                    disabled={isWithdrawing}
                    className="w-full py-3 rounded-xl bg-[#22d3ee] hover:bg-[#06b6d4] text-[#07090e] font-bold text-xs shadow-md shadow-[#22d3ee]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                  >
                    {isWithdrawing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Processing payout...</span>
                      </>
                    ) : (
                      <span>Confirm Instant Withdrawal</span>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
