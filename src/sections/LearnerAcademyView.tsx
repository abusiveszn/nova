import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/state/AppContext";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Code2,
  ExternalLink,
  Play,
  Sparkles,
  Terminal,
} from "lucide-react";
import type { TabId } from "@/types";

type Track = {
  id: string;
  name: string;
  description: string;
  color: string;
  lessons: number;
  duration: string;
};

const tracks: Track[] = [
  {
    id: "fullstack",
    name: "Full-stack developer",
    description: "Build complete products from interface to database.",
    color: "#22d3ee",
    lessons: 42,
    duration: "12 weeks",
  },
  {
    id: "backend",
    name: "Backend engineer",
    description: "Design APIs, services, and reliable data systems.",
    color: "#a78bfa",
    lessons: 36,
    duration: "10 weeks",
  },
  {
    id: "frontend",
    name: "Frontend engineer",
    description: "Turn ideas into polished, responsive web experiences.",
    color: "#fbbf24",
    lessons: 34,
    duration: "9 weeks",
  },
  {
    id: "design",
    name: "Product designer",
    description: "Learn visual systems, UX thinking, and prototyping.",
    color: "#fb7185",
    lessons: 28,
    duration: "8 weeks",
  },
];

const lessons = [
  {
    title: "How the web works",
    type: "Read",
    source: "W3Schools · HTML",
    complete: true,
  },
  {
    title: "Your first semantic page",
    type: "Build",
    source: "W3Schools · HTML",
    complete: true,
  },
  {
    title: "Style a product card",
    type: "Practice",
    source: "W3Schools · CSS",
    complete: false,
  },
  {
    title: "Make it interactive",
    type: "Challenge",
    source: "W3Schools · JavaScript",
    complete: false,
  },
];

interface LearnerAcademyViewProps {
  activeTab: TabId;
}

export function LearnerAcademyView({ activeTab }: LearnerAcademyViewProps) {
  const { state } = useApp();
  const [selectedTrack, setSelectedTrack] = useState("fullstack");
  const [subscribedTracks, setSubscribedTracks] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("nova_learner_tracks") || "[]");
    } catch {
      return [];
    }
  });
  const [selectedLesson, setSelectedLesson] = useState(2);
  const [code, setCode] = useState(
    '<button class="cta">Start learning</button>',
  );
  const track = tracks.find((item) => item.id === selectedTrack) || tracks[0];
  const subscribed = subscribedTracks.includes(selectedTrack);
  const progress = subscribed ? 18 : 0;
  const isLab = activeTab === "learner-lab";
  const isBilling = activeTab === "learner-billing";
  const isCurriculum = activeTab === "learner-curriculum";
  const greeting = state.currentUser?.fullName?.split(" ")[0] || "Learner";
  const output = useMemo(
    () =>
      code.includes("button")
        ? "Button rendered successfully"
        : "Add a button element to see it here",
    [code],
  );

  useEffect(() => {
    localStorage.setItem(
      "nova_learner_tracks",
      JSON.stringify(subscribedTracks),
    );
  }, [subscribedTracks]);

  const toggleSubscription = (trackId: string) => {
    setSubscribedTracks((current) =>
      current.includes(trackId)
        ? current.filter((id) => id !== trackId)
        : [...current, trackId],
    );
  };

  if (isCurriculum) {
    const subscribedCourses = tracks.filter((item) =>
      subscribedTracks.includes(item.id),
    );
    return (
      <div className="p-6 lg:p-10 max-w-[1400px] mx-auto w-full">
        <Header
          eyebrow="MY CURRICULUM"
          title="Courses you are learning"
          subtitle="Your subscribed learning paths, lesson progress, and next steps in one place."
        />
        {subscribedCourses.length === 0 ? (
          <section className="mt-8 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-10 text-center">
            <BookOpen className="w-8 h-8 text-cyan-300 mx-auto" />
            <h2 className="text-xl font-semibold mt-4">
              Your curriculum is empty
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Visit My Academy to choose and subscribe to a course.
            </p>
          </section>
        ) : (
          <div className="grid lg:grid-cols-2 gap-4 mt-8">
            {subscribedCourses.map((course) => (
              <section
                key={course.id}
                className="rounded-2xl border border-white/10 bg-white/[0.035] p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p
                      className="text-xs uppercase tracking-[0.2em]"
                      style={{ color: course.color }}
                    >
                      SUBSCRIBED COURSE
                    </p>
                    <h2 className="text-xl font-semibold mt-2">
                      {course.name}
                    </h2>
                    <p className="text-sm text-slate-400 mt-2">
                      {course.description}
                    </p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-7 mb-2">
                  <span>18% complete</span>
                  <span>8 of {course.lessons} lessons</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div
                    className="h-full w-[18%] rounded-full"
                    style={{ backgroundColor: course.color }}
                  />
                </div>
                <div className="flex items-center justify-between mt-6">
                  <span className="text-xs text-slate-500">
                    Next: HTML foundations
                  </span>
                  <Button
                    size="sm"
                    className="bg-cyan-300 text-slate-950 hover:bg-cyan-200"
                  >
                    Continue <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (isBilling) {
    return (
      <div className="p-6 lg:p-10 max-w-[1200px] mx-auto w-full">
        <Header
          eyebrow="SUBSCRIPTION"
          title="Your learning plan"
          subtitle="One focused path, guided from first principles to portfolio-ready work."
        />
        <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-5 mt-8">
          <section className="rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.06] p-6 lg:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
                  Current path
                </p>
                <h2 className="text-2xl font-semibold mt-2">{track.name}</h2>
                <p className="text-slate-400 mt-2">{track.description}</p>
              </div>
              <Sparkles className="text-cyan-300" />
            </div>
            <div className="grid grid-cols-3 gap-3 mt-8">
              <Metric
                label="Plan"
                value={subscribed ? "Active" : "Not started"}
              />
              <Metric
                label="Next charge"
                value={subscribed ? "$29 / mo" : "--"}
              />
              <Metric label="Renewal" value={subscribed ? "Monthly" : "--"} />
            </div>
            <Button
              onClick={() => toggleSubscription(selectedTrack)}
              className="mt-8 bg-cyan-300 text-slate-950 hover:bg-cyan-200"
            >
              {subscribed
                ? "Unsubscribe from course"
                : "Subscribe for $29 / month"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </section>
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Included
            </p>
            <div className="space-y-4 mt-5">
              {[
                "Structured W3Schools curriculum",
                "Interactive Code Lab",
                "Progress checkpoints",
                "Portfolio projects",
              ].map((item) => (
                <div key={item} className="flex gap-3 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400" />
                  {item}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (isLab) {
    return (
      <div className="p-6 lg:p-10 max-w-[1400px] mx-auto w-full">
        <Header
          eyebrow="CODE LAB / LESSON 03"
          title="Style a product card"
          subtitle="Write a little code, run it, and learn by seeing the result immediately."
        />
        <div className="grid xl:grid-cols-[0.9fr_1.1fr] gap-5 mt-8">
          <section className="rounded-2xl border border-white/10 bg-[#0c111b] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Code2 className="w-4 h-4 text-cyan-300" /> index.html
              </div>
              <Button
                size="sm"
                onClick={() => setCode(code)}
                className="bg-emerald-400 text-slate-950 hover:bg-emerald-300"
              >
                <Play className="w-3.5 h-3.5 mr-1.5" />
                Run
              </Button>
            </div>
            <textarea
              value={code}
              onChange={(event) => setCode(event.target.value)}
              spellCheck={false}
              className="w-full min-h-[310px] resize-none bg-[#080b12] p-5 font-mono text-sm leading-7 text-cyan-100 outline-none"
            />
          </section>
          <section className="rounded-2xl border border-white/10 bg-[#101722] overflow-hidden">
            <div className="px-5 py-4 border-b border-white/10 flex items-center gap-2 text-sm">
              <Terminal className="w-4 h-4 text-amber-300" /> Preview console
            </div>
            <div className="p-6 min-h-[310px]">
              <div className="rounded-xl bg-white p-8 text-slate-900 min-h-[160px] flex items-center justify-center">
                <button className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
                  {code.includes("button") ? "Start learning" : "Preview"}
                </button>
              </div>
              <p className="font-mono text-xs text-emerald-300 mt-5">
                $ {output}
              </p>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto w-full">
      <Header
        eyebrow="NOVA ACADEMY"
        title={`Keep building, ${greeting}.`}
        subtitle="A practical path from your first line of code to work you can show the world."
      />
      <div className="grid xl:grid-cols-[1fr_340px] gap-6 mt-8">
        <main>
          <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 lg:p-8 relative overflow-hidden">
            <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
                  Your next milestone
                </p>
                <h2 className="text-2xl font-semibold mt-2">
                  Build your first responsive page
                </h2>
                <p className="text-slate-400 mt-2 max-w-xl">
                  Finish the CSS practice and unlock your first mini project.
                  Every lesson is paired with a W3Schools reference and a
                  hands-on challenge.
                </p>
              </div>
              <Button
                onClick={() => setSelectedLesson(2)}
                className="bg-cyan-300 text-slate-950 hover:bg-cyan-200 shrink-0"
              >
                Continue lesson <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="mt-8">
              <div className="flex justify-between text-xs text-slate-400 mb-2">
                <span>{progress}% path complete</span>
                <span>Week 2 of 12</span>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <div
                  style={{ width: `${progress}%` }}
                  className="h-full rounded-full bg-cyan-300"
                />
              </div>
            </div>
          </section>
          <div className="flex items-center justify-between mt-9 mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Choose your path
              </p>
              <h2 className="text-xl font-semibold mt-1">
                What do you want to make?
              </h2>
            </div>
            <span className="text-xs text-slate-500">
              {tracks.length} tracks
            </span>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {tracks.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedTrack(item.id)}
                className={`text-left rounded-xl border p-5 transition ${selectedTrack === item.id ? "border-cyan-300/60 bg-cyan-300/[0.08]" : "border-white/10 bg-white/[0.02] hover:border-white/25"}`}
              >
                <div className="flex justify-between">
                  <span style={{ color: item.color }} className="text-2xl">
                    {item.id === "design" ? "*" : "</>"}
                  </span>
                  {selectedTrack === item.id && (
                    <CheckCircle2 className="w-5 h-5 text-cyan-300" />
                  )}
                </div>
                <h3 className="font-semibold mt-5">{item.name}</h3>
                <p className="text-sm text-slate-400 mt-2 min-h-10">
                  {item.description}
                </p>
                <div className="flex gap-4 text-xs text-slate-500 mt-5">
                  <span>{item.lessons} lessons</span>
                  <span>{item.duration}</span>
                </div>
                <span className="mt-5 inline-flex text-xs font-semibold text-cyan-300">
                  {subscribedTracks.includes(item.id)
                    ? "Subscribed"
                    : "View course"}
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </button>
            ))}
          </div>
        </main>
        <aside className="space-y-4">
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">This week</h3>
              <span className="text-xs text-emerald-300">2 / 4 done</span>
            </div>
            <div className="space-y-4 mt-5">
              {lessons.map((lesson, index) => (
                <button
                  key={lesson.title}
                  onClick={() => setSelectedLesson(index)}
                  className={`w-full text-left flex gap-3 ${selectedLesson === index ? "text-white" : "text-slate-400"}`}
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border ${lesson.complete ? "border-emerald-400 bg-emerald-400/10 text-emerald-300" : selectedLesson === index ? "border-cyan-300 text-cyan-300" : "border-white/20"}`}
                  >
                    {lesson.complete ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <span>
                    <span className="block text-sm font-medium">
                      {lesson.title}
                    </span>
                    <span className="block text-xs text-slate-500 mt-1">
                      {lesson.type} · {lesson.source}
                    </span>
                  </span>
                </button>
              ))}
            </div>
            <a
              href="https://www.w3schools.com/"
              target="_blank"
              rel="noreferrer"
              className="mt-6 flex items-center gap-2 text-xs text-cyan-300 hover:text-cyan-200"
            >
              Open W3Schools reference <ExternalLink className="w-3 h-3" />
            </a>
          </section>
          <section className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] p-5">
            <BookOpen className="w-5 h-5 text-amber-300" />
            <h3 className="font-semibold mt-4">Small steps compound</h3>
            <p className="text-sm text-slate-400 mt-2">
              Complete one focused lesson today. Your streak starts when you
              ship the first exercise.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Header({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <header>
      <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">
        {eyebrow}
      </p>
      <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight mt-3">
        {title}
      </h1>
      <p className="text-slate-400 mt-3 max-w-2xl">{subtitle}</p>
    </header>
  );
}
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
      <p className="text-[10px] uppercase tracking-widest text-slate-500">
        {label}
      </p>
      <p className="text-sm font-semibold mt-2">{value}</p>
    </div>
  );
}
