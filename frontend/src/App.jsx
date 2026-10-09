import { useEffect, useMemo, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import AppSidebar from "./components/layout/AppSidebar.jsx";
import AppHeader from "./components/layout/AppHeader.jsx";
import FeatureIntro from "./components/common/FeatureIntro.jsx";
import EmptyState from "./components/common/EmptyState.jsx";
import NotesPage from "./components/pages/NotesPage.jsx";
import TasksPage from "./components/pages/TasksPage.jsx";
import FocusPage from "./components/pages/FocusPage.jsx";
import FlashcardsPage from "./components/pages/FlashcardsPage.jsx";
import VoicePage from "./components/pages/VoicePage.jsx";
import PlannerPage from "./components/pages/PlannerPage.jsx";
import QuizPage from "./components/pages/QuizPage.jsx";
import MindmapPage from "./components/pages/MindmapPage.jsx";
import ExamsPage from "./components/pages/ExamsPage.jsx";
import AnalyticsPage from "./components/pages/AnalyticsPage.jsx";
import GoalsPage from "./components/pages/GoalsPage.jsx";
import FormulasPage from "./components/pages/FormulasPage.jsx";
import SubjectsPage from "./components/pages/SubjectsPage.jsx";
import BackupPage from "./components/pages/BackupPage.jsx";
import AccessibilityPage from "./components/pages/AccessibilityPage.jsx";
import {
  BookOpen,
  Brain,
  CheckCircle2,
  GraduationCap,
  Lightbulb,
  LoaderCircle,
  MessageCircle,
  Send,
  Sparkles,
  RotateCcw,
  StickyNote,
  ListTodo,
  Timer,
  Layers3,
  Plus,
  Trash2,
  Search,
  WandSparkles,
  CalendarDays,
  Mic,
  FileText,
  CalendarCheck,
  BarChart3,
  Target,
  Network,
  BookMarked,
  Download,
  Upload,
  Accessibility,
  Clock,
  NotebookPen,
  ClipboardList,
} from "lucide-react";

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const USER_ID_KEY = "studybuddy-user-id";
function getWorkspaceUserId() {
  let id = localStorage.getItem(USER_ID_KEY);
  if (!id) {
    id = `student-${crypto.randomUUID()}`;
    localStorage.setItem(USER_ID_KEY, id);
  }
  return id;
}
const WORKSPACE_USER_ID = getWorkspaceUserId();
const starterPrompts = [
  {
    icon: Lightbulb,
    title: "Explain a hard topic",
    prompt: "Explain photosynthesis in simple terms with an everyday example.",
    mode: "explain",
  },
  {
    icon: Brain,
    title: "Quiz me",
    prompt: "Quiz me on the basics of computer networks.",
    mode: "quiz",
  },
  {
    icon: CalendarDays,
    title: "Plan my revision",
    prompt: "Make a 3-day revision plan for data structures.",
    mode: "revision",
  },
];
const readStore = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

const ROUTES = {
  assistant: "/",
  notes: "/notes",
  tasks: "/tasks",
  focus: "/focus",
  flashcards: "/flashcards",
  voice: "/voice-notes",
  planner: "/planner",
  quiz: "/quiz",
  pdf: "/pdf-assistant",
  mindmap: "/mind-maps",
  exams: "/exams",
  analytics: "/analytics",
  goals: "/goals",
  formulas: "/formula-sheets",
  subjects: "/subjects",
  backup: "/backup",
  accessibility: "/accessibility",
};
const PAGE_BY_PATH = Object.fromEntries(
  Object.entries(ROUTES).map(([key, path]) => [path, key]),
);

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const page = PAGE_BY_PATH[location.pathname] || "assistant";
  const setPage = (key) => navigate(ROUTES[key] || "/");
  const [level, setLevel] = useState("beginner");
  const [mode, setMode] = useState("explain");
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);
  const [notes, setNotes] = useState(() => readStore("studybuddy-notes", []));
  const [tasks, setTasks] = useState(() => readStore("studybuddy-tasks", []));
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [noteSearch, setNoteSearch] = useState("");
  const [taskText, setTaskText] = useState("");
  const [taskDue, setTaskDue] = useState("");
  const [taskPriority, setTaskPriority] = useState("Normal");
  const [seconds, setSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [focusSessions, setFocusSessions] = useState(() =>
    Number(localStorage.getItem("studybuddy-focus-sessions") || 0),
  );
  const [flashTopic, setFlashTopic] = useState("");
  const [flashcards, setFlashcards] = useState(() =>
    readStore("studybuddy-flashcards", []),
  );
  const [revealed, setRevealed] = useState({});
  const [voiceText, setVoiceText] = useState("");
  const [recording, setRecording] = useState(false);
  const [subject, setSubject] = useState("General");
  const [noteTag, setNoteTag] = useState("");
  const [examName, setExamName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [exams, setExams] = useState(() => readStore("studybuddy-exams", []));
  const [goalMinutes, setGoalMinutes] = useState(() =>
    Number(localStorage.getItem("studybuddy-goal-minutes") || 60),
  );
  const [dailyMinutes, setDailyMinutes] = useState(() =>
    Number(localStorage.getItem("studybuddy-daily-minutes") || 0),
  );
  const [mindTopic, setMindTopic] = useState("");
  const [mindNodes, setMindNodes] = useState([]);
  const [pdfText, setPdfText] = useState("");
  const [pdfName, setPdfName] = useState("");
  const [textScale, setTextScale] = useState(() =>
    Number(localStorage.getItem("studybuddy-text-scale") || 100),
  );
  const [subjectFilter, setSubjectFilter] = useState("All subjects");
  const [quizTopic, setQuizTopic] = useState("");
  const [quizCount, setQuizCount] = useState("5");
  const [workspaceLoaded, setWorkspaceLoaded] = useState(false);
  const [storageStatus, setStorageStatus] = useState("loading");

  // Load the saved workspace from DynamoDB. Local storage remains a fallback
  // for offline use and pre-existing browser data.
  useEffect(() => {
    let cancelled = false;
    async function loadWorkspace() {
      if (!API_URL) {
        setStorageStatus("local");
        setWorkspaceLoaded(true);
        return;
      }
      try {
        const res = await fetch(
          `${API_URL}/data?userId=${encodeURIComponent(WORKSPACE_USER_ID)}`,
        );
        const payload = await res.json().catch(() => ({}));
        if (!res.ok)
          throw new Error(payload.error || "Could not load saved workspace");
        if (cancelled) return;
        const data = payload.data || {};
        if (Array.isArray(data.notes)) setNotes(data.notes);
        if (Array.isArray(data.tasks)) setTasks(data.tasks);
        if (Array.isArray(data.flashcards)) setFlashcards(data.flashcards);
        if (Array.isArray(data.exams)) setExams(data.exams);
        if (Number.isFinite(data.focusSessions))
          setFocusSessions(data.focusSessions);
        if (Number.isFinite(data.goalMinutes)) setGoalMinutes(data.goalMinutes);
        if (Number.isFinite(data.dailyMinutes))
          setDailyMinutes(data.dailyMinutes);
        if (Number.isFinite(data.textScale)) setTextScale(data.textScale);
        setStorageStatus("cloud");
      } catch (err) {
        if (!cancelled) setStorageStatus("offline");
      } finally {
        if (!cancelled) setWorkspaceLoaded(true);
      }
    }
    loadWorkspace();
    return () => {
      cancelled = true;
    };
  }, []);

  // Debounce writes to avoid sending a DynamoDB request for every small change.
  useEffect(() => {
    if (!workspaceLoaded || !API_URL) return undefined;
    const data = {
      notes,
      tasks,
      flashcards,
      exams,
      focusSessions,
      goalMinutes,
      dailyMinutes,
      textScale,
    };
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`${API_URL}/data`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: WORKSPACE_USER_ID, data }),
        });
        if (!res.ok) throw new Error("Save failed");
        setStorageStatus("cloud");
      } catch {
        setStorageStatus("offline");
      }
    }, 800);
    return () => clearTimeout(timeout);
  }, [
    workspaceLoaded,
    notes,
    tasks,
    flashcards,
    exams,
    focusSessions,
    goalMinutes,
    dailyMinutes,
    textScale,
  ]);

  const history = useMemo(
    () => messages.slice(-8).map((m) => ({ role: m.role, content: m.content })),
    [messages],
  );
  useEffect(() => {
    localStorage.setItem("studybuddy-notes", JSON.stringify(notes));
  }, [notes]);
  useEffect(() => {
    localStorage.setItem("studybuddy-tasks", JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    localStorage.setItem("studybuddy-flashcards", JSON.stringify(flashcards));
  }, [flashcards]);
  useEffect(() => {
    localStorage.setItem("studybuddy-focus-sessions", String(focusSessions));
  }, [focusSessions]);
  useEffect(() => {
    localStorage.setItem("studybuddy-exams", JSON.stringify(exams));
  }, [exams]);
  useEffect(() => {
    localStorage.setItem("studybuddy-goal-minutes", String(goalMinutes));
  }, [goalMinutes]);
  useEffect(() => {
    localStorage.setItem("studybuddy-daily-minutes", String(dailyMinutes));
  }, [dailyMinutes]);
  useEffect(() => {
    localStorage.setItem("studybuddy-text-scale", String(textScale));
    document.documentElement.style.setProperty(
      "--study-text-scale",
      `${textScale / 100}`,
    );
  }, [textScale]);
  useEffect(() => {
    if (!timerRunning) return undefined;
    const timer = setInterval(
      () =>
        setSeconds((s) => {
          if (s <= 1) {
            clearInterval(timer);
            setTimerRunning(false);
            setFocusSessions((n) => n + 1);
            return 0;
          }
          return s - 1;
        }),
      1000,
    );
    return () => clearInterval(timer);
  }, [timerRunning]);

  async function askAI(text, selectedMode = mode) {
    const message = text.trim();
    if (!message || busy) return;
    if (!API_URL) {
      setError(
        "AI needs a deployed backend. Add VITE_API_URL to frontend/.env. Notes, tasks, flashcards and the focus timer work locally.",
      );
      return;
    }
    setDraft("");
    setError("");
    setPage("assistant");
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setBusy(true);
    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, mode: selectedMode, level, history }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(
          data.error || `Request failed (${res.status}). Please try again.`,
        );
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer },
      ]);
    } catch (e) {
      setError(
        e.message ||
          "Could not reach StudyBuddy. Check your connection and try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  function addNote(e) {
    e.preventDefault();
    if (!noteTitle.trim() || !noteBody.trim()) return;
    setNotes((prev) => [
      {
        id: crypto.randomUUID(),
        title: noteTitle.trim(),
        body: noteBody.trim(),
        subject,
        tag: noteTag.trim(),
        created: new Date().toLocaleDateString(),
      },
      ...prev,
    ]);
    setNoteTitle("");
    setNoteBody("");
    setNoteTag("");
  }
  function addTask(e) {
    e.preventDefault();
    if (!taskText.trim()) return;
    setTasks((prev) => [
      {
        id: crypto.randomUUID(),
        text: taskText.trim(),
        due: taskDue,
        priority: taskPriority,
        done: false,
      },
      ...prev,
    ]);
    setTaskText("");
    setTaskDue("");
    setTaskPriority("Normal");
  }
  function generateCards() {
    const topic = flashTopic.trim();
    if (!topic) return;
    const cards = [
      {
        question: `What is ${topic}?`,
        answer: `Define ${topic} in your own words. Ask StudyBuddy for a detailed explanation if you need help.`,
      },
      {
        question: `Why is ${topic} important?`,
        answer: `Explain the purpose, benefits, or real-world importance of ${topic}.`,
      },
      {
        question: `Give an example of ${topic}.`,
        answer: `Think of a practical example of ${topic}, then compare it with a textbook or AI explanation.`,
      },
    ];
    setFlashcards((prev) => [
      ...cards.map((c, i) => ({
        ...c,
        id: crypto.randomUUID(),
        topic,
        index: i,
      })),
      ...prev,
    ]);
    setFlashTopic("");
  }
  const pageTitles = {
    assistant: "AI Study Assistant",
    notes: "My Study Notes",
    tasks: "To-do & Assignments",
    focus: "Focus Room",
    flashcards: "Flashcard Studio",
    voice: "Voice Notes",
    planner: "Study Planner",
    quiz: "Quiz Generator",
    pdf: "PDF Study Assistant",
    mindmap: "Mind Maps",
    exams: "Exam Countdown",
    analytics: "Progress Analytics",
    goals: "Study Goals",
    formulas: "Formula & Cheat Sheets",
    subjects: "Subject Library",
    backup: "Export & Backup",
    accessibility: "Accessibility",
  };
  const navItems = [
    ["assistant", MessageCircle, "AI Assistant"],
    ["notes", StickyNote, "AI Notes"],
    ["voice", Mic, "Voice notes"],
    ["tasks", ListTodo, "To-do & assignments"],
    ["planner", CalendarCheck, "Study planner"],
    ["flashcards", Layers3, "Flashcards"],
    ["quiz", ClipboardList, "Quiz generator"],
    ["pdf", FileText, "Ask a PDF"],
    ["focus", Timer, "Focus timer"],
    ["mindmap", Network, "Mind maps"],
    ["exams", CalendarDays, "Exam countdown"],
    ["analytics", BarChart3, "Progress analytics"],
    ["goals", Target, "Study goals"],
    ["formulas", BookMarked, "Formula sheets"],
    ["subjects", BookOpen, "Subject library"],
    ["backup", Download, "Export & backup"],
    ["accessibility", Accessibility, "Accessibility"],
  ];
  const completed = tasks.filter((t) => t.done).length;
  const formatTime = (n) =>
    `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;

  const appState = {
    page,
    setPage,
    level,
    setLevel,
    mode,
    setMode,
    draft,
    setDraft,
    busy,
    setBusy,
    error,
    setError,
    messages,
    setMessages,
    notes,
    setNotes,
    tasks,
    setTasks,
    noteTitle,
    setNoteTitle,
    noteBody,
    setNoteBody,
    noteSearch,
    setNoteSearch,
    taskText,
    setTaskText,
    taskDue,
    setTaskDue,
    taskPriority,
    setTaskPriority,
    seconds,
    setSeconds,
    timerRunning,
    setTimerRunning,
    focusSessions,
    setFocusSessions,
    flashTopic,
    setFlashTopic,
    flashcards,
    setFlashcards,
    revealed,
    setRevealed,
    voiceText,
    setVoiceText,
    recording,
    setRecording,
    subject,
    setSubject,
    noteTag,
    setNoteTag,
    examName,
    setExamName,
    examDate,
    setExamDate,
    exams,
    setExams,
    goalMinutes,
    setGoalMinutes,
    dailyMinutes,
    setDailyMinutes,
    mindTopic,
    setMindTopic,
    mindNodes,
    setMindNodes,
    pdfText,
    setPdfText,
    pdfName,
    setPdfName,
    textScale,
    setTextScale,
    subjectFilter,
    setSubjectFilter,
    quizTopic,
    setQuizTopic,
    quizCount,
    setQuizCount,
    askAI,
    addNote,
    addTask,
    generateCards,
    pageTitles,
    navItems,
    completed,
    formatTime,
    starterPrompts,
    API_URL,
    storageStatus,
    workspaceLoaded,
  };

  return (
    <div
      className="app-shell"
      style={{ fontSize: `calc(1em * ${textScale / 100})` }}
    >
      <AppSidebar
        navItems={navItems}
        page={page}
        routes={ROUTES}
        onNavigate={(key) => {
          setPage(key);
          setError("");
        }}
      />
      <main className="main">
        <AppHeader
          title={
            page === "assistant"
              ? "Let's make learning click."
              : pageTitles[page]
          }
          isAssistant={page === "assistant"}
          onNewSession={() => {
            setMessages([]);
            setError("");
            setDraft("");
          }}
        />
        <div className="storage-status" role="status">
          {storageStatus === "cloud"
            ? "✓ Saved to AWS"
            : storageStatus === "loading"
              ? "Loading your workspace…"
              : storageStatus === "offline"
                ? "Cloud save unavailable — changes may be local only"
                : "Local mode — configure VITE_API_URL to enable AWS sync"}
        </div>
        {page === "assistant" && (
          <>
            <section className="toolbar">
              <div>
                <span className="field-label">YOUR LEARNING LEVEL</span>
                <div className="level-switch">
                  {["beginner", "intermediate", "advanced"].map((v) => (
                    <button
                      key={v}
                      className={level === v ? "active" : ""}
                      onClick={() => setLevel(v)}
                    >
                      {v[0].toUpperCase() + v.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mode-pill">
                <span className="status-dot" />
                {mode === "explain"
                  ? "Learning mode"
                  : mode === "quiz"
                    ? "Practice mode"
                    : "Revision mode"}
              </div>
            </section>
            <section className="conversation">
              {messages.length === 0 ? (
                <div className="welcome">
                  <div className="welcome-icon">
                    <Sparkles size={28} />
                  </div>
                  <p className="hello">Hey there, learner 👋</p>
                  <h2>
                    What would you like to
                    <br />
                    understand today?
                  </h2>
                  <p className="welcome-sub">
                    Ask a question, explore an idea, or take a small step toward
                    your next exam.
                  </p>
                  <div className="starter-grid">
                    {starterPrompts.map(
                      ({ icon: Icon, title, prompt, mode: selectedMode }) => (
                        <button
                          className="starter-card"
                          key={title}
                          onClick={() => {
                            setMode(selectedMode);
                            askAI(prompt, selectedMode);
                          }}
                        >
                          <Icon size={20} />
                          <strong>{title}</strong>
                          <span>{prompt}</span>
                        </button>
                      ),
                    )}
                  </div>
                  <div className="quick-tools">
                    <button onClick={() => setPage("notes")}>
                      <StickyNote size={16} /> Write notes
                    </button>
                    <button onClick={() => setPage("tasks")}>
                      <ListTodo size={16} /> Plan tasks
                    </button>
                    <button onClick={() => setPage("flashcards")}>
                      <Layers3 size={16} /> Make flashcards
                    </button>
                  </div>
                </div>
              ) : (
                <div className="message-list">
                  {messages.map((m, i) => (
                    <article key={i} className={`message ${m.role}`}>
                      <div className="avatar">
                        {m.role === "assistant" ? (
                          <GraduationCap size={18} />
                        ) : (
                          "You"
                        )}
                      </div>
                      <div className="bubble">
                        <div className="message-name">
                          {m.role === "assistant" ? "StudyBuddy" : "You"}
                        </div>
                        <div className="message-content">{m.content}</div>
                        {m.role === "assistant" && (
                          <button
                            className="save-note-link"
                            onClick={() => {
                              setNoteTitle(
                                "AI answer · " +
                                  new Date().toLocaleDateString(),
                              );
                              setNoteBody(m.content);
                              setPage("notes");
                            }}
                          >
                            <StickyNote size={14} /> Save as note
                          </button>
                        )}
                      </div>
                    </article>
                  ))}
                  {busy && (
                    <div className="message assistant">
                      <div className="avatar">
                        <GraduationCap size={18} />
                      </div>
                      <div className="bubble">
                        <div className="message-name">StudyBuddy</div>
                        <div className="thinking">
                          <span />
                          <span />
                          <span /> Thinking through it with you…
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>
            {error && (
              <div className="error-box" role="alert">
                <strong>Let's get you back on track.</strong>
                <span>{error}</span>
              </div>
            )}
            <form
              className="composer"
              onSubmit={(e) => {
                e.preventDefault();
                askAI(draft);
              }}
            >
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    askAI(draft);
                  }
                }}
                placeholder="Ask anything you're learning…"
                rows={2}
                maxLength={3000}
                aria-label="Your learning question"
              />
              <div className="composer-bottom">
                <span>Enter to send · Shift + Enter for a new line</span>
                <button
                  className="send-btn"
                  type="submit"
                  disabled={busy || !draft.trim()}
                >
                  {busy ? (
                    <LoaderCircle className="spin" size={17} />
                  ) : (
                    <Send size={17} />
                  )}{" "}
                  <span>{busy ? "Thinking" : "Ask StudyBuddy"}</span>
                </button>
              </div>
            </form>
            <footer className="disclaimer">
              <MessageCircle size={14} /> AI can make mistakes. Verify important
              facts.
            </footer>
          </>
        )}
        <Routes>
          <Route path="/" element={null} />
          <Route path="/notes" element={<NotesPage app={appState} />} />
          <Route path="/tasks" element={<TasksPage app={appState} />} />
          <Route path="/focus" element={<FocusPage app={appState} />} />
          <Route
            path="/flashcards"
            element={<FlashcardsPage app={appState} />}
          />
          <Route path="/voice-notes" element={<VoicePage app={appState} />} />
          <Route path="/planner" element={<PlannerPage app={appState} />} />
          <Route path="/quiz" element={<QuizPage app={appState} />} />
          <Route
            path="/pdf-assistant"
            element={
              <section className="workspace-page">
                <FeatureIntro
                  icon={FileText}
                  title="Study from your materials."
                  description="Choose a text file or paste material, then ask AI questions grounded in it. PDF parsing can be added with PDF.js."
                />
                <div className="panel note-form">
                  <label>
                    Choose a text file
                    <input
                      type="file"
                      accept=".txt,text/plain"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPdfName(file.name);
                          setPdfText(await file.text());
                        }
                      }}
                    />
                  </label>
                  <label>
                    Document text
                    <textarea
                      rows={8}
                      value={pdfText}
                      onChange={(e) => setPdfText(e.target.value)}
                      placeholder="Paste study material here…"
                    />
                  </label>
                  <div className="form-actions">
                    <span>{pdfName || "No document selected"}</span>
                    <button
                      className="send-btn"
                      disabled={!pdfText.trim()}
                      onClick={() =>
                        askAI(
                          `Summarize this study material and suggest five questions.\n\n${pdfText.slice(0, 12000)}`,
                          "explain",
                        )
                      }
                    >
                      <MessageCircle size={15} /> Study this material
                    </button>
                  </div>
                  <label>
                    Ask a question
                    <textarea
                      rows={2}
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Ask about this material…"
                    />
                  </label>
                  <button
                    className="send-btn"
                    disabled={!pdfText.trim() || !draft.trim()}
                    onClick={() =>
                      askAI(
                        `Answer using this material:\n${pdfText.slice(0, 12000)}\nQuestion: ${draft}`,
                        "explain",
                      )
                    }
                  >
                    <Send size={15} /> Ask about document
                  </button>
                </div>
              </section>
            }
          />
          <Route path="/mind-maps" element={<MindmapPage app={appState} />} />
          <Route path="/exams" element={<ExamsPage app={appState} />} />
          <Route path="/analytics" element={<AnalyticsPage app={appState} />} />
          <Route path="/goals" element={<GoalsPage app={appState} />} />
          <Route
            path="/formula-sheets"
            element={<FormulasPage app={appState} />}
          />
          <Route path="/subjects" element={<SubjectsPage app={appState} />} />
          <Route path="/backup" element={<BackupPage app={appState} />} />
          <Route
            path="/accessibility"
            element={<AccessibilityPage app={appState} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
