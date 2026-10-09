import {
  Accessibility,
  BarChart3,
  BookMarked,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Download,
  FileText,
  Layers3,
  Lightbulb,
  ListTodo,
  Mic,
  Network,
  Plus,
  RotateCcw,
  Search,
  StickyNote,
  Target,
  Timer,
  Trash2,
  WandSparkles,
} from "lucide-react";

export default function TasksPage({ app }) {
  const {
    page,
    tasks,
    setTasks,
    taskText,
    setTaskText,
    taskDue,
    setTaskDue,
    taskPriority,
    setTaskPriority,
    addTask,
    completed,
  } = app;
  return (
    <section className="workspace-page">
      <div className="stats-row">
        <div className="stat-card">
          <span>Total tasks</span>
          <strong>{tasks.length}</strong>
        </div>
        <div className="stat-card">
          <span>Completed</span>
          <strong>{completed}</strong>
        </div>
        <div className="stat-card">
          <span>Remaining</span>
          <strong>{tasks.length - completed}</strong>
        </div>
      </div>
      <form className="panel task-form" onSubmit={addTask}>
        <label>
          What do you need to study?
          <input
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            placeholder="e.g. Revise binary trees"
            required
          />
        </label>
        <div className="task-fields">
          <label>
            Due date
            <input
              type="date"
              value={taskDue}
              onChange={(e) => setTaskDue(e.target.value)}
            />
          </label>
          <label>
            Priority
            <select
              value={taskPriority}
              onChange={(e) => setTaskPriority(e.target.value)}
            >
              <option>Low</option>
              <option>Normal</option>
              <option>High</option>
            </select>
          </label>
          <button className="send-btn" type="submit">
            <Plus size={16} /> Add task
          </button>
        </div>
      </form>
      <div className="list-heading">
        <h3>Your study checklist</h3>
        <button
          className="text-action"
          onClick={() => setTasks((prev) => prev.filter((t) => !t.done))}
        >
          Clear completed
        </button>
      </div>
      <div className="task-list">
        {tasks.map((t) => (
          <article
            className={`task-item ${t.done ? "task-done" : ""}`}
            key={t.id}
          >
            <label className="task-check">
              <input
                type="checkbox"
                checked={t.done}
                onChange={(e) =>
                  setTasks((prev) =>
                    prev.map((x) =>
                      x.id === t.id ? { ...x, done: e.target.checked } : x,
                    ),
                  )
                }
              />
              <span className="custom-check">
                <CheckCircle2 size={17} />
              </span>
              <span className="task-name">
                {t.text}
                <small>
                  {t.due ? `Due ${t.due}` : "No due date"} · {t.priority}{" "}
                  priority
                </small>
              </span>
            </label>
            <button
              className="icon-btn danger"
              aria-label="Delete task"
              onClick={() =>
                setTasks((prev) => prev.filter((x) => x.id !== t.id))
              }
            >
              <Trash2 size={15} />
            </button>
          </article>
        ))}
      </div>
      {tasks.length === 0 && (
        <div className="empty-state">
          <ListTodo size={25} />
          <strong>Your list is clear</strong>
          <span>Add an assignment, revision goal, or study task above.</span>
        </div>
      )}
    </section>
  );
}
