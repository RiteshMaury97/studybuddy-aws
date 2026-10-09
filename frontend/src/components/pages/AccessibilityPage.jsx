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

export default function AccessibilityPage({ app }) {
  const { page, textScale, setTextScale } = app;
  return (
    <section className="workspace-page">
      <div className="feature-intro">
        <div className="feature-icon">
          <Accessibility />
        </div>
        <div>
          <h2>Make your workspace comfortable.</h2>
          <p>
            Adjust interface text size. The app also supports keyboard
            navigation and reduced-motion preferences from your operating
            system.
          </p>
        </div>
      </div>
      <div className="panel note-form">
        <label>
          Text size: {textScale}%
          <input
            type="range"
            min="85"
            max="130"
            step="5"
            value={textScale}
            onChange={(e) => setTextScale(Number(e.target.value))}
          />
        </label>
        <div className="form-actions">
          <button className="reset-btn" onClick={() => setTextScale(100)}>
            <RotateCcw size={15} /> Reset text size
          </button>
          <span>Current preview: StudyBuddy helps you learn.</span>
        </div>
      </div>
    </section>
  );
}
