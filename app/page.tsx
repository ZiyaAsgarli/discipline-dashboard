"use client";

import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import type {
  Profile,
  DailyCheckin,
  ExistingDailyCheckin,
  StrategicTask,
  TaskFilter,
  XpEvent,
  WeeklyXpData,
  XpSourceData,
} from "@/components/types";
import { AuthPanel } from "@/components/AuthPanel";
import { DashboardHeader } from "@/components/DashboardHeader";
import { StatCards } from "@/components/StatCards";
import { DatabaseStatusCard } from "@/components/DatabaseStatusCard";
import { AnalyticsSummary } from "@/components/AnalyticsSummary";
import { DisciplineGrid } from "@/components/DisciplineGrid";
import { RpgProgress } from "@/components/RpgProgress";
import { RecentXpActivity } from "@/components/RecentXpActivity";
import { WeeklyXpAnalytics } from "@/components/WeeklyXpAnalytics";
import { XpBySource } from "@/components/XpBySource";
import { WeeklyCompletionAnalytics } from "@/components/WeeklyCompletionAnalytics";
import { MonthlyAnalyticsOverview } from "@/components/MonthlyAnalyticsOverview";
import { StrategicTasksManager } from "@/components/StrategicTasksManager";

async function getSupabase() {
  const { supabase } = await import("@/lib/supabaseClient");
  return supabase;
}

function getTodayDate() {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

function getUtcDayValue(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

function getCampaignDay(today: string, startDate: string) {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.floor(
    (getUtcDayValue(today) - getUtcDayValue(startDate)) / millisecondsPerDay,
  ) + 1;
}

function validateCredentials(email: string, password: string) {
  if (!email.trim()) {
    return "Email is required";
  }

  if (!password) {
    return "Password is required";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }

  return "";
}



function getLevelTitle(level: number): string {
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

function formatActivityDate(date: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

async function upsertProfile(
  supabase: Awaited<ReturnType<typeof getSupabase>>,
  user: User,
) {
  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    email: user.email,
    display_name: "Ziya",
    total_xp: 0,
    current_level: 1,
    discipline_start_date: getTodayDate(),
  });

  if (error) {
    throw error;
  }
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [authLoading, setAuthLoading] = useState<"sign-in" | "sign-up" | null>(
    null,
  );
  const [authError, setAuthError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [dailyCheckins, setDailyCheckins] = useState<DailyCheckin[]>([]);
  const [dailyCheckinsLoading, setDailyCheckinsLoading] = useState(false);
  const [dailyCheckinsError, setDailyCheckinsError] = useState("");
  const [strategicTasks, setStrategicTasks] = useState<StrategicTask[]>([]);
  const [strategicTasksLoading, setStrategicTasksLoading] = useState(false);
  const [strategicTasksError, setStrategicTasksError] = useState("");
  const [xpEvents, setXpEvents] = useState<XpEvent[]>([]);
  const [xpEventsCount, setXpEventsCount] = useState(0);
  const [xpEventsLoading, setXpEventsLoading] = useState(false);
  const [xpEventsError, setXpEventsError] = useState("");
  const [weeklyXpData, setWeeklyXpData] = useState<WeeklyXpData[]>([]);
  const [weeklyXpLoading, setWeeklyXpLoading] = useState(false);
  const [weeklyXpError, setWeeklyXpError] = useState("");
  const [xpSourceData, setXpSourceData] = useState<XpSourceData>({
    daily_checkin: 0,
    strategic_task: 0,
    manual_adjustment: 0,
  });
  const [xpSourceLoading, setXpSourceLoading] = useState(false);
  const [xpSourceError, setXpSourceError] = useState("");
  const [monthlyXpEarned, setMonthlyXpEarned] = useState(0);
  const [monthlyTasksCompleted, setMonthlyTasksCompleted] = useState(0);
  const [monthlyAnalyticsLoading, setMonthlyAnalyticsLoading] = useState(false);
  const [monthlyAnalyticsError, setMonthlyAnalyticsError] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] =
    useState<StrategicTask["priority"]>("Medium");
  const [taskCategory, setTaskCategory] = useState("");
  const [taskXpReward, setTaskXpReward] = useState("250");
  const [taskFormLoading, setTaskFormLoading] = useState(false);
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);
  const [taskActionId, setTaskActionId] = useState<string | null>(null);
  const [selectedTaskFilter, setSelectedTaskFilter] =
    useState<TaskFilter>("active");
  const [taskFormMessage, setTaskFormMessage] = useState("");
  const [taskFormMessageType, setTaskFormMessageType] = useState<
    "success" | "error" | "info"
  >("info");
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [checkinMessage, setCheckinMessage] = useState("");
  const [checkinMessageType, setCheckinMessageType] = useState<
    "success" | "error" | "info"
  >("info");
  const [databaseStatus, setDatabaseStatus] = useState<
    "loading" | "connected" | "error"
  >("loading");
  const profileLevel = profile?.current_level ?? 1;
  const levelTitle = getLevelTitle(profileLevel);
  const completedCheckinsCount = dailyCheckins.filter(
    (checkin) => checkin.completed,
  ).length;
  const completedCheckinDays = new Set(
    dailyCheckins
      .filter((checkin) => checkin.completed)
      .map((checkin) => checkin.campaign_day),
  );
  const completedCampaignDays = Array.from(completedCheckinDays).sort(
    (firstDay, secondDay) => firstDay - secondDay,
  );
  let currentStreak = 0;
  let longestStreak = 0;
  let runningStreak = 0;

  if (completedCampaignDays.length > 0) {
    const latestCompletedDay =
      completedCampaignDays[completedCampaignDays.length - 1];

    for (let day = latestCompletedDay; completedCheckinDays.has(day); day--) {
      currentStreak += 1;
    }

    completedCampaignDays.forEach((day, index) => {
      if (index > 0 && day === completedCampaignDays[index - 1] + 1) {
        runningStreak += 1;
      } else {
        runningStreak = 1;
      }

      longestStreak = Math.max(longestStreak, runningStreak);
    });
  }

  const currentStreakLabel = `${currentStreak} ${
    currentStreak === 1 ? "day" : "days"
  }`;
  const longestStreakLabel = `${longestStreak} ${
    longestStreak === 1 ? "day" : "days"
  }`;
  const activeTasksCount = strategicTasks.filter(
    (task) => task.status === "active",
  ).length;
  const completedTasksCount = strategicTasks.filter(
    (task) => task.status === "completed",
  ).length;
  const completionRate = Math.round((completedCheckinsCount / 180) * 100);

  const last7DaysCompletion = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const localDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
    const shortDay = new Intl.DateTimeFormat(undefined, {
      weekday: "short",
    }).format(d);

    let isComplete = false;
    if (profile?.discipline_start_date) {
      const campaignDay = getCampaignDay(
        localDate,
        profile.discipline_start_date,
      );
      isComplete = completedCheckinDays.has(campaignDay);
    }

    return {
      dateLabel: shortDay,
      fullDate: localDate,
      completed: isComplete,
    };
  });
  const weeklyCompletedCount = last7DaysCompletion.filter(
    (d) => d.completed,
  ).length;

  let monthlyCompletedDays = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const localDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
    if (profile?.discipline_start_date) {
      const campaignDay = getCampaignDay(
        localDate,
        profile.discipline_start_date,
      );
      if (completedCheckinDays.has(campaignDay)) {
        monthlyCompletedDays += 1;
      }
    }
  }
  const monthlyCompletionRate = Math.round((monthlyCompletedDays / 30) * 100);

  const filteredStrategicTasks =
    selectedTaskFilter === "all"
      ? strategicTasks
      : strategicTasks.filter((task) => task.status === selectedTaskFilter);
  const taskFilters: Array<{ label: string; value: TaskFilter }> = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Completed", value: "completed" },
    { label: "Paused", value: "paused" },
    { label: "Archived", value: "archived" },
  ];



  useEffect(() => {
    let isMounted = true;

    async function fetchWeeklyXp() {
      if (!user) {
        if (isMounted) {
          setWeeklyXpData([]);
          setWeeklyXpError("");
          setWeeklyXpLoading(false);
        }
        return;
      }

      setWeeklyXpLoading(true);
      setWeeklyXpError("");

      try {
        const supabase = await getSupabase();
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const { data, error } = await supabase
          .from("xp_events")
          .select("xp_amount, created_at")
          .eq("user_id", user.id)
          .gte("created_at", sevenDaysAgo.toISOString())
          .returns<{ xp_amount: number; created_at: string }[]>();

        if (!isMounted) return;

        if (error) {
          setWeeklyXpData([]);
          setWeeklyXpError("Unable to load weekly analytics.");
          return;
        }

        const last7Days: string[] = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const localDate = new Date(
            d.getTime() - d.getTimezoneOffset() * 60000,
          )
            .toISOString()
            .slice(0, 10);
          last7Days.push(localDate);
        }

        const xpByDate = new Map<string, number>();
        for (const event of data ?? []) {
          const d = new Date(event.created_at);
          const localDate = new Date(
            d.getTime() - d.getTimezoneOffset() * 60000,
          )
            .toISOString()
            .slice(0, 10);
          xpByDate.set(
            localDate,
            (xpByDate.get(localDate) || 0) + event.xp_amount,
          );
        }

        const chartData: WeeklyXpData[] = last7Days.map((dateStr) => {
          const [year, month, day] = dateStr.split("-").map(Number);
          const dateObj = new Date(year, month - 1, day);
          const shortDay = new Intl.DateTimeFormat(undefined, {
            weekday: "short",
          }).format(dateObj);
          return {
            dateLabel: shortDay,
            fullDate: dateStr,
            xp: xpByDate.get(dateStr) || 0,
          };
        });

        setWeeklyXpData(chartData);
      } catch {
        if (isMounted) {
          setWeeklyXpData([]);
          setWeeklyXpError("Unable to load weekly analytics.");
        }
      } finally {
        if (isMounted) {
          setWeeklyXpLoading(false);
        }
      }
    }

    async function fetchXpSourceBreakdown() {
      if (!user) {
        if (isMounted) {
          setXpSourceData({
            daily_checkin: 0,
            strategic_task: 0,
            manual_adjustment: 0,
          });
          setXpSourceError("");
          setXpSourceLoading(false);
        }
        return;
      }

      setXpSourceLoading(true);
      setXpSourceError("");

      try {
        const supabase = await getSupabase();

        const { data, error } = await supabase
          .from("xp_events")
          .select("xp_amount, source_type")
          .eq("user_id", user.id)
          .returns<{ xp_amount: number; source_type: string }[]>();

        if (!isMounted) return;

        if (error) {
          setXpSourceData({
            daily_checkin: 0,
            strategic_task: 0,
            manual_adjustment: 0,
          });
          setXpSourceError("Unable to load XP sources.");
          return;
        }

        let daily_checkin = 0;
        let strategic_task = 0;
        let manual_adjustment = 0;

        for (const event of data ?? []) {
          if (event.source_type === "daily_checkin") {
            daily_checkin += event.xp_amount;
          } else if (event.source_type === "strategic_task") {
            strategic_task += event.xp_amount;
          } else if (event.source_type === "manual_adjustment") {
            manual_adjustment += event.xp_amount;
          }
        }

        setXpSourceData({ daily_checkin, strategic_task, manual_adjustment });
      } catch {
        if (isMounted) {
          setXpSourceData({
            daily_checkin: 0,
            strategic_task: 0,
            manual_adjustment: 0,
          });
          setXpSourceError("Unable to load XP sources.");
        }
      } finally {
        if (isMounted) {
          setXpSourceLoading(false);
        }
      }
    }

    async function fetchMonthlyStats() {
      if (!user) {
        if (isMounted) {
          setMonthlyXpEarned(0);
          setMonthlyTasksCompleted(0);
          setMonthlyAnalyticsLoading(false);
        }
        return;
      }
      setMonthlyAnalyticsLoading(true);
      setMonthlyAnalyticsError("");

      try {
        const supabase = await getSupabase();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
        thirtyDaysAgo.setHours(0, 0, 0, 0);
        const startDateStr = thirtyDaysAgo.toISOString();

        const [xpRes, tasksRes] = await Promise.all([
          supabase
            .from("xp_events")
            .select("xp_amount")
            .eq("user_id", user.id)
            .gte("created_at", startDateStr),
          supabase
            .from("strategic_tasks")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("status", "completed")
            .gte("completed_at", startDateStr),
        ]);

        if (!isMounted) return;

        if (xpRes.error || tasksRes.error) {
          setMonthlyXpEarned(0);
          setMonthlyTasksCompleted(0);
          setMonthlyAnalyticsError("Unable to load monthly analytics.");
          return;
        }

        const totalXp =
          xpRes.data?.reduce((sum, event) => sum + event.xp_amount, 0) ?? 0;
        setMonthlyXpEarned(totalXp);
        setMonthlyTasksCompleted(tasksRes.count ?? 0);
      } catch {
        if (isMounted) {
          setMonthlyXpEarned(0);
          setMonthlyTasksCompleted(0);
          setMonthlyAnalyticsError("Unable to load monthly analytics.");
        }
      } finally {
        if (isMounted) {
          setMonthlyAnalyticsLoading(false);
        }
      }
    }

    fetchWeeklyXp();
    fetchXpSourceBreakdown();
    fetchMonthlyStats();

    return () => {
      isMounted = false;
    };
  }, [user, profile?.total_xp]);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | undefined;

    async function fetchProfile(userId: string) {
      setProfileLoading(true);
      setProfileError("");

      try {
        const supabase = await getSupabase();
        const { data, error } = await supabase
          .from("profiles")
          .select(
            "id, email, display_name, total_xp, current_level, discipline_start_date",
          )
          .eq("id", userId)
          .single<Profile>();

        if (!isMounted) {
          return;
        }

        if (error) {
          setProfile(null);
          setProfileError("Unable to load profile data.");
          return;
        }

        setProfile(data);
      } catch {
        if (isMounted) {
          setProfile(null);
          setProfileError("Unable to load profile data.");
        }
      } finally {
        if (isMounted) {
          setProfileLoading(false);
        }
      }
    }

    async function checkDatabaseStatus() {
      try {
        const supabase = await getSupabase();
        const { error } = await supabase.from("profiles").select("id").limit(1);

        if (isMounted) {
          setDatabaseStatus(error ? "error" : "connected");
        }
      } catch {
        if (isMounted) {
          setDatabaseStatus("error");
        }
      }
    }

    async function fetchDailyCheckins(userId: string) {
      setDailyCheckinsLoading(true);
      setDailyCheckinsError("");

      try {
        const supabase = await getSupabase();
        const { data, error } = await supabase
          .from("daily_checkins")
          .select("id, campaign_day, completed")
          .eq("user_id", userId)
          .order("campaign_day", { ascending: true })
          .returns<DailyCheckin[]>();

        if (!isMounted) {
          return;
        }

        if (error) {
          setDailyCheckins([]);
          setDailyCheckinsError("Unable to load discipline grid data.");
          return;
        }

        setDailyCheckins(data ?? []);
      } catch {
        if (isMounted) {
          setDailyCheckins([]);
          setDailyCheckinsError("Unable to load discipline grid data.");
        }
      } finally {
        if (isMounted) {
          setDailyCheckinsLoading(false);
        }
      }
    }

    async function fetchStrategicTasks(userId: string) {
      setStrategicTasksLoading(true);
      setStrategicTasksError("");

      try {
        const supabase = await getSupabase();
        const { data, error } = await supabase
          .from("strategic_tasks")
          .select(
            "id, title, description, category, priority, status, xp_reward, created_at",
          )
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .returns<StrategicTask[]>();

        if (!isMounted) {
          return;
        }

        if (error) {
          setStrategicTasks([]);
          setStrategicTasksError("Unable to load strategic tasks.");
          return;
        }

        setStrategicTasks(data ?? []);
      } catch {
        if (isMounted) {
          setStrategicTasks([]);
          setStrategicTasksError("Unable to load strategic tasks.");
        }
      } finally {
        if (isMounted) {
          setStrategicTasksLoading(false);
        }
      }
    }

    async function fetchXpEvents(userId: string) {
      setXpEventsLoading(true);
      setXpEventsError("");

      try {
        const supabase = await getSupabase();
        const { data, error } = await supabase
          .from("xp_events")
          .select("id, description, xp_amount, source_type, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(5)
          .returns<XpEvent[]>();
        const { count, error: countError } = await supabase
          .from("xp_events")
          .select("id", { count: "exact", head: true })
          .eq("user_id", userId);

        if (!isMounted) {
          return;
        }

        if (error || countError) {
          setXpEvents([]);
          setXpEventsCount(0);
          setXpEventsError("Unable to load XP activity.");
          return;
        }

        setXpEvents(data ?? []);
        setXpEventsCount(count ?? 0);
      } catch {
        if (isMounted) {
          setXpEvents([]);
          setXpEventsCount(0);
          setXpEventsError("Unable to load XP activity.");
        }
      } finally {
        if (isMounted) {
          setXpEventsLoading(false);
        }
      }
    }

    async function loadSession() {
      try {
        const supabase = await getSupabase();
        const { data } = await supabase.auth.getSession();

        if (!isMounted) {
          return;
        }

        setUser(data.session?.user ?? null);
        setAuthChecking(false);

        if (data.session?.user) {
          checkDatabaseStatus();
          fetchProfile(data.session.user.id);
          fetchDailyCheckins(data.session.user.id);
          fetchStrategicTasks(data.session.user.id);
          fetchXpEvents(data.session.user.id);
        } else {
          setProfile(null);
          setProfileLoading(false);
          setProfileError("");
          setDailyCheckins([]);
          setDailyCheckinsLoading(false);
          setDailyCheckinsError("");
          setStrategicTasks([]);
          setStrategicTasksLoading(false);
          setStrategicTasksError("");
          setXpEvents([]);
          setXpEventsCount(0);
          setXpEventsLoading(false);
          setXpEventsError("");
        }

        const { data: listener } = supabase.auth.onAuthStateChange(
          (_event, session) => {
            setUser(session?.user ?? null);
            setDatabaseStatus("loading");

            if (session?.user) {
              checkDatabaseStatus();
              fetchProfile(session.user.id);
              fetchDailyCheckins(session.user.id);
              fetchStrategicTasks(session.user.id);
              fetchXpEvents(session.user.id);
            } else {
              setProfile(null);
              setProfileLoading(false);
              setProfileError("");
              setDailyCheckins([]);
              setDailyCheckinsLoading(false);
              setDailyCheckinsError("");
              setStrategicTasks([]);
              setStrategicTasksLoading(false);
              setStrategicTasksError("");
              setXpEvents([]);
              setXpEventsCount(0);
              setXpEventsLoading(false);
              setXpEventsError("");
            }
          },
        );

        unsubscribe = () => listener.subscription.unsubscribe();
      } catch {
        if (isMounted) {
          setUser(null);
          setAuthChecking(false);
          setAuthError("Unable to initialize authentication.");
        }
      }
    }

    loadSession();

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, []);

  async function handleSignIn() {
    setAuthError("");

    const validationError = validateCredentials(email, password);

    if (validationError) {
      setAuthError(validationError);
      return;
    }

    setAuthLoading("sign-in");

    try {
      const supabase = await getSupabase();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        await upsertProfile(supabase, data.user);
        setUser(data.user);
        setProfileLoading(true);
        const { data: profileData, error: profileFetchError } = await supabase
          .from("profiles")
          .select(
            "id, email, display_name, total_xp, current_level, discipline_start_date",
          )
          .eq("id", data.user.id)
          .single<Profile>();

        if (profileFetchError) {
          setProfileError("Unable to load profile data.");
        } else {
          setProfile(profileData);
          setProfileError("");
        }

        setDailyCheckinsLoading(true);
        const { data: checkinsData, error: checkinsError } = await supabase
          .from("daily_checkins")
          .select("id, campaign_day, completed")
          .eq("user_id", data.user.id)
          .order("campaign_day", { ascending: true })
          .returns<DailyCheckin[]>();

        if (checkinsError) {
          setDailyCheckins([]);
          setDailyCheckinsError("Unable to load discipline grid data.");
        } else {
          setDailyCheckins(checkinsData ?? []);
          setDailyCheckinsError("");
        }

        setStrategicTasksLoading(true);
        const { data: tasksData, error: tasksError } = await supabase
          .from("strategic_tasks")
          .select(
            "id, title, description, category, priority, status, xp_reward, created_at",
          )
          .eq("user_id", data.user.id)
          .order("created_at", { ascending: false })
          .returns<StrategicTask[]>();

        if (tasksError) {
          setStrategicTasks([]);
          setStrategicTasksError("Unable to load strategic tasks.");
        } else {
          setStrategicTasks(tasksData ?? []);
          setStrategicTasksError("");
        }

        setXpEventsLoading(true);
        const { data: xpEventsData, error: xpEventsFetchError } = await supabase
          .from("xp_events")
          .select("id, description, xp_amount, source_type, created_at")
          .eq("user_id", data.user.id)
          .order("created_at", { ascending: false })
          .limit(5)
          .returns<XpEvent[]>();
        const { count: xpEventsTotal, error: xpEventsCountError } =
          await supabase
            .from("xp_events")
            .select("id", { count: "exact", head: true })
            .eq("user_id", data.user.id);

        if (xpEventsFetchError || xpEventsCountError) {
          setXpEvents([]);
          setXpEventsCount(0);
          setXpEventsError("Unable to load XP activity.");
        } else {
          setXpEvents(xpEventsData ?? []);
          setXpEventsCount(xpEventsTotal ?? 0);
          setXpEventsError("");
        }
      }
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : "Unable to sign in.",
      );
    } finally {
      setAuthLoading(null);
      setProfileLoading(false);
      setDailyCheckinsLoading(false);
      setStrategicTasksLoading(false);
      setXpEventsLoading(false);
    }
  }

  async function handleSignUp() {
    setAuthError("");

    const validationError = validateCredentials(email, password);

    if (validationError) {
      setAuthError(validationError);
      return;
    }

    setAuthLoading("sign-up");

    try {
      const supabase = await getSupabase();
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        await upsertProfile(supabase, data.user);
        setUser(data.user);
        setProfileLoading(true);
        const { data: profileData, error: profileFetchError } = await supabase
          .from("profiles")
          .select(
            "id, email, display_name, total_xp, current_level, discipline_start_date",
          )
          .eq("id", data.user.id)
          .single<Profile>();

        if (profileFetchError) {
          setProfileError("Unable to load profile data.");
        } else {
          setProfile(profileData);
          setProfileError("");
        }

        setDailyCheckinsLoading(true);
        const { data: checkinsData, error: checkinsError } = await supabase
          .from("daily_checkins")
          .select("id, campaign_day, completed")
          .eq("user_id", data.user.id)
          .order("campaign_day", { ascending: true })
          .returns<DailyCheckin[]>();

        if (checkinsError) {
          setDailyCheckins([]);
          setDailyCheckinsError("Unable to load discipline grid data.");
        } else {
          setDailyCheckins(checkinsData ?? []);
          setDailyCheckinsError("");
        }

        setStrategicTasksLoading(true);
        const { data: tasksData, error: tasksError } = await supabase
          .from("strategic_tasks")
          .select(
            "id, title, description, category, priority, status, xp_reward, created_at",
          )
          .eq("user_id", data.user.id)
          .order("created_at", { ascending: false })
          .returns<StrategicTask[]>();

        if (tasksError) {
          setStrategicTasks([]);
          setStrategicTasksError("Unable to load strategic tasks.");
        } else {
          setStrategicTasks(tasksData ?? []);
          setStrategicTasksError("");
        }

        setXpEventsLoading(true);
        const { data: xpEventsData, error: xpEventsFetchError } = await supabase
          .from("xp_events")
          .select("id, description, xp_amount, source_type, created_at")
          .eq("user_id", data.user.id)
          .order("created_at", { ascending: false })
          .limit(5)
          .returns<XpEvent[]>();
        const { count: xpEventsTotal, error: xpEventsCountError } =
          await supabase
            .from("xp_events")
            .select("id", { count: "exact", head: true })
            .eq("user_id", data.user.id);

        if (xpEventsFetchError || xpEventsCountError) {
          setXpEvents([]);
          setXpEventsCount(0);
          setXpEventsError("Unable to load XP activity.");
        } else {
          setXpEvents(xpEventsData ?? []);
          setXpEventsCount(xpEventsTotal ?? 0);
          setXpEventsError("");
        }
      }
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : "Unable to sign up.",
      );
    } finally {
      setAuthLoading(null);
      setProfileLoading(false);
      setDailyCheckinsLoading(false);
      setStrategicTasksLoading(false);
      setXpEventsLoading(false);
    }
  }

  async function handleSignOut() {
    setAuthError("");

    try {
      const supabase = await getSupabase();
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setProfileError("");
      setProfileLoading(false);
      setDailyCheckins([]);
      setDailyCheckinsError("");
      setDailyCheckinsLoading(false);
      setStrategicTasks([]);
      setStrategicTasksError("");
      setStrategicTasksLoading(false);
      setXpEvents([]);
      setXpEventsCount(0);
      setXpEventsError("");
      setXpEventsLoading(false);
      setDatabaseStatus("loading");
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : "Unable to sign out.",
      );
    }
  }

  async function handleCompleteToday() {
    setCheckinMessage("");

    if (!user) {
      setCheckinMessageType("error");
      setCheckinMessage("Please sign in before completing today.");
      return;
    }

    if (!profile?.discipline_start_date) {
      setCheckinMessageType("error");
      setCheckinMessage("Profile start date is missing.");
      return;
    }

    const today = getTodayDate();
    const campaignDay = getCampaignDay(today, profile.discipline_start_date);

    if (campaignDay < 1 || campaignDay > 180) {
      setCheckinMessageType("info");
      setCheckinMessage("Today is outside your 180-day discipline campaign.");
      return;
    }

    setCheckinLoading(true);

    try {
      const supabase = await getSupabase();
      const { data: existingCheckin, error: existingCheckinError } =
        await supabase
          .from("daily_checkins")
          .select("id, completed")
          .eq("user_id", user.id)
          .eq("checkin_date", today)
          .maybeSingle<ExistingDailyCheckin>();

      if (existingCheckinError) {
        throw existingCheckinError;
      }

      if (existingCheckin?.completed) {
        setCheckinMessageType("info");
        setCheckinMessage("Today is already completed.");
        return;
      }

      const { data: completedCheckin, error: checkinError } = await supabase
        .from("daily_checkins")
        .upsert(
          {
            user_id: user.id,
            checkin_date: today,
            campaign_day: campaignDay,
            completed: true,
            xp_awarded: 100,
            notes: "Daily discipline completed",
          },
          { onConflict: "user_id,checkin_date" },
        )
        .select("id, completed")
        .single<ExistingDailyCheckin>();

      if (checkinError) {
        throw checkinError;
      }

      const { error: xpEventError } = await supabase.from("xp_events").insert({
        user_id: user.id,
        source_type: "daily_checkin",
        source_id: completedCheckin.id,
        xp_amount: 100,
        description: "Completed daily discipline check-in",
      });

      if (xpEventError) {
        throw xpEventError;
      }

      const newTotalXp = (profile.total_xp ?? 0) + 100;
      const newCurrentLevel = Math.floor(newTotalXp / 1000) + 1;
      const { error: profileUpdateError } = await supabase
        .from("profiles")
        .update({
          total_xp: newTotalXp,
          current_level: newCurrentLevel,
        })
        .eq("id", user.id);

      if (profileUpdateError) {
        throw profileUpdateError;
      }

      setProfileLoading(true);
      const { data: refreshedProfile, error: refreshProfileError } =
        await supabase
          .from("profiles")
          .select(
            "id, email, display_name, total_xp, current_level, discipline_start_date",
          )
          .eq("id", user.id)
          .single<Profile>();

      if (refreshProfileError) {
        throw refreshProfileError;
      }

      setProfile(refreshedProfile);
      setProfileError("");

      setDailyCheckinsLoading(true);
      const { data: refreshedCheckins, error: refreshCheckinsError } =
        await supabase
          .from("daily_checkins")
          .select("id, campaign_day, completed")
          .eq("user_id", user.id)
          .order("campaign_day", { ascending: true })
          .returns<DailyCheckin[]>();

      if (refreshCheckinsError) {
        throw refreshCheckinsError;
      }

      setDailyCheckins(refreshedCheckins ?? []);
      setDailyCheckinsError("");

      setXpEventsLoading(true);
      const { data: refreshedXpEvents, error: refreshXpEventsError } =
        await supabase
          .from("xp_events")
          .select("id, description, xp_amount, source_type, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5)
          .returns<XpEvent[]>();
      const { count: refreshedXpEventsCount, error: refreshXpEventsCountError } =
        await supabase
          .from("xp_events")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id);

      if (refreshXpEventsError || refreshXpEventsCountError) {
        throw refreshXpEventsError ?? refreshXpEventsCountError;
      }

      setXpEvents(refreshedXpEvents ?? []);
      setXpEventsCount(refreshedXpEventsCount ?? 0);
      setXpEventsError("");
      setCheckinMessageType("success");
      setCheckinMessage("Daily check-in complete. +100 XP awarded.");
    } catch (error) {
      setCheckinMessageType("error");
      setCheckinMessage(
        error instanceof Error
          ? error.message
          : "Unable to complete today's check-in.",
      );
    } finally {
      setCheckinLoading(false);
      setProfileLoading(false);
      setDailyCheckinsLoading(false);
      setXpEventsLoading(false);
    }
  }

  async function handleAddStrategicTask() {
    setTaskFormMessage("");

    if (!user) {
      setTaskFormMessageType("error");
      setTaskFormMessage("Please sign in before adding a strategic task.");
      return;
    }

    if (!taskTitle.trim()) {
      setTaskFormMessageType("error");
      setTaskFormMessage("Task title is required.");
      return;
    }

    setTaskFormLoading(true);

    try {
      const supabase = await getSupabase();
      const xpReward = Number.parseInt(taskXpReward, 10);
      const { error } = await supabase.from("strategic_tasks").insert({
        user_id: user.id,
        title: taskTitle.trim(),
        description: taskDescription.trim() || null,
        priority: taskPriority,
        category: taskCategory.trim() || null,
        status: "active",
        xp_reward: Number.isFinite(xpReward) ? xpReward : 250,
      });

      if (error) {
        throw error;
      }

      setTaskTitle("");
      setTaskDescription("");
      setTaskPriority("Medium");
      setTaskCategory("");
      setTaskXpReward("250");

      setStrategicTasksLoading(true);
      const { data, error: fetchError } = await supabase
        .from("strategic_tasks")
        .select(
          "id, title, description, category, priority, status, xp_reward, created_at",
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .returns<StrategicTask[]>();

      if (fetchError) {
        throw fetchError;
      }

      setStrategicTasks(data ?? []);
      setStrategicTasksError("");
      setTaskFormMessageType("success");
      setTaskFormMessage("Strategic task added.");
    } catch (error) {
      setTaskFormMessageType("error");
      setTaskFormMessage(
        error instanceof Error ? error.message : "Unable to add strategic task.",
      );
    } finally {
      setTaskFormLoading(false);
      setStrategicTasksLoading(false);
    }
  }

  async function handleCompleteStrategicTask(task: StrategicTask) {
    setTaskFormMessage("");

    if (!user) {
      setTaskFormMessageType("error");
      setTaskFormMessage("Please sign in before completing a strategic task.");
      return;
    }

    if (task.status !== "active") {
      setTaskFormMessageType("info");
      setTaskFormMessage("Task is already completed.");
      return;
    }

    setCompletingTaskId(task.id);

    try {
      const supabase = await getSupabase();
      const { data: latestTask, error: latestTaskError } = await supabase
        .from("strategic_tasks")
        .select(
          "id, title, description, category, priority, status, xp_reward, created_at",
        )
        .eq("id", task.id)
        .eq("user_id", user.id)
        .single<StrategicTask>();

      if (latestTaskError) {
        throw latestTaskError;
      }

      if (latestTask.status !== "active") {
        setTaskFormMessageType("info");
        setTaskFormMessage("Task is already completed.");
        return;
      }

      const { error: taskUpdateError } = await supabase
        .from("strategic_tasks")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", task.id)
        .eq("user_id", user.id);

      if (taskUpdateError) {
        throw taskUpdateError;
      }

      const { error: xpEventError } = await supabase.from("xp_events").insert({
        user_id: user.id,
        source_type: "strategic_task",
        source_id: task.id,
        xp_amount: latestTask.xp_reward,
        description: `Completed strategic task: ${latestTask.title}`,
      });

      if (xpEventError) {
        throw xpEventError;
      }

      const newTotalXp = (profile?.total_xp ?? 0) + latestTask.xp_reward;
      const newCurrentLevel = Math.floor(newTotalXp / 1000) + 1;
      const { error: profileUpdateError } = await supabase
        .from("profiles")
        .update({
          total_xp: newTotalXp,
          current_level: newCurrentLevel,
        })
        .eq("id", user.id);

      if (profileUpdateError) {
        throw profileUpdateError;
      }

      setProfileLoading(true);
      const { data: refreshedProfile, error: refreshProfileError } =
        await supabase
          .from("profiles")
          .select(
            "id, email, display_name, total_xp, current_level, discipline_start_date",
          )
          .eq("id", user.id)
          .single<Profile>();

      if (refreshProfileError) {
        throw refreshProfileError;
      }

      setStrategicTasksLoading(true);
      const { data: refreshedTasks, error: refreshTasksError } = await supabase
        .from("strategic_tasks")
        .select(
          "id, title, description, category, priority, status, xp_reward, created_at",
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .returns<StrategicTask[]>();

      if (refreshTasksError) {
        throw refreshTasksError;
      }

      setProfile(refreshedProfile);
      setProfileError("");
      setStrategicTasks(refreshedTasks ?? []);
      setStrategicTasksError("");

      setXpEventsLoading(true);
      const { data: refreshedXpEvents, error: refreshXpEventsError } =
        await supabase
          .from("xp_events")
          .select("id, description, xp_amount, source_type, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5)
          .returns<XpEvent[]>();
      const { count: refreshedXpEventsCount, error: refreshXpEventsCountError } =
        await supabase
          .from("xp_events")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id);

      if (refreshXpEventsError || refreshXpEventsCountError) {
        throw refreshXpEventsError ?? refreshXpEventsCountError;
      }

      setXpEvents(refreshedXpEvents ?? []);
      setXpEventsCount(refreshedXpEventsCount ?? 0);
      setXpEventsError("");
      setTaskFormMessageType("success");
      setTaskFormMessage(
        `Strategic task completed. +${latestTask.xp_reward} XP awarded.`,
      );
    } catch (error) {
      setTaskFormMessageType("error");
      setTaskFormMessage(
        error instanceof Error
          ? error.message
          : "Unable to complete strategic task.",
      );
    } finally {
      setCompletingTaskId(null);
      setProfileLoading(false);
      setStrategicTasksLoading(false);
      setXpEventsLoading(false);
    }
  }

  async function refreshStrategicTasks(userId: string) {
    setStrategicTasksLoading(true);

    try {
      const supabase = await getSupabase();
      const { data, error } = await supabase
        .from("strategic_tasks")
        .select(
          "id, title, description, category, priority, status, xp_reward, created_at",
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .returns<StrategicTask[]>();

      if (error) {
        throw error;
      }

      setStrategicTasks(data ?? []);
      setStrategicTasksError("");
    } catch (error) {
      setStrategicTasks([]);
      setStrategicTasksError("Unable to load strategic tasks.");
      throw error;
    } finally {
      setStrategicTasksLoading(false);
    }
  }

  async function handleUpdateTaskStatus(
    task: StrategicTask,
    status: StrategicTask["status"],
  ) {
    setTaskFormMessage("");

    if (!user) {
      setTaskFormMessageType("error");
      setTaskFormMessage("Please sign in before managing strategic tasks.");
      return;
    }

    setTaskActionId(`${status}:${task.id}`);

    try {
      const supabase = await getSupabase();
      const { error } = await supabase
        .from("strategic_tasks")
        .update({ status })
        .eq("id", task.id)
        .eq("user_id", user.id);

      if (error) {
        throw error;
      }

      await refreshStrategicTasks(user.id);
      setTaskFormMessageType("success");
      setTaskFormMessage(`Task marked as ${status}.`);
    } catch (error) {
      setTaskFormMessageType("error");
      setTaskFormMessage(
        error instanceof Error ? error.message : "Unable to update task.",
      );
    } finally {
      setTaskActionId(null);
    }
  }

  async function handleDeleteArchivedTask(task: StrategicTask) {
    setTaskFormMessage("");

    if (!user) {
      setTaskFormMessageType("error");
      setTaskFormMessage("Please sign in before deleting strategic tasks.");
      return;
    }

    if (task.status !== "archived") {
      setTaskFormMessageType("error");
      setTaskFormMessage("Only archived tasks can be deleted.");
      return;
    }

    if (!window.confirm("Delete this archived task permanently?")) {
      return;
    }

    setTaskActionId(`delete:${task.id}`);

    try {
      const supabase = await getSupabase();
      const { error } = await supabase
        .from("strategic_tasks")
        .delete()
        .eq("id", task.id)
        .eq("user_id", user.id)
        .eq("status", "archived");

      if (error) {
        throw error;
      }

      await refreshStrategicTasks(user.id);
      setTaskFormMessageType("success");
      setTaskFormMessage("Archived task deleted.");
    } catch (error) {
      setTaskFormMessageType("error");
      setTaskFormMessage(
        error instanceof Error ? error.message : "Unable to delete task.",
      );
    } finally {
      setTaskActionId(null);
    }
  }

  const databaseStatusText =
    databaseStatus === "loading"
      ? "Checking..."
      : databaseStatus === "connected"
        ? "Connected"
        : "Error";
  const displayName = profile?.display_name ?? user?.email ?? "Commander";
  const currentLevel = profileLoading
    ? "Loading..."
    : `Level ${profileLevel}: ${levelTitle}`;
  const currentLevelXp = profileLoading ? 0 : (profile?.total_xp ?? 0) % 1000;
  const progressPercent = (currentLevelXp / 1000) * 100;

  if (authChecking || !user) {
    return (
      <AuthPanel
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        authChecking={authChecking}
        authLoading={authLoading}
        authError={authError}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#07080a] text-zinc-100">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <DashboardHeader
          displayName={displayName}
          currentLevel={currentLevel}
          profileLoading={profileLoading}
          profileError={profileError}
          dailyCheckinsError={dailyCheckinsError}
          strategicTasksError={strategicTasksError}
          onSignOut={handleSignOut}
        />

        <StatCards
          stats={[
            {
              label: "Current Level",
              value: profileLoading ? "..." : String(profileLevel),
              detail: profileLoading ? "Loading" : levelTitle,
            },
            {
              label: "Total XP",
              value: profileLoading ? "..." : String(profile?.total_xp ?? 0),
              detail: "Lifetime earnings",
            },
            {
              label: "Completed Days",
              value: dailyCheckinsLoading ? "..." : String(completedCheckinDays.size),
              detail: "180-Day Grid",
            },
            {
              label: "Active Tasks",
              value: strategicTasksLoading ? "..." : String(activeTasksCount),
              detail: "Strategic tasks",
            },
          ]}
        />

        <DatabaseStatusCard databaseStatusText={databaseStatusText} />

        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex w-full flex-col gap-8 lg:w-2/3">
            <AnalyticsSummary
              completionRate={completionRate}
              xpEventsCount={xpEventsCount}
              activeTasksCount={activeTasksCount}
              completedTasksCount={completedTasksCount}
              currentStreak={currentStreakLabel}
              longestStreak={longestStreakLabel}
            />

            <DisciplineGrid
              dailyCheckinsLoading={dailyCheckinsLoading}
              completedCheckinDays={completedCheckinDays}
              checkinLoading={checkinLoading}
              checkinMessage={checkinMessage}
              checkinMessageType={checkinMessageType}
              onCompleteToday={handleCompleteToday}
            />

            <RpgProgress
              currentLevel={currentLevel}
              currentLevelXp={currentLevelXp}
              progressPercent={progressPercent}
              profileLoading={profileLoading}
            />

            <RecentXpActivity
              xpEvents={xpEvents}
              xpEventsLoading={xpEventsLoading}
              xpEventsError={xpEventsError}
              formatActivityDate={formatActivityDate}
            />
          </div>

          <aside className="flex w-full flex-col gap-8 lg:w-1/3">
            <WeeklyXpAnalytics
              weeklyXpData={weeklyXpData}
              weeklyXpLoading={weeklyXpLoading}
              weeklyXpError={weeklyXpError}
            />

            <XpBySource
              xpSourceData={xpSourceData}
              xpSourceLoading={xpSourceLoading}
              xpSourceError={xpSourceError}
            />

            <WeeklyCompletionAnalytics
              last7DaysCompletion={last7DaysCompletion}
              weeklyCompletedCount={weeklyCompletedCount}
            />

            <MonthlyAnalyticsOverview
              monthlyCompletedDays={monthlyCompletedDays}
              monthlyCompletionRate={monthlyCompletionRate}
              monthlyXpEarned={monthlyXpEarned}
              monthlyTasksCompleted={monthlyTasksCompleted}
              monthlyAnalyticsLoading={monthlyAnalyticsLoading}
              monthlyAnalyticsError={monthlyAnalyticsError}
            />
          </aside>
        </div>

        <div className="mt-12 border-t border-white/10 pt-10">
          <StrategicTasksManager
            taskFilters={taskFilters}
            selectedTaskFilter={selectedTaskFilter}
            setSelectedTaskFilter={setSelectedTaskFilter}
            taskTitle={taskTitle}
            setTaskTitle={setTaskTitle}
            taskDescription={taskDescription}
            setTaskDescription={setTaskDescription}
            taskPriority={taskPriority}
            setTaskPriority={setTaskPriority}
            taskCategory={taskCategory}
            setTaskCategory={setTaskCategory}
            taskXpReward={taskXpReward}
            setTaskXpReward={setTaskXpReward}
            taskFormLoading={taskFormLoading}
            taskFormMessage={taskFormMessage}
            taskFormMessageType={taskFormMessageType}
            handleAddStrategicTask={handleAddStrategicTask}
            strategicTasksLoading={strategicTasksLoading}
            strategicTasksError={strategicTasksError}
            filteredStrategicTasks={filteredStrategicTasks}
            completingTaskId={completingTaskId}
            taskActionId={taskActionId}
            handleCompleteStrategicTask={handleCompleteStrategicTask}
            handleUpdateTaskStatus={handleUpdateTaskStatus}
            handleDeleteArchivedTask={handleDeleteArchivedTask}
          />
        </div>
      </div>
    </main>
  );
}
