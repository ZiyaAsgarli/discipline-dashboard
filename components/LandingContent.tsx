"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/useLanguage";
import { LanguageSwitcher } from "./LanguageSwitcher";

const GITHUB_URL = "https://github.com/ZiyaAsgarli/discipline-dashboard";
const CASE_STUDY_URL = "https://github.com/ZiyaAsgarli/discipline-dashboard/blob/main/CASE_STUDY.md";
const DASHBOARD_URL = "/dashboard";

export default function LandingContent() {
  const { language, changeLanguage, t, mounted } = useLanguage();

  if (!mounted) return null; // Avoid hydration mismatch on initial render

  return (
    <main className="min-h-screen bg-[#030712] text-zinc-100 font-sans selection:bg-[#39ff88]/30 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#030712]/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 sm:h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-[#39ff88] text-black font-bold text-sm sm:text-lg">
              D
            </div>
            <span className="font-semibold tracking-widest text-xs sm:text-sm uppercase text-white">
              Discipline
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium">
            <LanguageSwitcher language={language} onLanguageChange={changeLanguage} />
            
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition hidden sm:block">
              {t.landing.github}
            </a>
            <a href={CASE_STUDY_URL} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition hidden sm:block">
              {t.landing.caseStudy}
            </a>
            <Link
              href={DASHBOARD_URL}
              className="rounded-md bg-white/10 px-3 py-1.5 sm:px-4 sm:py-2 text-white hover:bg-white/20 transition"
            >
              {t.landing.openDashboard}
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-20 pb-12 sm:pt-32 sm:pb-24">
        {/* Hero Section */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-4 sm:mb-6">
            {t.landing.heroTitle.split(" ")[0]} <span className="text-[#39ff88]">{t.landing.heroTitle.split(" ")[1] || ""}</span>
          </h1>
          <p className="text-lg sm:text-2xl text-zinc-400 font-medium mb-2">
            {t.landing.heroSubtitle}
          </p>
          <p className="text-sm font-medium text-zinc-500 mb-6 uppercase tracking-widest">
            {t.landing.builtBy} <span className="text-[#39ff88]">Ziya Asgarli</span>
          </p>
          <p className="mx-auto max-w-2xl text-sm sm:text-lg text-zinc-400 mb-8 sm:mb-10 leading-relaxed">
            {t.landing.heroDesc}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8">
            <Link
              href={DASHBOARD_URL}
              className="w-full sm:w-auto rounded-lg bg-[#39ff88] px-6 py-3 sm:px-8 sm:py-4 text-center font-bold text-black hover:bg-[#2ce073] transition shadow-[0_0_25px_rgba(57,255,136,0.25)]"
            >
              {t.landing.openDashboard}
            </Link>
            <a
              href={CASE_STUDY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto rounded-lg border border-white/10 bg-white/5 px-6 py-3 sm:px-8 sm:py-4 text-center font-bold text-white hover:bg-white/10 transition"
            >
              {t.landing.viewCaseStudy}
            </a>
          </div>

          {/* Polished Static Preview Mockup */}
          <div className="mt-12 sm:mt-20 mx-auto max-w-4xl relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-b from-[#39ff88]/20 to-transparent blur-2xl opacity-40"></div>
            
            <div className="relative rounded-2xl border border-white/10 bg-[#0a0d14] p-4 sm:p-6 text-left shadow-2xl overflow-hidden flex flex-col gap-4 sm:gap-6">
              
              {/* Header Profile / XP */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-[#39ff88]/20 to-[#39ff88]/5 flex items-center justify-center border border-[#39ff88]/20">
                    <span className="text-[#39ff88] font-bold text-lg">Z</span>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white leading-none">{t.landing.novice}</h3>
                    <p className="text-xs sm:text-sm text-zinc-500 uppercase tracking-widest mt-1">{t.landing.level} 1</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xl sm:text-2xl font-bold text-[#39ff88]">350 XP</span>
                  <div className="flex items-center justify-end gap-2 mt-1">
                    <div className="h-1.5 w-16 sm:w-24 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#39ff88] w-[35%]"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Execution Block */}
              <div className="rounded-xl border border-[#39ff88]/20 bg-[#39ff88]/5 p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">{t.landing.todaysExecution}</h4>
                  <p className="text-xs text-zinc-400 mt-1">{t.landing.earnXp}</p>
                </div>
                <div className="h-8 sm:h-10 px-4 rounded-lg bg-[#39ff88] text-black font-bold text-xs sm:text-sm flex items-center shadow-[0_0_15px_rgba(57,255,136,0.3)]">
                  {t.app?.completeToday || "Complete Today"}
                </div>
              </div>

              {/* Grid + Analytics Row */}
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <h4 className="text-xs font-bold text-zinc-400 mb-3 uppercase tracking-wider">{t.landing.day180Grid}</h4>
                  <div className="grid grid-cols-10 gap-1.5 opacity-80">
                    {Array.from({ length: 30 }).map((_, i) => (
                      <div key={i} className={`aspect-square rounded-sm ${i < 12 ? 'bg-[#39ff88] shadow-[0_0_5px_rgba(57,255,136,0.3)]' : 'bg-white/5'}`}></div>
                    ))}
                  </div>
                </div>
                
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 flex flex-col justify-between">
                  <h4 className="text-xs font-bold text-zinc-400 mb-3 uppercase tracking-wider">{t.landing.weeklyOutput}</h4>
                  <div className="flex items-end gap-2 h-16 w-full opacity-80">
                    {[40, 70, 30, 90, 50, 100, 60].map((h, i) => (
                      <div key={i} className="flex-1 bg-[#39ff88]/80 rounded-t-sm" style={{ height: `${h}%` }}></div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Product Overview & Features */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-20 sm:mt-32">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">{t.landing.moreThanTodo}</h2>
            <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto">
              {t.landing.moreThanTodoDesc}
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
            {t.landing.features.map((feature, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg border border-white/5 bg-[#101217] p-3">
                <div className="h-1.5 w-1.5 rounded-full bg-[#39ff88] shrink-0"></div>
                <span className="text-xs sm:text-sm font-medium text-zinc-300 leading-tight">{feature}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Architecture & Database */}
        <section id="architecture" className="mx-auto max-w-6xl px-4 sm:px-6 mt-16 sm:mt-24">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
            <div className="rounded-xl border border-white/5 bg-[#0a0d14] p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">{t.landing.techStack}</h2>
              <p className="text-xs sm:text-sm text-zinc-400 mb-6">{t.landing.techStackDesc}</p>
              <div className="flex flex-wrap gap-2">
                {["Next.js", "TypeScript", "Tailwind CSS", "Supabase Auth", "PostgreSQL", "RLS Security", "Vercel", "PWA"].map((tech, i) => (
                  <span key={i} className="rounded-md border border-[#39ff88]/20 bg-[#39ff88]/5 px-3 py-1.5 text-xs font-medium text-[#39ff88]">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="rounded-xl border border-white/5 bg-[#0a0d14] p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">{t.landing.database}</h2>
              <p className="text-xs sm:text-sm text-zinc-400 mb-6">
                {t.landing.databaseDesc}
              </p>
              <div className="space-y-2">
                {[
                  { table: "profiles", desc: t.landing.dbProfiles },
                  { table: "daily_checkins", desc: t.landing.dbGrid },
                  { table: "strategic_tasks", desc: t.landing.dbTasks },
                  { table: "xp_events", desc: t.landing.dbAudit }
                ].map((db, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg bg-white/5 p-3">
                    <span className="text-xs font-mono text-zinc-200">{db.table}</span>
                    <span className="text-xs text-zinc-500 mt-1 sm:mt-0">{db.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Analytics & BI / PWA Experience */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-8 sm:mt-12">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
            <div>
              <h3 className="text-xl font-bold text-white mb-3">{t.landing.analyticsVal}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                {t.landing.analyticsDesc}
              </p>
              <ul className="space-y-2 text-sm text-zinc-500">
                {t.landing.analyticsPoints.map((point, i) => (
                  <li key={i} className="flex items-center gap-2"><div className="w-1 h-1 bg-zinc-600 rounded-full shrink-0"></div> {point}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-white mb-3">{t.landing.mobileVal}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                {t.landing.mobileDesc}
              </p>
              <ul className="space-y-2 text-sm text-zinc-500">
                {t.landing.mobilePoints.map((point, i) => (
                  <li key={i} className="flex items-center gap-2"><div className="w-1 h-1 bg-zinc-600 rounded-full shrink-0"></div> {point}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 mt-20 sm:mt-32 text-center border-t border-white/5 pt-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">{t.landing.readyCTA}</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={DASHBOARD_URL}
              className="w-full sm:w-auto rounded-lg bg-[#39ff88] px-8 py-3 text-center font-bold text-black hover:bg-[#2ce073] transition"
            >
              {t.landing.openDashboard}
            </Link>
            <a
              href={CASE_STUDY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto rounded-lg border border-white/10 bg-white/5 px-8 py-3 text-center font-bold text-white hover:bg-white/10 transition"
            >
              {t.landing.readCaseStudy}
            </a>
          </div>
        </section>

      </div>
      
      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#05070a] py-8 mt-auto">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-[#39ff88]/20 text-[#39ff88] font-bold text-[10px]">
              D
            </div>
            <span>{t.landing.builtBy} <span className="text-[#39ff88] font-medium">Ziya Asgarli</span></span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-zinc-500">
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">{t.landing.github}</a>
            <a href={CASE_STUDY_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">{t.landing.caseStudy}</a>
            <Link href={DASHBOARD_URL} className="hover:text-white transition">{t.landing.openDashboard}</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
