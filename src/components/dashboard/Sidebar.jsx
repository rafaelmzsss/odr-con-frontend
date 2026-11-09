import Brand from "../Brand";

export const menuCustomer = [
    { id: "inicio", label: "Visão geral", icon: "⌂" },
    { id: "atendimentos", label: "Meus atendimentos", icon: "▤" },
    { id: "novo", label: "Novo atendimento", icon: "＋" },
    { id: "anonimo", label: "Relato anônimo", icon: "◌" },
    { id: "protocolo", label: "Consultar protocolo", icon: "⌕" },
    { id: "historico", label: "Histórico", icon: "◷" },
    { id: "perfil", label: "Meu perfil", icon: "♙" },
];

export const menuCompany = [
  { id: "inicio", label: "Visão geral", icon: "⌂" },
  { id: "atendimentos", label: "Atendimentos", icon: "▤" },
  { id: "equipe", label: "Equipe", icon: "♧" },
  { id: "relatorios", label: "Relatórios", icon: "▥" },
  { id: "satisfacao", label: "Satisfação", icon: "☆" },
  { id: "perfil", label: "Perfil da empresa", icon: "▣" },
];

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
          <strong>Conte com a Sophia</strong>
          <small>Sua assistente para encontrar novos caminhos.</small>
        </div>

        <button className="side-exit" onClick={onExit}>
          ↪ Sair da conta
        </button>
      </div>
    </aside>
  );
}