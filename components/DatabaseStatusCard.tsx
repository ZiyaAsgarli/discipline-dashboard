export function DatabaseStatusCard({
  databaseStatusText,
}: {
  databaseStatusText: string;
}) {
  return (
    <div className="mt-8 rounded-lg border border-white/10 bg-[#101217] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.2)]">
      <div className="flex items-center gap-3">
        <div
          className={`h-2.5 w-2.5 rounded-full ${
            databaseStatusText === "Connected"
              ? "animate-pulse bg-[#39ff88] shadow-[0_0_8px_#39ff88]"
              : databaseStatusText === "Checking..."
                ? "animate-pulse bg-amber-400 shadow-[0_0_8px_#fbbf24]"
                : "bg-rose-500 shadow-[0_0_8px_#f43f5e]"
          }`}
        />
        <p className="text-sm font-semibold text-zinc-300">
          Database Status:{" "}
          <span className="text-white">{databaseStatusText}</span>
        </p>
      </div>
    </div>
  );
}
