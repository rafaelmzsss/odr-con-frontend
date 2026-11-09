import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="odr-footer">
      <div className="container">
        <div className="odr-footer__main">
          <div className="odr-footer__brand">
            <Logo />
          </div>

          <p className="odr-footer__tagline">
            Conectando pessoas.
            <br />
            Transformando relações.
          </p>
        </div>

        <div className="odr-footer__legal">
          <p>© {new Date().getFullYear()} odr-con. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}