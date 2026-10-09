export default function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="empty-state">
      <Icon size={25} aria-hidden="true" />
      <strong>{title}</strong>
      <span>{description}</span>
    </div>
  );
}
