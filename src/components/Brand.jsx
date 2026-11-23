export default function Brand({ light = false }) {
  return (
    <div className={`brand ${light ? "brand-light" : ""}`}>
      <span className="brand-mark">◉</span>
      <span>
        odr-con<span className="brand-dot">.</span>
      </span>
    </div>
  );
}