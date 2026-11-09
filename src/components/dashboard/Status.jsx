export default function Status({ children }) {
  const c = children.toLowerCase().includes("conclu")
    ? "green"
    : children.toLowerCase().includes("aguard")
      ? "amber"
      : "blue";

  return (
    <span className={`status status-${c}`}>
      <i />
      {children}
    </span>
  );
}