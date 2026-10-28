import { useState } from "react";
import { motion } from "framer-motion";
import { X, Users, CheckCircle2 } from "lucide-react";

interface CreateCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCommunityCreated?: (communityData: any) => void;
}

export function CreateCommunityModal({
  isOpen,
  onClose,
  onCommunityCreated,
}: CreateCommunityModalProps) {
  const [communityName, setCommunityName] = useState("");
  const [category, setCategory] = useState("Technology");
  const [department, setDepartment] = useState("AI & Machine Learning");
  const [communityType, setCommunityType] = useState("Open");
  const [purpose, setPurpose] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [location, setLocation] = useState("Global");
  const [communitySlug, setCommunitySlug] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleNameChange = (val: string) => {
    setCommunityName(val);
    setCommunitySlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!communityName.trim()) return;

    setSubmitted(true);
    setTimeout(() => {
      if (onCommunityCreated) {
        onCommunityCreated({
          name: communityName,
          category,
          department,
          type: communityType,
          purpose,
          targetAudience,
          slug: communitySlug,
        });
      }
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  const types = [
    "Open",
    "Verified",
    "Private",
    "Mission",
    "University",
    "Enterprise",
    "Regional",
    "Industry",
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl bg-[#0b101b] border border-[#22d3ee]/30 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4 my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#22d3ee]/20 text-[#22d3ee] flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-['Space_Grotesk']">
                Create Your Community
              </h2>
              <p className="text-[11px] text-slate-400">
                Launch a verified intelligence network or specialized builder hub.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#22d3ee] mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-white">Community Initialized!</h3>
            <p className="text-xs text-slate-400">
              Your community hub has been successfully deployed to the Nova nexus.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Community Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                What are you building?
              </label>
              <input
                type="text"
                value={communityName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Community Name (e.g. AI Autonomous Agents)"
                className="w-full bg-[#080d14] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#22d3ee]"
                required
              />
            </div>

            {/* Category & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#080d14] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#22d3ee]"
                >
                  <option value="Technology">Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Design">Design</option>
                  <option value="Science">Science</option>
                  <option value="Business">Business</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-[#080d14] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#22d3ee]"
                >
                  <option value="AI & Machine Learning">AI & Machine Learning</option>
                  <option value="FinTech / DeFi">FinTech / DeFi</option>
                  <option value="Systems & Infrastructure">Systems & Infrastructure</option>
                  <option value="Product & Growth">Product & Growth</option>
                </select>
              </div>
            </div>

            {/* Community Type Radios */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                Community Type
              </label>
              <div className="grid grid-cols-4 gap-2">
                {types.map((t) => {
                  const isSelected = communityType === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setCommunityType(t)}
                      className={`py-1.5 px-2 rounded-lg text-center text-xs font-medium border transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-[#22d3ee]/20 text-[#22d3ee] border-[#22d3ee] font-bold"
                          : "bg-[#080d14] text-slate-400 border-white/5 hover:border-white/20"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                Purpose
              </label>
              <textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Describe the purpose of your community..."
                rows={2}
                className="w-full bg-[#080d14] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#22d3ee] resize-none"
              />
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                Who is this community for?
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Describe your target audience..."
                className="w-full bg-[#080d14] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#22d3ee]"
              />
            </div>

            {/* Location & URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-[#080d14] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#22d3ee]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Community URL
                </label>
                <div className="bg-[#080d14] border border-white/10 rounded-xl px-3 py-2 text-[11px] text-slate-400 font-mono truncate">
                  nova.network/c/{communitySlug || "name"}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#22d3ee] hover:bg-[#06b6d4] text-[#07090e] font-bold text-xs shadow-md shadow-[#22d3ee]/20 cursor-pointer"
              >
                Continue &rarr;
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
