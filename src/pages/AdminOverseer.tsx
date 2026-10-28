import { useState, useEffect, useMemo } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AdminUsersView from "./admin/AdminUsersView";
import AdminBuildersView from "./admin/AdminBuildersView";
import {
  LayoutDashboard,
  Users,
  Code2,
  TrendingUp,
  Folder,
  GitBranch,
  MessageSquare,
  FileText,
  Terminal,
  Settings,
  Edit3,
  Headphones,
  BarChart2,
  Activity,
  CheckCircle2,
  Bell,
  Moon,
  Sun,
  Search,
  Menu,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Lock,
  ShieldCheck,
  Globe,
  Database,
  Server,
  Radio,
  Layers,
  Clock,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { useApp } from "@/state/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import AdminAuthPage, {
  isAdminAuthenticated,
  clearAdminSession,
} from "./AdminAuthPage";

type SidebarTab =
  | "overview"
  | "users"
  | "builders"
  | "investors"
  | "projects"
  | "repositories"
  | "community"
  | "applications"
  | "logs"
  | "settings"
  | "content"
  | "support"
  | "analytics"
  | "health";

export default function AdminOverseer() {
  const { state } = useApp();

  // Authentication gate state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return isAdminAuthenticated() || state.userRole === "admin";
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab") as SidebarTab | null;

  // UI Navigation & Controls
  const [activeTab, setActiveTabState] = useState<SidebarTab>(() => {
    const validTabs: SidebarTab[] = [
      "overview",
      "users",
      "builders",
      "investors",
      "projects",
      "repositories",
      "community",
      "applications",
      "logs",
      "settings",
      "content",
      "support",
      "analytics",
      "health",
    ];
    if (tabParam && validTabs.includes(tabParam)) {
      return tabParam;
    }
    return "overview";
  });

  const setActiveTab = (tab: SidebarTab) => {
    setActiveTabState(tab);
    if (tab === "overview") {
      setSearchParams({});
    } else {
      setSearchParams({ tab });
    }
  };

  useEffect(() => {
    const validTabs: SidebarTab[] = [
      "overview",
      "users",
      "builders",
      "investors",
      "projects",
      "repositories",
      "community",
      "applications",
      "logs",
      "settings",
      "content",
      "support",
      "analytics",
      "health",
    ];
    if (tabParam && tabParam !== activeTab && validTabs.includes(tabParam)) {
      setActiveTabState(tabParam);
    }
  }, [tabParam]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState("Last 7 days");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Quick Action Modals
  const [actionModal, setActionModal] = useState<
    "addUser" | "reviewApps" | "createProject" | "moderate" | null
  >(null);

  // Form states for Add User modal
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("builder");
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(
    null
  );

  // Application approvals state
  const [appStatuses, setAppStatuses] = useState<Record<string, string>>({
    "app-1": "Pending",
    "app-2": "Pending",
    "app-3": "In Review",
    "app-4": "Approved",
    "app-5": "Pending",
  });

  // Hotkey support for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setShowSearchModal((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Determine dynamic greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  // Logout handler
  const handleLogout = () => {
    clearAdminSession();
    setIsAuthenticated(false);
    setShowProfileMenu(false);
  };

  // If a regular non-admin user is logged in, redirect them away
  const isCurrentAdmin =
    state.userRole === "admin" || state.currentUser?.role === "admin";
  if (state.currentUser && !isCurrentAdmin) {
    return <Navigate to="/" replace />;
  }

  // If not authenticated, render the Admin Auth Page
  if (!isAuthenticated) {
    return (
      <AdminAuthPage
        onAuthenticated={() => {
          setIsAuthenticated(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#070a13] text-[#f1f5f9] flex flex-col font-sans selection:bg-[#22d3ee]/20 selection:text-[#22d3ee]">
      {/* ===================== TOP NAVIGATION BAR ===================== */}
      <header className="sticky top-0 z-40 h-16 bg-[#090d19]/95 backdrop-blur-xl border-b border-[#1b253b] px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Brand & Toggle */}
        <div className="flex items-center gap-3">
          {/* Logo */}
          <Link
            to="/admin"
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-[#38bdf8] to-[#6366f1] shadow-[0_0_15px_rgba(56,189,248,0.35)]">
              <span className="font-['Space_Grotesk'] font-black text-white text-base tracking-tighter">
                N
              </span>
            </div>
            <span className="font-['Space_Grotesk'] font-bold text-lg tracking-wider text-white">
              NOVA
            </span>
          </Link>

          {/* Sidebar Toggle Button */}
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#131b2e] transition-colors ml-2"
            title="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-xl mx-2 hidden md:block">
          <div
            onClick={() => setShowSearchModal(true)}
            className="relative flex items-center w-full h-10 px-3.5 rounded-xl bg-[#0d1322] border border-[#1e293b] text-slate-400 hover:border-[#22d3ee]/40 transition-all cursor-pointer group"
          >
            <Search className="w-4 h-4 text-slate-500 group-hover:text-[#22d3ee] transition-colors shrink-0" />
            <span className="text-xs text-slate-500 ml-2.5 truncate font-sans">
              Search anything... (users, projects, builders, etc.)
            </span>
            <div className="ml-auto flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-[#131b2e] border border-white/5 text-[10px] font-mono text-slate-400">
                Ctrl + K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right: Actions, Notifications & Admin Profile */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <button
            onClick={() =>
              setActionSuccessMessage(
                "3 new notifications: Ahmed Musa submitted Builder application; DeFi Dashboard project updated; New commit on nova-web."
              )
            }
            className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#131b2e] transition-colors"
            title="Notifications (3 unread)"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-[#090d19]">
              3
            </span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDarkMode((prev) => !prev)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#131b2e] transition-colors"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Admin Profile Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1 rounded-xl bg-[#0d1322] border border-[#1e293b] hover:border-[#22d3ee]/40 transition-all cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white font-bold text-xs shadow-sm">
                A
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold text-white leading-tight">
                  Admin
                </div>
                <div className="text-[10px] text-slate-400 leading-tight">
                  Super Admin
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-64 rounded-xl bg-[#0c1220] border border-[#1e293b] shadow-2xl p-2 z-50 text-xs"
                >
                  <div className="px-3 py-2 border-b border-[#1b253b] mb-1">
                    <p className="font-semibold text-white">Super Administrator</p>
                    <p className="text-[11px] font-mono text-[#22d3ee] truncate">
                      novafuturegrid@gmail.com
                    </p>
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Level 5 Root Clearance</span>
                    </div>
                  </div>

                  <Link
                    to="/"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#151f33] transition-colors"
                  >
                    <Globe className="w-4 h-4 text-[#22d3ee]" />
                    <span>View Public Platform</span>
                  </Link>

                  <button
                    onClick={() => {
                      setActiveTab("settings");
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#151f33] transition-colors text-left"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>System Settings</span>
                  </button>

                  <div className="my-1 border-t border-[#1b253b]" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors font-medium text-left"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Lock Console & Sign Out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* ===================== BODY CONTAINER ===================== */}
      <div className="flex-1 flex overflow-hidden">
        {/* ===================== LEFT SIDEBAR ===================== */}
        <aside
          className={`${
            sidebarOpen ? "w-64" : "w-20"
          } shrink-0 bg-[#070a13] border-r border-[#1b253b] transition-all duration-300 flex flex-col justify-between overflow-y-auto overflow-x-hidden`}
        >
          {/* Nav Links */}
          <div className="p-3 space-y-6">
            {/* Primary Overview Item */}
            <div>
              <button
                onClick={() => setActiveTab("overview")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                  activeTab === "overview"
                    ? "bg-gradient-to-r from-[#6366f1] to-[#4f46e5] text-white shadow-[0_0_20px_rgba(99,102,241,0.35)]"
                    : "text-slate-400 hover:text-white hover:bg-[#0f172a]"
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                {sidebarOpen && <span>Overview</span>}
              </button>
            </div>

            {/* Section: PLATFORM */}
            <div className="space-y-1">
              {sidebarOpen && (
                <div className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                  PLATFORM
                </div>
              )}

              {[
                { id: "users", label: "Users", icon: Users },
                { id: "builders", label: "Builders", icon: Code2 },
                { id: "investors", label: "Investors", icon: TrendingUp },
                { id: "projects", label: "Projects", icon: Folder },
                { id: "repositories", label: "Repositories", icon: GitBranch },
                { id: "community", label: "Community", icon: MessageSquare },
                { id: "applications", label: "Applications", icon: FileText },
                { id: "logs", label: "Logs", icon: Terminal },
                { id: "settings", label: "Settings", icon: Settings },
              ].map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as SidebarTab)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-[#4f46e5] to-[#6366f1] text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] font-semibold"
                        : "text-slate-400 hover:text-white hover:bg-[#0f172a]"
                    }`}
                    title={!sidebarOpen ? item.label : undefined}
                  >
                    <IconComponent
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? "text-white" : "text-slate-400"
                      }`}
                    />
                    {sidebarOpen && <span>{item.label}</span>}
                  </button>
                );
              })}
            </div>

            {/* Section: MANAGEMENT */}
            <div className="space-y-1">
              {sidebarOpen && (
                <div className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                  MANAGEMENT
                </div>
              )}

              {[
                { id: "content", label: "Content", icon: Edit3 },
                { id: "support", label: "Support & Tickets", icon: Headphones },
                { id: "analytics", label: "Analytics", icon: BarChart2 },
                { id: "health", label: "System Health", icon: Activity },
              ].map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as SidebarTab)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-[#4f46e5] to-[#6366f1] text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] font-semibold"
                        : "text-slate-400 hover:text-white hover:bg-[#0f172a]"
                    }`}
                    title={!sidebarOpen ? item.label : undefined}
                  >
                    <IconComponent
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? "text-white" : "text-slate-400"
                      }`}
                    />
                    {sidebarOpen && <span>{item.label}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Banner Card (Matching Screenshot) */}
          <div className="p-3">
            {sidebarOpen ? (
              <div className="relative rounded-2xl bg-gradient-to-br from-[#1e1b4b]/90 via-[#1e293b]/70 to-[#0f172a] border border-[#312e81] p-4 shadow-xl overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-[#6366f1]/20 rounded-full blur-xl pointer-events-none" />

                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-br from-[#38bdf8] to-[#6366f1] text-white font-black text-xs">
                    N
                  </div>
                  <span className="font-['Space_Grotesk'] font-bold text-sm text-white tracking-wide">
                    NOVA
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 font-sans leading-snug mb-3">
                  Build. Invest. Grow. Together.
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#38bdf8]">
                    v2.5 Production
                  </span>
                  <Link
                    to="/"
                    className="w-7 h-7 rounded-full bg-[#6366f1] hover:bg-[#4f46e5] text-white flex items-center justify-center transition-transform group-hover:translate-x-1"
                    title="Visit Nova Network"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-8 h-8 rounded-xl bg-[#1e1b4b] border border-[#312e81] flex items-center justify-center text-[#38bdf8] font-bold text-xs">
                  N
                </div>
              </div>
            )}

            {/* Sidebar bottom copyright */}
            {sidebarOpen && (
              <div className="mt-4 px-2 text-[10px] text-slate-500 font-sans">
                &copy; 2025 Nova. All rights reserved.
              </div>
            )}
          </div>
        </aside>

        {/* ===================== MAIN CONTENT ===================== */}
        <main className="flex-1 overflow-y-auto bg-[#070a13] p-4 sm:p-6 lg:p-7 space-y-6">
          {/* Notification Toast Banner if active */}
          <AnimatePresence>
            {actionSuccessMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-xl bg-[#0e2a22] border border-[#10b981]/50 p-3.5 flex items-center justify-between text-xs text-emerald-300 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{actionSuccessMessage}</span>
                </div>
                <button
                  onClick={() => setActionSuccessMessage(null)}
                  className="text-emerald-400 hover:text-white text-xs font-mono ml-4"
                >
                  ✕
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* If another tab is selected, show appropriate tab view, else show the Main Dashboard */}
          {activeTab === "users" ? (
            <AdminUsersView
              onShowToast={(msg) => setActionSuccessMessage(msg)}
            />
          ) : activeTab === "builders" ? (
            <AdminBuildersView
              onShowToast={(msg) => setActionSuccessMessage(msg)}
            />
          ) : activeTab !== "overview" ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-['Space_Grotesk'] text-2xl font-bold capitalize text-white">
                    {activeTab} Management
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    System console controls for {activeTab}
                  </p>
                </div>
                <Button
                  onClick={() => setActiveTab("overview")}
                  size="sm"
                  className="bg-[#1e293b] hover:bg-[#334155] text-slate-200 text-xs"
                >
                  &larr; Back to Overview
                </Button>
              </div>

              {/* Sub-tab view details */}
              <div className="rounded-2xl bg-[#0c1220] border border-[#1b253b] p-6 text-sm">
                <p className="text-slate-300 mb-4">
                  Active Overseer partition:{" "}
                  <span className="font-mono text-[#22d3ee] font-semibold uppercase">
                    {activeTab}
                  </span>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-[#080d1a] border border-[#1e293b]">
                    <div className="text-xs text-slate-400">Total Entities</div>
                    <div className="text-xl font-bold text-white mt-1">
                      {activeTab === "investors"
                        ? "932"
                        : activeTab === "projects"
                        ? "527"
                        : "Active"}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#080d1a] border border-[#1e293b]">
                    <div className="text-xs text-slate-400">Health Status</div>
                    <div className="text-xl font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      100% Operational
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#080d1a] border border-[#1e293b]">
                    <div className="text-xs text-slate-400">Telemetry Sync</div>
                    <div className="text-xl font-bold text-[#22d3ee] mt-1 font-mono">
                      Sub-second (14ms)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ===================== OVERVIEW DASHBOARD (MATCHING SCREENSHOT) ===================== */
            <div className="space-y-6">
              {/* TOP ROW: HERO GREETING BANNER & SYSTEM STATUS */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* HERO GREETING BANNER (Col-span 2) */}
                <div className="xl:col-span-2 relative rounded-2xl bg-gradient-to-br from-[#0f172a] via-[#101b33] to-[#0a101f] border border-[#1b2742] p-6 sm:p-7 shadow-xl overflow-hidden flex flex-col justify-between">
                  {/* Planet Illustration & Badge */}
                  <div className="absolute right-4 top-4 sm:right-8 sm:top-6 flex flex-col items-end pointer-events-none select-none">
                    <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-[#2563eb]/30 via-[#3b82f6]/20 to-transparent blur-xs flex items-center justify-center">
                      <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#1d4ed8] to-[#60a5fa] shadow-[0_0_35px_rgba(59,130,246,0.5)] border border-[#93c5fd]/30" />
                      <div className="absolute inset-0 border border-blue-400/20 rounded-full rotate-45 scale-125" />
                    </div>

                    <div className="mt-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0a0f1d]/80 border border-white/10 text-[10px] font-medium backdrop-blur-md">
                      <span className="font-semibold text-white">Nova</span>
                      <span className="text-slate-400">Multi-Role Platform</span>
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-mono ml-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Live
                      </span>
                    </div>
                  </div>

                  {/* Greeting Text */}
                  <div className="relative z-10 max-w-lg mb-6">
                    <h1 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                      {greeting}, Admin 👋
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                      Here&apos;s what&apos;s happening on Nova today. Keep the platform running smoothly and help the community grow.
                    </p>
                  </div>

                  {/* 4 Metric Cards inside Hero Banner */}
                  <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
                    {/* Card 1: Total Users */}
                    <div className="p-3.5 rounded-xl bg-[#090e1a]/80 border border-[#1b253b] backdrop-blur-md">
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-1.5 rounded-lg bg-[#22d3ee]/10 text-[#22d3ee]">
                          <Users className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-400">Total Users</div>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-lg sm:text-xl font-bold text-white font-['Space_Grotesk']">
                          12,482
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-400">
                          &uarr; 12%
                        </span>
                      </div>
                    </div>

                    {/* Card 2: Builders */}
                    <div className="p-3.5 rounded-xl bg-[#090e1a]/80 border border-[#1b253b] backdrop-blur-md">
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-1.5 rounded-lg bg-[#6366f1]/10 text-[#818cf8]">
                          <Code2 className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-400">Builders</div>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-lg sm:text-xl font-bold text-white font-['Space_Grotesk']">
                          1,284
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-400">
                          &uarr; 18%
                        </span>
                      </div>
                    </div>

                    {/* Card 3: Investors */}
                    <div className="p-3.5 rounded-xl bg-[#090e1a]/80 border border-[#1b253b] backdrop-blur-md">
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-1.5 rounded-lg bg-[#a855f7]/10 text-[#c084fc]">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-400">Investors</div>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-lg sm:text-xl font-bold text-white font-['Space_Grotesk']">
                          932
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-400">
                          &uarr; 14%
                        </span>
                      </div>
                    </div>

                    {/* Card 4: Projects */}
                    <div className="p-3.5 rounded-xl bg-[#090e1a]/80 border border-[#1b253b] backdrop-blur-md">
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-1.5 rounded-lg bg-[#ec4899]/10 text-[#f472b6]">
                          <Folder className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-400">Projects</div>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-lg sm:text-xl font-bold text-white font-['Space_Grotesk']">
                          527
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-400">
                          &uarr; 9%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT SYSTEM STATUS PANEL */}
                <div className="rounded-2xl bg-[#0c1220] border border-[#1b253b] p-6 shadow-xl flex flex-col justify-between">
                  <div>
                    {/* Header with Green Ping Indicator */}
                    <div className="flex items-start gap-3 mb-5">
                      <div className="relative mt-1">
                        <span className="flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                      </div>
                      <div>
                        <h2 className="font-['Space_Grotesk'] text-base font-bold text-white">
                          System Online
                        </h2>
                        <p className="text-xs text-slate-400">
                          All services are running smoothly
                        </p>
                      </div>
                    </div>

                    {/* 5 Service Rows */}
                    <div className="space-y-3">
                      {[
                        { name: "API", icon: Globe, status: "Operational" },
                        { name: "Database", icon: Database, status: "Operational" },
                        { name: "Server", icon: Server, status: "Operational" },
                        { name: "WebSocket", icon: Radio, status: "Operational" },
                        { name: "Queue", icon: Layers, status: "Operational" },
                      ].map((srv) => {
                        const Icon = srv.icon;
                        return (
                          <div
                            key={srv.name}
                            className="flex items-center justify-between py-1.5 border-b border-[#141d30] last:border-none"
                          >
                            <div className="flex items-center gap-2.5">
                              <Icon className="w-4 h-4 text-slate-400" />
                              <span className="text-xs font-medium text-slate-300">
                                {srv.name}
                              </span>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 text-[10px] font-medium">
                              {srv.status}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#141d30] flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Cluster: AWS-US-EAST</span>
                    <span className="text-emerald-400">99.98% Uptime</span>
                  </div>
                </div>
              </div>

              {/* MIDDLE ROW: PLATFORM OVERVIEW (METRICS & CHARTS) + QUICK ACTIONS */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* PLATFORM OVERVIEW (Col-span 2) */}
                <div className="xl:col-span-2 rounded-2xl bg-[#0c1220] border border-[#1b253b] p-6 shadow-xl space-y-6">
                  {/* Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h2 className="font-['Space_Grotesk'] text-lg font-bold text-white">
                        Platform Overview
                      </h2>
                      <p className="text-xs text-slate-400">
                        Real-time activity and key metrics across the Nova ecosystem.
                      </p>
                    </div>

                    {/* Time Range Selector */}
                    <div className="relative inline-block">
                      <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="bg-[#080d19] border border-[#1e293b] text-xs text-slate-300 rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#22d3ee] cursor-pointer"
                      >
                        <option value="Last 7 days">Last 7 days</option>
                        <option value="Last 30 days">Last 30 days</option>
                        <option value="Last 90 days">Last 90 days</option>
                      </select>
                    </div>
                  </div>

                  {/* 4 Metric Pill Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* Pill 1 */}
                    <div className="p-3.5 rounded-xl bg-[#080d1a] border border-[#172238]">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Users className="w-4 h-4 text-[#38bdf8]" />
                        <span className="text-xs text-slate-400">New Users</span>
                      </div>
                      <div className="text-lg font-bold text-white font-['Space_Grotesk']">
                        1,243
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                        <span className="text-emerald-400 font-semibold">&uarr; 16%</span>
                        <span>vs. previous 7 days</span>
                      </div>
                    </div>

                    {/* Pill 2 */}
                    <div className="p-3.5 rounded-xl bg-[#080d1a] border border-[#172238]">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Folder className="w-4 h-4 text-[#818cf8]" />
                        <span className="text-xs text-slate-400">New Projects</span>
                      </div>
                      <div className="text-lg font-bold text-white font-['Space_Grotesk']">
                        86
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                        <span className="text-emerald-400 font-semibold">&uarr; 22%</span>
                        <span>vs. previous 7 days</span>
                      </div>
                    </div>

                    {/* Pill 3 */}
                    <div className="p-3.5 rounded-xl bg-[#080d1a] border border-[#172238]">
                      <div className="flex items-center gap-2 mb-1.5">
                        <GitBranch className="w-4 h-4 text-[#c084fc]" />
                        <span className="text-xs text-slate-400">Repo Commits</span>
                      </div>
                      <div className="text-lg font-bold text-white font-['Space_Grotesk']">
                        412
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                        <span className="text-emerald-400 font-semibold">&uarr; 28%</span>
                        <span>vs. previous 7 days</span>
                      </div>
                    </div>

                    {/* Pill 4 */}
                    <div className="p-3.5 rounded-xl bg-[#080d1a] border border-[#172238]">
                      <div className="flex items-center gap-2 mb-1.5">
                        <MessageSquare className="w-4 h-4 text-[#f472b6]" />
                        <span className="text-xs text-slate-400">Community Posts</span>
                      </div>
                      <div className="text-lg font-bold text-white font-['Space_Grotesk']">
                        1,567
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                        <span className="text-emerald-400 font-semibold">&uarr; 19%</span>
                        <span>vs. previous 7 days</span>
                      </div>
                    </div>
                  </div>

                  {/* 2 CHARTS: Growth Curve & Donut Distribution */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                    {/* Growth Chart (SVG Area Chart) */}
                    <div className="p-4 rounded-xl bg-[#080d1a] border border-[#172238]">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-white">
                          Platform Growth
                        </h3>
                        <div className="flex items-center gap-3 text-[11px]">
                          <span className="flex items-center gap-1.5 text-slate-400">
                            <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />
                            Users
                          </span>
                          <span className="flex items-center gap-1.5 text-slate-400">
                            <span className="w-2 h-2 rounded-full bg-[#818cf8]" />
                            Projects
                          </span>
                        </div>
                      </div>

                      {/* SVG Chart */}
                      <div className="h-44 w-full relative">
                        <svg
                          viewBox="0 0 400 150"
                          className="w-full h-full overflow-visible"
                        >
                          <defs>
                            <linearGradient
                              id="usersGrad"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="#38bdf8"
                                stopOpacity="0.4"
                              />
                              <stop
                                offset="100%"
                                stopColor="#38bdf8"
                                stopOpacity="0"
                              />
                            </linearGradient>
                            <linearGradient
                              id="projGrad"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="#818cf8"
                                stopOpacity="0.3"
                              />
                              <stop
                                offset="100%"
                                stopColor="#818cf8"
                                stopOpacity="0"
                              />
                            </linearGradient>
                          </defs>

                          {/* Grid Lines */}
                          <line
                            x1="0"
                            y1="25"
                            x2="400"
                            y2="25"
                            stroke="#1f293d"
                            strokeDasharray="4 4"
                          />
                          <line
                            x1="0"
                            y1="65"
                            x2="400"
                            y2="65"
                            stroke="#1f293d"
                            strokeDasharray="4 4"
                          />
                          <line
                            x1="0"
                            y1="105"
                            x2="400"
                            y2="105"
                            stroke="#1f293d"
                            strokeDasharray="4 4"
                          />
                          <line
                            x1="0"
                            y1="145"
                            x2="400"
                            y2="145"
                            stroke="#1f293d"
                          />

                          {/* Area Fills */}
                          <path
                            d="M 10 120 Q 70 115 130 100 T 250 80 T 330 55 T 390 30 L 390 145 L 10 145 Z"
                            fill="url(#usersGrad)"
                          />
                          <path
                            d="M 10 135 Q 70 130 130 120 T 250 105 T 330 85 T 390 65 L 390 145 L 10 145 Z"
                            fill="url(#projGrad)"
                          />

                          {/* Lines */}
                          <path
                            d="M 10 120 Q 70 115 130 100 T 250 80 T 330 55 T 390 30"
                            fill="none"
                            stroke="#38bdf8"
                            strokeWidth="2.5"
                          />
                          <path
                            d="M 10 135 Q 70 130 130 120 T 250 105 T 330 85 T 390 65"
                            fill="none"
                            stroke="#818cf8"
                            strokeWidth="2.5"
                          />

                          {/* Endpoint Glowing Dot */}
                          <circle
                            cx="390"
                            cy="30"
                            r="4.5"
                            fill="#38bdf8"
                            stroke="#ffffff"
                            strokeWidth="1.5"
                            className="animate-pulse"
                          />
                        </svg>

                        {/* X-Axis Dates */}
                        <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2">
                          <span>Oct 17</span>
                          <span>Oct 18</span>
                          <span>Oct 19</span>
                          <span>Oct 20</span>
                          <span>Oct 21</span>
                          <span>Oct 22</span>
                          <span>Oct 23</span>
                        </div>
                      </div>
                    </div>

                    {/* Donut Chart (User Distribution) */}
                    <div className="p-4 rounded-xl bg-[#080d1a] border border-[#172238] flex flex-col justify-between">
                      <h3 className="text-sm font-semibold text-white mb-2">
                        User Distribution
                      </h3>

                      <div className="flex items-center justify-between gap-4 my-auto">
                        {/* Donut Graphic */}
                        <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
                          <svg
                            viewBox="0 0 100 100"
                            className="w-full h-full -rotate-90"
                          >
                            {/* Builders 45% */}
                            <circle
                              cx="50"
                              cy="50"
                              r="38"
                              fill="transparent"
                              stroke="#10b981"
                              strokeWidth="14"
                              strokeDasharray="107 132"
                              strokeDashoffset="0"
                            />
                            {/* Community 25% */}
                            <circle
                              cx="50"
                              cy="50"
                              r="38"
                              fill="transparent"
                              stroke="#818cf8"
                              strokeWidth="14"
                              strokeDasharray="60 179"
                              strokeDashoffset="-107"
                            />
                            {/* Investors 20% */}
                            <circle
                              cx="50"
                              cy="50"
                              r="38"
                              fill="transparent"
                              stroke="#06b6d4"
                              strokeWidth="14"
                              strokeDasharray="48 191"
                              strokeDashoffset="-167"
                            />
                            {/* Others 10% */}
                            <circle
                              cx="50"
                              cy="50"
                              r="38"
                              fill="transparent"
                              stroke="#6366f1"
                              strokeWidth="14"
                              strokeDasharray="24 215"
                              strokeDashoffset="-215"
                            />
                          </svg>

                          {/* Center Text */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span className="text-xs font-bold text-white font-['Space_Grotesk'] leading-none">
                              12,482
                            </span>
                            <span className="text-[9px] text-slate-400 mt-0.5">
                              Total Users
                            </span>
                          </div>
                        </div>

                        {/* Legend */}
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-2 text-slate-300">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                              Builders
                            </span>
                            <span className="font-semibold text-white">45%</span>
                          </div>

                          <div className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-2 text-slate-300">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#06b6d4]" />
                              Investors
                            </span>
                            <span className="font-semibold text-white">20%</span>
                          </div>

                          <div className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-2 text-slate-300">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#818cf8]" />
                              Community
                            </span>
                            <span className="font-semibold text-white">25%</span>
                          </div>

                          <div className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-2 text-slate-300">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#6366f1]" />
                              Others
                            </span>
                            <span className="font-semibold text-white">10%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* QUICK ACTIONS PANEL (Col-span 1) */}
                <div className="rounded-2xl bg-[#0c1220] border border-[#1b253b] p-6 shadow-xl flex flex-col justify-between">
                  <div>
                    {/* Header with Lightning Icon */}
                    <div className="flex items-center gap-2.5 mb-1">
                      <div className="p-1.5 rounded-lg bg-[#6366f1]/15 text-[#818cf8]">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <h2 className="font-['Space_Grotesk'] text-base font-bold text-white">
                        Quick Actions
                      </h2>
                    </div>
                    <p className="text-xs text-slate-400 mb-5">
                      Manage the platform with ease.
                    </p>

                    {/* 4 Action Rows with Chevron */}
                    <div className="space-y-3">
                      {/* Action 1 */}
                      <button
                        onClick={() => setActionModal("addUser")}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-[#080d19] hover:bg-[#111a2e] border border-[#18233a] hover:border-[#22d3ee]/30 transition-all text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-[#38bdf8]/10 text-[#38bdf8]">
                            <UserPlus className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-white group-hover:text-[#38bdf8] transition-colors">
                              Add New User
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Create and manage user accounts
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                      </button>

                      {/* Action 2 */}
                      <button
                        onClick={() => setActionModal("reviewApps")}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-[#080d19] hover:bg-[#111a2e] border border-[#18233a] hover:border-[#818cf8]/30 transition-all text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-[#818cf8]/10 text-[#818cf8]">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-white group-hover:text-[#818cf8] transition-colors">
                              Review Applications
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Check builder/investor applications
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                      </button>

                      {/* Action 3 */}
                      <button
                        onClick={() => setActionModal("createProject")}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-[#080d19] hover:bg-[#111a2e] border border-[#18233a] hover:border-[#c084fc]/30 transition-all text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-[#c084fc]/10 text-[#c084fc]">
                            <Folder className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-white group-hover:text-[#c084fc] transition-colors">
                              Create Project
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Launch a new project or repo
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                      </button>

                      {/* Action 4 */}
                      <button
                        onClick={() => setActionModal("moderate")}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-[#080d19] hover:bg-[#111a2e] border border-[#18233a] hover:border-[#f472b6]/30 transition-all text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-[#f472b6]/10 text-[#f472b6]">
                            <MessageSquare className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-white group-hover:text-[#f472b6] transition-colors">
                              Moderate Community
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Manage posts, comments & reports
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#141d30]">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Quick Hotkeys</span>
                      <kbd className="px-2 py-0.5 rounded bg-[#080d19] border border-white/5 font-mono text-[10px] text-[#22d3ee]">
                        Ctrl + K
                      </kbd>
                    </div>
                  </div>
                </div>
              </div>

              {/* BOTTOM ROW: 3 COLUMNS (Recent Activity, Top Builders, Recent Applications) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* COLUMN 1: RECENT ACTIVITY */}
                <div className="rounded-2xl bg-[#0c1220] border border-[#1b253b] p-5 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#38bdf8]" />
                        <h2 className="font-['Space_Grotesk'] text-sm font-bold text-white">
                          Recent Activity
                        </h2>
                      </div>
                      <button
                        onClick={() => setActiveTab("logs")}
                        className="text-[11px] text-[#38bdf8] hover:underline"
                      >
                        View All &rarr;
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 mb-4">
                      Latest actions across the platform.
                    </p>

                    {/* Activity items matching screenshot */}
                    <div className="space-y-3.5">
                      {/* Item 1 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-[#0284c7] text-white flex items-center justify-center font-bold text-xs shrink-0">
                            A
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-slate-200">
                              New user registered
                            </div>
                            <div className="text-[11px] text-slate-400">
                              tunde.ade01@example.com
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">
                          2m ago
                        </span>
                      </div>

                      {/* Item 2 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-[#7c3aed] text-white flex items-center justify-center shrink-0">
                            <Folder className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-slate-200">
                              New project submitted
                            </div>
                            <div className="text-[11px] text-slate-400">
                              DeFi Dashboard
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">
                          7m ago
                        </span>
                      </div>

                      {/* Item 3 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-[#059669] text-white flex items-center justify-center shrink-0">
                            <Users className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-slate-200">
                              Builder application received
                            </div>
                            <div className="text-[11px] text-slate-400">
                              by @cryptoDev
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">
                          12m ago
                        </span>
                      </div>

                      {/* Item 4 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-[#6d28d9] text-white flex items-center justify-center font-bold text-xs shrink-0">
                            A
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-slate-200">
                              New repo pushed
                            </div>
                            <div className="text-[11px] text-slate-400">
                              nova-web
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">
                          15m ago
                        </span>
                      </div>

                      {/* Item 5 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-[#db2777] text-white flex items-center justify-center shrink-0">
                            <MessageSquare className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-slate-200">
                              Community post
                            </div>
                            <div className="text-[11px] text-slate-400 truncate max-w-[140px]">
                              &quot;Looking for a Web3 developer&quot;
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">
                          18m ago
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* COLUMN 2: TOP BUILDERS */}
                <div className="rounded-2xl bg-[#0c1220] border border-[#1b253b] p-5 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-[#818cf8]" />
                        <h2 className="font-['Space_Grotesk'] text-sm font-bold text-white">
                          Top Builders
                        </h2>
                      </div>
                      <button
                        onClick={() => setActiveTab("builders")}
                        className="text-[11px] text-[#38bdf8] hover:underline"
                      >
                        View All &rarr;
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 mb-4">
                      Most active builders this week.
                    </p>

                    {/* Top Builders Rankings matching screenshot */}
                    <div className="space-y-3.5">
                      {[
                        {
                          rank: 1,
                          name: "CodeKing",
                          info: "12 projects · 48 commits",
                          score: "98",
                          avatarBg: "bg-red-500",
                        },
                        {
                          rank: 2,
                          name: "Web3Flow",
                          info: "8 projects · 32 commits",
                          score: "89",
                          avatarBg: "bg-blue-600",
                        },
                        {
                          rank: 3,
                          name: "CryptoDev",
                          info: "6 projects · 21 commits",
                          score: "76",
                          avatarBg: "bg-emerald-600",
                        },
                        {
                          rank: 4,
                          name: "PixelCraft",
                          info: "4 projects · 16 commits",
                          score: "62",
                          avatarBg: "bg-cyan-600",
                        },
                        {
                          rank: 5,
                          name: "ZikTech",
                          info: "3 projects · 9 commits",
                          score: "54",
                          avatarBg: "bg-amber-600",
                        },
                      ].map((b) => (
                        <div
                          key={b.name}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-4 text-xs font-mono font-semibold text-slate-500">
                              {b.rank}
                            </span>
                            <div
                              className={`w-7 h-7 rounded-full ${b.avatarBg} text-white flex items-center justify-center text-[11px] font-bold shrink-0 shadow-sm`}
                            >
                              {b.name[0]}
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-slate-200">
                                {b.name}
                              </div>
                              <div className="text-[11px] text-slate-400">
                                {b.info}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-0.5">
                            <span>{b.score}</span>
                            <span>&uarr;</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* COLUMN 3: RECENT APPLICATIONS */}
                <div className="rounded-2xl bg-[#0c1220] border border-[#1b253b] p-5 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#c084fc]" />
                        <h2 className="font-['Space_Grotesk'] text-sm font-bold text-white">
                          Recent Applications
                        </h2>
                      </div>
                      <button
                        onClick={() => setActiveTab("applications")}
                        className="text-[11px] text-[#38bdf8] hover:underline"
                      >
                        View All &rarr;
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 mb-4">
                      Latest builder and investor applications.
                    </p>

                    {/* Applications list matching screenshot */}
                    <div className="space-y-3.5">
                      {[
                        {
                          id: "app-1",
                          name: "Ahmed Musa",
                          role: "Builder Application",
                          time: "2m ago",
                          avatarBg: "bg-rose-500",
                        },
                        {
                          id: "app-2",
                          name: "Fatima Bello",
                          role: "Investor Application",
                          time: "15m ago",
                          avatarBg: "bg-blue-500",
                        },
                        {
                          id: "app-3",
                          name: "Samuel Kelvin",
                          role: "Builder Application",
                          time: "1h ago",
                          avatarBg: "bg-emerald-500",
                        },
                        {
                          id: "app-4",
                          name: "Aisha Ibrahim",
                          role: "Investor Application",
                          time: "2h ago",
                          avatarBg: "bg-cyan-500",
                        },
                        {
                          id: "app-5",
                          name: "Daniel Okafor",
                          role: "Builder Application",
                          time: "3h ago",
                          avatarBg: "bg-orange-500",
                        },
                      ].map((app) => {
                        const status = appStatuses[app.id] || "Pending";
                        return (
                          <div
                            key={app.id}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-7 h-7 rounded-full ${app.avatarBg} text-white flex items-center justify-center font-bold text-xs shrink-0`}
                              >
                                {app.name[0]}
                              </div>
                              <div>
                                <div className="text-xs font-semibold text-slate-200">
                                  {app.name}
                                </div>
                                <div className="text-[11px] text-slate-400">
                                  {app.role}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                                  status === "Approved"
                                    ? "bg-emerald-950/70 text-emerald-400 border-emerald-500/40"
                                    : status === "In Review"
                                    ? "bg-sky-950/70 text-sky-400 border-sky-500/40"
                                    : "bg-amber-950/70 text-amber-400 border-amber-500/40"
                                }`}
                              >
                                {status}
                              </span>
                              <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
                                {app.time}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== PAGE FOOTER ===================== */}
          <footer className="pt-6 border-t border-[#1b253b] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-sans gap-2">
            <div>&copy; 2025 Nova. All rights reserved.</div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <span>Building the future of work, investing and innovation.</span>
              <span className="text-amber-400">⚡</span>
            </div>
          </footer>
        </main>
      </div>

      {/* ===================== SEARCH MODAL (Ctrl + K) ===================== */}
      <Dialog open={showSearchModal} onOpenChange={setShowSearchModal}>
        <DialogContent className="bg-[#0b101c] border-[#1f293d] text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-['Space_Grotesk']">
              Quick Navigation & Search
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Search for users, projects, builders, and system partitions.
            </DialogDescription>
          </DialogHeader>

          <div className="relative mt-2">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Nova database..."
              className="bg-[#070b13] border-[#1e293b] pl-9 text-xs h-10 text-white"
              autoFocus
            />
          </div>

          <div className="space-y-1 mt-3 max-h-56 overflow-y-auto text-xs">
            {[
              { title: "Ahmed Musa", sub: "Builder Applicant", tab: "applications" },
              { title: "DeFi Dashboard", sub: "Open Project · 5 bids", tab: "projects" },
              { title: "CodeKing", sub: "Builder #1 · 48 commits", tab: "builders" },
              { title: "Fatima Bello", sub: "Angel Investor", tab: "investors" },
              { title: "System Logs & Telemetry", sub: "Root Audit Trail", tab: "logs" },
            ]
              .filter(
                (item) =>
                  !searchQuery ||
                  item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.sub.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((res) => (
                <button
                  key={res.title}
                  onClick={() => {
                    setActiveTab(res.tab as SidebarTab);
                    setShowSearchModal(false);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#131b2e] text-left transition-colors"
                >
                  <div>
                    <div className="font-semibold text-white">{res.title}</div>
                    <div className="text-[11px] text-slate-400">{res.sub}</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              ))}
          </div>

          <DialogFooter>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowSearchModal(false)}
              className="border-[#1e293b] text-slate-300 text-xs"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===================== ADD NEW USER MODAL ===================== */}
      <Dialog
        open={actionModal === "addUser"}
        onOpenChange={(open) => !open && setActionModal(null)}
      >
        <DialogContent className="bg-[#0b101c] border-[#1f293d] text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-['Space_Grotesk']">
              Add New Platform User
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Provision a new account on the Nova autonomous network.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-2 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Full Name
              </label>
              <Input
                type="text"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder="e.g. Chidi Anozie"
                className="bg-[#070b13] border-[#1e293b] text-xs h-9 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Email Address
              </label>
              <Input
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                placeholder="e.g. chidi@example.com"
                className="bg-[#070b13] border-[#1e293b] text-xs h-9 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Role</label>
              <select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value)}
                className="w-full bg-[#070b13] border border-[#1e293b] text-slate-200 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-[#22d3ee]"
              >
                <option value="builder">Builder</option>
                <option value="company">Company / Founder</option>
                <option value="investor">Venture Investor</option>
                <option value="learner">Learner</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setActionModal(null)}
              className="border-[#1e293b] text-slate-300 text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (!newUserName || !newUserEmail) return;
                setActionSuccessMessage(
                  `Successfully provisioned account for ${newUserName} (${newUserEmail}) as ${newUserRole}.`
                );
                setNewUserName("");
                setNewUserEmail("");
                setActionModal(null);
              }}
              className="bg-gradient-to-r from-[#22d3ee] to-[#0ea5e9] text-[#030712] font-semibold text-xs"
            >
              Create Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===================== REVIEW APPLICATIONS MODAL ===================== */}
      <Dialog
        open={actionModal === "reviewApps"}
        onOpenChange={(open) => !open && setActionModal(null)}
      >
        <DialogContent className="bg-[#0b101c] border-[#1f293d] text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-['Space_Grotesk']">
              Review Pending Applications
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Approve or review candidate builder and investor applications.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            {[
              { id: "app-1", name: "Ahmed Musa", role: "Builder" },
              { id: "app-2", name: "Fatima Bello", role: "Investor" },
              { id: "app-5", name: "Daniel Okafor", role: "Builder" },
            ].map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#080d19] border border-[#1b253b] text-xs"
              >
                <div>
                  <div className="font-semibold text-white">{app.name}</div>
                  <div className="text-slate-400 text-[11px]">{app.role} Application</div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setAppStatuses((prev) => ({
                        ...prev,
                        [app.id]: "In Review",
                      }));
                      setActionSuccessMessage(`Marked ${app.name}'s application as In Review.`);
                    }}
                    className="border-[#1e293b] text-sky-400 hover:bg-sky-500/10 text-[11px] h-7 px-2.5"
                  >
                    In Review
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setAppStatuses((prev) => ({
                        ...prev,
                        [app.id]: "Approved",
                      }));
                      setActionSuccessMessage(`Approved ${app.name}'s application!`);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] h-7 px-2.5"
                  >
                    Approve
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setActionModal(null)}
              className="border-[#1e293b] text-slate-300 text-xs"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===================== CREATE PROJECT MODAL ===================== */}
      <Dialog
        open={actionModal === "createProject"}
        onOpenChange={(open) => !open && setActionModal(null)}
      >
        <DialogContent className="bg-[#0b101c] border-[#1f293d] text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-['Space_Grotesk']">
              Create New Project / Repo
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Instantiate an ecosystem project with milestone smart escrow.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Project Title
              </label>
              <Input
                type="text"
                placeholder="e.g. Autonomous AI Trading Agent"
                className="bg-[#070b13] border-[#1e293b] text-xs h-9 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Category
              </label>
              <Input
                type="text"
                placeholder="e.g. AI / Machine Learning"
                className="bg-[#070b13] border-[#1e293b] text-xs h-9 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Initial Budget (USD)
              </label>
              <Input
                type="number"
                placeholder="10000"
                className="bg-[#070b13] border-[#1e293b] text-xs h-9 text-white"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setActionModal(null)}
              className="border-[#1e293b] text-slate-300 text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setActionSuccessMessage("Project launched and deployed to matching engine.");
                setActionModal(null);
              }}
              className="bg-gradient-to-r from-[#22d3ee] to-[#0ea5e9] text-[#030712] font-semibold text-xs"
            >
              Deploy Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===================== MODERATE COMMUNITY MODAL ===================== */}
      <Dialog
        open={actionModal === "moderate"}
        onOpenChange={(open) => !open && setActionModal(null)}
      >
        <DialogContent className="bg-[#0b101c] border-[#1f293d] text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-['Space_Grotesk']">
              Community Moderation
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Manage community feeds, filter spam, and review flagged content.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2.5 py-2 text-xs">
            <div className="p-3 rounded-xl bg-[#080d19] border border-[#1b253b] flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">Auto-Spam Shield</div>
                <div className="text-[11px] text-slate-400">Filter crypto phishing & bots</div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950/70 text-emerald-400 border border-emerald-500/30 text-[10px]">
                Active
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#080d19] border border-[#1b253b] flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">Pending Reports</div>
                <div className="text-[11px] text-slate-400">0 critical violations flagged</div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px]">
                Clean
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button
              size="sm"
              onClick={() => setActionModal(null)}
              className="bg-[#1e293b] hover:bg-[#334155] text-slate-200 text-xs"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
