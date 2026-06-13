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
    <header className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39ff88]">
          180-Day Campaign
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-white sm:text-5xl">
          Discipline Dashboard
        </h1>
        <p className="mt-3 text-sm font-medium text-[#baffd2]">
          {profileLoading
            ? "Loading profile data..."
            : `Welcome back, ${displayName}`}
        </p>
        {profileError ? (
          <p className="mt-2 text-sm text-rose-200">{profileError}</p>
        ) : null}
        {dailyCheckinsError ? (
          <p className="mt-2 text-sm text-rose-200">{dailyCheckinsError}</p>
        ) : null}
        {strategicTasksError ? (
          <p className="mt-2 text-sm text-rose-200">{strategicTasksError}</p>
        ) : null}
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
          Build discipline like an RPG character: complete the day, earn the
          identity, protect the streak, and keep moving.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:items-end">
        <div className="rounded-md border border-[#39ff88]/30 bg-[#39ff88]/10 px-4 py-3 text-sm font-medium text-[#baffd2] shadow-[0_0_30px_rgba(57,255,136,0.08)]">
          {currentLevel}
        </div>
        <button
          className="shrink-0 rounded-md border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-zinc-300 transition hover:bg-white/[0.08]"
          onClick={onSignOut}
          type="button"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
