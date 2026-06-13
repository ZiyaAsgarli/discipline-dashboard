export function StatCards({
  stats,
}: {
  stats: Array<{ label: string; value: string; detail: string }>;
}) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          className="rounded-lg border border-[#39ff88]/15 bg-[#101217] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
          key={stat.label}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            {stat.label}
          </p>
          <p className="mt-2 text-2xl font-semibold text-white">{stat.value}</p>
          <p className="mt-1 text-xs font-medium text-[#39ff88]">
            {stat.detail}
          </p>
        </div>
      ))}
    </div>
  );
}
