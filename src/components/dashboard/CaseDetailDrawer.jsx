import { useEffect, useRef, useState } from "react";

import Icon from "../Icon";
import Status from "./Status";

const STAGES = ["Registrado", "Em análise", "Resposta", "Concluído"];

function stageOf(status = "") {
  const s = status.toLowerCase();

  if (s.includes("conclu")) return 3;
  if (s.includes("aguard")) return 2;
  if (s.includes("andamento") || s.includes("análise")) return 1;

  return 0;
}

// Quando o backend passar a enviar `item.updates` ([{ text, date }]),
// ele tem prioridade. Até lá, a linha do tempo é montada só com o que
// já sabemos do caso (status e data de abertura).
function buildUpdates(item, stage) {
  if (item.updates?.length) return item.updates;

  const list = [{ text: "Atendimento registrado", date: item.date }];

  if (stage >= 1) list.unshift({ text: "Relato em análise" });
  if (stage >= 2) list.unshift({ text: "Aguardando resposta da empresa" });
  if (stage >= 3) list.unshift({ text: "Atendimento concluído" });

  return list;
}

export default function CaseDetailDrawer({ item, onClose, onOpenChat }) {
  const closeRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const [copied, setCopied] = useState(false);

  const stage = stageOf(item.status);
  const updates = buildUpdates(item, stage);
  const summary = item.summary || item.detail;

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Foco no botão de fechar, Esc para sair e foco devolvido ao card.
  useEffect(() => {
    const previous = document.activeElement;
    const onKey = (e) => {
      if (e.key === "Escape") onCloseRef.current();
    };

    closeRef.current?.focus();
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, []);

  const copyProtocol = async () => {
    try {
      await navigator.clipboard.writeText(item.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Sem permissão de área de transferência: o protocolo continua visível.
    }
  };

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside
        className="case-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-drawer-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="drawer-head">
          <span className="eyebrow">{item.id}</span>

          <button
            ref={closeRef}
            className="drawer-close"
            onClick={onClose}
            aria-label="Fechar detalhes"
          >
            ×
          </button>
        </header>

        <div className="drawer-body">
          <div>
            <h2 id="case-drawer-title">{item.title}</h2>

            <div className="drawer-meta">
              <Status>{item.status}</Status>
              <span>
                {[item.category, item.company].filter(Boolean).join(" · ")}
              </span>
            </div>
          </div>

          <ol className="drawer-steps" aria-label="Etapas do atendimento">
            {STAGES.map((label, i) => (
              <li
                key={label}
                className={i <= stage ? "done" : ""}
                aria-current={i === stage ? "step" : undefined}
              >
                {label}
              </li>
            ))}
          </ol>

          {summary && (
            <section className="drawer-summary">
              <span>
                <Icon name="sparkle" size={14} /> Resumo do relato
              </span>
              <p>{summary}</p>
            </section>
          )}

          <section>
            <h3>Atualizações</h3>

            <ul className="drawer-timeline">
              {updates.map((u, i) => (
                <li key={`${u.text}-${i}`} className={i === 0 ? "now" : ""}>
                  {u.text}
                  {u.date && <small>{u.date}</small>}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <footer className="drawer-foot">
          <button className="primary-button" onClick={onOpenChat}>
            Falar com a Sophia
          </button>

          <button className="outline-button" onClick={copyProtocol}>
            {copied ? "Protocolo copiado" : "Copiar protocolo"}
          </button>
        </footer>
      </aside>
    </div>
  );
}