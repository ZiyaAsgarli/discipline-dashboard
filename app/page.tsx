"use client";

import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

type Profile = {
  id: string;
  email: string | null;
  display_name: string | null;
  total_xp: number;
  current_level: number;
  discipline_start_date: string | null;
};

type DailyCheckin = {
  id: string;
  campaign_day: number;
  completed: boolean;
};

type ExistingDailyCheckin = Pick<DailyCheckin, "id" | "completed">;

type StrategicTask = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  priority: "High" | "Medium" | "Low";
  status: "active" | "completed" | "paused" | "archived";
  xp_reward: number;
  created_at: string;
};

type TaskFilter = "all" | StrategicTask["status"];

type XpEvent = {
  id: string;
  description: string | null;
  xp_amount: number;
  source_type: string;
  created_at: string;
};

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

function getPriorityTone(priority: StrategicTask["priority"]) {
  if (priority === "High") {
    return "border-rose-400/40 bg-rose-500/10 text-rose-200";
  }

  if (priority === "Medium") {
    return "border-amber-300/40 bg-amber-300/10 text-amber-100";
  }

  return "border-[#39ff88]/40 bg-[#39ff88]/10 text-[#baffd2]";
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
  const activeTasksCount = strategicTasks.filter(
    (task) => task.status === "active",
  ).length;
  const completedTasksCount = strategicTasks.filter(
    (task) => task.status === "completed",
  ).length;
  const completionRate = Math.round((completedCheckinsCount / 180) * 100);
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

  const stats = [
    {
      label: "Current Level",
      value: profileLoading
        ? "Loading..."
        : `Level ${profileLevel}`,
      detail: levelTitle,
    },
    {
      label: "Total XP",
      value: profileLoading ? "Loading..." : `${profile?.total_xp ?? 0} XP`,
      detail: "1000 XP to level up",
    },
    {
      label: "Completed Days",
      value: dailyCheckinsLoading
        ? "Loading..."
        : `${completedCheckinsCount} / 180`,
      detail: "Campaign progress",
    },
    {
      label: "Strategic Tasks",
      value: strategicTasksLoading
        ? "Loading..."
        : `${activeTasksCount} Active`,
      detail: "Mission queue",
    },
  ];

  const analyticsSummary = [
    {
      label: "Completion Rate",
      value: dailyCheckinsLoading ? "Loading..." : `${completionRate}%`,
      detail: "Discipline grid",
    },
    {
      label: "XP Events",
      value: xpEventsLoading ? "Loading..." : `${xpEventsCount}`,
      detail: "All recorded activity",
    },
    {
      label: "Completed Tasks",
      value: strategicTasksLoading ? "Loading..." : `${completedTasksCount}`,
      detail: "Finished missions",
    },
    {
      label: "Active Tasks",
      value: strategicTasksLoading ? "Loading..." : `${activeTasksCount}`,
      detail: "Open missions",
    },
  ];

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
      <main className="flex min-h-screen items-center justify-center bg-[#07080a] px-5 text-zinc-100">
        <section className="w-full max-w-md rounded-lg border border-white/10 bg-[#101217] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.36)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39ff88]">
            Discipline Dashboard
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-white">
            Enter the campaign
          </h1>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Sign in or create an account to unlock your personal RPG discipline
            dashboard.
          </p>

          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-zinc-300">Email</span>
              <input
                autoComplete="email"
                className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-[#39ff88]/60"
                disabled={authChecking || authLoading !== null}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                type="email"
                value={email}
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-zinc-300">
                Password
              </span>
              <input
                autoComplete="current-password"
                className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-[#39ff88]/60"
                disabled={authChecking || authLoading !== null}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                type="password"
                value={password}
              />
            </label>
          </div>

          {authError ? (
            <div className="mt-5 rounded-md border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {authError}
            </div>
          ) : null}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              className="rounded-md border border-[#39ff88]/40 bg-[#39ff88] px-4 py-3 text-sm font-semibold text-black transition hover:bg-[#7cffaa] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={authChecking || authLoading !== null}
              onClick={handleSignIn}
              type="button"
            >
              {authLoading === "sign-in" ? "Signing In..." : "Sign In"}
            </button>
            <button
              className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={authChecking || authLoading !== null}
              onClick={handleSignUp}
              type="button"
            >
              {authLoading === "sign-up" ? "Signing Up..." : "Sign Up"}
            </button>
          </div>

          {authChecking ? (
            <p className="mt-5 text-sm text-zinc-500">Checking session...</p>
          ) : null}
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07080a] text-zinc-100">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39ff88]">
              180-Day Campaign
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-5xl">
              Discipline Dashboard
            </h1>
            <p className="mt-3 text-sm font-medium text-[#baffd2]">
              {profileLoading ? "Loading profile..." : `Welcome back, ${displayName}`}
            </p>
            {profileError ? (
              <p className="mt-2 text-sm text-rose-200">{profileError}</p>
            ) : null}
            {dailyCheckinsError ? (
              <p className="mt-2 text-sm text-rose-200">
                {dailyCheckinsError}
              </p>
            ) : null}
            {strategicTasksError ? (
              <p className="mt-2 text-sm text-rose-200">
                {strategicTasksError}
              </p>
            ) : null}
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
              Build discipline like an RPG character: complete the day, earn
              the identity, protect the streak, and keep moving.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:items-end">
            <div className="rounded-md border border-[#39ff88]/30 bg-[#39ff88]/10 px-4 py-3 text-sm font-medium text-[#baffd2] shadow-[0_0_30px_rgba(57,255,136,0.08)]">
              {currentLevel}
            </div>
            <button
              className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-white/[0.08]"
              onClick={handleSignOut}
              type="button"
            >
              Sign Out
            </button>
          </div>
        </header>

        <div className="space-y-6 py-8">
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <article
                className="rounded-lg border border-white/10 bg-[#101217] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.24)]"
                key={stat.label}
              >
                <p className="text-sm font-medium text-zinc-400">
                  {stat.label}
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-white">
                  {stat.value}
                </h2>
                <p className="mt-3 text-sm text-zinc-500">{stat.detail}</p>
              </article>
            ))}
          </section>

          <section className="rounded-lg border border-white/10 bg-[#101116] p-5 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39ff88]">
                  Analytics Summary
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Campaign Signals
                </h2>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {analyticsSummary.map((metric) => (
                <article
                  className="rounded-lg border border-white/10 bg-[#14161c] p-4"
                  key={metric.label}
                >
                  <p className="text-sm font-medium text-zinc-400">
                    {metric.label}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-[#39ff88]">
                    {metric.value}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-500">
                    {metric.detail}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-white/10 bg-[#101217] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.18)] sm:max-w-sm">
            <p className="text-sm font-medium text-zinc-400">
              Database Status
            </p>
            <div className="mt-3 flex items-center gap-3">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  databaseStatus === "connected"
                    ? "bg-[#39ff88] shadow-[0_0_14px_rgba(57,255,136,0.55)]"
                    : databaseStatus === "error"
                      ? "bg-rose-500"
                      : "bg-zinc-500"
                }`}
              />
              <h2 className="text-2xl font-semibold text-white">
                {databaseStatusText}
              </h2>
            </div>
          </section>

          <section className="rounded-lg border border-white/10 bg-[#101116] p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39ff88]">
                  Discipline Streak Map
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  180-Day Discipline Grid
                </h2>
              </div>
              <div className="flex flex-col gap-3 sm:items-end">
                <button
                  className="rounded-md border border-[#39ff88]/40 bg-[#39ff88] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#7cffaa] disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={checkinLoading || profileLoading}
                  onClick={handleCompleteToday}
                  type="button"
                >
                  {checkinLoading ? "Completing..." : "Complete Today"}
                </button>
                <div className="flex gap-4 text-sm text-zinc-400">
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-[2px] bg-[#39ff88]" />
                    Complete
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-[2px] bg-[#451117]" />
                    Incomplete
                  </span>
                </div>
              </div>
            </div>

            {checkinMessage ? (
              <div
                className={`mt-5 rounded-md border px-4 py-3 text-sm ${
                  checkinMessageType === "success"
                    ? "border-[#39ff88]/30 bg-[#39ff88]/10 text-[#baffd2]"
                    : checkinMessageType === "error"
                      ? "border-rose-400/30 bg-rose-500/10 text-rose-100"
                      : "border-white/10 bg-white/[0.04] text-zinc-300"
                }`}
              >
                {checkinMessage}
              </div>
            ) : null}

            <div className="mt-6 grid grid-cols-[repeat(15,minmax(0,1fr))] gap-1 sm:grid-cols-[repeat(18,minmax(0,1fr))] md:grid-cols-[repeat(20,minmax(0,1fr))] lg:grid-cols-[repeat(30,minmax(0,1fr))]">
              {Array.from({ length: 180 }, (_, index) => {
                const day = index + 1;
                const isComplete = completedCheckinDays.has(day);

                return (
                  <div
                    aria-label={`Day ${day}: ${
                      isComplete ? "completed" : "incomplete"
                    }`}
                    className={`aspect-square rounded-[3px] border ${
                      isComplete
                        ? "border-[#7cffaa]/70 bg-[#39ff88] shadow-[0_0_16px_rgba(57,255,136,0.35)]"
                        : "border-red-950/70 bg-[#451117]"
                    }`}
                    key={day}
                    title={`Day ${day}`}
                  />
                );
              })}
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)]">
            <div className="space-y-6">
              <div className="rounded-lg border border-[#39ff88]/20 bg-[#101217] p-6 shadow-[0_0_40px_rgba(57,255,136,0.06)]">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39ff88]">
                  RPG Progress
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-white">
                  {currentLevel}
                </h2>
                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm text-zinc-400">
                    <span>
                      {profileLoading ? "Loading..." : `${currentLevelXp} XP`}
                    </span>
                    <span>1000 XP</span>
                  </div>
                  <div className="mt-3 h-4 overflow-hidden rounded-md border border-white/10 bg-black/50">
                    <div
                      className="h-full rounded-md bg-[#39ff88] shadow-[0_0_18px_rgba(57,255,136,0.45)]"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
                <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300">
                  Every completed day is a stat point. Stay consistent long
                  enough and the character sheet becomes real life.
                </p>
              </div>

              <div className="rounded-lg border border-[#39ff88]/15 bg-[#101116] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39ff88]">
                  Recent XP Activity
                </p>

                <div className="mt-5 space-y-3">
                  {xpEventsLoading ? (
                    <div className="rounded-md border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-400">
                      Loading XP activity...
                    </div>
                  ) : null}

                  {!xpEventsLoading && xpEventsError ? (
                    <div className="rounded-md border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                      {xpEventsError}
                    </div>
                  ) : null}

                  {!xpEventsLoading &&
                  !xpEventsError &&
                  xpEvents.length === 0 ? (
                    <div className="rounded-md border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-400">
                      No XP activity yet.
                    </div>
                  ) : null}

                  {!xpEventsLoading &&
                    xpEvents.map((event) => (
                      <article
                        className="rounded-md border border-white/10 bg-[#14161c] p-4"
                        key={event.id}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-sm font-semibold text-white">
                              {event.description || "XP event"}
                            </h3>
                            <p className="mt-2 text-xs uppercase tracking-[0.12em] text-zinc-500">
                              {event.source_type}
                            </p>
                          </div>
                          <span className="shrink-0 rounded-md border border-[#39ff88]/25 bg-[#39ff88]/10 px-3 py-1 text-sm font-semibold text-[#39ff88] shadow-[0_0_16px_rgba(57,255,136,0.08)]">
                            {event.xp_amount > 0 ? "+" : ""}
                            {event.xp_amount} XP
                          </span>
                        </div>
                        <p className="mt-3 text-xs text-zinc-500">
                          {formatActivityDate(event.created_at)}
                        </p>
                      </article>
                    ))}
                </div>
              </div>
            </div>

            <div>
              <div className="mb-4">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Mission Board
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Strategic Tasks Manager
                </h2>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {taskFilters.map((filter) => (
                  <button
                    className={`rounded-md border px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition ${
                      selectedTaskFilter === filter.value
                        ? "border-[#39ff88]/40 bg-[#39ff88]/10 text-[#baffd2]"
                        : "border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.07]"
                    }`}
                    key={filter.value}
                    onClick={() => setSelectedTaskFilter(filter.value)}
                    type="button"
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              <div className="rounded-lg border border-white/10 bg-[#101116] p-5">
                <div className="grid gap-3">
                  <input
                    className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-[#39ff88]/60"
                    disabled={taskFormLoading}
                    onChange={(event) => setTaskTitle(event.target.value)}
                    placeholder="Task title"
                    type="text"
                    value={taskTitle}
                  />
                  <textarea
                    className="min-h-20 w-full resize-none rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-[#39ff88]/60"
                    disabled={taskFormLoading}
                    onChange={(event) =>
                      setTaskDescription(event.target.value)
                    }
                    placeholder="Description"
                    value={taskDescription}
                  />
                  <div className="grid gap-3 sm:grid-cols-3">
                    <select
                      className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none transition focus:border-[#39ff88]/60"
                      disabled={taskFormLoading}
                      onChange={(event) =>
                        setTaskPriority(
                          event.target.value as StrategicTask["priority"],
                        )
                      }
                      value={taskPriority}
                    >
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                    <input
                      className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-[#39ff88]/60"
                      disabled={taskFormLoading}
                      onChange={(event) => setTaskCategory(event.target.value)}
                      placeholder="Category"
                      type="text"
                      value={taskCategory}
                    />
                    <input
                      className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-[#39ff88]/60"
                      disabled={taskFormLoading}
                      min="0"
                      onChange={(event) => setTaskXpReward(event.target.value)}
                      placeholder="XP reward"
                      type="number"
                      value={taskXpReward}
                    />
                  </div>
                  <button
                    className="rounded-md border border-[#39ff88]/40 bg-[#39ff88] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#7cffaa] disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={taskFormLoading}
                    onClick={handleAddStrategicTask}
                    type="button"
                  >
                    {taskFormLoading ? "Adding..." : "Add Task"}
                  </button>
                </div>

                {taskFormMessage ? (
                  <div
                    className={`mt-4 rounded-md border px-4 py-3 text-sm ${
                      taskFormMessageType === "success"
                        ? "border-[#39ff88]/30 bg-[#39ff88]/10 text-[#baffd2]"
                        : taskFormMessageType === "error"
                          ? "border-rose-400/30 bg-rose-500/10 text-rose-100"
                          : "border-white/10 bg-white/[0.04] text-zinc-300"
                    }`}
                  >
                    {taskFormMessage}
                  </div>
                ) : null}
              </div>

              <div className="mt-4 grid gap-4">
                {strategicTasksLoading ? (
                  <div className="rounded-lg border border-white/10 bg-[#14161c] p-5 text-sm text-zinc-400">
                    Loading strategic tasks...
                  </div>
                ) : null}

                {!strategicTasksLoading && strategicTasksError ? (
                  <div className="rounded-lg border border-rose-400/30 bg-rose-500/10 p-5 text-sm text-rose-100">
                    {strategicTasksError}
                  </div>
                ) : null}

                {!strategicTasksLoading &&
                !strategicTasksError &&
                filteredStrategicTasks.length === 0 ? (
                  <div className="rounded-lg border border-white/10 bg-[#14161c] p-5 text-sm leading-6 text-zinc-400">
                    No tasks match this filter yet.
                  </div>
                ) : null}

                {!strategicTasksLoading &&
                  filteredStrategicTasks.map((task) => (
                    <article
                      className="rounded-lg border border-white/10 bg-[#14161c] p-5"
                      key={task.id}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <div
                          className={`inline-flex rounded-md border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${getPriorityTone(task.priority)}`}
                        >
                          {task.priority}
                        </div>
                        <div className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-300">
                          {task.status}
                        </div>
                        {task.status === "completed" ? (
                          <div className="rounded-md border border-[#39ff88]/30 bg-[#39ff88]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#baffd2]">
                            Completed
                          </div>
                        ) : null}
                        {task.status === "archived" ? (
                          <div className="rounded-md border border-zinc-500/30 bg-zinc-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-300">
                            Archived
                          </div>
                        ) : null}
                        <div className="rounded-md border border-[#39ff88]/20 bg-[#39ff88]/10 px-3 py-1 text-xs font-semibold text-[#baffd2]">
                          {task.xp_reward} XP
                        </div>
                      </div>
                      <h3 className="mt-4 text-lg font-semibold leading-7 text-white">
                        {task.title}
                      </h3>
                      {task.description ? (
                        <p className="mt-2 text-sm leading-6 text-zinc-400">
                          {task.description}
                        </p>
                      ) : null}
                      <p className="mt-3 text-sm text-zinc-500">
                        Category: {task.category || "Uncategorized"}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {task.status === "active" ? (
                          <>
                            <button
                              className="rounded-md border border-[#39ff88]/40 bg-[#39ff88] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#7cffaa] disabled:cursor-not-allowed disabled:opacity-60"
                              disabled={
                                completingTaskId === task.id ||
                                taskActionId !== null
                              }
                              onClick={() => handleCompleteStrategicTask(task)}
                              type="button"
                            >
                              {completingTaskId === task.id
                                ? "Completing..."
                                : "Complete Task"}
                            </button>
                            <button
                              className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
                              disabled={taskActionId !== null}
                              onClick={() =>
                                handleUpdateTaskStatus(task, "paused")
                              }
                              type="button"
                            >
                              {taskActionId === `paused:${task.id}`
                                ? "Pausing..."
                                : "Pause"}
                            </button>
                            <button
                              className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
                              disabled={taskActionId !== null}
                              onClick={() =>
                                handleUpdateTaskStatus(task, "archived")
                              }
                              type="button"
                            >
                              {taskActionId === `archived:${task.id}`
                                ? "Archiving..."
                                : "Archive"}
                            </button>
                          </>
                        ) : null}

                        {task.status === "paused" ? (
                          <>
                            <button
                              className="rounded-md border border-[#39ff88]/40 bg-[#39ff88]/10 px-4 py-2 text-sm font-semibold text-[#baffd2] transition hover:bg-[#39ff88]/15 disabled:cursor-not-allowed disabled:opacity-60"
                              disabled={taskActionId !== null}
                              onClick={() =>
                                handleUpdateTaskStatus(task, "active")
                              }
                              type="button"
                            >
                              {taskActionId === `active:${task.id}`
                                ? "Resuming..."
                                : "Resume"}
                            </button>
                            <button
                              className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
                              disabled={taskActionId !== null}
                              onClick={() =>
                                handleUpdateTaskStatus(task, "archived")
                              }
                              type="button"
                            >
                              {taskActionId === `archived:${task.id}`
                                ? "Archiving..."
                                : "Archive"}
                            </button>
                          </>
                        ) : null}

                        {task.status === "completed" ? (
                          <button
                            className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={taskActionId !== null}
                            onClick={() =>
                              handleUpdateTaskStatus(task, "archived")
                            }
                            type="button"
                          >
                            {taskActionId === `archived:${task.id}`
                              ? "Archiving..."
                              : "Archive"}
                          </button>
                        ) : null}

                        {task.status === "archived" ? (
                          <button
                            className="rounded-md border border-rose-400/30 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={taskActionId !== null}
                            onClick={() => handleDeleteArchivedTask(task)}
                            type="button"
                          >
                            {taskActionId === `delete:${task.id}`
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        ) : null}
                      </div>
                    </article>
                  ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
