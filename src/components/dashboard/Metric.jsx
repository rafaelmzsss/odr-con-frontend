export default function Metric({ label, value, delta, icon }) {
  return (
    <div className="metric-card">
      <span className="metric-icon">{icon}</span>
      <small>{label}</small>
      <strong>{value}</strong>
      <p>{delta}</p>
    </div>
  );
}