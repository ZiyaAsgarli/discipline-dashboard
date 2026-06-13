export function getLevelTitle(level: number): string {
  const levelTitles: Record<number, string> = {
    1: "Novice",
    2: "Consistency Builder",
    3: "SQL Apprentice",
    4: "Data Analyst Trainee",
    5: "BI Warrior",
    6: "Full-Stack Strategist",
    7: "Automation Builder",
    8: "Product Engineer",
    9: "Analytics Commander",
    10: "Data Analytics Jedi",
  };

  return levelTitles[level] ?? "Legendary Operator";
}

export function calculateLevel(totalXp: number): number {
  return Math.floor(totalXp / 1000) + 1;
}

export function getCurrentLevelXp(totalXp: number): number {
  return totalXp % 1000;
}

export function getLevelProgressPercent(totalXp: number): number {
  return (getCurrentLevelXp(totalXp) / 1000) * 100;
}
