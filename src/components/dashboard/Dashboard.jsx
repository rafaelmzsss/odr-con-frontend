import { useState } from "react";

import Sidebar from "./Sidebar";
import { menuCustomer, menuCompany } from "./menus";
import CompanyHome from "./CompanyHome";
import CustomerHome from "./CustomerHome";
import GenericPage from "./GenericPage";
import CaseDetailDrawer from "./CaseDetailDrawer";
import PriscilaChat from "../Priscila/PriscilaChat";

export default function Dashboard({ role, name, email, profile, anonymous, onUpdateProfile, onExit }) {
  const [active, setActive] = useState("inicio");
  const [chatOpen, setChatOpen] = useState(false);
  const [cases, setCases] = useState(sampleCases);
  const [notifications, setNotifications] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const displayName =
  name || email?.split("@")[0] || (anonymous ? "Visitante anônimo" : "Usuário");

  // Chamado apenas após o backend devolver um protocolo real.
  const addCase = ({ protocol, summary }) =>
    setCases((c) => [
      {
        id: protocol,
        company: summary.company || "Empresa não informada",
        title: "Novo relato enviado pela Priscila",
        detail: summary.description,
        status: "Registrado",
        date: "Hoje",
        category: summary.category || "Relato",
      },
      ...c,
    ]);

  const trackCase = () => {
    setChatOpen(false);
    setActive("atendimentos");
  };

  const activeMenu = (
    role === "empresa" ? menuCompany : menuCustomer
  ).find((x) => x.id === active);

  return (
    <div className="dashboard-shell">
      <Sidebar
        role={role}
        active={active}
        setActive={setActive}
        onExit={onExit}
        name={displayName}
      />

      <main className="dashboard-main">
        <header className="dash-topbar">
          <div className="breadcrumb">
            ODR-CON <span>/</span> {activeMenu?.label || "Painel"}
          </div>

          <div className="top-actions">
            <button
              onClick={() => setNotifications(!notifications)}
              className="notification-button"
            >
              ♧ <i />
            </button>

            {notifications && (
              <div className="notification-pop">
                Você está em dia! Não há novas notificações.
              </div>
            )}

            <div className="top-profile">
              <div className="avatar small">
                {displayName.slice(0, 1).toUpperCase()}
                </div>
                <span>{displayName}</span>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          {active === "inicio" ? (
            role === "empresa" ? (
              <CompanyHome cases={cases} setActive={setActive} />
            ) : (
              <CustomerHome
                cases={cases}
                setActive={setActive}
                openChat={() => setChatOpen(true)}
                onSelectCase={setSelectedCase}
              />
            )
          ) : active === "novo" ? (
            <div className="new-case-panel">
              <span className="eyebrow">NOVO ATENDIMENTO</span>
              <h1>Vamos começar uma conversa?</h1>
              <p>
                A Priscila vai ouvir você, organizar as informações e preparar
                seu relato para revisão.
              </p>
              <div className="priscila-large">✧</div>
              <button
                className="primary-button"
                onClick={() => setChatOpen(true)}
              >
                Iniciar conversa com Priscila →
              </button>
            </div>
          ) : (
            <GenericPage
            page={active}
            role={role}
            name={name}
            email={email}
            profile={profile}
            onUpdateProfile={onUpdateProfile}
            cases={cases}
            teamMembers={teamMembers}
            setTeamMembers={setTeamMembers}
            setActive={setActive}
            onSelectCase={setSelectedCase}
            />
          )}
        </div>
      </main>

      {role === "pessoa" && (
        <button
          className="chat-launcher"
          onClick={() => setChatOpen(!chatOpen)}
        >
          <span>✧</span>
          {chatOpen ? "Fechar Priscila" : "Falar com Priscila"}
        </button>
      )}

      {selectedCase && (
        <CaseDetailDrawer
          key={selectedCase.id}
          item={selectedCase}
          onClose={() => setSelectedCase(null)}
          onOpenChat={() => {
            setSelectedCase(null);
            setChatOpen(true);
          }}
        />
      )}

      {role === "pessoa" && (
        <PriscilaChat
          open={chatOpen}
          onClose={() => setChatOpen(false)}
          onRegistered={addCase}
          onTrackCase={trackCase}
        />
      )}
    </div>
  );
}
