import type { WeeklyCompletionData } from "./types";

export function WeeklyCompletionAnalytics({
  last7DaysCompletion,
  weeklyCompletedCount,
}: {
  last7DaysCompletion: WeeklyCompletionData[];
  weeklyCompletedCount: number;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-[#101217] p-4 shadow-sm md:p-6">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#39ff88] md:text-xs">
        Weekly Completion
      </p>

      <div className="mt-4 flex flex-col gap-3 md:mt-5 md:gap-4">
        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {last7DaysCompletion.map((day) => (
            <div
              key={day.fullDate}
              className="flex flex-col items-center gap-1 md:gap-2"
            >
              <div
                className={`flex h-8 w-full items-center justify-center rounded-md border text-xs font-bold transition-all md:h-10 md:text-sm ${
                  day.completed
                    ? "border-[#7cffaa]/70 bg-[#39ff88] text-black shadow-[0_0_12px_rgba(57,255,136,0.3)]"
                    : "border-red-950/50 bg-[#451117] text-rose-500/40"
                }`}
                title={day.fullDate}
              >
                {day.completed ? "✓" : "✗"}
              </div>
              <span className="text-[8px] font-medium uppercase tracking-widest text-zinc-500 md:text-[10px]">
                {day.dateLabel}
              </span>
            </div>
          ))}
        </div>
        <p className="text-center text-xs font-medium text-zinc-400 md:text-sm">
          {weeklyCompletedCount} / 7 days completed
        </p>
      </div>
    </div>
  );
}
