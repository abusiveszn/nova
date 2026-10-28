import { useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  TrendingUp,
  MessageCircle,
  Eye,
  Users,
  Video,
  Image as ImageIcon,
  HelpCircle,
  Briefcase,
  Target,
  Calendar,
  Sparkles,
  ArrowRight,
  Clock,
  Heart,
  Share2,
} from "lucide-react";

interface CommunityMediaViewProps {
  onNavigateTab?: (tab: string) => void;
}

export function CommunityMediaView({ onNavigateTab }: CommunityMediaViewProps) {
  const [activeMediaFilter, setActiveMediaFilter] = useState("for-you");
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [likedVideo, setLikedVideo] = useState(false);
  const [videoLikes, setVideoLikes] = useState(482);

  const mediaTabs = [
    { id: "for-you", label: "For You" },
    { id: "following", label: "Following" },
    { id: "communities", label: "Communities" },
    { id: "live", label: "Live" },
    { id: "videos", label: "Videos" },
  ];

  const handleLikeVideo = () => {
    if (likedVideo) {
      setVideoLikes((c) => c - 1);
      setLikedVideo(false);
    } else {
      setVideoLikes((c) => c + 1);
      setLikedVideo(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Top Media Tabs Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {mediaTabs.map((tab) => {
            const isActive = activeMediaFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveMediaFilter(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#22d3ee] text-[#07090e] shadow-md shadow-[#22d3ee]/20"
                    : "bg-[#0b101b] text-slate-400 hover:text-white border border-white/5"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-mono">Media Layer • Verified Stream</span>
        </div>
      </div>

      {/* Quick Media Creation Bar */}
      <div className="bg-[#0b101b] border border-white/10 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#22d3ee]/20 border border-[#22d3ee]/40 flex items-center justify-center font-bold text-xs text-[#22d3ee]">
            VO
          </div>
          <input
            type="text"
            placeholder="Create: What's happening in your network?"
            className="flex-1 bg-[#080d14] border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#22d3ee]/50 transition-colors"
          />
        </div>

        {/* Action pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {[
            { label: "Post", icon: Sparkles },
            { label: "Image", icon: ImageIcon },
            { label: "Video", icon: Video },
            { label: "Question", icon: HelpCircle },
            { label: "Opportunity", icon: Briefcase },
            { label: "Mission", icon: Target },
            { label: "Event", icon: Calendar },
          ].map((pill) => {
            const Icon = pill.icon;
            return (
              <button
                key={pill.label}
                type="button"
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#22d3ee]/15 text-slate-300 hover:text-[#22d3ee] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-transparent hover:border-[#22d3ee]/30"
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{pill.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid: Trending Discussion & Community Video */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trending Discussion Spotlight */}
        <div className="lg:col-span-12 bg-gradient-to-r from-[#0d1624] via-[#101b2c] to-[#0b121d] border border-[#22d3ee]/30 rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#22d3ee]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22d3ee]/10 text-[#22d3ee] text-[10px] font-bold uppercase tracking-wider border border-[#22d3ee]/30">
                <TrendingUp className="w-3 h-3" />
                Trending Discussion
              </div>

              <h2 className="text-lg sm:text-xl font-bold font-['Space_Grotesk'] text-white">
                How are AI agents changing QA?
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-[#22d3ee]" /> 2.4K views
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#22d3ee]" /> 418 participants
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5 text-[#22d3ee]" /> 67 contributors
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab && onNavigateTab("feed")}
              className="px-5 py-2.5 rounded-xl bg-[#22d3ee] hover:bg-[#06b6d4] text-[#07090e] font-bold text-xs transition-all shadow-lg shadow-[#22d3ee]/20 cursor-pointer shrink-0"
            >
              Join Discussion &rarr;
            </button>
          </div>
        </div>

        {/* Video Player Card */}
        <div className="lg:col-span-7 bg-[#0b101b] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 pb-2 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Community Video
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">AI Builders Weekly</span>
          </div>

          {/* Video Preview / Player Area */}
          <div className="relative aspect-video bg-[#05080e] overflow-hidden group">
            {isPlayingVideo ? (
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Community Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full relative cursor-pointer" onClick={() => setIsPlayingVideo(true)}>
                <img
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80"
                  alt="Video thumbnail"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Big Center Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#22d3ee] text-[#07090e] flex items-center justify-center shadow-2xl shadow-[#22d3ee]/50 group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 fill-[#07090e] translate-x-0.5" />
                  </div>
                </div>

                {/* Duration badge */}
                <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-black/80 text-white font-mono text-xs flex items-center gap-1 border border-white/10">
                  <Clock className="w-3 h-3 text-[#22d3ee]" />
                  10:34
                </div>

                {/* Overlay title */}
                <div className="absolute bottom-3 left-3 max-w-sm">
                  <p className="text-xs font-bold text-white">Episode 48: Deploying Autonomous Agent Swarms</p>
                  <p className="text-[10px] text-slate-300">Featuring Sarah Johnson & David Okafor</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs">
              <button
                type="button"
                onClick={handleLikeVideo}
                className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                  likedVideo ? "text-red-400 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                <Heart className={`w-4 h-4 ${likedVideo ? "fill-red-400" : ""}`} />
                <span>{videoLikes}</span>
              </button>

              <button
                type="button"
                className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>84 Comments</span>
              </button>
            </div>

            <button
              type="button"
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Opportunity Card Preview */}
        <div className="lg:col-span-5 bg-[#0b101b] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#22d3ee] bg-[#22d3ee]/15 border border-[#22d3ee]/30 px-3 py-1 rounded-full">
              <Briefcase className="w-3.5 h-3.5" />
              <span>High Priority Opportunity</span>
            </div>

            <h3 className="text-base font-bold font-['Space_Grotesk'] text-white">
              AI Product Research Mission
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Research real-world user adoption bottlenecks for autonomous multi-agent
              workflows. Deliver a comprehensive benchmark report with verified test runs.
            </p>

            <div className="p-3.5 rounded-xl bg-[#080d14] border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Total Reward:</span>
                <span className="text-xl font-extrabold font-['Space_Grotesk'] text-[#22d3ee]">
                  $2,500
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Duration: 2 Weeks</span>
                <span>Positions: 2 Remaining</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab("missions")}
            className="w-full py-3 rounded-xl bg-[#22d3ee] hover:bg-[#06b6d4] text-[#07090e] font-bold text-xs transition-all shadow-md shadow-[#22d3ee]/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>View Mission Details</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
