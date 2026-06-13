export function StatCards({
  stats,
}: {
  stats: Array<{ label: string; value: string; detail: string }>;
}) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-3 md:mt-6 md:grid-cols-4 md:gap-4">
      {stats.map((stat) => (
        <div
          className="flex flex-col justify-between rounded-xl border border-white/5 bg-[#101217] p-3 shadow-sm md:p-4"
          key={stat.label}
        >
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 md:text-xs">
            {stat.label}
          </p>
          <p className="mt-1 text-xl font-bold text-white md:mt-2 md:text-2xl">{stat.value}</p>
          <p className="mt-0.5 text-[10px] font-medium text-[#39ff88] md:mt-1 md:text-xs">
            {stat.detail}
          </p>
        </div>
      ))}
    </div>
  );
}
