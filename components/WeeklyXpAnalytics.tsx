import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { WeeklyXpData } from "./types";

export function WeeklyXpAnalytics({
  weeklyXpData,
  weeklyXpLoading,
  weeklyXpError,
}: {
  weeklyXpData: WeeklyXpData[];
  weeklyXpLoading: boolean;
  weeklyXpError: string;
}) {
  return (
    <div className="rounded-lg border border-[#39ff88]/15 bg-[#101116] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39ff88]">
        Weekly XP Analytics
      </p>
      <p className="mt-2 text-sm text-zinc-400">
        XP earned over the last 7 days.
      </p>

      <div className="mt-6 h-64 w-full">
        {weeklyXpLoading ? (
          <div className="flex h-full items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-sm text-zinc-400">
            Loading chart...
          </div>
        ) : weeklyXpError ? (
          <div className="flex h-full items-center justify-center rounded-md border border-rose-400/30 bg-rose-500/10 text-sm text-rose-100">
            {weeklyXpError}
          </div>
        ) : weeklyXpData.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-sm text-zinc-400">
            No data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyXpData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <XAxis
                dataKey="dateLabel"
                tick={{ fill: "#a1a1aa", fontSize: 12 }}
                axisLine={{ stroke: "#27272a" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#a1a1aa", fontSize: 12 }}
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
                  fontSize: "14px",
                }}
                itemStyle={{ color: "#39ff88" }}
                labelStyle={{ color: "#a1a1aa", marginBottom: "4px" }}
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
