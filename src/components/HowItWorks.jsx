const STEPS = [
  {
    title: "Conte o que aconteceu",
    text: "Compartilhe sua experiência e o que você espera de uma solução.",
  },
  {
    title: "Abra espaço para o diálogo",
    text: "A Sophia ajuda a organizar o relato e apoia uma conversa respeitosa.",
  },
  {
    title: "Construa o próximo passo",
    text: "As partes avaliam possibilidades e buscam uma solução em conjunto.",
  },
];

export default function HowItWorks() {
  return (
    <section className="how" id="como-funciona" aria-labelledby="how-title">
      <div className="container">
        <p className="eyebrow">Simples, do primeiro passo ao próximo</p>
        <h2 className="section-title" id="how-title">
          Um novo caminho para resolver.
        </h2>
        <p className="section-lead">Menos barreiras. Mais espaço para o entendimento.</p>

        <ol className="how__steps">
          {STEPS.map((step, index) => (
            <li key={step.title} className="how__step">
              <span className="how__num">{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
