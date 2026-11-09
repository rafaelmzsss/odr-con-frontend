import Icon from "./Icon";

const ITEMS = [
  { icon: "chat", label: "Diálogo, não confronto" },
  { icon: "scale", label: "Imparcialidade em cada etapa" },
  { icon: "sparkle", label: "Inteligência com empatia" },
];

export default function Highlights() {
  return (
    <section className="highlights" aria-label="Nossos princípios">
      <div className="container highlights__inner">
        <p className="highlights__lead">
          Mais do que resolver.
          <strong>Construir novas relações.</strong>
        </p>

        <ul className="highlights__list">
          {ITEMS.map((item) => (
            <li key={item.label} className="highlights__item">
              <Icon name={item.icon} size={20} />
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
