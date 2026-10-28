import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Star,
  Package,
  ShieldAlert,
  Search,
  Download,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Eye,
  Edit2,
  Trash2,
  CheckCircle,
  X,
  Mail,
  Calendar,
  FolderGit2,
  Award,
} from "lucide-react";

export interface AdminBuilderData {
  id: number;
  name: string;
  email: string;
  skills: string[];
  projects: number;
  reputation: number;
  status: "Active" | "Pending" | "Suspended";
  joined: string;
  avatarBg: string;
  avatarInitials: string;
}

const INITIAL_BUILDERS: AdminBuilderData[] = [
  {
    id: 1,
    name: "Alex Carter",
    email: "alex@example.com",
    skills: ["React", "Node.js", "MongoDB"],
    projects: 5,
    reputation: 4.8,
    status: "Active",
    joined: "Oct 12, 2025",
    avatarBg: "from-blue-600 to-indigo-700",
    avatarInitials: "AC",
  },
  {
    id: 2,
    name: "Chioma Okafor",
    email: "chioma@example.com",
    skills: ["Python", "FastAPI", "Docker"],
    projects: 3,
    reputation: 4.6,
    status: "Active",
    joined: "Oct 10, 2025",
    avatarBg: "from-amber-600 to-orange-700",
    avatarInitials: "CO",
  },
  {
    id: 3,
    name: "Tunde Adeyemi",
    email: "tunde@example.com",
    skills: ["React", "TypeScript", "Next.js"],
    projects: 4,
    reputation: 4.7,
    status: "Active",
    joined: "Oct 9, 2025",
    avatarBg: "from-cyan-600 to-blue-700",
    avatarInitials: "TA",
  },
  {
    id: 4,
    name: "Favour Eze",
    email: "favour@example.com",
    skills: ["UI/UX", "Figma", "Design"],
    projects: 2,
    reputation: 4.4,
    status: "Active",
    joined: "Oct 8, 2025",
    avatarBg: "from-rose-500 to-pink-600",
    avatarInitials: "FE",
  },
  {
    id: 5,
    name: "Ibrahim Musa",
    email: "ibrahim@example.com",
    skills: ["Node.js", "Express", "MongoDB"],
    projects: 6,
    reputation: 4.9,
    status: "Active",
    joined: "Oct 6, 2025",
    avatarBg: "from-teal-600 to-emerald-700",
    avatarInitials: "IM",
  },
  {
    id: 6,
    name: "Aisha Bello",
    email: "aisha@example.com",
    skills: ["React", "Tailwind", "Firebase"],
    projects: 3,
    reputation: 4.5,
    status: "Pending",
    joined: "Oct 5, 2025",
    avatarBg: "from-amber-500 to-yellow-600",
    avatarInitials: "AB",
  },
  {
    id: 7,
    name: "Daniel Okafor",
    email: "daniel@example.com",
    skills: ["Python", "Django", "PostgreSQL"],
    projects: 2,
    reputation: 4.2,
    status: "Active",
    joined: "Oct 3, 2025",
    avatarBg: "from-blue-500 to-sky-600",
    avatarInitials: "DO",
  },
  {
    id: 8,
    name: "Samiat Ibrahim",
    email: "samiat@example.com",
    skills: ["Vue.js", "Laravel", "MySQL"],
    projects: 4,
    reputation: 4.6,
    status: "Active",
    joined: "Oct 1, 2025",
    avatarBg: "from-purple-600 to-indigo-700",
    avatarInitials: "SI",
  },
  {
    id: 9,
    name: "Kingsley Eze",
    email: "kingsley@example.com",
    skills: ["React", "Node.js", "TypeScript"],
    projects: 3,
    reputation: 4.3,
    status: "Suspended",
    joined: "Sep 28, 2025",
    avatarBg: "from-rose-600 to-red-700",
    avatarInitials: "KE",
  },
  {
    id: 10,
    name: "Blessing Udo",
    email: "blessing@example.com",
    skills: ["Flutter", "Dart", "Firebase"],
    projects: 2,
    reputation: 4.1,
    status: "Active",
    joined: "Sep 26, 2025",
    avatarBg: "from-emerald-600 to-teal-700",
    avatarInitials: "BU",
  },
];

const SKILL_OPTIONS = [
  "All Skills",
  "React",
  "Node.js",
  "Python",
  "TypeScript",
  "Next.js",
  "FastAPI",
  "Docker",
  "Figma",
  "Flutter",
  "Firebase",
  "MongoDB",
  "PostgreSQL",
];

interface AdminBuildersViewProps {
  onShowToast?: (message: string) => void;
}

export default function AdminBuildersView({
  onShowToast,
}: AdminBuildersViewProps) {
  const [builders, setBuilders] =
    useState<AdminBuilderData[]>(INITIAL_BUILDERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<string>("All Skills");
  const [selectedStatus, setSelectedStatus] = useState<string>("All Status");
  const [activePage, setActivePage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [selectedBuilder, setSelectedBuilder] =
    useState<AdminBuilderData | null>(null);
  const [editBuilder, setEditBuilder] = useState<AdminBuilderData | null>(null);

  // Filter builders based on search and filters
  const filteredBuilders = useMemo(() => {
    return builders.filter((b) => {
      const matchSearch =
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.skills.some((s) =>
          s.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        String(b.id).includes(searchQuery);

      const matchSkill =
        selectedSkill === "All Skills" ||
        b.skills.some((s) => s.toLowerCase() === selectedSkill.toLowerCase());

      const matchStatus =
        selectedStatus === "All Status" ||
        b.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchSearch && matchSkill && matchStatus;
    });
  }, [builders, searchQuery, selectedSkill, selectedStatus]);

  // Handle Export to CSV
  const handleExport = () => {
    const headers = [
      "ID",
      "Builder",
      "Email",
      "Skills",
      "Projects",
      "Reputation",
      "Status",
      "Joined",
    ];
    const rows = filteredBuilders.map((b) => [
      b.id,
      `"${b.name}"`,
      `"${b.email}"`,
      `"${b.skills.join(", ")}"`,
      b.projects,
      b.reputation,
      b.status,
      `"${b.joined}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nova_builders_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onShowToast?.(
      `Exported ${filteredBuilders.length} builders to CSV successfully.`
    );
  };

  // Toggle builder status
  const handleUpdateStatus = (
    builderId: number,
    newStatus: "Active" | "Pending" | "Suspended"
  ) => {
    setBuilders((prev) =>
      prev.map((b) => (b.id === builderId ? { ...b, status: newStatus } : b))
    );
    setActiveMenuId(null);
    onShowToast?.(`Builder #${builderId} status updated to ${newStatus}.`);
  };

  // Delete builder
  const handleDeleteBuilder = (builderId: number) => {
    setBuilders((prev) => prev.filter((b) => b.id !== builderId));
    setActiveMenuId(null);
    onShowToast?.(`Builder #${builderId} removed.`);
  };

  return (
    <div className="space-y-6">
      {/* ===================== HEADER BANNER ===================== */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#0b1329] via-[#0d1835] to-[#070b16] border border-[#1b263b] p-6 sm:p-7 shadow-2xl overflow-hidden flex items-center justify-between">
        {/* Ambient subtle glow background */}
        <div className="absolute -left-20 -top-20 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-xl">
          <h1 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Builders
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
            Manage and monitor platform builders, their skills, projects and
            contributions.
          </p>
        </div>

        {/* Right Graphic: Cyber Builder & Total Badge */}
        <div className="relative z-10 shrink-0 hidden sm:flex items-center gap-4">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-cyan-500/30 shadow-[0_0_35px_rgba(34,211,238,0.25)] group">
            <img
              src="/admin-builders-avatar.jpg"
              alt="Platform Builder Hologram"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070b16]/60 via-transparent to-transparent pointer-events-none" />
          </div>

          <div className="text-right">
            <div className="text-[11px] text-slate-400 font-medium">
              Total Builders
            </div>
            <div className="flex items-baseline justify-end gap-1.5 mt-0.5">
              <span className="text-2xl font-bold text-white font-['Space_Grotesk']">
                1,284
              </span>
              <span className="text-xs font-semibold text-emerald-400">
                &uarr; 15%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== 4 METRIC CARDS ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Builders */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#090e1c]/90 border border-[#1a253c] shadow-lg backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-600/20 text-[#60a5fa] border border-blue-500/30 flex items-center justify-center shrink-0">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">
                Active Builders
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white font-['Space_Grotesk'] tracking-tight mt-0.5">
                1,104
              </div>
            </div>
          </div>
          <div className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5 self-end mb-1">
            <span>&uarr;</span>
            <span>16%</span>
          </div>
        </div>

        {/* Card 2: Top Performers */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#090e1c]/90 border border-[#1a253c] shadow-lg backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-purple-600/20 text-[#c084fc] border border-purple-500/30 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">
                Top Performers
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white font-['Space_Grotesk'] tracking-tight mt-0.5">
                248
              </div>
            </div>
          </div>
          <div className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5 self-end mb-1">
            <span>&uarr;</span>
            <span>22%</span>
          </div>
        </div>

        {/* Card 3: New This Week */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#090e1c]/90 border border-[#1a253c] shadow-lg backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-sky-600/20 text-[#38bdf8] border border-sky-500/30 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">
                New This Week
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white font-['Space_Grotesk'] tracking-tight mt-0.5">
                86
              </div>
            </div>
          </div>
          <div className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5 self-end mb-1">
            <span>&uarr;</span>
            <span>28%</span>
          </div>
        </div>

        {/* Card 4: Suspended */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#090e1c]/90 border border-[#1a253c] shadow-lg backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-rose-600/20 text-[#fb7185] border border-rose-500/30 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">
                Suspended
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white font-['Space_Grotesk'] tracking-tight mt-0.5">
                32
              </div>
            </div>
          </div>
          <div className="text-xs font-semibold text-rose-400 flex items-center gap-0.5 self-end mb-1">
            <span>&uarr;</span>
            <span>6%</span>
          </div>
        </div>
      </div>

      {/* ===================== FILTER & SEARCH BAR ===================== */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search builders by name, email, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#080d19] border border-[#1a253c] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdowns & Export */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Skills Dropdown */}
          <div className="relative">
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="h-10 px-3.5 pr-8 rounded-xl bg-[#080d19] border border-[#1a253c] text-xs text-slate-300 font-medium appearance-none cursor-pointer focus:outline-none focus:border-[#6366f1]"
            >
              {SKILL_OPTIONS.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-10 px-3.5 pr-8 rounded-xl bg-[#080d19] border border-[#1a253c] text-xs text-slate-300 font-medium appearance-none cursor-pointer focus:outline-none focus:border-[#6366f1]"
            >
              <option value="All Status">All Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Suspended">Suspended</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="h-10 px-4 rounded-xl bg-[#080d19] hover:bg-[#11192e] border border-[#1a253c] hover:border-slate-600 text-xs text-slate-300 font-medium flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* ===================== BUILDERS TABLE ===================== */}
      <div className="rounded-2xl bg-[#070b16]/95 border border-[#162032] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#141e30] bg-[#090f1f]/60 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4">Builder</th>
                <th className="py-3.5 px-4">Skills</th>
                <th className="py-3.5 px-4 text-center">Projects</th>
                <th className="py-3.5 px-4 text-center">Reputation</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4">Joined</th>
                <th className="py-3.5 px-4 w-16 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#131b2e] text-xs">
              {filteredBuilders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-medium">
                      No builders match your filters.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedSkill("All Skills");
                        setSelectedStatus("All Status");
                      }}
                      className="mt-2 text-xs text-[#22d3ee] hover:underline"
                    >
                      Reset filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredBuilders.map((builder) => {
                  return (
                    <tr
                      key={builder.id}
                      className="hover:bg-[#0c1324]/80 transition-colors group"
                    >
                      {/* # Number */}
                      <td className="py-3.5 px-4 text-center text-slate-500 font-mono text-xs">
                        {builder.id}
                      </td>

                      {/* Builder (Avatar + Name & Email) */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full bg-gradient-to-br ${builder.avatarBg} text-white font-bold text-xs flex items-center justify-center shadow-sm shrink-0`}
                          >
                            {builder.avatarInitials}
                          </div>
                          <div>
                            <div
                              onClick={() => setSelectedBuilder(builder)}
                              className="font-semibold text-white hover:text-[#22d3ee] cursor-pointer transition-colors"
                            >
                              {builder.name}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              {builder.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Skills Badges */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {builder.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2.5 py-0.5 rounded-md bg-[#0e1627] text-[#38bdf8] border border-[#1e2e47] text-[11px] font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Projects Count */}
                      <td className="py-3.5 px-4 text-center font-bold text-white text-xs">
                        {builder.projects}
                      </td>

                      {/* Reputation */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-1 font-semibold text-white text-xs">
                          <span>{builder.reputation.toFixed(1)}</span>
                          <span className="text-amber-400 text-sm leading-none">
                            ★
                          </span>
                        </div>
                      </td>

                      {/* Status Pill */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-medium border ${
                            builder.status === "Active"
                              ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/30"
                              : builder.status === "Pending"
                              ? "bg-amber-950/60 text-amber-400 border-amber-500/30"
                              : "bg-rose-950/60 text-rose-400 border-rose-500/30"
                          }`}
                        >
                          {builder.status}
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 text-slate-400 text-xs">
                        {builder.joined}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(
                              activeMenuId === builder.id ? null : builder.id
                            );
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#141f36] transition-colors"
                          title="Row actions"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu */}
                        <AnimatePresence>
                          {activeMenuId === builder.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -5 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -5 }}
                              transition={{ duration: 0.12 }}
                              className="absolute right-4 mt-1 w-44 rounded-xl bg-[#0b1325] border border-[#1e2c47] shadow-2xl p-1.5 z-50 text-left text-xs"
                            >
                              <button
                                onClick={() => {
                                  setSelectedBuilder(builder);
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#141f36] transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5 text-[#22d3ee]" />
                                <span>View Profile</span>
                              </button>

                              <button
                                onClick={() => {
                                  setEditBuilder(builder);
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#141f36] transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                                <span>Edit Builder</span>
                              </button>

                              {builder.status !== "Active" && (
                                <button
                                  onClick={() =>
                                    handleUpdateStatus(builder.id, "Active")
                                  }
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-emerald-400 hover:bg-[#141f36] transition-colors"
                                >
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  <span>Set Active</span>
                                </button>
                              )}

                              {builder.status !== "Suspended" && (
                                <button
                                  onClick={() =>
                                    handleUpdateStatus(builder.id, "Suspended")
                                  }
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-400 hover:bg-[#141f36] transition-colors"
                                >
                                  <ShieldAlert className="w-3.5 h-3.5" />
                                  <span>Suspend Builder</span>
                                </button>
                              )}

                              <div className="my-1 border-t border-[#1a253c]" />

                              <button
                                onClick={() => handleDeleteBuilder(builder.id)}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove Builder</span>
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ===================== PAGINATION ===================== */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-[#141e30] bg-[#070b16] text-xs text-slate-400">
          <div>
            Showing 1-{Math.min(filteredBuilders.length, 10)} of 1,284 builders
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActivePage((p) => Math.max(1, p - 1))}
              disabled={activePage === 1}
              className="p-1.5 rounded-lg hover:bg-[#121c32] disabled:opacity-30 disabled:hover:bg-transparent text-slate-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {[1, 2, 3, 4, 5].map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setActivePage(pageNum)}
                className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                  activePage === pageNum
                    ? "bg-[#6366f1] text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                    : "text-slate-400 hover:text-white hover:bg-[#121c32]"
                }`}
              >
                {pageNum}
              </button>
            ))}

            <span className="px-1 text-slate-500">...</span>

            <button
              onClick={() => setActivePage(129)}
              className={`w-8 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                activePage === 129
                  ? "bg-[#6366f1] text-white"
                  : "text-slate-400 hover:text-white hover:bg-[#121c32]"
              }`}
            >
              129
            </button>

            <button
              onClick={() => setActivePage((p) => Math.min(129, p + 1))}
              className="p-1.5 rounded-lg hover:bg-[#121c32] text-slate-400 hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ===================== VIEW BUILDER MODAL ===================== */}
      <AnimatePresence>
        {selectedBuilder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl bg-[#090e1c] border border-[#1b263b] p-6 shadow-2xl relative text-xs"
            >
              <button
                onClick={() => setSelectedBuilder(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#131d33]"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-4 mb-5">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${selectedBuilder.avatarBg} text-white font-bold text-xl flex items-center justify-center shadow-lg`}
                >
                  {selectedBuilder.avatarInitials}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
                    {selectedBuilder.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-slate-400 flex items-center gap-1 font-mono">
                      <Mail className="w-3 h-3 text-[#22d3ee]" />
                      {selectedBuilder.email}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-xl bg-[#0e1627] border border-[#1a253c]">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                    Completed Projects
                  </span>
                  <div className="mt-1 font-semibold text-white flex items-center gap-1.5">
                    <FolderGit2 className="w-3.5 h-3.5 text-[#38bdf8]" />
                    {selectedBuilder.projects} Projects
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#0e1627] border border-[#1a253c]">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                    Reputation Score
                  </span>
                  <div className="mt-1 font-semibold text-amber-400 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    {selectedBuilder.reputation.toFixed(1)} / 5.0
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#0e1627] border border-[#1a253c]">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                    Account Status
                  </span>
                  <div className="mt-1 font-semibold text-emerald-400">
                    {selectedBuilder.status}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#0e1627] border border-[#1a253c]">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                    Member Since
                  </span>
                  <div className="mt-1 font-semibold text-white flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {selectedBuilder.joined}
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-5 p-3 rounded-xl bg-[#0e1627] border border-[#1a253c]">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono block mb-2">
                  Technical Stack & Skills
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedBuilder.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg bg-[#070b16] text-[#38bdf8] border border-[#1e2e47] text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2.5">
                <button
                  onClick={() => setSelectedBuilder(null)}
                  className="px-4 py-2 rounded-xl bg-[#141e33] hover:bg-[#1a2744] text-slate-300 font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setEditBuilder(selectedBuilder);
                    setSelectedBuilder(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white font-medium"
                >
                  Edit Builder
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================== EDIT BUILDER MODAL ===================== */}
      <AnimatePresence>
        {editBuilder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl bg-[#090e1c] border border-[#1b263b] p-6 shadow-2xl relative text-xs"
            >
              <button
                onClick={() => setEditBuilder(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#131d33]"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-base font-bold text-white font-['Space_Grotesk'] mb-4">
                Edit Builder #{editBuilder.id}
              </h3>

              <div className="space-y-3.5 mb-5">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editBuilder.name}
                    onChange={(e) =>
                      setEditBuilder({ ...editBuilder, name: e.target.value })
                    }
                    className="w-full h-9 px-3 rounded-xl bg-[#060a14] border border-[#1a253c] text-white text-xs focus:outline-none focus:border-[#6366f1]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editBuilder.email}
                    onChange={(e) =>
                      setEditBuilder({ ...editBuilder, email: e.target.value })
                    }
                    className="w-full h-9 px-3 rounded-xl bg-[#060a14] border border-[#1a253c] text-white text-xs focus:outline-none focus:border-[#6366f1]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">
                    Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    value={editBuilder.skills.join(", ")}
                    onChange={(e) =>
                      setEditBuilder({
                        ...editBuilder,
                        skills: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                    className="w-full h-9 px-3 rounded-xl bg-[#060a14] border border-[#1a253c] text-white text-xs focus:outline-none focus:border-[#6366f1]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1 font-medium">
                      Projects
                    </label>
                    <input
                      type="number"
                      value={editBuilder.projects}
                      onChange={(e) =>
                        setEditBuilder({
                          ...editBuilder,
                          projects: Number(e.target.value),
                        })
                      }
                      className="w-full h-9 px-3 rounded-xl bg-[#060a14] border border-[#1a253c] text-white text-xs focus:outline-none focus:border-[#6366f1]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1 font-medium">
                      Status
                    </label>
                    <select
                      value={editBuilder.status}
                      onChange={(e) =>
                        setEditBuilder({
                          ...editBuilder,
                          status: e.target
                            .value as AdminBuilderData["status"],
                        })
                      }
                      className="w-full h-9 px-3 rounded-xl bg-[#060a14] border border-[#1a253c] text-white text-xs focus:outline-none focus:border-[#6366f1]"
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2.5">
                <button
                  onClick={() => setEditBuilder(null)}
                  className="px-4 py-2 rounded-xl bg-[#141e33] hover:bg-[#1a2744] text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setBuilders((prev) =>
                      prev.map((b) => (b.id === editBuilder.id ? editBuilder : b))
                    );
                    onShowToast?.(
                      `Builder ${editBuilder.name} updated successfully.`
                    );
                    setEditBuilder(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white font-medium"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
