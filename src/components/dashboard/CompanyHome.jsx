import Metric from "./Metric";
import Status from "./Status";

export default function CompanyHome({ cases = [], setActive, metrics = null }) {
  const hasMetrics = metrics && Object.values(metrics).some((value) => value !== null && value !== undefined);

  return (
    <>
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">PAINEL CORPORATIVO</span>
          <h1>Visão geral</h1>
          <p>Acompanhe os atendimentos e fortaleça o diálogo com seus clientes.</p>
        </div>
        <button className="outline-button" onClick={() => setActive("relatorios")}>Ver relatórios ↗</button>
      </div>

      {hasMetrics ? (
        <div className="metric-grid">
          {metrics.totalCases != null && <Metric label="Atendimentos recebidos" value={metrics.totalCases} delta="" icon="▤" />}
          {metrics.inProgress != null && <Metric label="Em andamento" value={metrics.inProgress} delta="" icon="◷" />}
          {metrics.resolved != null && <Metric label="Resolvidos" value={metrics.resolved} delta="" icon="✓" />}
          {metrics.averageTime != null && <Metric label="Tempo médio" value={metrics.averageTime} delta="" icon="◷" />}
        </div>
      ) : (
        <div className="data-empty-state company-overview-empty">
          <span aria-hidden="true">✧</span>
          <h3>Os indicadores aparecerão aqui</h3>
          <p>Assim que a plataforma receber dados reais de atendimento, os indicadores da empresa serão calculados e exibidos.</p>
        </div>
      )}

      <div className="section-heading">
        <div><span className="eyebrow">ACOMPANHAMENTO</span><h2>Atendimentos recentes</h2></div>
        <button className="outline-button" onClick={() => setActive("atendimentos")}>Ver todos →</button>
      </div>

      {cases.length ? (
        <div className="table-card">
          <div className="table-head"><span>Protocolo / assunto</span><span>Cliente</span><span>Data</span><span>Status</span><span /></div>
          {cases.slice(0, 5).map((item) => (
            <div className="table-row" key={item.id}>
              <div><strong>{item.title}</strong><small>{item.id}</small></div>
              <span>{item.customerName || item.customer || "—"}</span>
              <span>{item.date || "—"}</span>
              <Status>{item.status || "Registrado"}</Status>
              <span />
            </div>
          ))}
        </div>
      ) : (
        <div className="data-empty-state">
          <span aria-hidden="true">✧</span>
          <h3>Nenhum atendimento recebido</h3>
          <p>Os atendimentos registrados pelos usuários aparecerão aqui quando forem disponibilizados pelo backend.</p>
        </div>
      )}
    </>
  );
}