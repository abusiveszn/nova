import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  Plus,
  CheckCircle2,
  X,
} from "lucide-react";

export function CommunityEventsView() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState<Record<string, boolean>>({
    ev1: true,
  });

  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventLocation, setNewEventLocation] = useState("");
  const [newEventDate, setNewEventDate] = useState("");

  const [eventsList, setEventsList] = useState([
    {
      id: "ev1",
      title: "NOVA AI Builders Meetup",
      location: "Abuja, Nigeria",
      dateStr: "Sep 28, 2026 • 5:00 PM WAT",
      attendees: "237 attending",
      isOnline: false,
      type: "upcoming",
      desc: "Live offline gathering for neural engineering, agentic coding demos, lightning project presentations, and venture networking.",
    },
    {
      id: "ev2",
      title: "AI Agents Workshop: Architecture & Scale",
      location: "Online / Global Stream",
      dateStr: "Oct 02, 2026 • 6:00 PM UTC",
      attendees: "1,240 registered",
      isOnline: true,
      type: "upcoming",
      desc: "Masterclass with core platform architects on state management, multi-agent orchestration, and production observability.",
    },
    {
      id: "ev3",
      title: "NOVA Community Summit 2026",
      location: "Lagos, Nigeria & Virtual",
      dateStr: "Oct 18, 2026 • Full Day",
      attendees: "2,500 attending",
      isOnline: false,
      type: "upcoming",
      desc: "The premier gathering of African builders, global venture partners, and AI intelligence pioneers.",
    },
    {
      id: "ev4",
      title: "FinTech Hackathon Demo Night",
      location: "Online",
      dateStr: "Aug 14, 2026 • Completed",
      attendees: "890 attended",
      isOnline: true,
      type: "past",
      desc: "Showcase of 16 finalists building decentralized liquidity and cross-border invoicing pipelines.",
    },
  ]);

  const handleToggleRegister = (id: string) => {
    setRegisteredEvents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const newEv = {
      id: `ev_${Date.now()}`,
      title: newEventTitle.trim(),
      location: newEventLocation.trim() || "Online",
      dateStr: newEventDate.trim() || "Nov 15, 2026 • 6:00 PM",
      attendees: "1 attending",
      isOnline: newEventLocation.toLowerCase().includes("online"),
      type: "upcoming",
      desc: "Community created event for collaborative builders.",
    };

    setEventsList([newEv, ...eventsList]);
    setRegisteredEvents((prev) => ({ ...prev, [newEv.id]: true }));
    setNewEventTitle("");
    setNewEventLocation("");
    setNewEventDate("");
    setShowCreateModal(false);
  };

  const filteredEvents = eventsList.filter((e) => e.type === activeTab);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold font-['Space_Grotesk'] text-white">
            Events
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Meetups, builder workshops, demo days, and global summits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-[#0b101b] border border-white/10 rounded-xl">
            {(["upcoming", "past"] as const).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer capitalize ${
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

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#22d3ee] hover:bg-[#06b6d4] text-[#07090e] text-xs font-bold transition-all shadow-md shadow-[#22d3ee]/20 cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Event</span>
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="space-y-4">
        {filteredEvents.map((ev) => {
          const isRegistered = registeredEvents[ev.id];
          return (
            <div
              key={ev.id}
              className="bg-[#0b101b] border border-white/10 hover:border-[#22d3ee]/30 rounded-2xl p-5 shadow-xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#22d3ee] bg-[#22d3ee]/10 border border-[#22d3ee]/30 px-2.5 py-0.5 rounded-full">
                    <Calendar className="w-3 h-3" />
                    {ev.dateStr}
                  </span>

                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {ev.location}
                  </span>

                  <span className="text-[11px] text-slate-500">•</span>

                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                    <Users className="w-3 h-3 text-[#22d3ee]" />
                    {ev.attendees}
                  </span>
                </div>

                <h3 className="text-base font-bold font-['Space_Grotesk'] text-white group-hover:text-[#22d3ee] transition-colors">
                  {ev.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {ev.desc}
                </p>
              </div>

              <div className="pt-2 md:pt-0 shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleRegister(ev.id)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                    isRegistered
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-[#22d3ee] text-[#07090e] hover:bg-[#06b6d4] shadow-[#22d3ee]/20"
                  }`}
                >
                  {isRegistered ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Registered</span>
                    </>
                  ) : (
                    <span>Register / Join</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Event Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#0b101b] border border-[#22d3ee]/30 rounded-3xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#22d3ee]" />
                  <h3 className="text-sm font-bold text-white font-['Space_Grotesk']">
                    Create Community Event
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateEvent} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Event Title
                  </label>
                  <input
                    type="text"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    placeholder="e.g. Next.js 16 & Agent Hackathon"
                    className="w-full bg-[#080d14] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#22d3ee]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Location or Stream Link
                  </label>
                  <input
                    type="text"
                    value={newEventLocation}
                    onChange={(e) => setNewEventLocation(e.target.value)}
                    placeholder="e.g. Lagos, Nigeria or Google Meet"
                    className="w-full bg-[#080d14] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#22d3ee]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Date & Time
                  </label>
                  <input
                    type="text"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    placeholder="e.g. Nov 12, 2026 • 6:00 PM WAT"
                    className="w-full bg-[#080d14] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#22d3ee]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#22d3ee] hover:bg-[#06b6d4] text-[#07090e] text-xs font-bold shadow-md shadow-[#22d3ee]/25"
                  >
                    Publish Event
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
