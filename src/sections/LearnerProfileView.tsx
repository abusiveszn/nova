import { useApp } from "@/state/AppContext";
import { BookOpen, CheckCircle2, Clock3, Flame, Trophy } from "lucide-react";

export function LearnerProfileView() {
  const { state } = useApp();
  const learner = state.currentUser;
  const firstName = learner?.fullName?.split(" ")[0] || "Learner";
  const learnerDetails = state.builders.find(
    (builder) => builder.userId === learner?.userId,
  );

  return (
    <div className="p-6 lg:p-10 max-w-[1200px] mx-auto w-full">
      <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">
        LEARNER PROFILE
      </p>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-3">
        <div className="flex items-center gap-4">
          <img
            src={learner?.avatarUrl}
            alt=""
            className="w-20 h-20 rounded-2xl object-cover border border-cyan-300/30"
          />
          <div>
            <h1 className="text-3xl font-semibold">
              {learner?.fullName || "Learner"}
            </h1>
            <p className="text-slate-400 mt-2">{learner?.email}</p>
            <p className="text-xs text-cyan-300 mt-2 uppercase tracking-widest">
              Nova Academy learner
            </p>
          </div>
        </div>
        <button className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5">
          Edit profile
        </button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <ProfileMetric icon={BookOpen} label="Courses subscribed" value="1" />
        <ProfileMetric
          icon={CheckCircle2}
          label="Lessons completed"
          value="8"
        />
        <ProfileMetric icon={Clock3} label="Learning hours" value="12.5" />
        <ProfileMetric icon={Flame} label="Current streak" value="4 days" />
      </div>
      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-5 mt-6">
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            <Trophy className="w-5 h-5 text-amber-300" />
            <h2 className="font-semibold">Your learning progress</h2>
          </div>
          <div className="mt-7">
            <div className="flex justify-between text-sm">
              <span>Full-stack developer</span>
              <span className="text-cyan-300">18%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 mt-3">
              <div className="h-full w-[18%] rounded-full bg-cyan-300" />
            </div>
            <p className="text-xs text-slate-500 mt-3">
              You are currently in HTML and CSS foundations.
            </p>
          </div>
        </section>
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="font-semibold">About {firstName}</h2>
          <p className="text-sm text-slate-400 mt-4">
            {learnerDetails?.bio ||
              "Tell the Nova Academy community what you are learning and what you want to build."}
          </p>
          <div className="mt-6 pt-5 border-t border-white/10">
            <p className="text-xs uppercase tracking-widest text-slate-500">
              Member since
            </p>
            <p className="text-sm mt-2">
              {learner?.createdAt
                ? new Date(learner.createdAt).toLocaleDateString()
                : "Recently joined"}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function ProfileMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof BookOpen;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <Icon className="w-5 h-5 text-cyan-300" />
      <p className="text-xs text-slate-500 mt-5">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}
