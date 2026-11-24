import { useEffect, useId, useMemo, useState } from "react";
import { createPortal } from "react-dom";

const PERMISSIONS = [
  { id: "viewCases", label: "Visualizar atendimentos" },
  { id: "manageCases", label: "Responder e gerenciar atendimentos" },
  { id: "viewReports", label: "Visualizar relatórios e indicadores" },
  { id: "viewSatisfaction", label: "Visualizar pesquisas de satisfação" },
  { id: "manageTeam", label: "Convidar e gerenciar colaboradores" },
  { id: "manageCompany", label: "Editar informações da empresa" },
];

const EMPTY_MEMBER = {
  fullName: "",
  email: "",
  phone: "",
  department: "",
  position: "",
  accessProfile: "Atendente",
  admissionDate: "",
  employeeCode: "",
  status: "Ativo",
  notes: "",
  permissions: ["viewCases", "manageCases"],
};

export default function TeamMemberModal({ mode, member, onClose, onSave }) {
  const uid = useId();
  const isEdit = mode === "edit";
  const initialValues = useMemo(
    () => ({ ...EMPTY_MEMBER, ...(member || {}) }),
    [member],
  );
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState("");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = "hidden";
    document.getElementById(`${uid}-name`)?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus?.();
    };
  }, [onClose, uid]);

  const setField = (field, value) =>
    setValues((current) => ({ ...current, [field]: value }));

  const togglePermission = (permission) => {
    setValues((current) => ({
      ...current,
      permissions: current.permissions.includes(permission)
        ? current.permissions.filter((item) => item !== permission)
        : [...current.permissions, permission],
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!values.fullName.trim() || !values.email.trim()) {
      setError("Informe o nome completo e o e-mail do colaborador.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) {
      setError("Informe um endereço de e-mail válido.");
      return;
    }
    setError("");
    onSave({ ...values, fullName: values.fullName.trim(), email: values.email.trim() });
  };

  return createPortal(
    <div
      className="modal-backdrop team-modal-backdrop"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section className="team-modal" role="dialog" aria-modal="true" aria-labelledby={`${uid}-title`}>
        <button type="button" className="icon-close" onClick={onClose} aria-label="Fechar">×</button>
        <header className="team-modal-header">
          <span className="eyebrow">GESTÃO DE ACESSOS</span>
          <h2 id={`${uid}-title`}>{isEdit ? "Editar colaborador" : "Convidar colaborador"}</h2>
          <p className="muted">
            {isEdit
              ? "Atualize os dados cadastrais, o perfil e as permissões de acesso."
              : "Preencha os dados para cadastrar um integrante na equipe."}
          </p>
        </header>

        <form className="team-modal-form" onSubmit={handleSubmit}>
          <div className="team-form-grid">
            <label className="field team-field team-field-wide">
              Nome completo *
              <input id={`${uid}-name`} value={values.fullName} onChange={(e) => setField("fullName", e.target.value)} placeholder="Nome e sobrenome" required />
            </label>
            <label className="field team-field">
              E-mail de acesso *
              <input type="email" value={values.email} onChange={(e) => setField("email", e.target.value)} placeholder="colaborador@empresa.com" required />
            </label>
            <label className="field team-field">
              Telefone / WhatsApp
              <input value={values.phone} onChange={(e) => setField("phone", e.target.value)} placeholder="(00) 00000-0000" />
            </label>
            <label className="field team-field">
              Setor
              <input value={values.department} onChange={(e) => setField("department", e.target.value)} placeholder="Ex.: Atendimento" />
            </label>
            <label className="field team-field">
              Cargo
              <input value={values.position} onChange={(e) => setField("position", e.target.value)} placeholder="Ex.: Analista" />
            </label>
            <label className="field team-field">
              Perfil de acesso
              <select value={values.accessProfile} onChange={(e) => setField("accessProfile", e.target.value)}>
                <option>Administrador</option>
                <option>Gestor</option>
                <option>Atendente</option>
                <option>Personalizado</option>
              </select>
            </label>
            <label className="field team-field">
              Data de admissão
              <input type="date" value={values.admissionDate} onChange={(e) => setField("admissionDate", e.target.value)} />
            </label>
            <label className="field team-field">
              Matrícula / identificação
              <input value={values.employeeCode} onChange={(e) => setField("employeeCode", e.target.value)} placeholder="Opcional" />
            </label>
            {isEdit && (
              <label className="field team-field">
                Situação
                <select value={values.status} onChange={(e) => setField("status", e.target.value)}>
                  <option>Ativo</option>
                  <option>Inativo</option>
                  <option>Convite pendente</option>
                </select>
              </label>
            )}
          </div>

          <fieldset className="team-permissions">
            <legend>Permissões de acesso</legend>
            <p>Selecione o que este colaborador poderá visualizar ou gerenciar.</p>
            <div className="team-permission-grid">
              {PERMISSIONS.map((permission) => (
                <label key={permission.id} className="team-permission-option">
                  <input
                    type="checkbox"
                    checked={values.permissions.includes(permission.id)}
                    onChange={() => togglePermission(permission.id)}
                  />
                  <span>{permission.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="field team-field">
            Observações internas
            <textarea value={values.notes} onChange={(e) => setField("notes", e.target.value)} placeholder="Informações adicionais sobre o colaborador" rows="3" />
          </label>

          {error && <p className="team-form-error" role="alert">{error}</p>}
          <p className="team-modal-note">Prévia de interface: os dados ficam apenas nesta sessão e ainda não são enviados ao backend.</p>
          <footer className="team-modal-actions">
            <button type="button" className="outline-button" onClick={onClose}>Cancelar</button>
            <button type="submit" className="primary-button">{isEdit ? "Salvar alterações" : "Adicionar colaborador"}</button>
          </footer>
        </form>
      </section>
    </div>,
    document.body,
  );
}