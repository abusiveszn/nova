import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserCheck,
  UserPlus,
  ShieldCheck,
  Search,
  Download,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Eye,
  Edit2,
  Trash2,
  ShieldAlert,
  CheckCircle,
  X,
  Mail,
  Calendar,
  Shield,
  Activity,
} from "lucide-react";

export interface AdminUserData {
  id: number;
  name: string;
  email: string;
  role: "User" | "Builder" | "Investor";
  status: "Active" | "Pending" | "Banned";
  joined: string;
  avatarBg: string;
  avatarInitials: string;
}

const INITIAL_USERS: AdminUserData[] = [
  {
    id: 1,
    name: "Adebayo Musa",
    email: "adebayo@example.com",
    role: "User",
    status: "Active",
    joined: "Oct 23, 2025",
    avatarBg: "from-blue-600 to-indigo-700",
    avatarInitials: "AM",
  },
  {
    id: 2,
    name: "Chiamaka Okafor",
    email: "chiamaka@example.com",
    role: "Builder",
    status: "Active",
    joined: "Oct 22, 2025",
    avatarBg: "from-amber-500 to-orange-600",
    avatarInitials: "CO",
  },
  {
    id: 3,
    name: "Tunde Balogun",
    email: "tunde@example.com",
    role: "Investor",
    status: "Active",
    joined: "Oct 21, 2025",
    avatarBg: "from-cyan-500 to-blue-600",
    avatarInitials: "TB",
  },
  {
    id: 4,
    name: "Fatima Yusuf",
    email: "fatima@example.com",
    role: "User",
    status: "Active",
    joined: "Oct 20, 2025",
    avatarBg: "from-rose-500 to-pink-600",
    avatarInitials: "FY",
  },
  {
    id: 5,
    name: "Emeka Nwosu",
    email: "emeka@example.com",
    role: "Builder",
    status: "Pending",
    joined: "Oct 19, 2025",
    avatarBg: "from-purple-600 to-violet-700",
    avatarInitials: "EN",
  },
  {
    id: 6,
    name: "Blessing Adeyemi",
    email: "blessing@example.com",
    role: "User",
    status: "Active",
    joined: "Oct 18, 2025",
    avatarBg: "from-yellow-500 to-amber-600",
    avatarInitials: "BA",
  },
  {
    id: 7,
    name: "Ibrahim Sani",
    email: "ibrahim@example.com",
    role: "Investor",
    status: "Active",
    joined: "Oct 17, 2025",
    avatarBg: "from-sky-500 to-indigo-600",
    avatarInitials: "IS",
  },
  {
    id: 8,
    name: "Zainab Mohammed",
    email: "zainab@example.com",
    role: "User",
    status: "Active",
    joined: "Oct 16, 2025",
    avatarBg: "from-violet-500 to-purple-600",
    avatarInitials: "ZM",
  },
  {
    id: 9,
    name: "Kingsley Eze",
    email: "kingsley@example.com",
    role: "Builder",
    status: "Active",
    joined: "Oct 15, 2025",
    avatarBg: "from-amber-600 to-orange-700",
    avatarInitials: "KE",
  },
  {
    id: 10,
    name: "Dorcas Ibe",
    email: "dorcas@example.com",
    role: "User",
    status: "Banned",
    joined: "Oct 14, 2025",
    avatarBg: "from-purple-500 to-indigo-600",
    avatarInitials: "DI",
  },
];

interface AdminUsersViewProps {
  onShowToast?: (message: string) => void;
}

export default function AdminUsersView({ onShowToast }: AdminUsersViewProps) {
  const [users, setUsers] = useState<AdminUserData[]>(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("All Roles");
  const [selectedStatus, setSelectedStatus] = useState<string>("All Status");
  const [activePage, setActivePage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUserData | null>(null);
  const [editUser, setEditUser] = useState<AdminUserData | null>(null);

  // Filter users based on query and dropdowns
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(u.id).includes(searchQuery);

      const matchRole =
        selectedRole === "All Roles" ||
        u.role.toLowerCase() === selectedRole.toLowerCase();

      const matchStatus =
        selectedStatus === "All Status" ||
        u.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchSearch && matchRole && matchStatus;
    });
  }, [users, searchQuery, selectedRole, selectedStatus]);

  // Handle Export to CSV
  const handleExport = () => {
    const headers = ["ID", "Name", "Email", "Role", "Status", "Joined"];
    const rows = filteredUsers.map((u) => [
      u.id,
      `"${u.name}"`,
      `"${u.email}"`,
      u.role,
      u.status,
      `"${u.joined}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nova_users_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onShowToast?.(`Exported ${filteredUsers.length} users to CSV successfully.`);
  };

  // Toggle user status
  const handleUpdateStatus = (
    userId: number,
    newStatus: "Active" | "Pending" | "Banned"
  ) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
    setActiveMenuId(null);
    onShowToast?.(`User #${userId} status updated to ${newStatus}.`);
  };

  // Delete user
  const handleDeleteUser = (userId: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    setActiveMenuId(null);
    onShowToast?.(`User #${userId} removed from platform.`);
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
            Users
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
            Manage platform users, view details, and monitor activity.
          </p>
        </div>

        {/* Right Graphic: Holographic 3D Orb */}
        <div className="relative z-10 shrink-0 hidden sm:block">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border border-cyan-500/30 shadow-[0_0_35px_rgba(34,211,238,0.25)] group">
            <img
              src="/admin-users-orb.jpg"
              alt="Platform Users Hologram"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070b16]/60 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ===================== 4 METRIC CARDS ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Users */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#090e1c]/90 border border-[#1a253c] shadow-lg backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-600/20 text-[#60a5fa] border border-blue-500/30 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Total Users</div>
              <div className="text-xl sm:text-2xl font-bold text-white font-['Space_Grotesk'] tracking-tight mt-0.5">
                12,482
              </div>
            </div>
          </div>
          <div className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5 self-end mb-1">
            <span>&uarr;</span>
            <span>12%</span>
          </div>
        </div>

        {/* Card 2: Active (Last 7 days) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#090e1c]/90 border border-[#1a253c] shadow-lg backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-teal-500/20 text-[#2dd4bf] border border-teal-500/30 flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">
                Active (Last 7 days)
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white font-['Space_Grotesk'] tracking-tight mt-0.5">
                8,764
              </div>
            </div>
          </div>
          <div className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5 self-end mb-1">
            <span>&uarr;</span>
            <span>16%</span>
          </div>
        </div>

        {/* Card 3: New Users */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#090e1c]/90 border border-[#1a253c] shadow-lg backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-indigo-600/20 text-[#818cf8] border border-indigo-500/30 flex items-center justify-center shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">New Users</div>
              <div className="text-xl sm:text-2xl font-bold text-white font-['Space_Grotesk'] tracking-tight mt-0.5">
                1,243
              </div>
            </div>
          </div>
          <div className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5 self-end mb-1">
            <span>&uarr;</span>
            <span>22%</span>
          </div>
        </div>

        {/* Card 4: Verified */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#090e1c]/90 border border-[#1a253c] shadow-lg backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-sky-600/20 text-[#38bdf8] border border-sky-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Verified</div>
              <div className="text-xl sm:text-2xl font-bold text-white font-['Space_Grotesk'] tracking-tight mt-0.5">
                9,872
              </div>
            </div>
          </div>
          <div className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5 self-end mb-1">
            <span>&uarr;</span>
            <span>18%</span>
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
            placeholder="Search users by name, email, or ID..."
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
          {/* Roles Dropdown */}
          <div className="relative">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="h-10 px-3.5 pr-8 rounded-xl bg-[#080d19] border border-[#1a253c] text-xs text-slate-300 font-medium appearance-none cursor-pointer focus:outline-none focus:border-[#6366f1]"
            >
              <option value="All Roles">All Roles</option>
              <option value="User">User</option>
              <option value="Builder">Builder</option>
              <option value="Investor">Investor</option>
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
              <option value="Banned">Banned</option>
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

      {/* ===================== USERS TABLE ===================== */}
      <div className="rounded-2xl bg-[#070b16]/95 border border-[#162032] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#141e30] bg-[#090f1f]/60 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4 text-center">Role</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4">Joined</th>
                <th className="py-3.5 px-4 w-16 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#131b2e] text-xs">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-medium">No users match your filters.</p>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedRole("All Roles");
                        setSelectedStatus("All Status");
                      }}
                      className="mt-2 text-xs text-[#22d3ee] hover:underline"
                    >
                      Reset filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-[#0c1324]/80 transition-colors group"
                    >
                      {/* # Number */}
                      <td className="py-3.5 px-4 text-center text-slate-500 font-mono text-xs">
                        {user.id}
                      </td>

                      {/* User (Avatar + Name) */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full bg-gradient-to-br ${user.avatarBg} text-white font-bold text-xs flex items-center justify-center shadow-sm shrink-0`}
                          >
                            {user.avatarInitials}
                          </div>
                          <span
                            onClick={() => setSelectedUser(user)}
                            className="font-semibold text-white hover:text-[#22d3ee] cursor-pointer transition-colors"
                          >
                            {user.name}
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-xs">
                        {user.email}
                      </td>

                      {/* Role Pill */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-medium border ${
                            user.role === "User"
                              ? "bg-blue-950/60 text-blue-400 border-blue-500/30"
                              : user.role === "Builder"
                              ? "bg-purple-950/60 text-purple-300 border-purple-500/30"
                              : "bg-cyan-950/60 text-cyan-300 border-cyan-500/30"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      {/* Status Pill */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-medium border ${
                            user.status === "Active"
                              ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/30"
                              : user.status === "Pending"
                              ? "bg-amber-950/60 text-amber-400 border-amber-500/30"
                              : "bg-rose-950/60 text-rose-400 border-rose-500/30"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 text-slate-400 text-xs">
                        {user.joined}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(
                              activeMenuId === user.id ? null : user.id
                            );
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#141f36] transition-colors"
                          title="Row actions"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu */}
                        <AnimatePresence>
                          {activeMenuId === user.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -5 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -5 }}
                              transition={{ duration: 0.12 }}
                              className="absolute right-4 mt-1 w-44 rounded-xl bg-[#0b1325] border border-[#1e2c47] shadow-2xl p-1.5 z-50 text-left text-xs"
                            >
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#141f36] transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5 text-[#22d3ee]" />
                                <span>View Profile</span>
                              </button>

                              <button
                                onClick={() => {
                                  setEditUser(user);
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#141f36] transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                                <span>Edit User</span>
                              </button>

                              {user.status !== "Active" && (
                                <button
                                  onClick={() =>
                                    handleUpdateStatus(user.id, "Active")
                                  }
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-emerald-400 hover:bg-[#141f36] transition-colors"
                                >
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  <span>Set Active</span>
                                </button>
                              )}

                              {user.status !== "Banned" && (
                                <button
                                  onClick={() =>
                                    handleUpdateStatus(user.id, "Banned")
                                  }
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-400 hover:bg-[#141f36] transition-colors"
                                >
                                  <ShieldAlert className="w-3.5 h-3.5" />
                                  <span>Ban Account</span>
                                </button>
                              )}

                              <div className="my-1 border-t border-[#1a253c]" />

                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete User</span>
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
            Showing 1-{Math.min(filteredUsers.length, 10)} of 12,482 users
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
              onClick={() => setActivePage(125)}
              className={`w-8 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                activePage === 125
                  ? "bg-[#6366f1] text-white"
                  : "text-slate-400 hover:text-white hover:bg-[#121c32]"
              }`}
            >
              125
            </button>

            <button
              onClick={() => setActivePage((p) => Math.min(125, p + 1))}
              className="p-1.5 rounded-lg hover:bg-[#121c32] text-slate-400 hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ===================== VIEW USER MODAL ===================== */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl bg-[#090e1c] border border-[#1b263b] p-6 shadow-2xl relative text-xs"
            >
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#131d33]"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-4 mb-5">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${selectedUser.avatarBg} text-white font-bold text-xl flex items-center justify-center shadow-lg`}
                >
                  {selectedUser.avatarInitials}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
                    {selectedUser.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-slate-400 flex items-center gap-1 font-mono">
                      <Mail className="w-3 h-3 text-[#22d3ee]" />
                      {selectedUser.email}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="p-3 rounded-xl bg-[#0e1627] border border-[#1a253c]">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                    Assigned Role
                  </span>
                  <div className="mt-1 font-semibold text-white flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#6366f1]" />
                    {selectedUser.role}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#0e1627] border border-[#1a253c]">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                    Account Status
                  </span>
                  <div className="mt-1 font-semibold text-emerald-400 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    {selectedUser.status}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#0e1627] border border-[#1a253c]">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                    Registration Date
                  </span>
                  <div className="mt-1 font-semibold text-white flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#38bdf8]" />
                    {selectedUser.joined}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#0e1627] border border-[#1a253c]">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                    Security Level
                  </span>
                  <div className="mt-1 font-semibold text-[#22d3ee]">
                    Verified Tier 2
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2.5">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 rounded-xl bg-[#141e33] hover:bg-[#1a2744] text-slate-300 font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setEditUser(selectedUser);
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white font-medium"
                >
                  Edit Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================== EDIT USER MODAL ===================== */}
      <AnimatePresence>
        {editUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl bg-[#090e1c] border border-[#1b263b] p-6 shadow-2xl relative text-xs"
            >
              <button
                onClick={() => setEditUser(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#131d33]"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-base font-bold text-white font-['Space_Grotesk'] mb-4">
                Edit User #{editUser.id}
              </h3>

              <div className="space-y-3.5 mb-5">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editUser.name}
                    onChange={(e) =>
                      setEditUser({ ...editUser, name: e.target.value })
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
                    value={editUser.email}
                    onChange={(e) =>
                      setEditUser({ ...editUser, email: e.target.value })
                    }
                    className="w-full h-9 px-3 rounded-xl bg-[#060a14] border border-[#1a253c] text-white text-xs focus:outline-none focus:border-[#6366f1]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">
                    Platform Role
                  </label>
                  <select
                    value={editUser.role}
                    onChange={(e) =>
                      setEditUser({
                        ...editUser,
                        role: e.target.value as AdminUserData["role"],
                      })
                    }
                    className="w-full h-9 px-3 rounded-xl bg-[#060a14] border border-[#1a253c] text-white text-xs focus:outline-none focus:border-[#6366f1]"
                  >
                    <option value="User">User</option>
                    <option value="Builder">Builder</option>
                    <option value="Investor">Investor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">
                    Status
                  </label>
                  <select
                    value={editUser.status}
                    onChange={(e) =>
                      setEditUser({
                        ...editUser,
                        status: e.target.value as AdminUserData["status"],
                      })
                    }
                    className="w-full h-9 px-3 rounded-xl bg-[#060a14] border border-[#1a253c] text-white text-xs focus:outline-none focus:border-[#6366f1]"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Banned">Banned</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2.5">
                <button
                  onClick={() => setEditUser(null)}
                  className="px-4 py-2 rounded-xl bg-[#141e33] hover:bg-[#1a2744] text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setUsers((prev) =>
                      prev.map((u) => (u.id === editUser.id ? editUser : u))
                    );
                    onShowToast?.(`User ${editUser.name} saved successfully.`);
                    setEditUser(null);
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
