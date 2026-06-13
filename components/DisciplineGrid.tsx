import type { translations } from "@/lib/i18n/translations";

export function DisciplineGrid({
  dailyCheckinsLoading,
  completedCheckinDays,
  t,
}: {
  dailyCheckinsLoading: boolean;
  completedCheckinDays: Set<number>;
  t: typeof translations.en.app;
}) {
  return (
    <section className="mt-6 rounded-xl border border-white/10 bg-[#101217] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.25)] md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 md:text-xs">
          {t.campaign180}
        </h2>
        <span className="text-xs font-medium text-zinc-500">{completedCheckinDays.size}/180</span>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(12px,1fr))] gap-1 md:grid-cols-[repeat(auto-fill,minmax(16px,1fr))] md:gap-1.5">
        {Array.from({ length: 180 }).map((_, index) => {
          const dayNum = index + 1;
          const isCompleted = completedCheckinDays.has(dayNum);
          return (
            <div
              className={`aspect-square rounded-sm border transition-colors ${
                dailyCheckinsLoading
                  ? "border-white/5 bg-white/5 animate-pulse"
                  : isCompleted
                    ? "border-[#7cffaa]/70 bg-[#39ff88] shadow-[0_0_8px_rgba(57,255,136,0.2)]"
                    : "border-white/5 bg-[#14161c]"
              }`}
              key={dayNum}
              title={`Day ${dayNum}${isCompleted ? " (Completed)" : ""}`}
            />
          );
        })}
      </div>
    </section>
  );
}
