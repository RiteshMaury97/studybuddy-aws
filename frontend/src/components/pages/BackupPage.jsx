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

export default function BackupPage({ app }) {
  const {
    page,
    setError,
    notes,
    setNotes,
    tasks,
    setTasks,
    focusSessions,
    flashcards,
    setFlashcards,
    exams,
    setExams,
    goalMinutes,
    dailyMinutes,
  } = app;
  return (
    <section className="workspace-page">
      <div className="feature-intro">
        <div className="feature-icon">
          <Download />
        </div>
        <div>
          <h2>Your data, in your hands.</h2>
          <p>
            Export your browser-stored StudyBuddy data to a JSON backup or
            plain-text notes file. Keep backups somewhere safe.
          </p>
        </div>
      </div>
      <div className="panel note-form">
        <button
          className="send-btn"
          onClick={() => {
            const blob = new Blob(
              [
                JSON.stringify(
                  {
                    notes,
                    tasks,
                    flashcards,
                    exams,
                    focusSessions,
                    goalMinutes,
                    dailyMinutes,
                  },
                  null,
                  2,
                ),
              ],
              { type: "application/json" },
            );
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "studybuddy-backup.json";
            a.click();
            URL.revokeObjectURL(a.href);
          }}
        >
          <Download size={15} /> Export full JSON backup
        </button>
        <button
          className="reset-btn"
          onClick={() => {
            const content = notes
              .map(
                (n) =>
                  `# ${n.title}\nSubject: ${n.subject || "General"}\n\n${n.body}`,
              )
              .join("\n\n---\n\n");
            const a = document.createElement("a");
            a.href = URL.createObjectURL(
              new Blob([content], { type: "text/plain" }),
            );
            a.download = "studybuddy-notes.txt";
            a.click();
            URL.revokeObjectURL(a.href);
          }}
        >
          <FileText size={15} /> Export notes as text
        </button>
        <label>
          Restore JSON backup
          <input
            type="file"
            accept="application/json,.json"
            onChange={async (e) => {
              try {
                const data = JSON.parse(await e.target.files[0].text());
                if (data.notes) setNotes(data.notes);
                if (data.tasks) setTasks(data.tasks);
                if (data.flashcards) setFlashcards(data.flashcards);
                if (data.exams) setExams(data.exams);
                setError(
                  "Backup imported where supported. Please review your restored data.",
                );
              } catch {
                setError("This file is not a valid StudyBuddy JSON backup.");
              }
            }}
          />
        </label>
      </div>
    </section>
  );
}
