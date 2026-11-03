import "./Home.css";

const NAV = [
  { label: "Início", href: "#inicio", active: true },
  { label: "Soluções", href: "#solucoes" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Conheça a Sophia", href: "#sophia", badge: "IA", icon: "sparkle" },
  { label: "Sobre nós", href: "#sobre" },
  { label: "Painel do mediador", href: "#painel", icon: "chart" },
];

const Icon = ({ name }) => {
  const p = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  switch (name) {
    case "arrow": return <svg {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
    case "sparkle": return <svg {...p}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3zM19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2z" /></svg>;
    case "chart": return <svg {...p}><path d="M4 20V4M4 20h16M9 16v-5M14 16V8M19 16v-3" /></svg>;
    case "shield": return <svg {...p}><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" /></svg>;
    case "people": return <svg {...p}><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 5.5a3 3 0 010 5.5M17.5 14.5c2 .6 3.5 2.6 3.5 5.5" /></svg>;
    case "chat": return <svg {...p}><path d="M5 5h14a1 1 0 011 1v9a1 1 0 01-1 1h-8l-4 4v-4H5a1 1 0 01-1-1V6a1 1 0 011-1z" /><path d="M8 9.5h8M8 12.5h5" /></svg>;
    case "check": return <svg {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>;
    default: return null;
  }
};

export default function Home() {
  return (
    <div className="odr" id="inicio">
      <header className="odr-header">
        <a className="odr-logo" href="#inicio" aria-label="odr-con">
          <svg width="30" height="30" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            <ellipse cx="12" cy="16" rx="8" ry="11" transform="rotate(35 12 16)" />
            <ellipse cx="20" cy="16" rx="8" ry="11" transform="rotate(35 20 16)" />
          </svg>
          <span>odr-con<b>.</b></span>
        </a>

        <nav className="odr-nav" aria-label="Principal">
          {NAV.map((n) => (
            <a key={n.label} href={n.href} className={n.active ? "is-active" : undefined}>
              {n.icon && <Icon name={n.icon} />}
              {n.label}
              {n.badge && <em className="odr-badge">{n.badge}</em>}
            </a>
          ))}
        </nav>

        <a className="btn btn-dark btn-sm" href="#contato">
          Fale com a gente <Icon name="arrow" />
        </a>
      </header>

      <main className="odr-hero">
        <section className="odr-copy">
          <span className="odr-pill"><i /> Menos conflito. Mais conexão.</span>
          <h1>
            O diálogo transforma.<br />
            A gente <span>conecta.</span>
          </h1>
          <p>
            Entre um conflito e uma solução, existe uma conversa.
            Conectamos empresas, clientes e colaboradores com escuta, inteligência e respeito.
          </p>
          <div className="odr-cta">
            <a className="btn btn-dark" href="#conflito">Quero resolver um conflito <Icon name="arrow" /></a>
            <a className="btn btn-light" href="#sophia"><Icon name="sparkle" /> Conheça a Sophia</a>
          </div>
          <ul className="odr-trust">
            <li><Icon name="shield" /> Respeito à sua privacidade</li>
            <li><Icon name="people" /> Pessoas em primeiro lugar</li>
          </ul>
        </section>

        <section className="odr-visual" aria-label="Ilustração da Sophia">
          <span className="odr-tag">Inteligência que acolhe</span>
          <i className="ring r1" /><i className="ring r2" /><i className="ring r3" />
          <i className="dot d1" />
          <i className="dot d2" />
          <i className="dot d3" />
          <i className="dot d4" />

          <div className="orb">
            <svg width="56" height="56" viewBox="0 0 48 48" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" aria-hidden>
              <path d="M22 8c1.5 9 5 12.500 14 14-9 1.500-12.500 5-14 14-1.500-9-5-12.500-14-14 9-1.500 12.500-5 14-14z" />
              <path d="M37 6c.5 3 1.500 4 4.500 4.500-3 .5-4 1.500-4.500 4.500-.5-3-1.500-4-4.500-4.500 3-.5 4-1.500 4.500-4.500z" />
            </svg>
          </div>

          <article className="card c-voice">
            <span className="ico"><Icon name="chat" /></span>
            <div>
              <small>Cada voz importa</small>
              <p>“Quero encontrar uma solução.”</p>
            </div>
          </article>

          <article className="card c-sophia">
            <header><Icon name="sparkle" /> <strong>Sophia</strong> <em className="odr-badge">IA</em></header>
            <p>Transformando conflitos<br />em conversas construtivas.</p>
            <div className="bars"><i /><i /><i /><i /></div>
            <footer><Icon name="check" /> Escuta ativa. Diálogo respeitoso.</footer>
          </article>

          <article className="card c-path">
            <span className="ico"><Icon name="people" /></span>
            <div>
              <strong>Um caminho em comum.</strong>
              <small>Mais diálogo, novas possibilidades.</small>
            </div>
          </article>

          <span className="odr-tag odr-tag-bottom">Tecnologia com propósito humano</span>
        </section>
      </main>
    </div>
  );
}