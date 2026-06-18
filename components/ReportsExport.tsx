import type { Profile, DailyCheckin, XpEvent, StrategicTask } from "@/components/types";
import type { translations } from "@/lib/i18n/translations";
import {
  downloadCsv,
  buildDailyCheckinsCsv,
  buildXpEventsCsv,
  buildStrategicTasksCsv,
  buildFullReportCsv,
} from "@/lib/dashboard/export";

function ExportButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg border border-white/5 bg-[#14161c] px-3 py-2.5 text-xs font-medium text-zinc-300 transition hover:border-[#39ff88]/30 hover:bg-[#39ff88]/5 hover:text-white active:scale-[0.98] md:px-4 md:py-3 md:text-sm"
    >
      <svg
        className="h-3.5 w-3.5 shrink-0 text-[#39ff88] md:h-4 md:w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3"
        />
      </svg>
      {label}
    </button>
  );
}

export function ReportsExport({
  profile,
  dailyCheckins,
  xpEvents,
  xpEventsCount,
  strategicTasks,
  analytics,
  t,
}: {
  profile: Profile | null;
  dailyCheckins: DailyCheckin[];
  xpEvents: XpEvent[];
  xpEventsCount: number;
  strategicTasks: StrategicTask[];
  analytics: {
    currentStreak: number;
    longestStreak: number;
    completionRate: number;
    monthlyCompletedDays: number;
    monthlyCompletionRate: number;
    monthlyXpEarned: number;
    monthlyTasksCompleted: number;
  };
  t: typeof translations.en.app;
}) {
  function handleExportCheckins() {
    const csv = buildDailyCheckinsCsv(dailyCheckins);
    downloadCsv("daily_checkins.csv", csv);
  }

  function handleExportXpEvents() {
    const csv = buildXpEventsCsv(xpEvents);
    downloadCsv("xp_events.csv", csv);
  }

  function handleExportTasks() {
    const csv = buildStrategicTasksCsv(strategicTasks);
    downloadCsv("strategic_tasks.csv", csv);
  }

  function handleExportFullReport() {
    const csv = buildFullReportCsv(
      profile,
      dailyCheckins,
      xpEventsCount,
      strategicTasks,
      analytics,
    );
    downloadCsv("full_dashboard_report.csv", csv);
  }

  return (
    <div className="rounded-xl border border-white/5 bg-[#101217] p-4 shadow-sm md:p-6">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#39ff88] md:text-xs">
        {t.reportsExport}
      </p>
      <p className="mt-1.5 text-[10px] leading-relaxed text-zinc-500 md:text-xs">
        {t.reportsExportDesc}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2 md:mt-5 md:gap-3">
        <ExportButton
          label={t.exportCheckins}
          onClick={handleExportCheckins}
        />
        <ExportButton
          label={t.exportXpEvents}
          onClick={handleExportXpEvents}
        />
        <ExportButton
          label={t.exportTasks}
          onClick={handleExportTasks}
        />
        <ExportButton
          label={t.exportFullReport}
          onClick={handleExportFullReport}
        />
      </div>

      <p className="mt-3 text-[9px] text-zinc-600 md:mt-4 md:text-[10px]">
        {t.reportsExportNote}
      </p>
    </div>
  );
}
