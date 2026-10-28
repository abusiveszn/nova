import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  Sparkles,
  Calendar,
  Target,
  Briefcase,
  Users,
  Video,
  Home,
  Compass,
} from "lucide-react";

interface MobileCreateSheetProps {
  activeTab: string;
  onTabSelect: (tab: string) => void;
  onOpenCreateCommunity: () => void;
}

export function MobileCreateSheet({
  activeTab,
  onTabSelect,
  onOpenCreateCommunity,
}: MobileCreateSheetProps) {
  const [isOpen, setIsOpen] = useState(false);

  const createActions = [
    {
      id: "post",
      label: "Create Post",
      icon: Sparkles,
      action: () => {
        onTabSelect("feed");
        setIsOpen(false);
      },
    },
    {
      id: "story",
      label: "Create Story",
      icon: Video,
      action: () => {
        onTabSelect("media");
        setIsOpen(false);
      },
    },
    {
      id: "event",
      label: "Create Event",
      icon: Calendar,
      action: () => {
        onTabSelect("events");
        setIsOpen(false);
      },
    },
    {
      id: "mission",
      label: "Create Mission",
      icon: Target,
      action: () => {
        onTabSelect("missions");
        setIsOpen(false);
      },
    },
    {
      id: "opportunity",
      label: "Create Opportunity",
      icon: Briefcase,
      action: () => {
        onTabSelect("opportunities");
        setIsOpen(false);
      },
    },
    {
      id: "community",
      label: "Create Community",
      icon: Users,
      action: () => {
        setIsOpen(false);
        onOpenCreateCommunity();
      },
    },
  ];

  return (
    <>
      {/* Mobile Fixed Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0c1017]/95 backdrop-blur-xl border-t border-white/10 px-4 py-2 flex items-center justify-around shadow-2xl">
        <button
          type="button"
          onClick={() => onTabSelect("feed")}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
            activeTab === "feed" ? "text-[#22d3ee] font-bold" : "text-slate-400"
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          type="button"
          onClick={() => onTabSelect("communities")}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
            activeTab === "communities" ? "text-[#22d3ee] font-bold" : "text-slate-400"
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Hubs</span>
        </button>

        {/* Center Floating Plus Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-11 h-11 -mt-5 rounded-full bg-gradient-to-tr from-[#22d3ee] to-[#0284c7] text-[#07090e] flex items-center justify-center shadow-lg shadow-[#22d3ee]/40 transition-transform active:scale-95 cursor-pointer"
        >
          <Plus className="w-5 h-5 font-bold" />
        </button>

        <button
          type="button"
          onClick={() => onTabSelect("media")}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
            activeTab === "media" ? "text-[#22d3ee] font-bold" : "text-slate-400"
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Media</span>
        </button>

        <button
          type="button"
          onClick={() => onTabSelect("profile")}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
            activeTab === "profile" ? "text-[#22d3ee] font-bold" : "text-slate-400"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Profile</span>
        </button>
      </div>

      {/* Floating Action Sheet Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              className="w-full max-w-sm bg-[#0b101b] border-t sm:border border-[#22d3ee]/30 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <h3 className="text-sm font-bold text-white font-['Space_Grotesk']">
                  Create in Community
                </h3>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {createActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      type="button"
                      onClick={action.action}
                      className="p-3 rounded-2xl bg-[#080d14] hover:bg-white/5 border border-white/5 hover:border-[#22d3ee]/40 text-left transition-all cursor-pointer flex flex-col items-start gap-2 group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#22d3ee]/10 text-[#22d3ee] flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-white group-hover:text-[#22d3ee]">
                        {action.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
