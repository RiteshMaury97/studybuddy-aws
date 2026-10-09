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
import FeatureIntro from "../common/FeatureIntro.jsx";
import EmptyState from "../common/EmptyState.jsx";

export default function NotesPage({ app }) {
  const {
    page,
    setPage,
    setDraft,
    notes,
    setNotes,
    noteTitle,
    setNoteTitle,
    noteBody,
    setNoteBody,
    noteSearch,
    setNoteSearch,
    subject,
    setSubject,
    noteTag,
    setNoteTag,
    addNote,
  } = app;
  return (
    <section className="workspace-page">
      <FeatureIntro
        icon={StickyNote}
        title="Your knowledge, organized."
        description="Save lecture notes, summaries, and useful answers. Notes are stored in this browser."
      />
      <form className="panel note-form" onSubmit={addNote}>
        <label>
          Note title
          <input
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            placeholder="e.g. Computer Networks — OSI Model"
            required
          />
        </label>
        <div className="task-fields">
          <label>
            Subject
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Computer Science"
            />
          </label>
          <label>
            Tag
            <input
              value={noteTag}
              onChange={(e) => setNoteTag(e.target.value)}
              placeholder="e.g. exam revision"
            />
          </label>
        </div>
        <label>
          Your notes
          <textarea
            value={noteBody}
            onChange={(e) => setNoteBody(e.target.value)}
            placeholder="Write or paste your notes here…"
            rows={5}
            required
          />
        </label>
        <div className="form-actions">
          <span>
            <FileText size={14} /> You can save AI answers from the chat, too.
          </span>
          <button className="send-btn" type="submit">
            <Plus size={16} /> Save note
          </button>
        </div>
      </form>
      <div className="list-heading">
        <h3>
          Saved notes <span className="count-pill">{notes.length}</span>
        </h3>
        <div className="search-box">
          <Search size={15} />
          <input
            value={noteSearch}
            onChange={(e) => setNoteSearch(e.target.value)}
            placeholder="Search notes"
          />
        </div>
      </div>
      <div className="notes-grid">
        {notes
          .filter((n) =>
            `${n.title} ${n.body}`
              .toLowerCase()
              .includes(noteSearch.toLowerCase()),
          )
          .map((n) => (
            <article className="panel saved-note" key={n.id}>
              <div className="saved-note-top">
                <span className="note-tag">
                  {n.subject || "STUDY NOTE"}
                  {n.tag ? ` · ${n.tag}` : ""}
                </span>
                <button
                  className="icon-btn danger"
                  aria-label="Delete note"
                  onClick={() =>
                    setNotes((prev) => prev.filter((x) => x.id !== n.id))
                  }
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <h3>{n.title}</h3>
              <p>{n.body}</p>
              <small>Saved {n.created}</small>
              <button
                className="text-action"
                onClick={() => {
                  setDraft(
                    `Help me revise these notes:\n${n.title}\n${n.body}`,
                  );
                  setPage("assistant");
                }}
              >
                Revise with AI <WandSparkles size={14} />
              </button>
            </article>
          ))}
      </div>
      {notes.length === 0 && (
        <EmptyState
          icon={StickyNote}
          title="No notes yet"
          description="Create your first note above, or save a helpful AI answer."
        />
      )}
    </section>
  );
}
