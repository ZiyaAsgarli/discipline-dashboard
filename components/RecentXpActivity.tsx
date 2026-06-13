import type { XpEvent } from "./types";

export function RecentXpActivity({
  xpEvents,
  xpEventsLoading,
  xpEventsError,
  formatActivityDate,
}: {
  xpEvents: XpEvent[];
  xpEventsLoading: boolean;
  xpEventsError: string;
  formatActivityDate: (date: string) => string;
}) {
  return (
    <div className="rounded-lg border border-[#39ff88]/15 bg-[#101116] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39ff88]">
        Recent XP Activity
      </p>

      <div className="mt-5 space-y-3">
        {xpEventsLoading ? (
          <div className="rounded-md border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-400">
            Loading recent XP activity...
          </div>
        ) : null}

        {!xpEventsLoading && xpEventsError ? (
          <div className="rounded-md border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {xpEventsError}
          </div>
        ) : null}

        {!xpEventsLoading && !xpEventsError && xpEvents.length === 0 ? (
          <div className="rounded-md border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-6 text-zinc-400">
            <p className="font-medium text-zinc-300">No XP activity yet.</p>
            <p className="mt-1 text-zinc-500">
              Complete a daily check-in or strategic task to start building
              your XP history.
            </p>
          </div>
        ) : null}

        {!xpEventsLoading &&
          xpEvents.map((event) => (
            <article
              className="rounded-md border border-white/10 bg-[#14161c] p-4"
              key={event.id}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {event.description || "XP event"}
                  </h3>
                  <p className="mt-2 text-xs uppercase tracking-[0.12em] text-zinc-500">
                    {event.source_type}
                  </p>
                </div>
                <span className="shrink-0 rounded-md border border-[#39ff88]/25 bg-[#39ff88]/10 px-3 py-1 text-sm font-semibold text-[#39ff88] shadow-[0_0_16px_rgba(57,255,136,0.08)]">
                  {event.xp_amount > 0 ? "+" : ""}
                  {event.xp_amount} XP
                </span>
              </div>
              <p className="mt-3 text-xs text-zinc-500">
                {formatActivityDate(event.created_at)}
              </p>
            </article>
          ))}
      </div>
    </div>
  );
}
