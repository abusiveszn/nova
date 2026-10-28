import { Link } from "react-router-dom";
import { useApp } from "@/state/AppContext";
import { useIsMobile } from "@/hooks/use-mobile";
import type { UserRole, TabId } from "@/types";
import { getDashboardRole } from "@/types";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Briefcase,
  Compass,
  Users,
  UserCircle,
  FolderPlus,
  ClipboardList,
  GitMerge,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Settings,
  LogOut,
  TrendingUp,
  ShoppingCart,
  BookOpen,
  Code2,
  CreditCard,
  LayoutGrid,
  Shield,
} from "lucide-react";

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
}

const builderNav: NavItem[] = [
  { id: "overview", label: "Home", icon: LayoutDashboard },
  { id: "community", label: "Community", icon: Users },
  { id: "opportunities", label: "Opportunities", icon: Briefcase },
  { id: "projects", label: "Projects", icon: LayoutGrid },
  { id: "network", label: "Teams", icon: Users },
  { id: "team-chat", label: "Messages", icon: MessageSquare, badge: 3 },
  { id: "portfolio", label: "Portfolio", icon: Briefcase },
  { id: "analytics", label: "Analytics", icon: Compass },
  { id: "reputation", label: "Reputation", icon: UserCircle },
  { id: "profile", label: "Settings", icon: Settings },
];

const companyNav: NavItem[] = [
  { id: "overview", label: "Home", icon: LayoutDashboard },
  { id: "community", label: "Community", icon: Users },
  { id: "post-project", label: "Post Project", icon: FolderPlus },
  { id: "projects", label: "My Projects", icon: Briefcase },
  { id: "applicants", label: "Applicants", icon: ClipboardList },
  { id: "profile", label: "Settings", icon: Settings },
];

const investorNav: NavItem[] = [
  { id: "overview", label: "Home", icon: LayoutDashboard },
  { id: "community", label: "Community", icon: Users },
  { id: "investment-marketplace", label: "Marketplace", icon: ShoppingCart },
  { id: "my-investments", label: "My Investments", icon: TrendingUp },
  { id: "profile", label: "Settings", icon: Settings },
];

const adminNav: NavItem[] = [
  { id: "overview", label: "Home", icon: LayoutDashboard },
  { id: "community", label: "Community", icon: Users },
  { id: "learners", label: "Learners", icon: BookOpen },
  { id: "users", label: "Users", icon: Users },
  { id: "projects", label: "Projects", icon: Briefcase },
  { id: "matching", label: "Matching", icon: GitMerge },
  { id: "profile", label: "Settings", icon: Settings },
];

const learnerNav: NavItem[] = [
  { id: "overview", label: "Home", icon: LayoutDashboard },
  { id: "community", label: "Community", icon: Users },
  { id: "learner-curriculum", label: "Curriculum", icon: BookOpen },
  { id: "learner-lab", label: "Code Lab", icon: Code2 },
  { id: "learner-billing", label: "Subscription", icon: CreditCard },
  { id: "profile", label: "Settings", icon: Settings },
];

const navMap: Record<UserRole, NavItem[]> = {
  builder: builderNav,
  company: companyNav,
  admin: adminNav,
};

export function RoleSidebar() {
  const handleLogout = () => {
    localStorage.removeItem("nova_logged_in_user_id");
    localStorage.removeItem("nova_user_role");
    localStorage.removeItem("nova_current_user_profile");
    window.location.reload();
  };
  const { state, dispatch } = useApp();
  const collapsed = state.sidebarCollapsed;
  const dashboardRole = getDashboardRole(state.userRole);

  // Check if user is an investor or learner
  const isInvestor = state.currentUser?.registeredRole === "investor";
  const isLearner = state.currentUser?.registeredRole === "learner";

  // Determine navigation based on role and status
  let navItems = navMap[dashboardRole] || [];
  if (isInvestor && dashboardRole === "company") {
    navItems = investorNav;
  }
  if (isLearner && dashboardRole === "builder") {
    navItems = learnerNav;
  }

  const isMobile = useIsMobile();
  const [hoveredId, setHoveredId] = useState<TabId | null>(null);

  return (
    <>
      <AnimatePresence>
        {!collapsed && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => dispatch({ type: "TOGGLE_SIDEBAR" })}
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed left-0 top-0 z-50 h-full bg-[#0a0a0a] border-r border-white/5 flex flex-col transition-all duration-300 ease-out ${
          isMobile
            ? state.sidebarCollapsed
              ? "-translate-x-full"
              : "translate-x-0"
            : collapsed
              ? "w-16"
              : "w-60"
        } ${isMobile ? "w-60" : ""}`}
      >
        {/* Logo & Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => dispatch({ type: "SET_TAB", payload: "overview" })}
          >
            <div
              className={`flex items-center justify-center rounded-lg overflow-hidden bg-[#0a0a0a] p-0.5 ${
                collapsed ? "w-8 h-8 mx-auto" : "w-8 h-8"
              }`}
            >
              <img
                src="/Picsart_26-04-10_14-37-41-214.png"
                alt="NOVA Logo"
                className="w-full h-full object-contain"
              />
            </div>
            {!collapsed && (
              <span className="font-['Space_Grotesk'] font-bold text-xl text-[#22d3ee] tracking-tight">
                NOVA
              </span>
            )}
          </div>

          {!isMobile && (
            <button
              onClick={() => dispatch({ type: "TOGGLE_SIDEBAR" })}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* User Profile Card inside Sidebar */}
        {!collapsed && state.currentUser && (
          <div className="px-4 py-3 border-b border-white/5">
            <div className="bg-[#131a26] border border-white/5 rounded-2xl p-3 flex items-center gap-3">
              <img
                src={
                  state.currentUser.avatarUrl ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${state.currentUser.userId}`
                }
                alt=""
                className="w-9 h-9 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-['Space_Grotesk'] text-xs font-bold text-white truncate">
                  {state.currentUser.fullName}
                </h4>
                <p className="text-[9px] text-[#22d3ee] font-bold tracking-widest mt-0.5 uppercase">
                  • {state.currentUser.registeredRole || state.userRole}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation items list */}
        <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto no-scrollbar relative">
          {navItems.map((item) => {
            const isActive = state.activeTab === item.id;
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                onClick={() => dispatch({ type: "SET_TAB", payload: item.id })}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "text-[#22d3ee] font-semibold"
                    : "text-[#9ca3af] hover:text-[#f9fafb]"
                } ${collapsed ? "justify-center px-2" : ""}`}
                title={collapsed ? item.label : undefined}
                whileTap={{ scale: 0.98 }}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute left-0 top-2.5 bottom-2.5 w-1 bg-[#22d3ee] rounded-r-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}

                {/* Sliding hover pill */}
                {hoveredId === item.id && (
                  <motion.div
                    layoutId="sidebar-hover-bg"
                    className="absolute inset-0 bg-white/5 rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}

                {/* Static base for active when not hovered */}
                {isActive && !hoveredId && (
                  <div className="absolute inset-0 bg-[#131a26]/40 border border-white/5 rounded-xl -z-20" />
                )}

                <Icon
                  className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${
                    isActive ? "text-[#22d3ee]" : "text-[#9ca3af]"
                  }`}
                  strokeWidth={1.5}
                />

                {!collapsed && (
                  <span className="relative z-10 flex-1 text-left">
                    {item.label}
                  </span>
                )}

                {!collapsed && item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#22d3ee] text-[#0a101d] shadow-sm">
                    {item.badge}
                  </span>
                )}
              </motion.button>
            );
          })}
        </nav>


        {/* Sidebar Footer (Settings & Logout) */}
        <div className="p-2.5 border-t border-white/5 flex items-center justify-between gap-1">
          {!collapsed ? (
            <>
              {dashboardRole === "admin" && (
                <Link
                  to="/admin"
                  className="p-2 rounded-lg text-[#22d3ee] hover:bg-[#22d3ee]/10 transition-colors"
                  title="Overseer Command Center (/admin)"
                >
                  <Shield className="w-4 h-4" />
                </Link>
              )}
              <button
                onClick={() =>
                  dispatch({ type: "SET_TAB", payload: "profile" })
                }
                className="p-2 rounded-lg text-[#9ca3af] hover:text-[#22d3ee] hover:bg-white/5 transition-colors"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-1.5 mx-auto">
              {dashboardRole === "admin" && (
                <Link
                  to="/admin"
                  className="p-2 rounded-lg text-[#22d3ee] hover:bg-[#22d3ee]/10 transition-colors"
                  title="Overseer Command Center (/admin)"
                >
                  <Shield className="w-4 h-4" />
                </Link>
              )}
              <button
                onClick={() => dispatch({ type: "TOGGLE_SIDEBAR" })}
                className="p-2 rounded-lg text-[#9ca3af] hover:text-white hover:bg-white/5 transition-colors"
                title="Expand"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
