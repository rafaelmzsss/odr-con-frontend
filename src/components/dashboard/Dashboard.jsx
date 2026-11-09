import { useState } from "react";

import Sidebar, { menuCustomer, menuCompany } from "./Sidebar";
import CompanyHome from "./CompanyHome";
import CustomerHome from "./CustomerHome";
import GenericPage from "./GenericPage";
import CaseDetailDrawer from "./CaseDetailDrawer";
import SophiaChat from "../Sophia/SophiaChat";

const sampleCases = [
  {
    id: "ODR-2026-0184",
    company: "Conecta Telecom",
    title: "Instabilidade na conexão de internet",
    detail: "Quedas frequentes durante o período da noite.",
    status: "Em andamento",
    date: "03 nov. 2026",
    tone: "blue",
    category: "Serviço",
  },
  {
    id: "ODR-2026-0172",
    company: "Loja Horizonte",
    title: "Solicitação de troca de produto",
    detail: "Produto apresentou defeito após poucos dias de uso.",
    status: "Aguardando empresa",
    date: "29 out. 2026",
    tone: "amber",
    category: "Produto",
  },
  {
    id: "ODR-2026-0159",
    company: "Banco Centralis",
    title: "Divergência em cobrança",
    detail: "Valor cobrado diferente do informado na contratação.",
    status: "Concluído",
    date: "21 out. 2026",
    tone: "green",
    category: "Financeiro",
  },
];

export default function Dashboard({ role, name, onExit }) {
  const [active, setActive] = useState("inicio");
  const [chatOpen, setChatOpen] = useState(false);
  const [cases, setCases] = useState(sampleCases);
  const [notifications, setNotifications] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  // Chamado apenas após o backend devolver um protocolo real.
  const addCase = ({ protocol, summary }) =>
    setCases((c) => [
      {
        id: protocol,
        company: summary.company || "Empresa não informada",
        title: "Novo relato enviado pela Sophia",
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
        name={name}
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
                {name.slice(0, 1).toUpperCase()}
              </div>
              <span>{name}</span>
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
                A Sophia vai ouvir você, organizar as informações e preparar
                seu relato para revisão.
              </p>
              <div className="sophia-large">✧</div>
              <button
                className="primary-button"
                onClick={() => setChatOpen(true)}
              >
                Iniciar conversa com Sophia →
              </button>
            </div>
          ) : (
            <GenericPage
              page={active}
              role={role}
              cases={cases}
              setActive={setActive}
              onSelectCase={setSelectedCase}
            />
          )}
        </div>
      </main>

      <button
        className="chat-launcher"
        onClick={() => setChatOpen(!chatOpen)}
      >
        <span>✧</span>
        {chatOpen ? "Fechar Sophia" : "Falar com Sophia"}
      </button>

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

      <SophiaChat
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        onRegistered={addCase}
        onTrackCase={trackCase}
      />
    </div>
  );
}