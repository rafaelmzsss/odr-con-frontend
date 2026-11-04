import Icon from "./Icon";

export default function FinalCta() {
  return (
    <section className="final-cta" id="contato" aria-labelledby="cta-title">
      <div className="container">
        <p className="eyebrow">O primeiro passo é uma conversa</p>
        <h2 className="section-title" id="cta-title">
          Vamos encontrar um caminho?
        </h2>
        <p className="section-lead">Você não precisa lidar com um conflito sem ser ouvido.</p>
        <a className="btn btn-dark" href="#conflito">
          Comece por aqui <Icon name="arrow" />
        </a>
      </div>
    </section>
  );
}
