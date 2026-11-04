import Icon from "./Icon";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="odr-footer">
      <div className="container">
        <div className="odr-footer__main">
          <div className="odr-footer__brand">
            <Logo />
            <p className="odr-footer__tagline">
              Conectando pessoas.
              <br />
              Transformando relações.
            </p>
          </div>

          <nav className="odr-footer__nav" aria-label="Rodapé">
            <a href="#sophia">Conheça a Sophia</a>
            <a href="#painel">Painel do mediador</a>
            <a href="#contato">
              Fale com a gente <Icon name="arrow" />
            </a>
          </nav>
        </div>

        <div className="odr-footer__legal">
          <p>© {new Date().getFullYear()} odr-con. Todos os direitos reservados.</p>
          <p>Feito para aproximar.</p>
        </div>
      </div>
    </footer>
  );
}
