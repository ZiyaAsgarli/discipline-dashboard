

export function DisciplineGrid({
  dailyCheckinsLoading,
  completedCheckinDays,
  checkinLoading,
  checkinMessage,
  checkinMessageType,
  onCompleteToday,
}: {
  dailyCheckinsLoading: boolean;
  completedCheckinDays: Set<number>;
  checkinLoading: boolean;
  checkinMessage: string;
  checkinMessageType: "success" | "error" | "info";
  onCompleteToday: () => void;
}) {
  return (
    <section className="mt-8 rounded-lg border border-white/10 bg-[#101217] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.25)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Campaign Execution
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Every day is a stat point. Don&apos;t miss.
          </p>
        </div>
        <button
          className="shrink-0 rounded-md border border-[#39ff88]/40 bg-[#39ff88] px-5 py-3 text-sm font-semibold text-black shadow-[0_0_20px_rgba(57,255,136,0.3)] transition hover:bg-[#7cffaa] hover:shadow-[0_0_30px_rgba(57,255,136,0.4)] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={dailyCheckinsLoading || checkinLoading}
          onClick={onCompleteToday}
          type="button"
        >
          {checkinLoading ? "Processing..." : "Complete Today"}
        </button>
      </div>

      {checkinMessage ? (
        <div
          className={`mt-5 rounded-md border px-4 py-3 text-sm ${
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

      <div className="mt-8">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(20px,1fr))] gap-[6px]">
          {Array.from({ length: 180 }).map((_, index) => {
            const dayNum = index + 1;
            const isCompleted = completedCheckinDays.has(dayNum);
            return (
              <div
                className={`aspect-square rounded-[3px] border transition-colors ${
                  dailyCheckinsLoading
                    ? "border-white/5 bg-white/5 animate-pulse"
                    : isCompleted
                      ? "border-[#7cffaa]/70 bg-[#39ff88] shadow-[0_0_12px_rgba(57,255,136,0.25)]"
                      : "border-white/10 bg-[#14161c]"
                }`}
                key={dayNum}
                title={`Day ${dayNum}${isCompleted ? " (Completed)" : ""}`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
