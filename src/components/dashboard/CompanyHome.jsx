import Metric from "./Metric";
import Status from "./Status";

export default function CompanyHome({ cases, setActive }) {
  return (
    <>
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">PAINEL CORPORATIVO</span>
          <h1>Visão geral</h1>
          <p>
            Acompanhe os conflitos e fortaleça o diálogo com seus clientes.
          </p>
        </div>

        <button
          className="outline-button"
          onClick={() => setActive("relatorios")}
        >
          Ver relatórios ↗
        </button>
      </div>

      <div className="metric-grid">
        <Metric label="Atendimentos recebidos" value="128" delta="+12% neste mês" icon="▤" />
        <Metric label="Em andamento" value="36" delta="12 aguardando resposta" icon="◷" />
        <Metric label="Resolvidos" value="84" delta="65,6% do total" icon="✓" />
        <Metric label="Tempo médio" value="2,4 dias" delta="−8% em relação ao mês passado" icon="◷" />
      </div>

      <div className="section-heading">
        <div>
          <span className="eyebrow">ACOMPANHAMENTO</span>
          <h2>Atendimentos recentes</h2>
        </div>

        <button
          className="outline-button"
          onClick={() => setActive("atendimentos")}
        >
          Ver todos →
        </button>
      </div>

      <div className="table-card">
        <div className="table-head">
          <span>Protocolo / assunto</span>
          <span>Cliente</span>
          <span>Data</span>
          <span>Status</span>
          <span />
        </div>

        {cases.map((c, i) => (
          <div className="table-row" key={c.id}>
            <div>
              <strong>{c.title}</strong>
              <small>{c.id}</small>
            </div>

            <span>
              {["Mariana Alves", "João Pedro", "Cliente identificado"][i]}
            </span>

            <span>{c.date}</span>
            <Status>{c.status}</Status>
            <button className="more-button">•••</button>
          </div>
        ))}
      </div>
    </>
  );
}