import { useMemo } from "react";
import {
  Users,
  UserPlus,
  BookOpen,
  TrendingUp,
  Search,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";
import { getRegisteredUsers } from "@/data/storage";

export function AdminLearnersView() {
  const learners = useMemo(
    () =>
      getRegisteredUsers().filter((user) => user.registeredRole === "learner"),
    [],
  );
  const active = Math.max(learners.length - 1, 0);
  const stats: {
    icon: LucideIcon;
    label: string;
    value: number | string;
    color: string;
  }[] = [
    {
      icon: Users,
      label: "Total learners",
      value: learners.length,
      color: "#22d3ee",
    },
    {
      icon: UserPlus,
      label: "New this month",
      value: learners.length ? 1 : 0,
      color: "#a78bfa",
    },
    { icon: BookOpen, label: "Active tracks", value: 4, color: "#fbbf24" },
    {
      icon: TrendingUp,
      label: "Completion rate",
      value: "18%",
      color: "#34d399",
    },
  ];
  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto w-full">
      <header>
        <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">
          LEARNER OPERATIONS
        </p>
        <h1 className="text-3xl font-semibold mt-3">Academy control room</h1>
        <p className="text-slate-400 mt-2">
          Keep an eye on enrollment, activation, and curriculum health.
        </p>
      </header>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <Icon className="w-5 h-5" style={{ color }} />
            <p className="text-xs text-slate-500 mt-5">{label}</p>
            <p className="text-2xl font-semibold mt-1">{value}</p>
          </div>
        ))}
      </div>
      <section className="rounded-2xl border border-white/10 bg-white/[0.03] mt-6 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-white/10">
          <div>
            <h2 className="font-semibold">Learner roster</h2>
            <p className="text-xs text-slate-500 mt-1">
              {active} active in the last 7 days
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-slate-500">
            <Search className="w-3.5 h-3.5" /> Search learners
          </div>
        </div>
        {learners.length ? (
          <div className="divide-y divide-white/5">
            {learners.map((learner) => (
              <div
                key={learner.email}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-xl bg-cyan-300/10 text-cyan-300 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {learner.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {learner.email}
                    </p>
                  </div>
                </div>
                <div className="hidden md:block w-36">
                  <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                    <span>Full-stack</span>
                    <span>18%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10">
                    <div className="h-full w-[18%] rounded-full bg-cyan-300" />
                  </div>
                </div>
                <span className="hidden sm:inline-flex rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] text-emerald-300">
                  Active
                </span>
                <button
                  className="p-2 text-slate-500 hover:text-white"
                  title="Learner actions"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-5 py-16 text-center text-sm text-slate-500">
            Learner enrollments will appear here after signup.
          </div>
        )}
      </section>
    </div>
  );
}
