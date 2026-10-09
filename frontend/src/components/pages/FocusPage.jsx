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

export default function FocusPage({ app }) {
  const {
    page,
    notes,
    seconds,
    setSeconds,
    timerRunning,
    setTimerRunning,
    focusSessions,
    flashcards,
    completed,
    formatTime,
  } = app;
  return (
    <section className="workspace-page">
      <div className="focus-card panel">
        <div className="focus-orbit">
          <Timer size={27} />
        </div>
        <span className="eyebrow">POMODORO FOCUS SESSION</span>
        <h2>One thing at a time.</h2>
        <p>Put distractions aside and give your attention to one small goal.</p>
        <div className="timer-display">{formatTime(seconds)}</div>
        <div className="timer-controls">
          <button
            className="send-btn"
            onClick={() => setTimerRunning((v) => !v)}
          >
            {timerRunning
              ? "Pause session"
              : seconds === 0
                ? "Start again"
                : "Start focus"}
          </button>
          <button
            className="reset-btn"
            onClick={() => {
              setTimerRunning(false);
              setSeconds(25 * 60);
            }}
          >
            <RotateCcw size={15} /> Reset 25 min
          </button>
          <button
            className="reset-btn"
            onClick={() => {
              setTimerRunning(false);
              setSeconds(5 * 60);
            }}
          >
            5 min break
          </button>
        </div>
        <div className="focus-foot">
          <span>
            <CheckCircle2 size={16} /> {focusSessions} completed sessions on
            this browser
          </span>
          <span>25 min focus · 5 min break</span>
        </div>
      </div>
      <div className="panel focus-tip">
        <Lightbulb size={20} />
        <div>
          <strong>Try this</strong>
          <p>
            Before you start, write down one specific outcome: finish two pages
            of notes, solve three problems, or review ten flashcards.
          </p>
        </div>
      </div>
    </section>
  );
}
