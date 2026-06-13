export type Profile = {
  id: string;
  email: string | null;
  display_name: string | null;
  total_xp: number;
  current_level: number;
  discipline_start_date: string | null;
};

export type DailyCheckin = {
  id: string;
  campaign_day: number;
  completed: boolean;
};

export type ExistingDailyCheckin = Pick<DailyCheckin, "id" | "completed">;

export type StrategicTask = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  priority: "High" | "Medium" | "Low";
  status: "active" | "completed" | "paused" | "archived";
  xp_reward: number;
  created_at: string;
};

export type TaskFilter = "all" | StrategicTask["status"];

export type XpEvent = {
  id: string;
  description: string | null;
  xp_amount: number;
  source_type: string;
  created_at: string;
};

export type WeeklyXpData = {
  dateLabel: string;
  fullDate: string;
  xp: number;
};

export type XpSourceData = {
  daily_checkin: number;
  strategic_task: number;
  manual_adjustment: number;
};

export type WeeklyCompletionData = {
  dateLabel: string;
  fullDate: string;
  completed: boolean;
};
