export function DashboardHeader({
  displayName,
  currentLevel,
  profileLoading,
  profileError,
  dailyCheckinsError,
  strategicTasksError,
  onSignOut,
}: {
  displayName: string;
  currentLevel: string;
  profileLoading: boolean;
  profileError: string;
  dailyCheckinsError: string;
  strategicTasksError: string;
  onSignOut: () => void;
}) {
  return (
    <header className="flex flex-row items-start justify-between pb-4 sm:items-center sm:pb-6">
      <div className="flex flex-col gap-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#39ff88] md:text-xs">
          180-Day Campaign
        </p>
        <h1 className="text-xl font-bold text-white md:text-3xl">
          Discipline Dashboard
        </h1>
        <p className="text-xs font-medium text-[#baffd2] md:text-sm">
          {profileLoading
            ? "Loading profile data..."
            : `Welcome back, ${displayName}`}
        </p>
        {profileError && <p className="text-xs text-rose-200">{profileError}</p>}
        {dailyCheckinsError && <p className="text-xs text-rose-200">{dailyCheckinsError}</p>}
        {strategicTasksError && <p className="text-xs text-rose-200">{strategicTasksError}</p>}
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="hidden rounded-full border border-[#39ff88]/30 bg-[#39ff88]/10 px-3 py-1 text-[10px] font-medium text-[#baffd2] md:block md:text-xs">
          {currentLevel}
        </div>
        <button
          className="text-xs font-semibold text-zinc-500 transition hover:text-zinc-300 md:rounded-md md:border md:border-white/10 md:bg-white/[0.04] md:px-3 md:py-1.5"
          onClick={onSignOut}
          type="button"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
