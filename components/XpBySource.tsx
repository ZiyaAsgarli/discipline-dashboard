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
    <div className="rounded-lg border border-[#39ff88]/15 bg-[#101116] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39ff88]">
        XP by Source
      </p>
      <p className="mt-2 text-sm text-zinc-400">
        Lifetime XP breakdown by category.
      </p>

      <div className="mt-6 space-y-3">
        {xpSourceLoading ? (
          <div className="rounded-md border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-400">
            Loading XP sources...
          </div>
        ) : xpSourceError ? (
          <div className="rounded-md border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {xpSourceError}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between rounded-md border border-white/10 bg-[#14161c] p-4">
              <span className="text-sm font-medium text-zinc-300">
                Daily Check-ins
              </span>
              <span className="text-lg font-semibold text-[#39ff88]">
                {xpSourceData.daily_checkin} XP
              </span>
            </div>
            <div className="flex items-center justify-between rounded-md border border-white/10 bg-[#14161c] p-4">
              <span className="text-sm font-medium text-zinc-300">
                Strategic Tasks
              </span>
              <span className="text-lg font-semibold text-[#39ff88]">
                {xpSourceData.strategic_task} XP
              </span>
            </div>
            <div className="flex items-center justify-between rounded-md border border-white/10 bg-[#14161c] p-4">
              <span className="text-sm font-medium text-zinc-300">
                Manual Adjustments
              </span>
              <span className="text-lg font-semibold text-[#39ff88]">
                {xpSourceData.manual_adjustment} XP
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
