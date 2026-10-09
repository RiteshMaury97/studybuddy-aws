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

export default function QuizPage({ app }) {
  const {
    page,
    setPage,
    setFlashTopic,
    flashcards,
    quizTopic,
    setQuizTopic,
    quizCount,
    setQuizCount,
    askAI,
  } = app;
  return (
    <section className="workspace-page">
      <div className="feature-intro">
        <div className="feature-icon">
          <ClipboardList />
        </div>
        <div>
          <h2>Practice before the exam.</h2>
          <p>
            Ask StudyBuddy to create a quiz, mock test, or short-answer practice
            set. AI responses require your backend API to be configured.
          </p>
        </div>
      </div>
      <form
        className="panel note-form"
        onSubmit={(e) => {
          e.preventDefault();
          askAI(
            `Create ${quizCount} practice questions on ${quizTopic}. Include a mix of multiple-choice and short-answer questions, an answer key, and brief explanations.`,
            "quiz",
          );
        }}
      >
        <label>
          Topic
          <input
            required
            value={quizTopic}
            onChange={(e) => setQuizTopic(e.target.value)}
            placeholder="e.g. Operating systems, recursion"
          />
        </label>
        <label>
          Number of questions
          <select
            value={quizCount}
            onChange={(e) => setQuizCount(e.target.value)}
          >
            <option value="5">5 questions</option>
            <option value="10">10 questions</option>
            <option value="15">15 questions</option>
            <option value="20">20 questions</option>
          </select>
        </label>
        <button className="send-btn" type="submit">
          <WandSparkles size={16} /> Generate with AI
        </button>
      </form>
      <button
        className="text-action"
        onClick={() => {
          setFlashTopic(quizTopic);
          setPage("flashcards");
        }}
      >
        Make flashcards for this topic →
      </button>
    </section>
  );
}
