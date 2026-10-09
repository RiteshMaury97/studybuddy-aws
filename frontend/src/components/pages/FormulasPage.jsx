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

export default function FormulasPage({ app }) {
  const {
    page,
    setPage,
    notes,
    setNoteTitle,
    setNoteBody,
    setSubject,
    setNoteTag,
  } = app;
  return (
    <section className="workspace-page">
      <div className="feature-intro">
        <div className="feature-icon">
          <BookMarked />
        </div>
        <div>
          <h2>Your quick-revision shelf.</h2>
          <p>
            Save formulas, definitions, commands, and exam reminders as
            specially tagged notes.
          </p>
        </div>
      </div>
      <button
        className="send-btn"
        onClick={() => {
          setSubject("Formula & Cheat Sheets");
          setNoteTag("formula");
          setNoteTitle("New formula / cheat sheet");
          setNoteBody(
            "Topic:\nFormula or definition:\nWhat each symbol means:\nExample:",
          );
          setPage("notes");
        }}
      >
        <Plus size={15} /> Create a cheat sheet
      </button>
      <div className="notes-grid">
        {notes
          .filter(
            (n) =>
              (n.subject || "").toLowerCase().includes("formula") ||
              (n.tag || "").toLowerCase().includes("formula") ||
              (n.tag || "").toLowerCase().includes("cheat"),
          )
          .map((n) => (
            <article className="panel saved-note" key={n.id}>
              <h3>{n.title}</h3>
              <p>{n.body}</p>
              <small>{n.subject}</small>
            </article>
          ))}
      </div>
    </section>
  );
}
