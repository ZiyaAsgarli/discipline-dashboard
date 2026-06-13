export function RpgProgress({
  currentLevel,
  currentLevelXp,
  progressPercent,
  profileLoading,
}: {
  currentLevel: string;
  currentLevelXp: number;
  progressPercent: number;
  profileLoading: boolean;
}) {
  return (
    <div className="rounded-lg border border-[#39ff88]/20 bg-[#101217] p-6 shadow-[0_0_40px_rgba(57,255,136,0.06)]">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39ff88]">
        RPG Progress
      </p>
      <h2 className="mt-3 text-3xl font-semibold text-white">
        {currentLevel}
      </h2>
      <div className="mt-6">
        <div className="flex items-center justify-between text-sm text-zinc-400">
          <span>{profileLoading ? "Loading..." : `${currentLevelXp} XP`}</span>
          <span>1000 XP</span>
        </div>
        <div className="mt-3 h-4 overflow-hidden rounded-md border border-white/10 bg-black/50">
          <div
            className="h-full rounded-md bg-[#39ff88] shadow-[0_0_18px_rgba(57,255,136,0.45)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
      <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300">
        Every completed day is a stat point. Stay consistent long enough and
        the character sheet becomes real life.
      </p>
    </div>
  );
}
