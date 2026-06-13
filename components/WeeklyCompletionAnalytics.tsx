import type { WeeklyCompletionData } from "./types";

export function WeeklyCompletionAnalytics({
  last7DaysCompletion,
  weeklyCompletedCount,
}: {
  last7DaysCompletion: WeeklyCompletionData[];
  weeklyCompletedCount: number;
}) {
  return (
    <div className="rounded-lg border border-[#39ff88]/15 bg-[#101116] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39ff88]">
        Weekly Completion Analytics
      </p>
      <p className="mt-2 text-sm text-zinc-400">
        Daily completion status for the last 7 days.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        <div className="grid grid-cols-7 gap-2">
          {last7DaysCompletion.map((day) => (
            <div
              key={day.fullDate}
              className="flex flex-col items-center gap-2"
            >
              <div
                className={`flex h-10 w-full items-center justify-center rounded-md border text-sm font-semibold transition-all ${
                  day.completed
                    ? "border-[#7cffaa]/70 bg-[#39ff88] text-black shadow-[0_0_16px_rgba(57,255,136,0.35)]"
                    : "border-red-950/70 bg-[#451117] text-rose-500/50"
                }`}
                title={day.fullDate}
              >
                {day.completed ? "✓" : "✗"}
              </div>
              <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                {day.dateLabel}
              </span>
            </div>
          ))}
        </div>
        <p className="text-center text-sm font-medium text-zinc-300">
          {weeklyCompletedCount} / 7 days completed
        </p>
      </div>
    </div>
  );
}
