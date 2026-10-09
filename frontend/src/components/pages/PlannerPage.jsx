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

export default function PlannerPage({ app }) {
  const { page, setPage, tasks, setTasks, goalMinutes } = app;
  return (
    <section className="workspace-page">
      <div className="feature-intro">
        <div className="feature-icon">
          <CalendarCheck />
        </div>
        <div>
          <h2>A plan you can follow.</h2>
          <p>
            Turn your open tasks into a simple study agenda. Add due dates to
            tasks to make planning more useful.
          </p>
        </div>
      </div>
      <div className="stats-row">
        <div className="stat-card">
          <span>Open tasks</span>
          <strong>{tasks.filter((t) => !t.done).length}</strong>
        </div>
        <div className="stat-card">
          <span>Due this week</span>
          <strong>
            {
              tasks.filter(
                (t) =>
                  !t.done &&
                  t.due &&
                  (new Date(t.due) - new Date()) / 86400000 <= 7 &&
                  new Date(t.due) >= new Date(new Date().toDateString()),
              ).length
            }
          </strong>
        </div>
        <div className="stat-card">
          <span>Study goal</span>
          <strong>{goalMinutes} min/day</strong>
        </div>
      </div>
      <div className="list-heading">
        <h3>Your upcoming study plan</h3>
        <button className="text-action" onClick={() => setPage("tasks")}>
          Manage tasks →
        </button>
      </div>
      <div className="task-list">
        {tasks
          .filter((t) => !t.done)
          .sort((a, b) => (a.due || "9999").localeCompare(b.due || "9999"))
          .map((t) => (
            <article className="task-item" key={t.id}>
              <div className="task-name">
                <strong>{t.text}</strong>
                <small>
                  {t.due || "Schedule a date"} · {t.priority} priority
                </small>
              </div>
              <button
                className="text-action"
                onClick={() =>
                  setTasks((prev) =>
                    prev.map((x) => (x.id === t.id ? { ...x, done: true } : x)),
                  )
                }
              >
                Mark done <CheckCircle2 size={14} />
              </button>
            </article>
          ))}
      </div>
      {!tasks.some((t) => !t.done) && (
        <div className="empty-state">
          <CalendarCheck />
          <strong>Your week is open</strong>
          <span>Add assignments and revision tasks to build your plan.</span>
        </div>
      )}
    </section>
  );
}
