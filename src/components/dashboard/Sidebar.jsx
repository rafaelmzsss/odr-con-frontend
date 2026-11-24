import Brand from "../Brand";
import { menuCompany, menuCustomer } from "./menus";

export default function Sidebar({ role, active, setActive, onExit, name }) {
  const items = role === "empresa" ? menuCompany : menuCustomer;

  return (
    <aside className="dash-sidebar">
      <Brand />

      <div className="side-user">
        <div className="avatar">
          {(name || "A").slice(0, 1).toUpperCase()}
        </div>

        <div>
          <strong>{name}</strong>
          <small>
            {role === "empresa"
              ? "Acesso corporativo"
              : "Área do consumidor"}
          </small>
        </div>
      </div>

      <nav>
        {items.map((x) => (
          <button
            key={x.id}
            className={active === x.id ? "active" : ""}
            onClick={() => setActive(x.id)}
          >
            <span>{x.icon}</span>
            {x.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="privacy-card">
          <span>✧</span>
          <strong>Conte com a Priscila</strong>
          <small>Sua assistente para encontrar novos caminhos.</small>
        </div>

        <button className="side-exit" onClick={onExit}>
          ↪ Sair da conta
        </button>
      </div>
    </aside>
  );
}
