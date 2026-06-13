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
    <div className="rounded-xl border border-[#39ff88]/20 bg-[#101217] p-4 shadow-[0_0_30px_rgba(57,255,136,0.04)] md:p-6">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#39ff88] md:text-xs">
        RPG Progress
      </p>
      <h2 className="mt-2 text-xl font-bold text-white md:mt-3 md:text-2xl">
        {currentLevel}
      </h2>
      <div className="mt-4 md:mt-5">
        <div className="flex items-center justify-between text-xs text-zinc-400 md:text-sm">
          <span>{profileLoading ? "Loading..." : `${currentLevelXp} XP`}</span>
          <span>1000 XP</span>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-md border border-white/10 bg-black/50 md:mt-3 md:h-3">
          <div
            className="h-full rounded-md bg-[#39ff88] shadow-[0_0_12px_rgba(57,255,136,0.4)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
      <p className="mt-3 text-xs leading-5 text-zinc-400 md:mt-4 md:text-sm md:leading-6">
        Every completed day is a stat point. Stay consistent long enough and
        the character sheet becomes real life.
      </p>
    </div>
  );
}
