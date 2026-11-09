import { useState } from "react";
import { REPORT_FIELDS, canRegister } from "../../services/reportService";
import { SUMMARY_STATE } from "../../hooks/useSophiaChat";

const STATE_LABEL = {
  [SUMMARY_STATE.SUPERSEDED]: "Resumo anterior",
  [SUMMARY_STATE.REJECTED]: "Resumo descartado",
  [SUMMARY_STATE.REGISTERED]: "Resumo registrado",
};

/**
 * Resumo estruturado do relato. Permite revisar, editar, pedir ajustes,
 * rejeitar e confirmar. A confirmação é sempre um clique explícito.
 */
export default function ReportSummary({
  report,
  state,
  busy,
  onSave,
  onRequestAdjustments,
  onReject,
  onConfirm,
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(report);

  const active = state === SUMMARY_STATE.ACTIVE;
  const registrable = canRegister(report);

  const startEdit = () => {
    setForm({ ...report });
    setEditing(true);
  };

  const save = (e) => {
    e.preventDefault();
    if (onSave(form)) setEditing(false);
  };

  return (
    <div className="chat-line">
      <div className={`chat-bubble summary-bubble ${active ? "" : "summary-muted"}`}>
        <strong>{active ? "Resumo do relato" : STATE_LABEL[state]}</strong>

        {editing ? (
          <form className="report-form" onSubmit={save}>
            {REPORT_FIELDS.map(({ key, label, multiline, maxLength }) => (
              <label className="report-field" key={key}>
                <span>{label}</span>
                {multiline ? (
                  <textarea
                    rows={3}
                    value={form[key]}
                    maxLength={maxLength}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  />
                ) : (
                  <input
                    value={form[key]}
                    maxLength={maxLength}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  />
                )}
              </label>
            ))}
            <div className="summary-actions">
              <button type="button" onClick={() => setEditing(false)}>
                Cancelar
              </button>
              <button type="submit">Salvar alterações</button>
            </div>
          </form>
        ) : (
          <dl className="report-fields">
            {REPORT_FIELDS.map(({ key, label }) => (
              <div key={key}>
                <dt>{label}</dt>
                <dd className={report[key] ? "" : "report-empty"}>
                  {report[key] || "Não informado"}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {active && !editing && (
          <>
            {!registrable && (
              <p className="report-hint">Preencha ao menos a descrição para registrar.</p>
            )}
            <div className="summary-actions">
              <button type="button" onClick={startEdit} disabled={busy}>
                Editar
              </button>
              <button type="button" onClick={onRequestAdjustments} disabled={busy}>
                Solicitar ajustes
              </button>
              <button type="button" onClick={onReject} disabled={busy}>
                Rejeitar
              </button>
              <button type="button" onClick={onConfirm} disabled={busy || !registrable}>
                Confirmar e registrar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
