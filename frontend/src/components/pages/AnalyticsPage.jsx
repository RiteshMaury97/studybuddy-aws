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

export default function AnalyticsPage({ app }) {
  const { page, notes, tasks, focusSessions, flashcards, exams, completed } =
    app;
  return (
    <section className="workspace-page">
      <div className="feature-intro">
        <div className="feature-icon">
          <BarChart3 />
        </div>
        <div>
          <h2>Notice your progress.</h2>
          <p>
            These metrics are calculated from activity stored in this browser,
            not from a verified server-wide account.
          </p>
        </div>
      </div>
      <div className="stats-row">
        <div className="stat-card">
          <span>Notes saved</span>
          <strong>{notes.length}</strong>
        </div>
        <div className="stat-card">
          <span>Tasks completed</span>
          <strong>{completed}</strong>
        </div>
        <div className="stat-card">
          <span>Focus sessions</span>
          <strong>{focusSessions}</strong>
        </div>
      </div>
      <div className="panel">
        <h3>Study activity</h3>
        <p>
          {tasks.length ? Math.round((completed / tasks.length) * 100) : 0}% of
          tasks completed
        </p>
        <div className="progress-track">
          <span
            style={{
              width: `${tasks.length ? (completed / tasks.length) * 100 : 0}%`,
            }}
          />
        </div>
        <p>
          {flashcards.length} flashcards · {exams.length} exams tracked ·{" "}
          {notes.length} saved notes
        </p>
      </div>
    </section>
  );
}
