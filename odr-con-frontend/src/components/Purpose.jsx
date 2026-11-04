import Icon from "./Icon";

export default function Purpose() {
  return (
    <section className="purpose" id="sobre" aria-labelledby="purpose-title">
      <div className="container purpose__grid">
        <div>
          <p className="eyebrow">Nosso propósito</p>
          <h2 className="section-title" id="purpose-title">
            Conflitos fazem parte.
            <br />
            O respeito também deve fazer.
          </h2>
        </div>

        <div className="purpose__body">
          <p>
            A odr-con nasce da ideia de que ouvir é o primeiro passo para transformar. Unimos tecnologia e uma
            abordagem centrada nas pessoas para aproximar empresas, clientes e colaboradores.
          </p>
          <p>
            Acreditamos em soluções construídas com diálogo, transparência e participação. Porque uma relação não
            precisa terminar onde um conflito começa.
          </p>
          <a className="link-arrow" href="#contato">
            Vamos conversar <Icon name="arrow" />
          </a>
        </div>
      </div>
    </section>
  );
}
