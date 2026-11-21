export default function Logo() {
  return (
    <a className="odr-logo" href="#inicio" aria-label="odr-con, ir para o início">
      <svg width="30" height="30" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <ellipse cx="12" cy="16" rx="8" ry="11" transform="rotate(35 12 16)" />
        <ellipse cx="20" cy="16" rx="8" ry="11" transform="rotate(35 20 16)" />
      </svg>
      <span>
        odr-con<b>.</b>
      </span>
    </a>
  );
}
