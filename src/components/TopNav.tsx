import { Link } from "react-router-dom";
import { useApp } from "@/state/AppContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Bell, Menu, ChevronDown, Sparkles, Check, Search, Shield } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getRegisteredUsers } from "@/data/storage";

interface TopNavProps {
  onAddProfile: () => void;
}

export function TopNav({ onAddProfile }: TopNavProps) {
  const { state, dispatch, unreadCount } = useApp();
  const isMobile = useIsMobile();
  const registeredUsers = getRegisteredUsers();
  const isCommunity = state.activeTab === "community";
  const isAdmin = state.userRole === "admin" || state.currentUser?.role === "admin";

  return (
    <header
      className="fixed top-0 right-0 left-0 z-40 h-16 bg-[#0c1017]/85 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 transition-all duration-300"
      style={
        isMobile
          ? { marginLeft: "0" }
          : { marginLeft: state.sidebarCollapsed ? "64px" : "240px" }
      }
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => dispatch({ type: "TOGGLE_SIDEBAR" })}
          className="md:hidden p-2 rounded-md hover:bg-white/5 transition-colors"
        >
          <Menu className="w-5 h-5 text-[#9ca3af]" />
        </button>

        {/* Community Search or Breadcrumbs */}
        {isCommunity ? (
          <div className="flex items-center gap-2.5 bg-[#131a26] border border-white/10 hover:border-[#22d3ee]/30 rounded-xl px-3.5 py-1.5 w-60 sm:w-80 md:w-96 transition-all">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search the community..."
              className="bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none w-full"
            />
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-400">
            <span className="uppercase text-[10px] text-slate-500 font-bold">
              Dashboard
            </span>
            <span className="text-slate-700">/</span>
            <span className="uppercase text-[10px] text-slate-300 font-bold capitalize">
              {state.activeTab.replace("-", " ")}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Ask Nova AI input (shown when not on community search mode) */}
        {!isCommunity && (
          <div className="hidden md:flex items-center gap-2 bg-[#131a26] border border-white/5 hover:border-[#22d3ee]/20 rounded-xl px-4 py-1.5 text-slate-400 cursor-pointer transition-all">
            <Sparkles className="w-3.5 h-3.5 text-[#22d3ee] animate-pulse" />
            <span className="text-[11px] font-semibold text-slate-400">
              Ask Nova AI
            </span>
          </div>
        )}

        {/* Overseer System Portal (only visible to admin) */}
        {isAdmin && (
          <Link
            to="/admin"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#22d3ee]/10 text-[#22d3ee] border border-[#22d3ee]/30 hover:bg-[#22d3ee]/20 transition-all text-xs font-mono font-semibold"
            title="Open System Overseer Dashboard (/admin)"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Overseer</span>
          </Link>
        )}

        {/* Bell Notifications */}
        <button
          onClick={() => dispatch({ type: "TOGGLE_NOTIFICATIONS" })}
          className="relative p-2 rounded-full hover:bg-white/5 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4 text-slate-400" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#22d3ee] rounded-full border-2 border-[#0c1017]" />
          )}
        </button>

        {/* User profile and persona switcher */}
        {state.currentUser && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2.5 bg-[#131a26] border border-white/5 hover:border-white/15 rounded-xl px-3 py-1.5 transition-colors cursor-pointer">
                <img
                  src={
                    state.currentUser.avatarUrl ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${state.currentUser.userId}`
                  }
                  alt=""
                  className="w-6 h-6 rounded-full object-cover"
                />
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs text-white font-medium font-['Space_Grotesk'] leading-tight">
                    {state.currentUser.fullName}
                  </span>
                  <span className="text-[10px] text-[#22d3ee] font-medium capitalize leading-tight">
                    {state.currentUser.registeredRole || state.userRole}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-[#131a26] border-white/10 text-white"
            >
              <DropdownMenuLabel className="text-slate-400">
                Switch profile
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              {registeredUsers.map((account) => (
                <DropdownMenuItem
                  key={account.email}
                  onClick={() =>
                    dispatch({
                      type: "SWITCH_ACCOUNT",
                      payload: account.email,
                    })
                  }
                  className="flex items-center justify-between cursor-pointer focus:bg-white/10 focus:text-white"
                >
                  <span>
                    {account.name}
                    <span className="ml-2 text-xs text-slate-500">
                      {account.registeredRole}
                    </span>
                  </span>
                  {state.currentUser?.email.toLowerCase() === account.email && (
                    <Check className="w-4 h-4 text-[#22d3ee]" />
                  )}
                </DropdownMenuItem>
              ))}
              {isAdmin && (
                <>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem asChild>
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 cursor-pointer text-[#22d3ee] focus:bg-white/10 focus:text-[#22d3ee] font-mono text-xs"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Overseer Console (/admin)</span>
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem
                onClick={onAddProfile}
                className="cursor-pointer text-slate-300 focus:bg-white/10 focus:text-white"
              >
                + Add profile
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
