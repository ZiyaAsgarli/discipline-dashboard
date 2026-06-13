import type { StrategicTask, TaskFilter } from "./types";
import type { translations } from "@/lib/i18n/translations";

function getPriorityTone(priority: StrategicTask["priority"]) {
  if (priority === "High") {
    return "border-rose-400/40 bg-rose-500/10 text-rose-200";
  }
  if (priority === "Medium") {
    return "border-amber-300/40 bg-amber-300/10 text-amber-100";
  }
  return "border-[#39ff88]/40 bg-[#39ff88]/10 text-[#baffd2]";
}

export function StrategicTasksManager({
  taskFilters,
  selectedTaskFilter,
  setSelectedTaskFilter,
  taskTitle,
  setTaskTitle,
  taskDescription,
  setTaskDescription,
  taskPriority,
  setTaskPriority,
  taskCategory,
  setTaskCategory,
  taskXpReward,
  setTaskXpReward,
  taskFormLoading,
  taskFormMessage,
  taskFormMessageType,
  handleAddStrategicTask,
  strategicTasksLoading,
  strategicTasksError,
  filteredStrategicTasks,
  completingTaskId,
  taskActionId,
  handleCompleteStrategicTask,
  handleUpdateTaskStatus,
  handleDeleteArchivedTask,
  t,
}: {
  taskFilters: { label: string; value: TaskFilter }[];
  selectedTaskFilter: TaskFilter;
  setSelectedTaskFilter: (filter: TaskFilter) => void;
  taskTitle: string;
  setTaskTitle: (val: string) => void;
  taskDescription: string;
  setTaskDescription: (val: string) => void;
  taskPriority: StrategicTask["priority"];
  setTaskPriority: (val: StrategicTask["priority"]) => void;
  taskCategory: string;
  setTaskCategory: (val: string) => void;
  taskXpReward: string;
  setTaskXpReward: (val: string) => void;
  taskFormLoading: boolean;
  taskFormMessage: string;
  taskFormMessageType: "success" | "error" | "info";
  handleAddStrategicTask: () => void;
  strategicTasksLoading: boolean;
  strategicTasksError: string;
  filteredStrategicTasks: StrategicTask[];
  completingTaskId: string | null;
  taskActionId: string | null;
  handleCompleteStrategicTask: (task: StrategicTask) => void;
  handleUpdateTaskStatus: (
    task: StrategicTask,
    status: StrategicTask["status"],
  ) => void;
  handleDeleteArchivedTask: (task: StrategicTask) => void;
  t: typeof translations.en.app;
}) {
  return (
    <div>
      <div className="mb-4">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
          Mission Board
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">
          {t.strategicTasks}
        </h2>
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {taskFilters.map((filter) => (
          <button
            className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider transition md:text-xs md:tracking-[0.12em] ${
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

      <div className="rounded-xl border border-white/5 bg-[#101217] p-3 shadow-sm md:p-5">
        <div className="grid gap-2 md:gap-3">
          <input
            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-white outline-none transition placeholder:text-zinc-600 focus:border-[#39ff88]/60 md:py-2 md:text-sm"
            disabled={taskFormLoading}
            onChange={(event) => setTaskTitle(event.target.value)}
            placeholder={t.taskTitle}
            type="text"
            value={taskTitle}
          />
          <textarea
            className="min-h-12 w-full resize-none rounded-lg border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-white outline-none transition placeholder:text-zinc-600 focus:border-[#39ff88]/60 md:min-h-20 md:py-2 md:text-sm"
            disabled={taskFormLoading}
            onChange={(event) => setTaskDescription(event.target.value)}
            placeholder={t.description}
            value={taskDescription}
          />
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
            <select
              className="rounded-lg border border-white/10 bg-black/30 px-2 py-1.5 text-xs text-white outline-none transition focus:border-[#39ff88]/60 md:px-3 md:py-2 md:text-sm"
              disabled={taskFormLoading}
              onChange={(event) =>
                setTaskPriority(event.target.value as StrategicTask["priority"])
              }
              value={taskPriority}
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            <input
              className="rounded-lg border border-white/10 bg-black/30 px-2 py-1.5 text-xs text-white outline-none transition placeholder:text-zinc-600 focus:border-[#39ff88]/60 md:px-3 md:py-2 md:text-sm"
              disabled={taskFormLoading}
              onChange={(event) => setTaskCategory(event.target.value)}
              placeholder={t.category}
              type="text"
              value={taskCategory}
            />
            <input
              className="col-span-2 rounded-lg border border-white/10 bg-black/30 px-2 py-1.5 text-xs text-white outline-none transition placeholder:text-zinc-600 focus:border-[#39ff88]/60 md:col-span-1 md:px-3 md:py-2 md:text-sm"
              disabled={taskFormLoading}
              min="0"
              onChange={(event) => setTaskXpReward(event.target.value)}
              placeholder="XP reward"
              type="number"
              value={taskXpReward}
            />
          </div>
          <button
            className="rounded-lg border border-[#39ff88]/40 bg-[#39ff88] px-3 py-1.5 text-xs font-bold text-black transition hover:bg-[#7cffaa] disabled:cursor-not-allowed disabled:opacity-60 md:px-4 md:py-2 md:text-sm"
            disabled={taskFormLoading}
            onClick={handleAddStrategicTask}
            type="button"
          >
            {taskFormLoading ? "..." : t.addTask}
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
          <div className="rounded-lg border border-white/10 bg-[#101217] p-4 text-xs leading-5 text-zinc-400">
            <p className="font-medium text-zinc-300">
              {t.noTasksYet}
            </p>
          </div>
        ) : null}

        {!strategicTasksLoading &&
          filteredStrategicTasks.map((task) => (
            <article
              className="rounded-xl border border-white/5 bg-[#101217] p-3 shadow-sm md:p-5"
              key={task.id}
            >
              <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
                <div
                  className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider md:px-3 md:py-1 md:text-xs md:tracking-[0.12em] ${getPriorityTone(task.priority)}`}
                >
                  {task.priority}
                </div>
                <div className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-300 md:px-3 md:py-1 md:text-xs md:tracking-[0.12em]">
                  {task.status}
                </div>
                {task.status === "completed" ? (
                  <div className="rounded-md border border-[#39ff88]/30 bg-[#39ff88]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#baffd2] md:px-3 md:py-1 md:text-xs md:tracking-[0.12em]">
                    Completed
                  </div>
                ) : null}
                {task.status === "archived" ? (
                  <div className="rounded-md border border-zinc-500/30 bg-zinc-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-300 md:px-3 md:py-1 md:text-xs md:tracking-[0.12em]">
                    Archived
                  </div>
                ) : null}
                <div className="rounded-md border border-[#39ff88]/20 bg-[#39ff88]/10 px-2 py-0.5 text-[10px] font-bold text-[#baffd2] md:px-3 md:py-1 md:text-xs">
                  {task.xp_reward} XP
                </div>
              </div>
              <h3 className="mt-3 text-base font-bold leading-6 text-white md:mt-4 md:text-lg">
                {task.title}
              </h3>
              {task.description ? (
                <p className="mt-1 text-xs leading-5 text-zinc-400 md:mt-2 md:text-sm">
                  {task.description}
                </p>
              ) : null}
              <p className="mt-2 text-[10px] text-zinc-500 md:mt-3 md:text-xs">
                Category: {task.category || "Uncategorized"}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 md:mt-4">
                {task.status === "active" ? (
                  <>
                    <button
                      className="rounded-lg border border-[#39ff88]/40 bg-[#39ff88] px-3 py-1.5 text-[10px] font-bold text-black transition hover:bg-[#7cffaa] disabled:cursor-not-allowed disabled:opacity-60 md:px-4 md:py-2 md:text-xs"
                      disabled={
                        completingTaskId === task.id || taskActionId !== null
                      }
                      onClick={() => handleCompleteStrategicTask(task)}
                      type="button"
                    >
                      {completingTaskId === task.id
                        ? "Completing..."
                        : "Complete Task"}
                    </button>
                    <button
                      className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-semibold text-zinc-200 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60 md:px-4 md:py-2 md:text-xs"
                      disabled={taskActionId !== null}
                      onClick={() => handleUpdateTaskStatus(task, "paused")}
                      type="button"
                    >
                      {taskActionId === `paused:${task.id}`
                        ? "Pausing..."
                        : "Pause"}
                    </button>
                    <button
                      className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-semibold text-zinc-200 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60 md:px-4 md:py-2 md:text-xs"
                      disabled={taskActionId !== null}
                      onClick={() => handleUpdateTaskStatus(task, "archived")}
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
                      className="rounded-lg border border-[#39ff88]/40 bg-[#39ff88]/10 px-3 py-1.5 text-[10px] font-semibold text-[#baffd2] transition hover:bg-[#39ff88]/15 disabled:cursor-not-allowed disabled:opacity-60 md:px-4 md:py-2 md:text-xs"
                      disabled={taskActionId !== null}
                      onClick={() => handleUpdateTaskStatus(task, "active")}
                      type="button"
                    >
                      {taskActionId === `active:${task.id}`
                        ? "Resuming..."
                        : "Resume"}
                    </button>
                    <button
                      className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-semibold text-zinc-200 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60 md:px-4 md:py-2 md:text-xs"
                      disabled={taskActionId !== null}
                      onClick={() => handleUpdateTaskStatus(task, "archived")}
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
                    className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-semibold text-zinc-200 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60 md:px-4 md:py-2 md:text-xs"
                    disabled={taskActionId !== null}
                    onClick={() => handleUpdateTaskStatus(task, "archived")}
                    type="button"
                  >
                    {taskActionId === `archived:${task.id}`
                      ? "Archiving..."
                      : "Archive"}
                  </button>
                ) : null}

                {task.status === "archived" ? (
                  <button
                    className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-1.5 text-[10px] font-semibold text-rose-100 transition hover:bg-rose-500/15 disabled:cursor-not-allowed disabled:opacity-60 md:px-4 md:py-2 md:text-xs"
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
  );
}
