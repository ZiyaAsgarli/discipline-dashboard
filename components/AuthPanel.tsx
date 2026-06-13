export function AuthPanel({
  email,
  password,
  setEmail,
  setPassword,
  authChecking,
  authLoading,
  authError,
  onSignIn,
  onSignUp,
}: {
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  authChecking: boolean;
  authLoading: "sign-in" | "sign-up" | null;
  authError: string;
  onSignIn: () => void;
  onSignUp: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07080a] px-5 text-zinc-100">
      <section className="w-full max-w-md rounded-lg border border-white/10 bg-[#101217] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.36)]">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39ff88]">
          Discipline Dashboard
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-white">
          Enter the campaign
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Sign in or create an account to unlock your personal RPG discipline
          dashboard.
        </p>
        <p className="mt-3 rounded-md border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-zinc-400">
          Use email and password to access your personal dashboard.
        </p>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-zinc-300">Email</span>
            <input
              autoComplete="email"
              className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-[#39ff88]/60"
              disabled={authChecking || authLoading !== null}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              type="email"
              value={email}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-zinc-300">Password</span>
            <input
              autoComplete="current-password"
              className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-[#39ff88]/60"
              disabled={authChecking || authLoading !== null}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              type="password"
              value={password}
            />
          </label>
        </div>

        {authError ? (
          <div className="mt-5 rounded-md border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {authError}
          </div>
        ) : null}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            className="rounded-md border border-[#39ff88]/40 bg-[#39ff88] px-4 py-3 text-sm font-semibold text-black transition hover:bg-[#7cffaa] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={authChecking || authLoading !== null}
            onClick={onSignIn}
            type="button"
          >
            {authLoading === "sign-in" ? "Signing In..." : "Sign In"}
          </button>
          <button
            className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={authChecking || authLoading !== null}
            onClick={onSignUp}
            type="button"
          >
            {authLoading === "sign-up" ? "Signing Up..." : "Sign Up"}
          </button>
        </div>

        {authChecking ? (
          <p className="mt-5 text-sm text-zinc-500">Checking your session...</p>
        ) : null}
      </section>
    </main>
  );
}
