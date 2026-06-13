import type { translations } from "@/lib/i18n/translations";

export function AnalyticsSummary({
  completionRate,
  xpEventsCount,
  activeTasksCount,
  completedTasksCount,
  currentStreak,
  longestStreak,
  t,
}: {
  completionRate: number;
  xpEventsCount: number;
  activeTasksCount: number;
  completedTasksCount: number;
  currentStreak: string | number;
  longestStreak: string | number;
  t: typeof translations.en.app;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-[#101217] p-4 shadow-sm md:p-6">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#39ff88] md:text-xs">
        {t.analyticsSummary}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 md:mt-6 md:gap-4">
        <div className="flex min-w-0 flex-col rounded-lg border border-white/5 bg-[#14161c] p-3 md:p-4">
          <span className="min-w-0 break-words text-[10px] font-medium uppercase leading-tight tracking-wider text-zinc-500 md:text-xs md:tracking-wider">
            {t.completionRate}
          </span>
          <span className="mt-1 text-lg font-bold text-white md:mt-2 md:text-xl">
            {completionRate}%
          </span>
        </div>
        <div className="flex min-w-0 flex-col rounded-lg border border-white/5 bg-[#14161c] p-3 md:p-4">
          <span className="min-w-0 break-words text-[10px] font-medium uppercase leading-tight tracking-wider text-zinc-500 md:text-xs md:tracking-wider">
            {t.xpEvents}
          </span>
          <span className="mt-1 text-lg font-bold text-[#39ff88] md:mt-2 md:text-xl">
            {xpEventsCount}
          </span>
        </div>
        <div className="flex min-w-0 flex-col rounded-lg border border-white/5 bg-[#14161c] p-3 md:p-4">
          <span className="min-w-0 break-words text-[10px] font-medium uppercase leading-tight tracking-wider text-zinc-500 md:text-xs md:tracking-wider">
            {t.activeTasks}
          </span>
          <span className="mt-1 text-lg font-bold text-white md:mt-2 md:text-xl">
            {activeTasksCount}
          </span>
        </div>
        <div className="flex min-w-0 flex-col rounded-lg border border-white/5 bg-[#14161c] p-3 md:p-4">
          <span className="min-w-0 break-words text-[10px] font-medium uppercase leading-tight tracking-wider text-zinc-500 md:text-xs md:tracking-wider">
            {t.completedTasks}
          </span>
          <span className="mt-1 text-lg font-bold text-white md:mt-2 md:text-xl">
            {completedTasksCount}
          </span>
        </div>
        <div className="flex min-w-0 flex-col rounded-lg border border-white/5 bg-[#14161c] p-3 md:p-4">
          <span className="min-w-0 break-words text-[10px] font-medium uppercase leading-tight tracking-wider text-zinc-500 md:text-xs md:tracking-wider">
            {t.currentStreak}
          </span>
          <span className="mt-1 text-lg font-bold text-white md:mt-2 md:text-xl">
            {currentStreak}
          </span>
        </div>
        <div className="flex min-w-0 flex-col rounded-lg border border-white/5 bg-[#14161c] p-3 md:p-4">
          <span className="min-w-0 break-words text-[10px] font-medium uppercase leading-tight tracking-wider text-zinc-500 md:text-xs md:tracking-wider">
            {t.longestStreak}
          </span>
          <span className="mt-1 text-lg font-bold text-[#39ff88] md:mt-2 md:text-xl">
            {longestStreak}
          </span>
        </div>
      </div>
    </div>
  );
}
