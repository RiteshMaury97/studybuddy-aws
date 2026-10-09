import { RotateCcw } from "lucide-react";

export default function AppHeader({ title, isAssistant, onNewSession }) {
  return (
    <header className="topbar">
      <div>
        <span className="eyebrow">YOUR PERSONAL LEARNING SPACE</span>
        <h1>{title}</h1>
      </div>
      {isAssistant && (
        <button className="reset-btn" onClick={onNewSession}>
          <RotateCcw size={15} /> New session
        </button>
      )}
    </header>
  );
}
