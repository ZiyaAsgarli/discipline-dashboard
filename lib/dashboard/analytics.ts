import type { WeeklyXpData, XpSourceData } from "@/components/types";
import { formatLocalDate, calculateCampaignDay, getLast7Days } from "./dates";

export function calculateCurrentStreak(completedCampaignDays: number[], completedCheckinDays: Set<number>): number {
  let currentStreak = 0;
  if (completedCampaignDays.length > 0) {
    const latestCompletedDay = completedCampaignDays[completedCampaignDays.length - 1];
    for (let day = latestCompletedDay; completedCheckinDays.has(day); day--) {
      currentStreak += 1;
    }
  }
  return currentStreak;
}

export function calculateLongestStreak(completedCampaignDays: number[]): number {
  let longestStreak = 0;
  let runningStreak = 0;
  
  if (completedCampaignDays.length > 0) {
    completedCampaignDays.forEach((day, index) => {
      if (index > 0 && day === completedCampaignDays[index - 1] + 1) {
        runningStreak += 1;
      } else {
        runningStreak = 1;
      }
      longestStreak = Math.max(longestStreak, runningStreak);
    });
  }
  return longestStreak;
}

export function calculateCompletionRate(completedDaysCount: number, totalDays: number): number {
  return Math.round((completedDaysCount / totalDays) * 100);
}

export function buildWeeklyCompletionData(
  disciplineStartDate: string | null | undefined, 
  completedCheckinDays: Set<number>
) {
  const last7DaysCompletion = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const localDate = formatLocalDate(d);
    const shortDay = new Intl.DateTimeFormat(undefined, {
      weekday: "short",
    }).format(d);

    let isComplete = false;
    if (disciplineStartDate) {
      const campaignDay = calculateCampaignDay(localDate, disciplineStartDate);
      isComplete = completedCheckinDays.has(campaignDay);
    }

    return {
      dateLabel: shortDay,
      fullDate: localDate,
      completed: isComplete,
    };
  });
  
  return last7DaysCompletion;
}

export function calculateMonthlyAnalytics(
  disciplineStartDate: string | null | undefined,
  completedCheckinDays: Set<number>
) {
  let monthlyCompletedDays = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const localDate = formatLocalDate(d);
    if (disciplineStartDate) {
      const campaignDay = calculateCampaignDay(localDate, disciplineStartDate);
      if (completedCheckinDays.has(campaignDay)) {
        monthlyCompletedDays += 1;
      }
    }
  }
  const monthlyCompletionRate = Math.round((monthlyCompletedDays / 30) * 100);
  
  return { monthlyCompletedDays, monthlyCompletionRate };
}

export function buildWeeklyXpData(xpEvents: { xp_amount: number; created_at: string }[]): WeeklyXpData[] {
  const last7Days = getLast7Days();
  const xpByDate = new Map<string, number>();
  
  for (const event of xpEvents) {
    const d = new Date(event.created_at);
    const localDate = formatLocalDate(d);
    xpByDate.set(
      localDate,
      (xpByDate.get(localDate) || 0) + event.xp_amount,
    );
  }

  const chartData: WeeklyXpData[] = last7Days.map(({ dateLabel, fullDate }) => {
    return {
      dateLabel,
      fullDate,
      xp: xpByDate.get(fullDate) || 0,
    };
  });

  return chartData;
}

export function buildXpBySource(events: { xp_amount: number; source_type: string }[]): XpSourceData {
  let daily_checkin = 0;
  let strategic_task = 0;
  let manual_adjustment = 0;

  for (const event of events) {
    if (event.source_type === "daily_checkin") {
      daily_checkin += event.xp_amount;
    } else if (event.source_type === "strategic_task") {
      strategic_task += event.xp_amount;
    } else if (event.source_type === "manual_adjustment") {
      manual_adjustment += event.xp_amount;
    }
  }

  return { daily_checkin, strategic_task, manual_adjustment };
}
