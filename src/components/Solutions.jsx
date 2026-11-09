import Icon from "./Icon";

const CARDS = [
  {
    icon: "chat",
    title: "Para clientes",
    text: "Um problema com uma empresa? Encontre um espaço para ser ouvido e buscar uma solução de forma simples e respeitosa.",
    cta: "Quero resolver meu problema",
    href: "#conflito",
  },
  {
    icon: "people",
    title: "Para colaboradores",
    text: "Sua voz também importa no trabalho. Relate situações do ambiente profissional e dê o primeiro passo para uma mudança.",
    cta: "Quero fazer um relato",
    href: "#relato",
  },
  {
    icon: "building",
    title: "Para empresas",
    text: "Transforme reclamações em oportunidades. Fortaleça a confiança, compreenda os conflitos e cultive relações mais saudáveis.",
    cta: "Conhecer as soluções",
    href: "#empresas",
    featured: true,
  },
];

export default function Solutions() {
  return (
    <section className="solutions" id="solucoes" aria-labelledby="solutions-title">
      <div className="container">
        <div className="solutions__head">
          <div>
            <p className="eyebrow">Um espaço para cada voz</p>
            <h2 className="section-title" id="solutions-title">
              Relações melhores começam
              <br />
              com uma escuta de verdade.
            </h2>
          </div>
          <p className="solutions__note">
            Não importa de que lado você está.
            <br />
            O próximo passo pode ser dado em conjunto.
          </p>
        </div>

        <ul className="solutions__grid">
          {CARDS.map((card, index) => (
            <li key={card.title} className={`solution-card${card.featured ? " solution-card--featured" : ""}`}>
              <div className="solution-card__top">
                <span className="solution-card__icon">
                  <Icon name={card.icon} size={18} />
                </span>
                <span className="solution-card__num" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
              <a className="link-arrow" href={card.href}>
                {card.cta} <Icon name="arrow" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
