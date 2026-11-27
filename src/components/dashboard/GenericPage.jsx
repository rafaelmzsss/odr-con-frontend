import { useMemo, useState } from "react";

import CaseCard from "./CaseCard";
import ProtocolLookup from "./ProtocolLookup";
import EditProfileModal from "./EditProfileModal";
import TeamMemberModal from "./TeamMemberModal";
import "./TeamMemberModal.css";

function EmptyState({ title, description }) {
  return (
    <div className="data-empty-state">
      <span aria-hidden="true">✧</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function parseCaseDate(item) {
  const value = item.createdAt || item.date;
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export default function GenericPage({
  page,
  role,
  name,
  email,
  profile,
  anonymous = false,
  onUpdateProfile,
  cases = [],
  teamMembers = [],
  setTeamMembers,
  setActive,
  onSelectCase,
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [periodFilter, setPeriodFilter] = useState("todos");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  const titleMap = {
    atendimentos: role === "empresa" ? "Atendimentos" : "Meus atendimentos",
    equipe: "Equipe e colaboradores",
    relatorios: "Relatórios e indicadores",
    satisfacao: "Pesquisa de satisfação",
    perfil: role === "empresa" ? "Perfil da empresa" : "Meu perfil",
  };
  const title = titleMap[page] || "Visão geral";

  const filteredCases = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");
    const now = new Date();
    return cases.filter((item) => {
      const searchable = [item.id, item.title, item.company, item.category]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("pt-BR");
      if (normalizedSearch && !searchable.includes(normalizedSearch)) return false;
      if (statusFilter !== "todos" && item.status !== statusFilter) return false;
      if (periodFilter !== "todos") {
        const date = parseCaseDate(item);
        if (!date) return false;
        const days = periodFilter === "30" ? 30 : 90;
        const limit = new Date(now);
        limit.setDate(limit.getDate() - days);
        if (date < limit || date > now) return false;
      }
      return true;
    });
  }, [cases, search, statusFilter, periodFilter]);

  const addCollaborator = (values) => {
    setTeamMembers((current) => [
      ...current,
      { ...values, id: `local-${Date.now()}`, status: "Convite pendente" },
    ]);
    setInviteOpen(false);
  };

  const updateCollaborator = (values) => {
    setTeamMembers((current) => current.map((member) =>
      member.id === editingMember.id ? { ...member, ...values } : member,
    ));
    setEditingMember(null);
  };

  if (page === "anonimo") {
    return (
      <div className="new-case-panel">
        <span className="eyebrow">RELATO ANÔNIMO</span>
        <h1>Sua voz pode ser ouvida sem identificação.</h1>
        <p>Você pode iniciar uma conversa com a Priscila sem criar uma conta. Não informe dados que possam identificar você no texto do relato.</p>
        <div className="priscila-large">✧</div>
        <button className="primary-button" onClick={() => setActive("novo")}>Iniciar relato anônimo →</button>
      </div>
    );
  }

  if (page === "protocolo") return <ProtocolLookup cases={cases} />;

  if (page === "atendimentos") {
    return (
      <>
        <div className="dashboard-heading">
          <div>
            <span className="eyebrow">ACOMPANHAMENTO</span>
            <h1>{title}</h1>
            <p>{role === "empresa" ? "Visualize e acompanhe as solicitações recebidas." : "Consulte o andamento das suas solicitações."}</p>
          </div>
          {role === "empresa" && <button className="outline-button" disabled>Exportar dados ↓</button>}
        </div>

        <div className="filter-row">
          <input aria-label="Buscar atendimento" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="⌕ Buscar por protocolo ou assunto" />
          <select aria-label="Filtrar por status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="todos">Todos os status</option>
            {[...new Set(cases.map((item) => item.status).filter(Boolean))].map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
          <select aria-label="Filtrar por período" value={periodFilter} onChange={(event) => setPeriodFilter(event.target.value)}>
            <option value="todos">Todos os períodos</option>
            <option value="30">Últimos 30 dias</option>
            <option value="90">Últimos 90 dias</option>
          </select>
          {(search || statusFilter !== "todos" || periodFilter !== "todos") && (
            <button className="text-button" onClick={() => { setSearch(""); setStatusFilter("todos"); setPeriodFilter("todos"); }}>Limpar filtros</button>
          )}
        </div>
        <p className="results-count">{filteredCases.length} {filteredCases.length === 1 ? "atendimento encontrado" : "atendimentos encontrados"}</p>
        {filteredCases.length ? (
          <div className="case-list">{filteredCases.map((item) => <CaseCard key={item.id} item={item} onClick={() => onSelectCase?.(item)} />)}</div>
        ) : (
          <EmptyState title={cases.length ? "Nenhum atendimento encontrado" : "Nenhum atendimento registrado"} description={cases.length ? "Não há atendimentos que correspondam aos filtros selecionados. Experimente alterar os critérios de busca." : "Os atendimentos registrados pela plataforma aparecerão aqui quando forem recebidos do backend."} />
        )}
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
            <p>Gerencie os dados cadastrais e as permissões de quem acessa a conta da empresa.</p>
          </div>
          <button className="primary-button" onClick={() => setInviteOpen(true)}>＋ Convidar colaborador</button>
        </div>

        {teamMembers.length ? (
          <div className="table-card">
            <div className="table-head team-table-head"><span>Colaborador</span><span>E-mail</span><span>Setor / cargo</span><span>Perfil</span><span>Status</span><span /></div>
            {teamMembers.map((member) => (
              <div className="table-row team-table-row" key={member.id}>
                <div><strong>{member.fullName}</strong><small>{member.admissionDate ? `Admissão: ${new Date(`${member.admissionDate}T00:00:00`).toLocaleDateString("pt-BR")}` : "Admissão não informada"}</small></div>
                <span>{member.email}</span>
                <span>{[member.department, member.position].filter(Boolean).join(" · ") || "Não informado"}</span>
                <span>{member.accessProfile}</span>
                <span className="team-pending-status">{member.status}</span>
                <div className="team-row-actions">
                  <button className="more-button" aria-label={`Opções de ${member.fullName}`} aria-expanded={openMenuId === member.id} onClick={() => setOpenMenuId(openMenuId === member.id ? null : member.id)}>•••</button>
                  {openMenuId === member.id && (
                    <div className="team-action-menu">
                     <button
                     type="button"
                     onClick={() => {
                     setEditingMember(member);
                     setOpenMenuId(null);
                    }}
                     >
                     Editar informações
                    </button>

                   <button
                    type="button"
                    onClick={() => {
                    setEditingMember(member);
                    setOpenMenuId(null);
                    }}
                    >
                    Editar permissões
                   </button>
                  </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="Nenhum colaborador cadastrado" description="Os integrantes da equipe serão exibidos aqui após serem cadastrados e recebidos do backend. Use “Convidar colaborador” para preencher um novo cadastro." />
        )}

        {(inviteOpen || editingMember) && (
          <TeamMemberModal
            mode={editingMember ? "edit" : "invite"}
            member={editingMember}
            onClose={() => { setInviteOpen(false); setEditingMember(null); }}
            onSave={editingMember ? updateCollaborator : addCollaborator}
          />
        )}
      </>
    );
  }

  if (page === "relatorios" || page === "satisfacao") {
    const isReports = page === "relatorios";
    return (
      <>
        <div className="dashboard-heading">
          <div>
            <span className="eyebrow">{isReports ? "INTELIGÊNCIA DE DADOS" : "EXPERIÊNCIA DO CLIENTE"}</span>
            <h1>{isReports ? "Relatórios e indicadores" : "Pesquisa de satisfação"}</h1>
            <p>{isReports ? "Os indicadores serão apresentados conforme os dados reais de atendimento forem recebidos." : "As avaliações e respostas dos usuários serão exibidas após serem registradas na plataforma."}</p>
          </div>
        </div>
        <EmptyState
          title={isReports ? "Ainda não há dados para gerar relatórios" : "Ainda não há respostas de satisfação"}
          description={isReports ? "Quando houver atendimentos registrados, os relatórios e indicadores serão disponibilizados aqui. Nenhum dado demonstrativo é exibido." : "As avaliações aparecerão nesta área conforme os usuários responderem às pesquisas vinculadas aos atendimentos."}
        />
      </>
    );
  }

  if (page === "perfil") {
    const isAnonymous = name === "Visitante anônimo";
    return (
      <>
        <div className="dashboard-heading"><div><span className="eyebrow">CONFIGURAÇÕES</span><h1>{title}</h1><p>Atualize seus dados e preferências de acesso.</p></div></div>
        <div className="profile-card">
          <div className="avatar large">{(name || "?").slice(0, 1).toUpperCase()}</div>
          <div>
            <h3>{name}</h3>
            <p>{role === "empresa" ? "CNPJ ••••••••/0001-••" : isAnonymous ? "Sessão anônima, sem dados de identificação" : profile?.username ? `@${profile.username} · ${email}` : email}</p>
            <span className="status status-green">Conta ativa</span>
          </div>
          {!isAnonymous && <button className="outline-button" onClick={role !== "empresa" && profile ? () => setEditOpen(true) : undefined}>Editar informações</button>}
        </div>
        {editOpen && <EditProfileModal user={profile} onClose={() => setEditOpen(false)} onSave={onUpdateProfile} />}
        {!anonymous && (
         <div className="chart-card">
          <h3>Segurança e privacidade</h3>
           <p>
            Gerencie senha, dados de acesso e preferências de comunicação.
          </p>
           <button className="text-button">
            Alterar senha →
          </button>
       </div>
)}
      </>
    );
  }

  return <EmptyState title={title} description="Este módulo está preparado para receber dados do backend." />;
}