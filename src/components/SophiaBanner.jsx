import Icon from "./Icon";

export default function SophiaBanner() {
  return (
    <section className="sophia-banner" id="sophia" aria-labelledby="sophia-title">
      <div className="container">
        <div className="sophia-banner__box">
          <div className="sophia-banner__orb" aria-hidden="true">
            <span>
              <Icon name="sparkle" size={32} />
            </span>
          </div>

          <div className="sophia-banner__text">
            <p className="eyebrow">Tecnologia que aproxima</p>
            <h2 className="section-title" id="sophia-title">
              Inteligência artificial.
              <br />
              Sensibilidade real.
            </h2>
            <p className="section-lead">
              Conheça a Sophia, nossa IA que apoia o diálogo, organiza relatos e ajuda a encontrar caminhos mais
              construtivos.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
