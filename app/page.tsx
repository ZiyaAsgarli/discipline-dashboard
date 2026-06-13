import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Discipline Dashboard — RPG Career & Discipline Tracker",
  description: "Full-stack RPG-based discipline, career tracking, and analytics dashboard built with Next.js, Supabase, and PostgreSQL.",
};

const GITHUB_URL = "https://github.com/ZiyaAsgarli/discipline-dashboard";
const CASE_STUDY_URL = "https://github.com/ZiyaAsgarli/discipline-dashboard/blob/main/CASE_STUDY.md";
const DASHBOARD_URL = "/dashboard";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#07080a] text-zinc-100 font-sans selection:bg-[#39ff88]/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#07080a]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#39ff88] text-black font-bold text-lg">
              D
            </div>
            <span className="font-semibold tracking-widest text-sm uppercase text-white hidden sm:block">
              Discipline
            </span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 text-sm font-medium">
            <Link href="#features" className="text-zinc-400 hover:text-white transition hidden sm:block">Features</Link>
            <Link href="#architecture" className="text-zinc-400 hover:text-white transition hidden sm:block">Architecture</Link>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition">
              GitHub
            </a>
            <Link
              href={DASHBOARD_URL}
              className="rounded-md bg-white/10 px-4 py-2 text-white hover:bg-white/20 transition"
            >
              Open Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 sm:pt-32 sm:pb-24">
        {/* Hero Section */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-6">
            Discipline <span className="text-[#39ff88]">Dashboard</span>
          </h1>
          <p className="text-xl sm:text-2xl text-zinc-400 font-medium mb-4">
            RPG-Based Career & Discipline Tracking System
          </p>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-zinc-500 mb-10 leading-relaxed">
            A full-stack personal operating system for tracking daily discipline, strategic career goals, XP progression, streaks, and analytics-backed growth.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={DASHBOARD_URL}
              className="w-full sm:w-auto rounded-lg bg-[#39ff88] px-8 py-4 text-center font-bold text-black hover:bg-[#2ce073] transition shadow-[0_0_30px_rgba(57,255,136,0.3)]"
            >
              Open Dashboard
            </Link>
            <a
              href={CASE_STUDY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto rounded-lg border border-white/10 bg-white/5 px-8 py-4 text-center font-bold text-white hover:bg-white/10 transition"
            >
              View Case Study
            </a>
          </div>

          {/* Static Preview Card */}
          <div className="mt-16 sm:mt-24 mx-auto max-w-4xl relative">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-b from-[#39ff88]/20 to-transparent blur-2xl opacity-50"></div>
            <div className="relative rounded-xl border border-white/10 bg-[#101217] p-6 text-left shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Novice</h3>
                  <p className="text-sm text-zinc-500 uppercase tracking-widest mt-1">Level 1</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-[#39ff88]">350 XP</span>
                  <p className="text-sm text-zinc-500 mt-1">/ 1000 XP</p>
                </div>
              </div>
              <div className="h-3 w-full rounded-full bg-black/50 mb-8 border border-white/5 overflow-hidden">
                <div className="h-full bg-[#39ff88] w-[35%] shadow-[0_0_12px_rgba(57,255,136,0.5)]"></div>
              </div>
              <div className="grid grid-cols-7 gap-2 sm:gap-3 opacity-60">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div key={i} className={`h-8 sm:h-12 rounded-md border ${i < 5 ? 'border-[#39ff88]/50 bg-[#39ff88] shadow-[0_0_10px_rgba(57,255,136,0.2)]' : 'border-white/5 bg-white/[0.02]'}`}></div>
                ))}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#101217] via-transparent to-transparent"></div>
            </div>
          </div>
        </section>

        {/* Product Overview */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">More Than a To-Do List</h2>
            <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
              Traditional to-do apps focus on task completion. Discipline Dashboard focuses on long-term career compounding, daily habits, and visible skill progression.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { title: "Daily Execution", desc: "Build momentum with the 180-day grid. Check in daily to build streaks and earn baseline XP." },
              { title: "Strategic Work", desc: "Manage career, portfolio, and high-value projects with a task manager that rewards focused effort." },
              { title: "RPG Progression", desc: "Turn hard work into measurable stats. Level up, earn dynamic titles, and review your audit trail." }
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-white/5 bg-[#101217] p-6 hover:border-white/10 transition">
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Core Features */}
        <section id="features" className="mx-auto max-w-6xl px-4 sm:px-6 mt-32">
          <h2 className="text-3xl font-bold text-white mb-10">Core Features</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              "180-Day Discipline Grid",
              "Daily Check-in + XP rewards",
              "RPG Level System",
              "Strategic Tasks Manager",
              "XP Activity Audit Trail",
              "Weekly & Monthly Analytics",
              "Streak Tracking",
              "PWA Install Support"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-white/5 bg-[#14161c] p-4">
                <div className="h-2 w-2 rounded-full bg-[#39ff88]"></div>
                <span className="text-sm font-medium text-zinc-200">{feature}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Architecture & Database */}
        <section id="architecture" className="mx-auto max-w-6xl px-4 sm:px-6 mt-32">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Technical Stack</h2>
              <p className="text-zinc-400 mb-8">Built for speed, security, and mobile-first responsiveness.</p>
              <div className="flex flex-wrap gap-3">
                {["Next.js App Router", "TypeScript", "Tailwind CSS", "Supabase Auth", "PostgreSQL", "Row Level Security", "Vercel", "PWA"].map((tech, i) => (
                  <span key={i} className="rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Data & Security</h2>
              <p className="text-zinc-400 mb-6">
                The database is built on Supabase PostgreSQL with strict Row Level Security (RLS). Every query is scoped via <code>auth.uid()</code>, ensuring a secure multi-user architecture.
              </p>
              <div className="space-y-3">
                {[
                  { table: "profiles", desc: "User stats, total XP, and start dates" },
                  { table: "daily_checkins", desc: "180-day grid records" },
                  { table: "strategic_tasks", desc: "Long-term goals & XP rewards" },
                  { table: "xp_events", desc: "Immutable XP audit trail" }
                ].map((db, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 rounded-lg border border-white/5 bg-[#14161c] p-4">
                    <span className="text-sm font-mono text-[#39ff88]">{db.table}</span>
                    <span className="text-sm text-zinc-500 hidden sm:inline">-</span>
                    <span className="text-sm text-zinc-400">{db.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Analytics & BI / PWA */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-32">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="rounded-xl border border-[#39ff88]/10 bg-[#101217] p-8">
              <h3 className="text-xl font-bold text-white mb-4">Analytics & BI Value</h3>
              <p className="text-zinc-400 mb-6 text-sm leading-relaxed">
                Demonstrating data-driven product thinking, the app aggregates raw tables into powerful BI metrics: completion rates, XP by source, weekly trends, and monthly overviews.
              </p>
            </div>
            <div className="rounded-xl border border-white/5 bg-[#101217] p-8">
              <h3 className="text-xl font-bold text-white mb-4">Premium Mobile App Experience</h3>
              <p className="text-zinc-400 mb-6 text-sm leading-relaxed">
                Featuring a mobile-first premium UI, compact stats, and full PWA support. Install it directly to your home screen for a standalone, immersive habit-tracker experience.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 mt-32 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">Ready to Level Up?</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={DASHBOARD_URL}
              className="w-full sm:w-auto rounded-lg bg-[#39ff88] px-8 py-4 text-center font-bold text-black hover:bg-[#2ce073] transition"
            >
              Open Dashboard
            </Link>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto rounded-lg border border-white/10 bg-white/5 px-8 py-4 text-center font-bold text-white hover:bg-white/10 transition"
            >
              View GitHub Repo
            </a>
            <a
              href={CASE_STUDY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto rounded-lg border border-white/10 bg-white/5 px-8 py-4 text-center font-bold text-white hover:bg-white/10 transition"
            >
              Read Case Study
            </a>
          </div>
        </section>

      </div>
    </main>
  );
}
