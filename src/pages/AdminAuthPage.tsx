import React, { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Terminal,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Cpu,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/state/AppContext";
import type { AdminProfile } from "@/types";

export const ADMIN_CREDENTIALS = {
  username: "novafuturegrid@gmail.com",
  password: "nova@admin",
};

export const ADMIN_STORAGE_KEY = "nova_admin_authenticated";
export const ADMIN_USER_KEY = "nova_admin_user";

/**
 * Check if the active session has authorized admin clearance
 */
export function isAdminAuthenticated(): boolean {
  try {
    const isLocal = localStorage.getItem(ADMIN_STORAGE_KEY) === "true";
    const isSession = sessionStorage.getItem(ADMIN_STORAGE_KEY) === "true";
    return isLocal || isSession;
  } catch {
    return false;
  }
}

/**
 * Store admin authentication clearance
 */
export function setAdminSession(remember: boolean = true): void {
  try {
    if (remember) {
      localStorage.setItem(ADMIN_STORAGE_KEY, "true");
      localStorage.setItem(ADMIN_USER_KEY, ADMIN_CREDENTIALS.username);
    } else {
      sessionStorage.setItem(ADMIN_STORAGE_KEY, "true");
      sessionStorage.setItem(ADMIN_USER_KEY, ADMIN_CREDENTIALS.username);
    }
  } catch (err) {
    console.warn("Failed to persist admin session", err);
  }
}

/**
 * Revoke admin authentication clearance
 */
export function clearAdminSession(): void {
  try {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    sessionStorage.removeItem(ADMIN_USER_KEY);
  } catch (err) {
    console.warn("Failed to clear admin session", err);
  }
}

interface AdminAuthPageProps {
  onAuthenticated?: () => void;
}

export default function AdminAuthPage({ onAuthenticated }: AdminAuthPageProps) {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();

  const isCurrentAdmin =
    state.userRole === "admin" || state.currentUser?.role === "admin";
  const hasAdminAuth = isAdminAuthenticated() || isCurrentAdmin;

  if (state.currentUser && !isCurrentAdmin) {
    return <Navigate to="/" replace />;
  }

  if (hasAdminAuth) {
    return <Navigate to="/admin" replace />;
  }

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password;

    // Simulate cyber clearance verification
    setTimeout(() => {
      const isValidUser =
        cleanUser === ADMIN_CREDENTIALS.username.toLowerCase() ||
        cleanUser === "novafuturegrid";
      const isValidPass = cleanPass === ADMIN_CREDENTIALS.password;

      if (isValidUser && isValidPass) {
        // Successful admin authentication
        setAdminSession(rememberMe);

        // Update application state with admin persona
        const adminProfile: AdminProfile = {
          userId: "admin-novafuturegrid",
          role: "admin",
          fullName: "Nova Overseer Admin",
          username: "novafuturegrid",
          email: ADMIN_CREDENTIALS.username,
          avatarUrl:
            "https://api.dicebear.com/7.x/bottts/svg?seed=novafuturegrid",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        dispatch({ type: "LOGIN_USER", payload: adminProfile });
        dispatch({ type: "SWITCH_USER", payload: "admin" });
        localStorage.setItem("nova_logged_in_user_id", "admin-novafuturegrid");
        localStorage.setItem("nova_user_role", "admin");

        setIsSuccess(true);
        setIsLoading(false);

        setTimeout(() => {
          if (onAuthenticated) {
            onAuthenticated();
          } else {
            navigate("/admin");
          }
        }, 600);
      } else {
        setIsLoading(false);
        if (!isValidUser && !isValidPass) {
          setErrorMessage(
            "Access Denied: Invalid admin username and password combination."
          );
        } else if (!isValidUser) {
          setErrorMessage(
            "Access Denied: Unrecognized administrator username or email address."
          );
        } else {
          setErrorMessage(
            "Access Denied: Incorrect security clearance password."
          );
        }
      }
    }, 450);
  };



  return (
    <div className="min-h-screen w-full bg-[#07090e] text-[#f1f5f9] flex flex-col justify-between relative overflow-hidden font-sans selection:bg-[#22d3ee]/20 selection:text-[#22d3ee]">
      {/* Dynamic ambient cyber glow backdrops */}
      <div className="absolute top-[-15%] left-[20%] w-[600px] h-[600px] bg-[#22d3ee]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[15%] w-[550px] h-[550px] bg-[#6366f1]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#1f293d_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      {/* Top Bar Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2.5 group transition-transform hover:scale-[1.02]"
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#22d3ee]/20 to-[#6366f1]/20 border border-[#22d3ee]/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            <Shield className="w-5 h-5 text-[#22d3ee] transition-colors group-hover:text-white" />
          </div>
          <div>
            <span className="font-['Space_Grotesk'] font-bold text-base tracking-wider bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              NOVA AI
            </span>
            <span className="block text-[9px] font-mono tracking-widest text-[#22d3ee]">
              OVERSEER GATEWAY
            </span>
          </div>
        </Link>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1322] border border-[#1e293b] text-xs font-medium text-slate-400 hover:text-white hover:border-[#22d3ee]/40 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Platform</span>
        </Link>
      </header>

      {/* Main Authentication Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Card Wrapper with Glassmorphism */}
          <div className="relative rounded-2xl bg-[#0c101b]/85 border border-[#1f293d] shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-2xl p-6 sm:p-8">
            {/* Top Accent Light Bar */}
            <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#22d3ee] to-transparent opacity-80" />

            {/* Shield Emblem & Title */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-b from-[#22d3ee]/15 to-[#0e1626] border border-[#22d3ee]/30 shadow-[0_0_30px_rgba(34,211,238,0.25)] mb-3">
                {isSuccess ? (
                  <ShieldCheck className="w-7 h-7 text-[#10b981] animate-bounce" />
                ) : (
                  <Lock className="w-7 h-7 text-[#22d3ee]" />
                )}
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#22d3ee]/10 border border-[#22d3ee]/30 text-[10px] font-mono font-semibold text-[#22d3ee] mb-2 tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22d3ee] animate-pulse" />
                CLEARANCE LEVEL 5 &middot; ROOT ACCESS
              </div>

              <h2 className="font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-white">
                Admin Authentication
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter your administrative clearance credentials to access the
                Nova AI Overseer Command Center.
              </p>
            </div>

            {/* Error Banner */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="rounded-xl bg-rose-950/50 border border-rose-500/40 p-3 flex items-start gap-2.5 text-xs text-rose-300"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1 font-sans">{errorMessage}</div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Banner */}
            <AnimatePresence>
              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-xl bg-emerald-950/60 border border-emerald-500/40 p-3 mb-4 flex items-center gap-2.5 text-xs text-emerald-300 font-mono"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>CLEARANCE APPROVED &middot; LAUNCHING CONSOLE...</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                  ADMIN USERNAME / EMAIL
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter admin email or username"
                    autoComplete="username"
                    required
                    className="bg-[#070b13] border-[#1e293b] focus:border-[#22d3ee] focus:ring-1 focus:ring-[#22d3ee] text-slate-100 placeholder:text-slate-600 text-sm h-11 pr-4 pl-3.5 transition-colors font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono font-medium text-slate-300">
                    CLEARANCE SECURITY KEY
                  </label>
                  <span className="text-[10px] font-mono text-slate-500">
                    PROTECTED
                  </span>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter security key"
                    autoComplete="current-password"
                    required
                    className="bg-[#070b13] border-[#1e293b] focus:border-[#22d3ee] focus:ring-1 focus:ring-[#22d3ee] text-slate-100 placeholder:text-slate-600 text-sm h-11 pr-10 pl-3.5 transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                    title={showPassword ? "Hide key" : "Show key"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-[#070b13] border-[#1e293b] text-[#22d3ee] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-xs text-slate-400 font-sans">
                    Remember clearance session
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || isSuccess}
                className="w-full h-11 bg-gradient-to-r from-[#22d3ee] via-[#06b6d4] to-[#0ea5e9] hover:from-[#22d3ee]/90 hover:to-[#0ea5e9]/90 text-[#030712] font-semibold text-sm rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <>
                    <Cpu className="w-4 h-4 animate-spin" />
                    <span>Verifying Clearance...</span>
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Authorized</span>
                  </>
                ) : (
                  <>
                    <span>Enter Overseer Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>


          </div>

          {/* Security Notice */}
          <div className="mt-4 text-center">
            <p className="text-[11px] font-mono text-slate-500 flex items-center justify-center gap-1.5">
              <Terminal className="w-3 h-3 text-slate-600" />
              <span>TLS 1.3 &middot; SHA-256 HANDSHAKE &middot; ROOT PRIVILEGES</span>
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-4 text-center text-xs text-slate-600 font-mono">
        Nova AI Overseer Platform &copy; {new Date().getFullYear()} &middot; All Subsystems Monitored
      </footer>
    </div>
  );
}
