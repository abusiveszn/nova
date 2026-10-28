import { useApp } from "@/state/AppContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  FolderPlus,
  Users,
  Zap,
  Briefcase,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
  ArrowRight,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 22,
    },
  },
} as const;

export function CompanyOverview() {
  const { state, dispatch, getProjectMatches, getBuilder } = useApp();
  const company = state.companies.find(
    (c) => c.userId === state.currentUser?.userId,
  );
  if (!company) return null;

  // Company's projects
  const myProjects = state.projects.filter(
    (p) => p.founderId === company.userId,
  );
  const openProjects = myProjects.filter((p) => p.status === "open");

  // Applications for company's projects
  const myApplications = state.applications.filter((a) =>
    myProjects.some((p) => p.id === a.projectId),
  );

  // Recent matches for company's projects
  const myMatches = state.matches.filter((m) =>
    myProjects.some((p) => p.id === m.projectId),
  );
  const pendingApplications = myApplications.filter(
    (application) => application.status === "pending",
  ).length;
  const acceptedApplications = myApplications.filter(
    (application) => application.status === "accepted",
  ).length;
  const responseRate = myApplications.length
    ? Math.round(
        ((myApplications.length - pendingApplications) /
          myApplications.length) *
          100,
      )
    : 0;
  const projectReadiness = myProjects.length
    ? Math.round((openProjects.length / myProjects.length) * 100)
    : 0;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />;
      case "pending":
        return <Clock className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <XCircle className="w-3.5 h-3.5 text-rose-400" />;
    }
  };

  const isInvestor = state.currentUser?.registeredRole === "investor";
  const isEnterprise = state.currentUser?.registeredRole === "enterprise";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-4 lg:p-8 max-w-[1600px] w-full mx-auto px-6 lg:px-10 flex flex-col gap-6"
    >
      {/* Header Panel */}
      <motion.div
        variants={cardVariants}
        className="flex flex-col md:flex-row md:justify-between md:items-end gap-4"
      >
        <div>
          <h1 className="font-['Space_Grotesk'] font-bold text-3xl md:text-4xl text-white mb-2 tracking-tight">
            {isInvestor
              ? "Investor Dealroom"
              : isEnterprise
                ? "Enterprise Command Center"
                : "Founder Workspace"}
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-medium">
            Welcome back, {company.companyName}. You have{" "}
            {isInvestor
              ? `sought matches for ${myProjects.length} strategic proposals.`
              : isEnterprise
                ? `matched ${myMatches.length} talent partners across your projects.`
                : `received ${myApplications.length} proposals from builders.`}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="bg-transparent border-white/5 text-slate-300 hover:bg-white/5 hover:text-white text-xs font-semibold uppercase tracking-wider h-10 px-4 rounded-xl"
            onClick={() => dispatch({ type: "SET_TAB", payload: "applicants" })}
          >
            <Users className="w-4 h-4 mr-2" /> Review Applicants
          </Button>
          <Button
            className="bg-[#22d3ee] hover:bg-[#22d3ee]/90 text-slate-950 text-xs font-semibold uppercase tracking-wider h-10 px-4 rounded-xl"
            onClick={() =>
              dispatch({ type: "SET_TAB", payload: "post-project" })
            }
          >
            <FolderPlus className="w-4 h-4 mr-2" /> Post New Project
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards Grid with Stagger & Hover scale */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-2"
      >
        {/* Card 1: Posted Projects */}
        <motion.div
          variants={cardVariants}
          whileHover={{ scale: 1.02, y: -4 }}
          className="bg-[#131a26]/30 border border-white/5 rounded-2xl p-5 flex flex-col gap-4 transition-all hover:shadow-xl hover:shadow-cyan-500/5 hover:border-cyan-500/20 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-[#22d3ee]/10 flex items-center justify-center text-[#22d3ee]">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <p className="font-['Space_Grotesk'] font-bold text-3xl text-white">
              {myProjects.length}
            </p>
            <span className="text-[9px] font-bold tracking-widest uppercase text-slate-500 mt-1 block">
              Posted Projects
            </span>
          </div>
        </motion.div>

        {/* Card 2: Open Projects */}
        <motion.div
          variants={cardVariants}
          whileHover={{ scale: 1.02, y: -4 }}
          className="bg-[#131a26]/30 border border-white/5 rounded-2xl p-5 flex flex-col gap-4 transition-all hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-500/20 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <p className="font-['Space_Grotesk'] font-bold text-3xl text-white">
              {openProjects.length}
            </p>
            <span className="text-[9px] font-bold tracking-widest uppercase text-slate-500 mt-1 block">
              Open Projects
            </span>
          </div>
        </motion.div>

        {/* Card 3: Total Applicants */}
        <motion.div
          variants={cardVariants}
          whileHover={{ scale: 1.02, y: -4 }}
          className="bg-[#131a26]/30 border border-white/5 rounded-2xl p-5 flex flex-col gap-4 transition-all hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-500/20 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="font-['Space_Grotesk'] font-bold text-3xl text-white">
              {myApplications.length}
            </p>
            <span className="text-[9px] font-bold tracking-widest uppercase text-slate-500 mt-1 block">
              Total Applicants
            </span>
          </div>
        </motion.div>

        {/* Card 4: Matched Builders */}
        <motion.div
          variants={cardVariants}
          whileHover={{ scale: 1.02, y: -4 }}
          className="bg-[#131a26]/30 border border-white/5 rounded-2xl p-5 flex flex-col gap-4 transition-all hover:shadow-xl hover:shadow-rose-500/5 hover:border-rose-500/20 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="font-['Space_Grotesk'] font-bold text-3xl text-white">
              {myMatches.length}
            </p>
            <span className="text-[9px] font-bold tracking-widest uppercase text-slate-500 mt-1 block">
              Matched Builders
            </span>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <motion.div
          variants={cardVariants}
          className="bg-[#131a26]/30 border border-white/5 rounded-2xl p-5"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500">
              Response health
            </span>
            <span className="text-sm font-bold text-emerald-400">
              {responseRate}%
            </span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full"
              style={{ width: `${responseRate}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-3">
            {pendingApplications} applicants waiting for a decision
          </p>
        </motion.div>
        <motion.div
          variants={cardVariants}
          className="bg-[#131a26]/30 border border-white/5 rounded-2xl p-5"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500">
              Project readiness
            </span>
            <span className="text-sm font-bold text-cyan-400">
              {projectReadiness}%
            </span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-400 rounded-full"
              style={{ width: `${projectReadiness}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-3">
            {openProjects.length} of {myProjects.length} projects accepting
            talent
          </p>
        </motion.div>
        <motion.div
          variants={cardVariants}
          className="bg-[#131a26]/30 border border-white/5 rounded-2xl p-5"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500">
              Nova activity
            </span>
            <span className="text-sm font-bold text-indigo-400">
              {state.streak} days
            </span>
          </div>
          <p className="text-sm text-white font-semibold">
            {acceptedApplications} accepted applicants
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Daily activity keeps your matching signals fresh
          </p>
        </motion.div>
      </motion.div>

      {/* Columns Grid */}
      <motion.div
        variants={cardVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Left Column: Your Projects & Top Matches */}
        <div className="bg-[#131a26]/20 border border-white/5 rounded-2xl p-6 flex flex-col">
          <h2 className="font-['Space_Grotesk'] font-bold text-base text-white mb-5 tracking-wide">
            Your Projects & Top Matches
          </h2>
          <div className="space-y-4 flex-1">
            {myProjects.length === 0 ? (
              <div className="h-48 border border-dashed border-white/5 rounded-xl flex items-center justify-center text-slate-500 text-xs">
                No active projects posted
              </div>
            ) : (
              myProjects.map((project) => {
                const matches = getProjectMatches(project.id).slice(0, 3);
                return (
                  <div
                    key={project.id}
                    className="bg-[#131a26]/40 border border-white/5 rounded-xl p-4 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={project.coverImage}
                          alt=""
                          className="w-9 h-9 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-xs text-[#f9fafb]">
                            {project.title}
                          </h3>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {project.category}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[9px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20 capitalize font-semibold"
                      >
                        {project.status}
                      </Badge>
                    </div>

                    {matches.length > 0 ? (
                      <div className="pt-2.5 border-t border-white/5 space-y-2">
                        <span className="text-[9px] font-bold text-slate-500 tracking-wider block uppercase">
                          Matched Builders
                        </span>
                        {matches.map((match) => {
                          const builder = getBuilder(match.builderId);
                          if (!builder) return null;
                          return (
                            <div
                              key={match.id}
                              className="flex items-center justify-between text-xs py-0.5"
                            >
                              <div className="flex items-center gap-2">
                                <img
                                  src={builder.avatarUrl}
                                  alt=""
                                  className="w-5 h-5 rounded-full object-cover"
                                />
                                <span className="text-slate-300 font-medium">
                                  {builder.fullName}
                                </span>
                              </div>
                              <span className="text-[10px] font-mono text-[#22d3ee] bg-[#22d3ee]/5 px-2 py-0.5 rounded border border-[#22d3ee]/10 font-bold">
                                {match.matchScore}% match
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="pt-2 border-t border-white/5 text-[10px] text-slate-500 font-medium">
                        Searching for matching talent...
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
          {myProjects.length > 0 && (
            <Button
              variant="ghost"
              className="w-full mt-4 text-[#9ca3af] hover:text-[#22d3ee] text-[10px] h-9 border-t border-white/5 rounded-none font-semibold"
              onClick={() => dispatch({ type: "SET_TAB", payload: "projects" })}
            >
              View All Matches <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          )}
        </div>

        {/* Right Column: Recent Applicants */}
        <div className="bg-[#131a26]/20 border border-white/5 rounded-2xl p-6 flex flex-col min-h-[350px]">
          <h2 className="font-['Space_Grotesk'] font-bold text-base text-white mb-5 tracking-wide">
            Recent Applicants
          </h2>

          {myApplications.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <span className="text-xs font-semibold text-slate-500 tracking-wide">
                No new applicants
              </span>
              <p className="text-[10px] text-slate-600 mt-1">
                Pending applicant proposals will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5 flex-1 overflow-y-auto max-h-[400px]">
              {myApplications.slice(0, 8).map((app) => {
                const project = state.projects.find(
                  (p) => p.id === app.projectId,
                );
                return (
                  <div
                    key={app.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={app.builderAvatar}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-xs font-semibold text-white">
                          {app.builderName}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {project?.title}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(app.status)}
                      <Badge
                        variant="outline"
                        className={`text-[9px] font-semibold capitalize ${
                          app.status === "pending"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : app.status === "accepted"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        }`}
                      >
                        {app.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
