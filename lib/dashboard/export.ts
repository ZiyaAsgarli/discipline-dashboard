import type { Profile, DailyCheckin, XpEvent, StrategicTask } from "@/components/types";

export function escapeCsvValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function convertRowsToCsv(headers: string[], rows: string[][]): string {
  const headerLine = headers.map(escapeCsvValue).join(",");
  const dataLines = rows.map((row) => row.map(escapeCsvValue).join(","));
  return [headerLine, ...dataLines].join("\n");
}

export function downloadCsv(filename: string, csvContent: string): void {
  const blob = new Blob(["﻿" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function buildDailyCheckinsCsv(checkins: DailyCheckin[]): string {
  const headers = ["campaign_day", "completed"];
  const rows = checkins.map((c) => [String(c.campaign_day), String(c.completed)]);
  return convertRowsToCsv(headers, rows);
}

export function buildXpEventsCsv(events: XpEvent[]): string {
  const headers = ["created_at", "source_type", "xp_amount", "description"];
  const rows = events.map((e) => [
    e.created_at,
    e.source_type,
    String(e.xp_amount),
    e.description ?? "",
  ]);
  return convertRowsToCsv(headers, rows);
}

export function buildStrategicTasksCsv(tasks: StrategicTask[]): string {
  const headers = [
    "title",
    "description",
    "priority",
    "category",
    "status",
    "xp_reward",
    "created_at",
  ];
  const rows = tasks.map((t) => [
    t.title,
    t.description ?? "",
    t.priority,
    t.category ?? "",
    t.status,
    String(t.xp_reward),
    t.created_at,
  ]);
  return convertRowsToCsv(headers, rows);
}

export function buildFullReportCsv(
  profile: Profile | null,
  checkins: DailyCheckin[],
  xpEventsCount: number,
  tasks: StrategicTask[],
  analytics: {
    currentStreak: number;
    longestStreak: number;
    completionRate: number;
    monthlyCompletedDays: number;
    monthlyCompletionRate: number;
    monthlyXpEarned: number;
    monthlyTasksCompleted: number;
  },
): string {
  const completedDays = checkins.filter((c) => c.completed).length;
  const activeTasks = tasks.filter((t) => t.status === "active").length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;

  const headers = [
    "report_generated_at",
    "user_email",
    "display_name",
    "current_level",
    "total_xp",
    "total_completed_days",
    "active_tasks_count",
    "completed_tasks_count",
    "current_streak",
    "longest_streak",
    "completion_rate",
    "monthly_completed_days",
    "monthly_completion_rate",
    "monthly_xp_earned",
    "monthly_tasks_completed",
    "total_xp_events",
  ];

  const rows = [
    [
      new Date().toISOString(),
      profile?.email ?? "",
      profile?.display_name ?? "",
      String(profile?.current_level ?? 1),
      String(profile?.total_xp ?? 0),
      String(completedDays),
      String(activeTasks),
      String(completedTasks),
      String(analytics.currentStreak),
      String(analytics.longestStreak),
      String(analytics.completionRate),
      String(analytics.monthlyCompletedDays),
      String(analytics.monthlyCompletionRate),
      String(analytics.monthlyXpEarned),
      String(analytics.monthlyTasksCompleted),
      String(xpEventsCount),
    ],
  ];

  return convertRowsToCsv(headers, rows);
}
