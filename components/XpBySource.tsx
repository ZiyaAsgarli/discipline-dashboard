import type { XpSourceData } from "./types";
import type { translations } from "@/lib/i18n/translations";

export function XpBySource({
  xpSourceData,
  xpSourceLoading,
  xpSourceError,
  t,
}: {
  xpSourceData: XpSourceData;
  xpSourceLoading: boolean;
  xpSourceError: string;
  t: typeof translations.en.app;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-[#101217] p-4 shadow-sm md:p-6">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#39ff88] md:text-xs">
        {t.xpBySource}
      </p>

      <div className="mt-4 space-y-2 md:mt-5 md:space-y-3">
        {xpSourceLoading ? (
          <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 text-xs text-zinc-400 md:p-4 md:text-sm">
            ...
          </div>
        ) : xpSourceError ? (
          <div className="rounded-lg border border-rose-400/30 bg-rose-500/10 p-3 text-xs text-rose-100 md:p-4 md:text-sm">
            {xpSourceError}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between rounded-lg border border-white/5 bg-[#14161c] p-3 md:p-4">
              <span className="text-xs font-medium text-zinc-300 md:text-sm">
                {t.dailyCheckins}
              </span>
              <span className="text-sm font-bold text-[#39ff88] md:text-lg">
                {xpSourceData.daily_checkin} XP
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/5 bg-[#14161c] p-3 md:p-4">
              <span className="text-xs font-medium text-zinc-300 md:text-sm">
                {t.strategicTasks}
              </span>
              <span className="text-sm font-bold text-[#39ff88] md:text-lg">
                {xpSourceData.strategic_task} XP
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/5 bg-[#14161c] p-3 md:p-4">
              <span className="text-xs font-medium text-zinc-300 md:text-sm">
                {t.manualAdjustments}
              </span>
              <span className="text-sm font-bold text-[#39ff88] md:text-lg">
                {xpSourceData.manual_adjustment} XP
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
