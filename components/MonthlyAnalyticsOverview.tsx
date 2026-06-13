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
    <div className="rounded-lg border border-[#39ff88]/15 bg-[#101116] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39ff88]">
        Monthly Analytics Overview
      </p>
      <p className="mt-2 text-sm text-zinc-400">
        Performance summary for the last 30 days.
      </p>

      <div className="mt-6">
        {monthlyAnalyticsLoading ? (
          <div className="rounded-md border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-400">
            Loading monthly analytics...
          </div>
        ) : monthlyAnalyticsError ? (
          <div className="rounded-md border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {monthlyAnalyticsError}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col rounded-md border border-white/10 bg-[#14161c] p-4">
              <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                Completed Days
              </span>
              <span className="mt-2 text-2xl font-semibold text-white">
                {monthlyCompletedDays}
              </span>
            </div>
            <div className="flex flex-col rounded-md border border-white/10 bg-[#14161c] p-4">
              <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                Completion Rate
              </span>
              <span className="mt-2 text-2xl font-semibold text-[#39ff88]">
                {monthlyCompletionRate}%
              </span>
            </div>
            <div className="flex flex-col rounded-md border border-white/10 bg-[#14161c] p-4">
              <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                XP Earned
              </span>
              <span className="mt-2 text-2xl font-semibold text-[#39ff88]">
                {monthlyXpEarned}
              </span>
            </div>
            <div className="flex flex-col rounded-md border border-white/10 bg-[#14161c] p-4">
              <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                Tasks Completed
              </span>
              <span className="mt-2 text-2xl font-semibold text-white">
                {monthlyTasksCompleted}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
