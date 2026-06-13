import type { XpEvent } from "./types";
import type { translations } from "@/lib/i18n/translations";

export function RecentXpActivity({
  xpEvents,
  xpEventsLoading,
  xpEventsError,
  formatActivityDate,
  t,
}: {
  xpEvents: XpEvent[];
  xpEventsLoading: boolean;
  xpEventsError: string;
  formatActivityDate: (date: string) => string;
  t: typeof translations.en.app;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-[#101217] p-4 shadow-sm md:p-6">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#39ff88] md:text-xs">
        {t.recentXp}
      </p>

      <div className="mt-3 space-y-2 md:mt-4 md:space-y-3">
        {xpEventsLoading ? (
          <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 text-xs text-zinc-400 md:p-4 md:text-sm">
            ...
          </div>
        ) : null}

        {!xpEventsLoading && xpEventsError ? (
          <div className="rounded-lg border border-rose-400/30 bg-rose-500/10 p-3 text-xs text-rose-100 md:p-4 md:text-sm">
            {xpEventsError}
          </div>
        ) : null}

        {!xpEventsLoading && !xpEventsError && xpEvents.length === 0 ? (
          <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 text-xs leading-5 text-zinc-400 md:p-4 md:text-sm md:leading-6">
            <p className="font-medium text-zinc-300">{t.noXpYet}</p>
          </div>
        ) : null}

        {!xpEventsLoading &&
          xpEvents.map((event) => (
            <article
              className="rounded-lg border border-white/5 bg-[#14161c] p-3 md:p-4"
              key={event.id}
            >
              <div className="flex items-start justify-between gap-3 md:gap-4">
                <div>
                  <h3 className="text-xs font-semibold text-white md:text-sm">
                    {event.description || "XP event"}
                  </h3>
                  <p className="mt-1 text-[10px] uppercase tracking-widest text-zinc-500 md:mt-1.5 md:text-xs">
                    {event.source_type}
                  </p>
                </div>
                <span className="shrink-0 rounded-md border border-[#39ff88]/25 bg-[#39ff88]/10 px-2 py-0.5 text-xs font-bold text-[#39ff88] shadow-[0_0_12px_rgba(57,255,136,0.1)] md:px-3 md:py-1 md:text-sm">
                  {event.xp_amount > 0 ? "+" : ""}
                  {event.xp_amount} XP
                </span>
              </div>
              <p className="mt-2 text-[10px] text-zinc-600 md:mt-3 md:text-xs md:text-zinc-500">
                {formatActivityDate(event.created_at)}
              </p>
            </article>
          ))}
      </div>
    </div>
  );
}
