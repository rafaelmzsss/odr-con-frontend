import CaseCard from "./CaseCard";
import Metric from "./Metric";
import Status from "./Status";
import ProtocolLookup from "./ProtocolLookup";

export default function GenericPage({ page, role, cases, setActive, onSelectCase }) {
  const titleMap = {
    atendimentos: role === "empresa" ? "Atendimentos" : "Meus atendimentos",
    historico: "Histórico de atendimentos",
    equipe: "Equipe e colaboradores",
    relatorios: "Relatórios e indicadores",
    satisfacao: "Pesquisa de satisfação",
    perfil: role === "empresa" ? "Perfil da empresa" : "Meu perfil"
  };

  const title = titleMap[page] || "Visão geral";

  if (page === "anonimo") {
    return (
      <div className="new-case-panel">
        <span className="eyebrow">RELATO ANÔNIMO</span>
        <h1>Sua voz pode ser ouvida sem identificação.</h1>
        <p>
          Você pode iniciar uma conversa com a Sophia sem criar uma conta.
          Não informe dados que possam identificar você no texto do relato.
        </p>
        <div className="sophia-large">✧</div>
        <button className="primary-button" onClick={() => setActive("novo")}>
          Iniciar relato anônimo →
        </button>
      </div>
    );
  }

  if (page === "protocolo") {
    return <ProtocolLookup cases={cases} />;
  }

  if (page === "atendimentos" || page === "historico") {
    return (
      <>
        <div className="dashboard-heading">
          <div>
            <span className="eyebrow">ACOMPANHAMENTO</span>
            <h1>{title}</h1>
            <p>
              {role === "empresa"
                ? "Visualize, filtre e acompanhe as solicitações recebidas."
                : "Consulte o andamento de todas as suas solicitações."}
            </p>
          </div>
          {role === "empresa" && (
            <button className="outline-button">Exportar dados ↓</button>
          )}
        </div>

        <div className="filter-row">
          <input placeholder="⌕ Buscar por protocolo ou assunto" />
          <select>
            <option>Todos os status</option>
            <option>Em andamento</option>
            <option>Aguardando empresa</option>
            <option>Concluído</option>
          </select>
          <select>
            <option>Todos os períodos</option>
            <option>Últimos 30 dias</option>
            <option>Últimos 90 dias</option>
          </select>
        </div>

        <div className="case-list">
          {cases.map(c => (
            <CaseCard key={c.id} item={c} onClick={() => onSelectCase?.(c)} />
          ))}
        </div>
      </>
    );
  }

  if (page === "equipe") {
    return (
      <>
        <div className="dashboard-heading">
          <div>
            <span className="eyebrow">GESTÃO DE ACESSOS</span>
            <h1>Equipe e colaboradores</h1>
            <p>
              Gerencie quem pode visualizar e tratar os atendimentos da empresa.
            </p>
          </div>
          <button className="primary-button">＋ Convidar colaborador</button>
        </div>

        <div className="table-card">
          <div className="table-head">
            <span>Colaborador</span>
            <span>E-mail</span>
            <span>Perfil</span>
            <span>Status</span>
            <span />
          </div>

          {["Ana Beatriz", "Carlos Mendes", "Fernanda Lima"].map((n, i) => (
            <div className="table-row" key={n}>
              <div>
                <strong>{n}</strong>
                <small>
                  Desde {["12 set. 2026", "18 set. 2026", "02 out. 2026"][i]}
                </small>
              </div>
              <span>
                {["ana@empresa.com", "carlos@empresa.com", "fernanda@empresa.com"][i]}
              </span>
              <span>{["Administradora", "Gestor", "Atendente"][i]}</span>
              <Status>Ativo</Status>
              <button className="more-button">•••</button>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (page === "relatorios") {
    return (
      <>
        <div className="dashboard-heading">
          <div>
            <span className="eyebrow">INTELIGÊNCIA DE DADOS</span>
            <h1>Relatórios</h1>
            <p>Indicadores para acompanhar a qualidade dos atendimentos.</p>
          </div>
          <button className="outline-button">Últimos 30 dias⌄</button>
        </div>

        <div className="metric-grid">
          <Metric label="Total de reclamações" value="128" delta="+12% no período" icon="▤" />
          <Metric label="Taxa de resolução" value="65,6%" delta="+4,2 pontos" icon="✓" />
          <Metric label="Satisfação média" value="4,6/5" delta="Com base em 52 avaliações" icon="☆" />
          <Metric label="Tempo de resposta" value="8h 20min" delta="−1h 15min" icon="◷" />
        </div>

        <div className="chart-card">
          <h3>Volume de atendimentos</h3>
          <p>Distribuição ilustrativa dos últimos seis meses</p>
          <div className="bars-chart">
            {[42, 62, 51, 78, 66, 92].map((n, i) => (
              <div key={i}>
                <span style={{ height: `${n}%` }} />
                <small>{["Jun", "Jul", "Ago", "Set", "Out", "Nov"][i]}</small>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  if (page === "satisfacao") {
    return (
      <>
        <div className="dashboard-heading">
          <div>
            <span className="eyebrow">EXPERIÊNCIA DO CLIENTE</span>
            <h1>Pesquisa de satisfação</h1>
            <p>
              Acompanhe a percepção dos usuários após os atendimentos.
            </p>
          </div>
        </div>

        <div className="metric-grid">
          <Metric label="Satisfação geral" value="4,6/5" delta="52 respostas" icon="☆" />
          <Metric label="Recomendariam" value="91%" delta="48 respostas positivas" icon="♡" />
        </div>

        <div className="chart-card">
          <h3>Questionário WHO-5</h3>
          <p>
            Instrumento de avaliação de bem-estar, apresentado aqui como
            módulo de demonstração.
          </p>
          <div className="info-banner">
            As respostas são confidenciais e devem ser utilizadas conforme
            a finalidade informada ao participante.
          </div>
          <button className="outline-button">Visualizar questionário →</button>
        </div>
      </>
    );
  }

  if (page === "perfil") {
    return (
      <>
        <div className="dashboard-heading">
          <div>
            <span className="eyebrow">CONFIGURAÇÕES</span>
            <h1>{title}</h1>
            <p>Atualize seus dados e preferências de acesso.</p>
          </div>
        </div>

        <div className="profile-card">
          <div className="avatar large">A</div>
          <div>
            <h3>{role === "empresa" ? "Conecta Telecom" : "Amanda Oliveira"}</h3>
            <p>
              {role === "empresa"
                ? "CNPJ ••••••••/0001-••"
                : "amanda@email.com"}
            </p>
            <span className="status status-green">Conta ativa</span>
          </div>
          <button className="outline-button">Editar informações</button>
        </div>

        <div className="chart-card">
          <h3>Segurança e privacidade</h3>
          <p>Gerencie senha, dados de acesso e preferências de comunicação.</p>
          <button className="text-button">Alterar senha →</button>
        </div>
      </>
    );
  }

  return (
    <div className="empty-page">
      <span>✧</span>
      <h2>{title}</h2>
      <p>
        Este módulo está preparado para receber a integração com o backend.
      </p>
    </div>
  );
}