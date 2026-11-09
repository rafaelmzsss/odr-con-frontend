import Icon from "./Icon";

export default function Hero() {
  return (
    <section className="odr-hero" aria-labelledby="hero-title">
      <div className="odr-copy">
        <span className="odr-pill">
          <i /> Menos conflito. Mais conexão.
        </span>
        <h1 id="hero-title">
          O diálogo transforma.
          <br />
          A gente <span>conecta.</span>
        </h1>
        <p>
          Entre um conflito e uma solução, existe uma conversa. Conectamos empresas, clientes e colaboradores com
          escuta, inteligência e respeito.
        </p>
        <div className="odr-cta">
          <a className="btn btn-dark" href="#conflito">
            Quero resolver um conflito <Icon name="arrow" />
          </a>
          <a className="btn btn-light" href="#sophia">
            <Icon name="sparkle" /> Conheça a Sophia
          </a>
        </div>
        <ul className="odr-trust">
          <li>
            <Icon name="shield" /> Respeito à sua privacidade
          </li>
          <li>
            <Icon name="people" /> Pessoas em primeiro lugar
          </li>
        </ul>
      </div>

      <div className="odr-visual" aria-label="Ilustração da Sophia">
        <span className="odr-tag">Inteligência que acolhe</span>
        <i className="ring r1" />
        <i className="ring r2" />
        <i className="ring r3" />
        <i className="dot d1" />
        <i className="dot d2" />
        <i className="dot d3" />
        <i className="dot d4" />

        <div className="orb">
          <svg width="56" height="56" viewBox="0 0 48 48" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 8c1.5 9 5 12.500 14 14-9 1.500-12.500 5-14 14-1.500-9-5-12.500-14-14 9-1.500 12.500-5 14-14z" />
            <path d="M37 6c.5 3 1.500 4 4.500 4.500-3 .5-4 1.500-4.500 4.500-.5-3-1.500-4-4.500-4.500 3-.5 4-1.500 4.500-4.500z" />
          </svg>
        </div>

        <article className="card c-voice">
          <span className="ico">
            <Icon name="chat" />
          </span>
          <div>
            <small>Cada voz importa</small>
            <p>“Quero encontrar uma solução.”</p>
          </div>
        </article>

        <article className="card c-sophia">
          <header>
            <Icon name="sparkle" /> <strong>Sophia</strong> <em className="odr-badge">IA</em>
          </header>
          <p>
            Transformando conflitos
            <br />
            em conversas construtivas.
          </p>
          <div className="bars">
            <i />
            <i />
            <i />
            <i />
          </div>
          <footer>
            <Icon name="check" /> Escuta ativa. Diálogo respeitoso.
          </footer>
        </article>

        <article className="card c-path">
          <span className="ico">
            <Icon name="people" />
          </span>
          <div>
            <strong>Um caminho em comum.</strong>
            <small>Mais diálogo, novas possibilidades.</small>
          </div>
        </article>

        <span className="odr-tag odr-tag-bottom">Tecnologia com propósito humano</span>
      </div>
    </section>
  );
}
