import type { StrategicTask, TaskFilter } from "./types";

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
}) {
  return (
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
            onChange={(event) => setTaskDescription(event.target.value)}
            placeholder="Description"
            value={taskDescription}
          />
          <div className="grid gap-3 sm:grid-cols-3">
            <select
              className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none transition focus:border-[#39ff88]/60"
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
            <p className="font-medium text-zinc-300">
              No tasks in this status yet.
            </p>
            <p className="mt-1 text-zinc-500">
              Create a strategic task to turn long-term goals into XP.
            </p>
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
                      className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={taskActionId !== null}
                      onClick={() => handleUpdateTaskStatus(task, "paused")}
                      type="button"
                    >
                      {taskActionId === `paused:${task.id}`
                        ? "Pausing..."
                        : "Pause"}
                    </button>
                    <button
                      className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
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
                      className="rounded-md border border-[#39ff88]/40 bg-[#39ff88]/10 px-4 py-2 text-sm font-semibold text-[#baffd2] transition hover:bg-[#39ff88]/15 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={taskActionId !== null}
                      onClick={() => handleUpdateTaskStatus(task, "active")}
                      type="button"
                    >
                      {taskActionId === `active:${task.id}`
                        ? "Resuming..."
                        : "Resume"}
                    </button>
                    <button
                      className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
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
                    className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
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
  );
}
