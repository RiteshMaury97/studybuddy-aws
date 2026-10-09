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

export default function MindmapPage({ app }) {
  const { page, mindTopic, setMindTopic, mindNodes, setMindNodes } = app;
  return (
    <section className="workspace-page">
      <div className="feature-intro">
        <div className="feature-icon">
          <Network />
        </div>
        <div>
          <h2>See how ideas connect.</h2>
          <p>
            Create a simple editable concept map from a topic and your own
            subtopics. This is a local visual organizer, not an AI-generated
            diagram.
          </p>
        </div>
      </div>
      <div className="panel flash-create">
        <label>
          Main topic
          <input
            value={mindTopic}
            onChange={(e) => setMindTopic(e.target.value)}
            placeholder="e.g. Computer Networks"
          />
        </label>
        <button
          className="send-btn"
          onClick={() =>
            setMindNodes(
              mindTopic
                .split(/[,:;]/)
                .map((x) => x.trim())
                .filter(Boolean)
                .flatMap((x) => [x, "Key concepts", "Examples", "Applications"])
                .slice(0, 12),
            )
          }
        >
          <Network size={15} /> Build concept map
        </button>
      </div>
      {mindNodes.length > 0 && (
        <div className="mindmap">
          <div className="mind-root">{mindNodes[0]}</div>
          <div className="mind-branches">
            {mindNodes.slice(1).map((n, i) => (
              <div className="mind-node" key={i}>
                {n}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
