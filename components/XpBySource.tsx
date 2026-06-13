import type { XpSourceData } from "./types";

export function XpBySource({
  xpSourceData,
  xpSourceLoading,
  xpSourceError,
}: {
  xpSourceData: XpSourceData;
  xpSourceLoading: boolean;
  xpSourceError: string;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-[#101217] p-4 shadow-sm md:p-6">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#39ff88] md:text-xs">
        XP by Source
      </p>

      <div className="mt-4 space-y-2 md:mt-5 md:space-y-3">
        {xpSourceLoading ? (
          <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 text-xs text-zinc-400 md:p-4 md:text-sm">
            Loading XP sources...
          </div>
        ) : xpSourceError ? (
          <div className="rounded-lg border border-rose-400/30 bg-rose-500/10 p-3 text-xs text-rose-100 md:p-4 md:text-sm">
            {xpSourceError}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between rounded-lg border border-white/5 bg-[#14161c] p-3 md:p-4">
              <span className="text-xs font-medium text-zinc-300 md:text-sm">
                Daily Check-ins
              </span>
              <span className="text-sm font-bold text-[#39ff88] md:text-lg">
                {xpSourceData.daily_checkin} XP
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/5 bg-[#14161c] p-3 md:p-4">
              <span className="text-xs font-medium text-zinc-300 md:text-sm">
                Strategic Tasks
              </span>
              <span className="text-sm font-bold text-[#39ff88] md:text-lg">
                {xpSourceData.strategic_task} XP
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/5 bg-[#14161c] p-3 md:p-4">
              <span className="text-xs font-medium text-zinc-300 md:text-sm">
                Manual Adjustments
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
