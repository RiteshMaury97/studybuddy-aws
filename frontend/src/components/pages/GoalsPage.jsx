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

export default function GoalsPage({ app }) {
  const { page, goalMinutes, setGoalMinutes, dailyMinutes, setDailyMinutes } =
    app;
  return (
    <section className="workspace-page">
      <div className="feature-intro">
        <div className="feature-icon">
          <Target />
        </div>
        <div>
          <h2>Small goals, steady progress.</h2>
          <p>
            Choose a daily study target and track the minutes you log on this
            device.
          </p>
        </div>
      </div>
      <div className="panel note-form">
        <label>
          Daily study target (minutes)
          <input
            type="number"
            min="5"
            max="720"
            value={goalMinutes}
            onChange={(e) => setGoalMinutes(Number(e.target.value) || 5)}
          />
        </label>
        <label>
          Minutes studied today
          <input
            type="number"
            min="0"
            max="1440"
            value={dailyMinutes}
            onChange={(e) => setDailyMinutes(Number(e.target.value) || 0)}
          />
        </label>
        <div className="progress-track">
          <span
            style={{
              width: `${Math.min(100, (dailyMinutes / Math.max(goalMinutes, 1)) * 100)}%`,
            }}
          />
        </div>
        <strong>
          {Math.min(
            100,
            Math.round((dailyMinutes / Math.max(goalMinutes, 1)) * 100),
          )}
          % of today's goal
        </strong>
      </div>
    </section>
  );
}
