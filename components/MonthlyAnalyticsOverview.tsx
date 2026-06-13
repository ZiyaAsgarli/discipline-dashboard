export function MonthlyAnalyticsOverview({
  monthlyCompletedDays,
  monthlyCompletionRate,
  monthlyXpEarned,
  monthlyTasksCompleted,
  monthlyAnalyticsLoading,
  monthlyAnalyticsError,
}: {
  monthlyCompletedDays: number;
  monthlyCompletionRate: number;
  monthlyXpEarned: number;
  monthlyTasksCompleted: number;
  monthlyAnalyticsLoading: boolean;
  monthlyAnalyticsError: string;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-[#101217] p-4 shadow-sm md:p-6">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#39ff88] md:text-xs">
        Monthly Analytics
      </p>

      <div className="mt-4 md:mt-5">
        {monthlyAnalyticsLoading ? (
          <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 text-xs text-zinc-400 md:p-4 md:text-sm">
            Loading monthly analytics...
          </div>
        ) : monthlyAnalyticsError ? (
          <div className="rounded-lg border border-rose-400/30 bg-rose-500/10 p-3 text-xs text-rose-100 md:p-4 md:text-sm">
            {monthlyAnalyticsError}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            <div className="flex flex-col rounded-lg border border-white/5 bg-[#14161c] p-3 md:p-4">
              <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 md:text-xs md:tracking-widest">
                Completed Days
              </span>
              <span className="mt-1 text-lg font-bold text-white md:mt-2 md:text-2xl">
                {monthlyCompletedDays}
              </span>
            </div>
            <div className="flex flex-col rounded-lg border border-white/5 bg-[#14161c] p-3 md:p-4">
              <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 md:text-xs md:tracking-widest">
                Completion Rate
              </span>
              <span className="mt-1 text-lg font-bold text-[#39ff88] md:mt-2 md:text-2xl">
                {monthlyCompletionRate}%
              </span>
            </div>
            <div className="flex flex-col rounded-lg border border-white/5 bg-[#14161c] p-3 md:p-4">
              <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 md:text-xs md:tracking-widest">
                XP Earned
              </span>
              <span className="mt-1 text-lg font-bold text-[#39ff88] md:mt-2 md:text-2xl">
                {monthlyXpEarned}
              </span>
            </div>
            <div className="flex flex-col rounded-lg border border-white/5 bg-[#14161c] p-3 md:p-4">
              <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 md:text-xs md:tracking-widest">
                Tasks Completed
              </span>
              <span className="mt-1 text-lg font-bold text-white md:mt-2 md:text-2xl">
                {monthlyTasksCompleted}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
