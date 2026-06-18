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
import { useLanguage } from "@/lib/i18n/useLanguage";
import { AuthPanel } from "@/components/AuthPanel";
import { DashboardHeader } from "@/components/DashboardHeader";
import { StatCards } from "@/components/StatCards";
import { DatabaseStatusCard } from "@/components/DatabaseStatusCard";
import { TodayExecutionCard } from "@/components/TodayExecutionCard";
import { AnalyticsSummary } from "@/components/AnalyticsSummary";
import { DisciplineGrid } from "@/components/DisciplineGrid";
import { RpgProgress } from "@/components/RpgProgress";
import { RecentXpActivity } from "@/components/RecentXpActivity";
import { WeeklyXpAnalytics } from "@/components/WeeklyXpAnalytics";
import { XpBySource } from "@/components/XpBySource";
import { WeeklyCompletionAnalytics } from "@/components/WeeklyCompletionAnalytics";
import { MonthlyAnalyticsOverview } from "@/components/MonthlyAnalyticsOverview";
import { StrategicTasksManager } from "@/components/StrategicTasksManager";
import { ReportsExport } from "@/components/ReportsExport";
import {
  getLevelTitle,
  getCurrentLevelXp,
  getLevelProgressPercent,
} from "@/lib/dashboard/levels";
import {
  getTodayDate,
  formatActivityDate,
  getThirtyDaysAgoDate,
  calculateCampaignDay,
} from "@/lib/dashboard/dates";
import {
  calculateCurrentStreak,
  calculateLongestStreak,
  calculateCompletionRate,
  buildWeeklyCompletionData,
  buildWeeklyXpData,
  buildXpBySource,
  calculateMonthlyAnalytics,
} from "@/lib/dashboard/analytics";
async function getSupabase() {
  const { supabase } = await import("@/lib/supabaseClient");
  return supabase;
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
  const { language, changeLanguage, t, mounted } = useLanguage();
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
  const currentStreak = calculateCurrentStreak(completedCampaignDays, completedCheckinDays);
  const longestStreak = calculateLongestStreak(completedCampaignDays);

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
  const completionRate = calculateCompletionRate(completedCheckinsCount, 180);

  const last7DaysCompletion = buildWeeklyCompletionData(
    profile?.discipline_start_date,
    completedCheckinDays
  );
  const weeklyCompletedCount = last7DaysCompletion.filter(
    (d) => d.completed,
  ).length;

  const { monthlyCompletedDays, monthlyCompletionRate } = calculateMonthlyAnalytics(
    profile?.discipline_start_date,
    completedCheckinDays
  );

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

        const chartData = buildWeeklyXpData(data ?? []);
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

        const sourceData = buildXpBySource(data ?? []);
        setXpSourceData(sourceData);
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
        const startDateStr = getThirtyDaysAgoDate();

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
    const campaignDay = calculateCampaignDay(today, profile.discipline_start_date);

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

  const displayName = profile?.display_name ?? user?.email ?? "Commander";
  const currentLevel = profileLoading
    ? "Loading..."
    : `Level ${profileLevel}: ${levelTitle}`;
  const currentLevelXp = profileLoading ? 0 : getCurrentLevelXp(profile?.total_xp ?? 0);
  const progressPercent = profileLoading ? 0 : getLevelProgressPercent(profile?.total_xp ?? 0);

  if (!mounted) return null;

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
        t={t.app}
        language={language}
        onLanguageChange={changeLanguage}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#07080a] text-zinc-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col px-4 py-6 md:px-8 md:py-10">
        <DashboardHeader
          displayName={displayName}
          currentLevel={currentLevel}
          profileLoading={profileLoading}
          profileError={profileError}
          dailyCheckinsError={dailyCheckinsError}
          strategicTasksError={strategicTasksError}
          onSignOut={handleSignOut}
          t={t.app}
          language={language}
          onLanguageChange={changeLanguage}
        />

        <DatabaseStatusCard 
          status={databaseStatus} 
          statusText={
            databaseStatus === "connected" ? t.app.dbConnected : 
            databaseStatus === "loading" ? "Checking..." : 
            "Error"
          } 
        />

        {/* Mobile Main Action Area */}
        <div className="mt-4 md:mt-8">
          <TodayExecutionCard
            currentLevel={currentLevel}
            currentLevelXp={currentLevelXp}
            progressPercent={progressPercent}
            profileLoading={profileLoading}
            dailyCheckinsLoading={dailyCheckinsLoading}
            checkinLoading={checkinLoading}
            checkinMessage={checkinMessage}
            checkinMessageType={checkinMessageType}
            onCompleteToday={handleCompleteToday}
            t={t.app}
          />
        </div>

        <StatCards
          stats={[
            {
              label: t.app.currentLevel,
              value: profileLoading ? "..." : String(profileLevel),
              detail: profileLoading ? "..." : levelTitle,
            },
            {
              label: t.app.totalXp,
              value: profileLoading ? "..." : String(profile?.total_xp ?? 0),
              detail: "Lifetime earnings",
            },
            {
              label: t.app.completedDays,
              value: dailyCheckinsLoading ? "..." : String(completedCheckinDays.size),
              detail: t.app.campaign180,
            },
            {
              label: t.app.activeTasks,
              value: strategicTasksLoading ? "..." : String(activeTasksCount),
              detail: "Strategic tasks",
            },
          ]}
        />

        {/* Desktop grid layout vs mobile stacked */}
        <div className="mt-6 flex flex-col gap-6 md:mt-10 md:gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex w-full flex-col gap-6 md:gap-8 lg:w-[60%]">
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
              t={t.app}
            />

            <DisciplineGrid
              dailyCheckinsLoading={dailyCheckinsLoading}
              completedCheckinDays={completedCheckinDays}
              t={t.app}
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
              t={t.app}
            />
          </div>

          <aside className="flex w-full flex-col gap-6 md:gap-8 lg:w-[40%]">
            <AnalyticsSummary
              completionRate={completionRate}
              xpEventsCount={xpEventsCount}
              activeTasksCount={activeTasksCount}
              completedTasksCount={completedTasksCount}
              currentStreak={currentStreakLabel}
              longestStreak={longestStreakLabel}
              t={t.app}
            />
            
            <WeeklyCompletionAnalytics
              last7DaysCompletion={last7DaysCompletion}
              weeklyCompletedCount={weeklyCompletedCount}
              t={t.app}
            />

            <MonthlyAnalyticsOverview
              monthlyCompletedDays={monthlyCompletedDays}
              monthlyCompletionRate={monthlyCompletionRate}
              monthlyXpEarned={monthlyXpEarned}
              monthlyTasksCompleted={monthlyTasksCompleted}
              monthlyAnalyticsLoading={monthlyAnalyticsLoading}
              monthlyAnalyticsError={monthlyAnalyticsError}
              t={t.app}
            />

            <WeeklyXpAnalytics
              weeklyXpData={weeklyXpData}
              weeklyXpLoading={weeklyXpLoading}
              weeklyXpError={weeklyXpError}
              t={t.app}
            />

            <XpBySource
              xpSourceData={xpSourceData}
              xpSourceLoading={xpSourceLoading}
              xpSourceError={xpSourceError}
              t={t.app}
            />

            <ReportsExport
              profile={profile}
              dailyCheckins={dailyCheckins}
              xpEvents={xpEvents}
              xpEventsCount={xpEventsCount}
              strategicTasks={strategicTasks}
              analytics={{
                currentStreak,
                longestStreak,
                completionRate,
                monthlyCompletedDays,
                monthlyCompletionRate,
                monthlyXpEarned,
                monthlyTasksCompleted,
              }}
              t={t.app}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}
