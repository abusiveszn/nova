import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ShieldCheck,
  Check,
  ChevronRight,
  Plus,
} from "lucide-react";
import { AVAILABLE_COMMUNITIES } from "../CommunityGateway";

interface CommunitiesDirectoryViewProps {
  activeCommunityHub: string;
  onSelectCommunity: (hubId: string) => void;
  onCreateCommunityClick: () => void;
}

const DISCOVER_TAGS = [
  "Technology",
  "Business",
  "Design",
  "Science",
  "Finance",
  "Industries",
  "Regional",
  "Universities",
  "Professional",
  "Innovation",
];

const FEATURED_COMMUNITIES = [
  {
    id: "ai-builders",
    name: "AI BUILDERS",
    avatar: "AI",
    members: "18.4K members",
    health: 91,
    tagline: "AI • ML • Agents",
    desc: "Building autonomous agents, LLM pipelines, neural models and generative applications.",
    joined: true,
    accent: "#22d3ee",
  },
  {
    id: "qa-engineering",
    name: "QA ENGINEERING",
    avatar: "QA",
    members: "12.6K members",
    health: 85,
    tagline: "Testing • Automation",
    desc: "End-to-end testing, CI/CD observability, Playwright automation & resilient software verification.",
    joined: false,
    accent: "#38bdf8",
  },
  {
    id: "african-builders",
    name: "AFRICAN BUILDERS",
    avatar: "AB",
    members: "8.4K members",
    health: 93,
    tagline: "Africa • Innovation",
    desc: "Empowering tech ecosystems, fintech pioneers, logistics infrastructure, and grassroots hubs across Africa.",
    joined: false,
    accent: "#10b981",
  },
];

export function CommunitiesDirectoryView({
  activeCommunityHub,
  onSelectCommunity,
  onCreateCommunityClick,
}: CommunitiesDirectoryViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("Technology");
  const [joinedCommunities, setJoinedCommunities] = useState<Record<string, boolean>>({
    "ai-builders": true,
  });

  const toggleJoin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setJoinedCommunities((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <h1 className="text-2xl font-bold font-['Space_Grotesk'] text-white">
            Communities
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Discover verified tech circles, domain networks, and curated intelligence hubs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search communities..."
              className="w-full pl-9 pr-3 py-2 bg-[#0e141f] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#22d3ee]/50 transition-colors"
            />
          </div>

          <button
            type="button"
            onClick={onCreateCommunityClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#22d3ee] hover:bg-[#06b6d4] text-[#07090e] text-xs font-bold transition-all shadow-md shadow-[#22d3ee]/20 cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Create Community</span>
            <span className="sm:hidden">Create</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Your Communities */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#0b101b] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Your Communities
              </h3>
              <span className="text-[10px] text-[#22d3ee] font-semibold">
                {AVAILABLE_COMMUNITIES.length} Joined
              </span>
            </div>

            <div className="space-y-2">
              {AVAILABLE_COMMUNITIES.map((community) => {
                const Icon = community.icon;
                const isSelected = activeCommunityHub === community.id;
                return (
                  <button
                    key={community.id}
                    type="button"
                    onClick={() => onSelectCommunity(community.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer group ${
                      isSelected
                        ? "bg-[#22d3ee]/15 border-[#22d3ee]/40 text-white shadow-md shadow-[#22d3ee]/10"
                        : "bg-[#080d14] border-white/5 text-slate-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-[#22d3ee] text-[#07090e] font-bold"
                            : "bg-white/5 text-[#22d3ee] group-hover:bg-[#22d3ee]/20"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate text-white">
                          {community.name}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {community.members}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white shrink-0 ml-2" />
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className="w-full text-center text-xs text-[#22d3ee] font-semibold hover:underline mt-4 cursor-pointer pt-2 border-t border-white/5"
            >
              See all communities &rarr;
            </button>
          </div>
        </div>

        {/* Right Column: Discover & Featured Communities */}
        <div className="lg:col-span-8 space-y-5">
          {/* Discover Tags */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Discover
              </span>
              <span className="text-[11px] text-slate-500">Categories</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {DISCOVER_TAGS.map((tag) => {
                const isSelected = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#22d3ee] text-[#07090e] font-bold shadow-md shadow-[#22d3ee]/20"
                        : "bg-[#0e141f] border border-white/5 text-slate-300 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Featured Communities Header */}
          <div className="pt-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Featured Communities
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {FEATURED_COMMUNITIES.map((featured) => {
                const isJoined = joinedCommunities[featured.id];
                return (
                  <div
                    key={featured.id}
                    className="bg-[#0b101b] border border-white/10 hover:border-[#22d3ee]/30 rounded-2xl p-4 flex flex-col justify-between transition-all group shadow-xl relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#22d3ee]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#22d3ee]/10 transition-colors" />

                    <div>
                      {/* Avatar Circle & Title */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#22d3ee]/20 via-[#0284c7]/20 to-[#07090e] border border-[#22d3ee]/40 flex items-center justify-center font-extrabold text-[#22d3ee] text-sm shadow-md shadow-[#22d3ee]/10">
                          {featured.avatar}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-mono text-[#22d3ee] bg-[#22d3ee]/10 border border-[#22d3ee]/20 px-2 py-0.5 rounded-full">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Health {featured.health}</span>
                        </div>
                      </div>

                      <h4 className="text-xs font-bold text-white group-hover:text-[#22d3ee] transition-colors">
                        {featured.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {featured.members}
                      </p>
                      <span className="inline-block text-[10px] text-cyan-400 mt-1 font-medium">
                        {featured.tagline}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {featured.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={(e) => toggleJoin(featured.id, e)}
                        className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          isJoined
                            ? "bg-white/10 text-slate-300 border border-white/10 hover:bg-white/15"
                            : "bg-[#22d3ee] text-[#07090e] hover:bg-[#06b6d4] shadow-md shadow-[#22d3ee]/20"
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
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
