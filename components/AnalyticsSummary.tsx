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
    <div className="rounded-xl border border-white/5 bg-[#101217] p-4 shadow-sm md:p-6">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#39ff88] md:text-xs">
        Analytics Summary
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 md:mt-6 md:gap-4">
        <div className="flex flex-col rounded-lg border border-white/5 bg-[#14161c] p-3 md:p-4">
          <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 md:text-xs md:tracking-widest">
            Completion Rate
          </span>
          <span className="mt-1 text-lg font-bold text-white md:mt-2 md:text-xl">
            {completionRate}%
          </span>
        </div>
        <div className="flex flex-col rounded-lg border border-white/5 bg-[#14161c] p-3 md:p-4">
          <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 md:text-xs md:tracking-widest">
            XP Events
          </span>
          <span className="mt-1 text-lg font-bold text-[#39ff88] md:mt-2 md:text-xl">
            {xpEventsCount}
          </span>
        </div>
        <div className="flex flex-col rounded-lg border border-white/5 bg-[#14161c] p-3 md:p-4">
          <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 md:text-xs md:tracking-widest">
            Active Tasks
          </span>
          <span className="mt-1 text-lg font-bold text-white md:mt-2 md:text-xl">
            {activeTasksCount}
          </span>
        </div>
        <div className="flex flex-col rounded-lg border border-white/5 bg-[#14161c] p-3 md:p-4">
          <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 md:text-xs md:tracking-widest">
            Completed Tasks
          </span>
          <span className="mt-1 text-lg font-bold text-white md:mt-2 md:text-xl">
            {completedTasksCount}
          </span>
        </div>
        <div className="flex flex-col rounded-lg border border-white/5 bg-[#14161c] p-3 md:p-4">
          <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 md:text-xs md:tracking-widest">
            Current Streak
          </span>
          <span className="mt-1 text-lg font-bold text-white md:mt-2 md:text-xl">
            {currentStreak}
          </span>
        </div>
        <div className="flex flex-col rounded-lg border border-white/5 bg-[#14161c] p-3 md:p-4">
          <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 md:text-xs md:tracking-widest">
            Longest Streak
          </span>
          <span className="mt-1 text-lg font-bold text-[#39ff88] md:mt-2 md:text-xl">
            {longestStreak}
          </span>
        </div>
      </div>
    </div>
  );
}
