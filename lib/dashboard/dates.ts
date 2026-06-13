export function formatLocalDate(date: Date): string {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

export function getTodayDate(): string {
  return formatLocalDate(new Date());
}

export function getUtcDayValue(date: string): number {
  const [year, month, day] = date.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

export function calculateCampaignDay(today: string, startDate: string): number {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.floor(
    (getUtcDayValue(today) - getUtcDayValue(startDate)) / millisecondsPerDay,
  ) + 1;
}

export function formatActivityDate(date: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function getLast7Days(): { dateLabel: string; fullDate: string }[] {
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const localDate = formatLocalDate(d);
    const shortDay = new Intl.DateTimeFormat(undefined, {
      weekday: "short",
    }).format(d);
    last7Days.push({ dateLabel: shortDay, fullDate: localDate });
  }
  return last7Days;
}

export function getThirtyDaysAgoDate(): string {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
  thirtyDaysAgo.setHours(0, 0, 0, 0);
  return thirtyDaysAgo.toISOString();
}
