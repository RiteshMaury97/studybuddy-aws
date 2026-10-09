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

export default function ExamsPage({ app }) {
  const {
    page,
    notes,
    examName,
    setExamName,
    examDate,
    setExamDate,
    exams,
    setExams,
  } = app;
  return (
    <section className="workspace-page">
      <div className="feature-intro">
        <div className="feature-icon">
          <CalendarDays />
        </div>
        <div>
          <h2>Know what you're working toward.</h2>
          <p>
            Save exam dates and see how many days remain. Dates are stored on
            this browser.
          </p>
        </div>
      </div>
      <form
        className="panel task-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (examName.trim() && examDate)
            setExams((prev) => [
              {
                id: crypto.randomUUID(),
                name: examName.trim(),
                date: examDate,
              },
              ...prev,
            ]);
          setExamName("");
          setExamDate("");
        }}
      >
        <label>
          Exam or deadline
          <input
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            required
            placeholder="e.g. Data Structures midterm"
          />
        </label>
        <div className="task-fields">
          <label>
            Exam date
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              required
            />
          </label>
          <button className="send-btn" type="submit">
            <Plus size={15} /> Add exam
          </button>
        </div>
      </form>
      <div className="notes-grid">
        {exams.map((x) => (
          <article className="panel saved-note" key={x.id}>
            <div className="note-tag">EXAM COUNTDOWN</div>
            <h3>{x.name}</h3>
            <strong>
              {Math.ceil(
                (new Date(x.date + "T00:00:00") -
                  new Date(new Date().toDateString())) /
                  86400000,
              )}{" "}
              days to go
            </strong>
            <p>{x.date}</p>
            <button
              className="icon-btn danger"
              onClick={() =>
                setExams((prev) => prev.filter((y) => y.id !== x.id))
              }
            >
              <Trash2 size={15} />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
