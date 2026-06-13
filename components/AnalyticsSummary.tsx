export function AnalyticsSummary({
  completionRate,
  xpEventsCount,
  activeTasksCount,
  completedTasksCount,
  currentStreak,
  longestStreak,
}: {
  completionRate: number;
  xpEventsCount: number;
  activeTasksCount: number;
  completedTasksCount: number;
  currentStreak: string | number;
  longestStreak: string | number;
}) {
  return (
    <div className="mt-8 rounded-lg border border-white/10 bg-[#101217] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.25)]">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39ff88]">
        Analytics Summary
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <div className="flex flex-col rounded-md border border-white/10 bg-[#14161c] p-4">
          <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">
            Completion Rate
          </span>
          <span className="mt-2 text-xl font-semibold text-white">
            {completionRate}%
          </span>
        </div>
        <div className="flex flex-col rounded-md border border-white/10 bg-[#14161c] p-4">
          <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">
            XP Events
          </span>
          <span className="mt-2 text-xl font-semibold text-[#39ff88]">
            {xpEventsCount}
          </span>
        </div>
        <div className="flex flex-col rounded-md border border-white/10 bg-[#14161c] p-4">
          <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">
            Active Tasks
          </span>
          <span className="mt-2 text-xl font-semibold text-white">
            {activeTasksCount}
          </span>
        </div>
        <div className="flex flex-col rounded-md border border-white/10 bg-[#14161c] p-4">
          <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">
            Completed Tasks
          </span>
          <span className="mt-2 text-xl font-semibold text-white">
            {completedTasksCount}
          </span>
        </div>
        <div className="flex flex-col rounded-md border border-white/10 bg-[#14161c] p-4">
          <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">
            Current Streak
          </span>
          <span className="mt-2 text-xl font-semibold text-white">
            {currentStreak}
          </span>
        </div>
        <div className="flex flex-col rounded-md border border-white/10 bg-[#14161c] p-4">
          <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">
            Longest Streak
          </span>
          <span className="mt-2 text-xl font-semibold text-[#39ff88]">
            {longestStreak}
          </span>
        </div>
      </div>
    </div>
  );
}
