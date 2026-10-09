import { NavLink } from "react-router-dom";

export default function AppSidebar({ navItems, routes, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">
          <span aria-hidden="true">🎓</span>
        </span>
        <span>
          StudyBuddy<small>YOUR LEARNING COMPANION</small>
        </span>
      </div>
      <div className="side-label">YOUR WORKSPACE</div>
      {navItems.map(([key, Icon, label]) => (
        <NavLink
          key={key}
          to={routes[key] || "/"}
          end={key === "assistant"}
          className={({ isActive }) =>
            `mode-link ${isActive ? "selected" : ""}`
          }
          aria-label={label}
          onClick={() => onNavigate(key)}
        >
          <Icon size={18} aria-hidden="true" />
          {label}
        </NavLink>
      ))}
      <div className="sidebar-note">
        <span aria-hidden="true">✦</span>
        <p>
          <strong>Small steps count.</strong>
          <br />
          You don't have to understand everything at once.
        </p>
      </div>
      <div className="sidebar-foot">Your learning space ✦</div>
    </aside>
  );
}
