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

export default function VoicePage({ app }) {
  const {
    page,
    setPage,
    setError,
    notes,
    setNoteTitle,
    setNoteBody,
    voiceText,
    setVoiceText,
    recording,
    setRecording,
  } = app;
  return (
    <section className="workspace-page">
      <div className="feature-intro">
        <div className="feature-icon">
          <Mic />
        </div>
        <div>
          <h2>Capture lecture ideas.</h2>
          <p>
            Use your browser's speech recognition when supported. Microphone
            permission is requested by the browser; availability varies by
            browser and language.
          </p>
        </div>
      </div>
      <div className="panel note-form">
        <label>
          Transcription
          <textarea
            rows={8}
            value={voiceText}
            onChange={(e) => setVoiceText(e.target.value)}
            placeholder="Your live transcription will appear here. You can also type or paste notes."
          />
        </label>
        <div className="form-actions">
          <button
            className="reset-btn"
            onClick={() => {
              const SR =
                window.SpeechRecognition || window.webkitSpeechRecognition;
              if (!SR) {
                setError(
                  "Speech recognition is not supported in this browser. Try a supported browser or type your notes.",
                );
                return;
              }
              setError("");
              const recognition = new SR();
              recognition.continuous = true;
              recognition.interimResults = true;
              recognition.onresult = (ev) =>
                setVoiceText(
                  (prev) =>
                    prev +
                    " " +
                    Array.from(ev.results)
                      .slice(ev.resultIndex)
                      .map((r) => r[0].transcript)
                      .join(" "),
                );
              recognition.onerror = () => {
                setRecording(false);
                setError(
                  "Microphone transcription stopped. Check browser microphone permissions.",
                );
              };
              recognition.onend = () => setRecording(false);
              if (!recording) {
                recognition.start();
                setRecording(true);
              } else {
                recognition.stop();
                setRecording(false);
              }
            }}
          >
            <Mic size={15} />
            {recording ? "Stop recording" : "Start recording"}
          </button>
          <button
            className="send-btn"
            onClick={() => {
              setNoteTitle("Voice notes · " + new Date().toLocaleDateString());
              setNoteBody(voiceText);
              setPage("notes");
            }}
            disabled={!voiceText.trim()}
          >
            <StickyNote size={15} /> Save as note
          </button>
        </div>
      </div>
    </section>
  );
}
