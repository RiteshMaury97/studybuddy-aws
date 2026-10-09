export default function FeatureIntro({ icon: Icon, title, description }) {
  return (
    <div className="feature-intro">
      <div className="feature-icon">
        <Icon aria-hidden="true" />
      </div>
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}
