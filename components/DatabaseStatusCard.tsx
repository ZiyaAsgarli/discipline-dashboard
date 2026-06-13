export function DatabaseStatusCard({
  status,
  statusText,
}: {
  status: "loading" | "connected" | "error";
  statusText: string;
}) {
  return (
    <div className="flex items-center gap-2 self-start rounded-full border border-white/10 bg-[#101217] px-3 py-1 shadow-sm md:mt-2">
      <div
        className={`h-1.5 w-1.5 rounded-full ${
          status === "connected"
            ? "animate-pulse bg-[#39ff88] shadow-[0_0_6px_#39ff88]"
            : status === "loading"
              ? "animate-pulse bg-amber-400 shadow-[0_0_6px_#fbbf24]"
              : "bg-rose-500 shadow-[0_0_6px_#f43f5e]"
        }`}
      />
      <p className="text-[10px] font-medium text-zinc-400 md:text-xs">
        DB: <span className="text-zinc-200">{statusText}</span>
      </p>
    </div>
  );
}
