import Icon from "./Icon";

export default function PriscilaBanner() {
  return (
    <section className="priscila-banner" id="priscila" aria-labelledby="priscila-title">
      <div className="container">
        <div className="priscila-banner__box">
          <div className="priscila-banner__orb" aria-hidden="true">
            <span>
              <Icon name="sparkle" size={32} />
            </span>
          </div>

          <div className="priscila-banner__text">
            <p className="eyebrow">Tecnologia que aproxima</p>
            <h2 className="section-title" id="priscila-title">
              Inteligência artificial.
              <br />
              Sensibilidade real.
            </h2>
            <p className="section-lead">
              Conheça a Priscila, nossa IA que apoia o diálogo, organiza relatos e ajuda a encontrar caminhos mais
              construtivos.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}