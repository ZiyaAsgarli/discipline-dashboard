import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { WeeklyXpData } from "./types";
import type { translations } from "@/lib/i18n/translations";

export function WeeklyXpAnalytics({
  weeklyXpData,
  weeklyXpLoading,
  weeklyXpError,
  t,
}: {
  weeklyXpData: WeeklyXpData[];
  weeklyXpLoading: boolean;
  weeklyXpError: string;
  t: typeof translations.en.app;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-[#101217] p-4 shadow-sm md:p-6">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#39ff88] md:text-xs">
        {t.weeklyXp}
      </p>

      <div className="mt-4 h-40 w-full md:mt-5 md:h-56">
        {weeklyXpLoading ? (
          <div className="flex h-full items-center justify-center rounded-lg border border-white/5 bg-white/[0.02] text-xs text-zinc-400 md:text-sm">
            ...
          </div>
        ) : weeklyXpError ? (
          <div className="flex h-full items-center justify-center rounded-lg border border-rose-400/30 bg-rose-500/10 text-xs text-rose-100 md:text-sm">
            {weeklyXpError}
          </div>
        ) : weeklyXpData.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-lg border border-white/5 bg-white/[0.02] text-xs text-zinc-400 md:text-sm">
            {t.noXpYet}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyXpData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <XAxis
                dataKey="dateLabel"
                tick={{ fill: "#a1a1aa", fontSize: 10 }}
                axisLine={{ stroke: "#27272a" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#a1a1aa", fontSize: 10 }}
                axisLine={{ stroke: "#27272a" }}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: "#ffffff0a" }}
                contentStyle={{
                  backgroundColor: "#14161c",
                  borderColor: "#39ff8840",
                  borderRadius: "6px",
                  color: "#fff",
                  fontSize: "12px",
                  padding: "8px",
                }}
                itemStyle={{ color: "#39ff88" }}
                labelStyle={{ color: "#a1a1aa", marginBottom: "2px" }}
              />
              <Bar
                dataKey="xp"
                fill="#39ff88"
                radius={[4, 4, 0, 0]}
                name="XP Amount"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
