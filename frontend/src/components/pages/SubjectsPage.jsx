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

export default function SubjectsPage({ app }) {
  const { page, notes, tasks, subject, subjectFilter, setSubjectFilter } = app;
  return (
    <section className="workspace-page">
      <div className="feature-intro">
        <div className="feature-icon">
          <BookOpen />
        </div>
        <div>
          <h2>Everything for a subject, together.</h2>
          <p>
            Organize notes by subject and filter your saved knowledge.
            Assignments are listed below.
          </p>
        </div>
      </div>
      <div className="panel">
        <label>
          Filter by subject
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
          >
            <option>All subjects</option>
            {Array.from(new Set(notes.map((n) => n.subject || "General"))).map(
              (x) => (
                <option key={x}>{x}</option>
              ),
            )}
          </select>
        </label>
      </div>
      <div className="notes-grid">
        {notes
          .filter(
            (n) =>
              subjectFilter === "All subjects" ||
              (n.subject || "General") === subjectFilter,
          )
          .map((n) => (
            <article className="panel saved-note" key={n.id}>
              <span className="note-tag">{n.subject || "General"}</span>
              <h3>{n.title}</h3>
              <p>{n.body}</p>
            </article>
          ))}
      </div>
      <div className="list-heading">
        <h3>Assignments</h3>
      </div>
      <div className="task-list">
        {tasks
          .filter(
            (t) =>
              subjectFilter === "All subjects" ||
              (t.subject || "General") === subjectFilter,
          )
          .map((t) => (
            <article className="task-item" key={t.id}>
              <span>{t.text}</span>
              <small>{t.due || "No due date"}</small>
            </article>
          ))}
      </div>
    </section>
  );
}
