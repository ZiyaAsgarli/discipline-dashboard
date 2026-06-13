import type { translations } from "@/lib/i18n/translations";

export function TodayExecutionCard({
  currentLevel,
  currentLevelXp,
  progressPercent,
  profileLoading,
  dailyCheckinsLoading,
  checkinLoading,
  checkinMessage,
  checkinMessageType,
  onCompleteToday,
  t,
}: {
  currentLevel: string;
  currentLevelXp: number;
  progressPercent: number;
  profileLoading: boolean;
  dailyCheckinsLoading: boolean;
  checkinLoading: boolean;
  checkinMessage: string;
  checkinMessageType: "success" | "error" | "info";
  onCompleteToday: () => void;
  t: typeof translations.en.app;
}) {
  return (
    <section className="mt-4 rounded-xl border border-[#39ff88]/30 bg-gradient-to-b from-[#161a22] to-[#101217] p-5 shadow-[0_8px_30px_rgba(57,255,136,0.08)]">
      <div className="flex flex-col gap-4">
        {/* Header and Level Summary */}
        <div>
          <h2 className="text-xl font-bold text-white md:text-2xl">
            {profileLoading ? "..." : currentLevel}
          </h2>
          
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs font-medium text-zinc-400">
              <span>{profileLoading ? "..." : `${currentLevelXp} XP`}</span>
              <span>1000 XP</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/60">
              <div
                className="h-full rounded-full bg-[#39ff88] shadow-[0_0_10px_rgba(57,255,136,0.6)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          className="mt-2 w-full rounded-lg border border-[#39ff88]/50 bg-[#39ff88] py-3.5 text-base font-bold text-black shadow-[0_0_20px_rgba(57,255,136,0.3)] transition hover:bg-[#7cffaa] hover:shadow-[0_0_30px_rgba(57,255,136,0.4)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:text-lg"
          disabled={dailyCheckinsLoading || checkinLoading}
          onClick={onCompleteToday}
          type="button"
        >
          {checkinLoading ? "..." : t.completeToday}
        </button>

        {/* Status Message */}
        {checkinMessage ? (
          <div
            className={`mt-2 rounded-lg border px-3 py-2 text-sm font-medium ${
              checkinMessageType === "success"
                ? "border-[#39ff88]/30 bg-[#39ff88]/10 text-[#baffd2]"
                : checkinMessageType === "error"
                  ? "border-rose-400/30 bg-rose-500/10 text-rose-200"
                  : "border-blue-400/30 bg-blue-500/10 text-blue-200"
            }`}
          >
            {checkinMessage}
          </div>
        ) : null}
      </div>
    </section>
  );
}
