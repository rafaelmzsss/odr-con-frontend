import Icon from "./Icon";
import Logo from "./Logo";

const NAV = [
  { label: "Início", href: "#inicio", active: true },
  { label: "Soluções", href: "#solucoes" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Conheça a Sophia", href: "#sophia", badge: "IA", icon: "sparkle" },
  { label: "Sobre nós", href: "#sobre" },
  { label: "Painel do mediador", href: "#painel", icon: "chart" },
];

export default function Header() {
  return (
    <header className="odr-header">
      <Logo />

      <nav className="odr-nav" aria-label="Principal">
        {NAV.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={item.active ? "is-active" : undefined}
            aria-current={item.active ? "page" : undefined}
          >
            {item.icon && <Icon name={item.icon} />}
            {item.label}
            {item.badge && <em className="odr-badge">{item.badge}</em>}
          </a>
        ))}
      </nav>

      <a className="btn btn-dark btn-sm" href="#contato">
        Fale com a gente <Icon name="arrow" />
      </a>
    </header>
  );
}
