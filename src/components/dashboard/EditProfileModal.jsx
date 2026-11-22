import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { getErrorMessage } from "../../services/api";
import {
  EMPTY_PROFILE,
  PROFILE_UFS,
  formatPhone,
  validateProfile,
} from "../../services/profileService";

import "./EditProfileModal.css";

const TABS = [
  { id: "conta", label: "Conta" },
  { id: "pessoais", label: "Dados pessoais" },
];

// Em qual aba cada campo aparece (para abrir a aba com erro ao salvar).
const FIELD_TAB = {
  username: "conta",
  email: "conta",
  fullName: "pessoais",
  socialName: "pessoais",
  city: "pessoais",
  state: "pessoais",
  phone: "pessoais",
};

/**
 * Janela "Editar informações" do perfil. Renderize somente quando estiver
 * aberta: ao montar, o formulário parte sempre dos dados atuais.
 *
 * @param {{
 *   user: object,                          perfil atual (ver EMPTY_PROFILE)
 *   onClose: () => void,
 *   onSave: (values: object) => Promise<void>   lance um erro para exibi-lo no modal
 * }} props
 */
export default function EditProfileModal({ user, onClose, onSave }) {
  const uid = useId();

  const initial = useMemo(
    () => ({
      ...EMPTY_PROFILE,
      ...user,
      phone: formatPhone(user?.phone),
    }),
    [user],
  );

  const [values, setValues] = useState(initial);
  const [tab, setTab] = useState("conta");
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  const dialogRef = useRef(null);
  const firstFieldRef = useRef(null);

  const errors = useMemo(() => validateProfile(values), [values]);
  const dirty = Object.keys(EMPTY_PROFILE).some(
    (key) => values[key] !== initial[key],
  );

  const requestClose = () => {
    if (saving) return;
    if (dirty) setConfirmDiscard(true);
    else onClose();
  };

  // Mantém sempre a versão mais recente de requestClose para o listener de teclado.
  const requestCloseRef = useRef(requestClose);
  useEffect(() => {
    requestCloseRef.current = requestClose;
  });

  // Foco inicial, trava de rolagem da página e devolução do foco ao fechar.
  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstFieldRef.current?.focus();

    return () => {
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, []);

  // Esc fecha (ou volta da confirmação) e o Tab fica preso dentro da janela.
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (confirmDiscard) setConfirmDiscard(false);
        else requestCloseRef.current();
        return;
      }

      if (e.key === "Tab" && dialogRef.current) {
        const focusables = [
          ...dialogRef.current.querySelectorAll(
            "button:not([disabled]), input:not([disabled]), select:not([disabled])",
          ),
        ].filter((el) => el.offsetParent !== null && el.tabIndex >= 0);

        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [confirmDiscard]);

  const setField = (name, value) =>
    setValues((prev) => ({ ...prev, [name]: value }));
  const markTouched = (name) =>
    setTouched((prev) => ({ ...prev, [name]: true }));
  const fieldError = (name) =>
    (touched[name] || submitted) && errors[name] ? errors[name] : "";

  const tabHasError = (tabId) =>
    Object.keys(errors).some(
      (field) => FIELD_TAB[field] === tabId && (touched[field] || submitted),
    );

  const onTabsKeyDown = (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const index = TABS.findIndex((t) => t.id === tab);
    const step = e.key === "ArrowRight" ? 1 : -1;
    const next = TABS[(index + step + TABS.length) % TABS.length];
    setTab(next.id);
    document.getElementById(`${uid}-tab-${next.id}`)?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSubmitted(true);

    const invalidField = Object.keys(errors)[0];
    if (invalidField) {
      setTab(FIELD_TAB[invalidField]);
      requestAnimationFrame(() =>
        dialogRef.current?.querySelector('[aria-invalid="true"]')?.focus(),
      );
      return;
    }

    setSaving(true);
    setSubmitError("");
    try {
      await onSave(values);
      onClose();
    } catch (err) {
      setSubmitError(getErrorMessage(err));
      setSaving(false);
    }
  };

  const id = (name) => `${uid}-${name}`;

  return createPortal(
    <div
      className="modal-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && requestClose()}
    >
      <section
        className="epm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={id("title")}
        ref={dialogRef}
      >
        <button
          type="button"
          className="icon-close"
          onClick={requestClose}
          aria-label="Fechar"
        >
          ×
        </button>

        <header className="epm-header">
          <span className="eyebrow">MEU PERFIL</span>
          <h2 id={id("title")}>Editar informações</h2>
          <p className="muted">Atualize seus dados de acesso e de contato.</p>
        </header>

        <div
          className="role-switch epm-tabs"
          role="tablist"
          aria-label="Seções do perfil"
          onKeyDown={onTabsKeyDown}
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={id(`tab-${t.id}`)}
              aria-selected={tab === t.id}
              aria-controls={id(`panel-${t.id}`)}
              tabIndex={tab === t.id ? 0 : -1}
              className={tab === t.id ? "selected" : ""}
              onClick={() => setTab(t.id)}
            >
              {t.label}
              {tabHasError(t.id) && (
                <span
                  className="epm-dot"
                  role="img"
                  aria-label="com campos para corrigir"
                />
              )}
            </button>
          ))}
        </div>

        <form className="epm-form" onSubmit={handleSubmit} noValidate>
          <div className="epm-body">
            <div
              role="tabpanel"
              id={id("panel-conta")}
              aria-labelledby={id("tab-conta")}
              hidden={tab !== "conta"}
              className="auth-form"
            >
              <div className="field">
                <label htmlFor={id("username")}>Nome de usuário</label>
                <div
                  className={`password-wrap epm-affix${
                    fieldError("username") ? " is-invalid" : ""
                  }`}
                >
                  <span className="epm-at" aria-hidden="true">
                    @
                  </span>
                  <input id={id("username")}
                    ref={firstFieldRef}
                    type="text"
                    value={values.username}
                    maxLength={20}
                    autoComplete="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    aria-invalid={fieldError("username") ? "true" : undefined}
                    aria-describedby={id("username-msg")}
                    onChange={(e) =>
                      setField(
                        "username",
                        e.target.value.toLowerCase().replace(/\s/g, ""),
                      )
                    }
                    onBlur={() => markTouched("username")}
                  />
                </div>
                <small
                  id={id("username-msg")}
                  className={`epm-msg${fieldError("username") ? " error" : ""}`}
                >
                  {fieldError("username") ||
                    "De 3 a 20 caracteres: letras minúsculas, números e _."}
                </small>
              </div>

              <div className="field">
                <label htmlFor={id("email")}>E-mail</label>
                <input id={id("email")}
                  type="email"
                  value={values.email}
                  autoComplete="email"
                  aria-invalid={fieldError("email") ? "true" : undefined}
                  aria-describedby={id("email-msg")}
                  onChange={(e) => setField("email", e.target.value)}
                  onBlur={() => markTouched("email")}
                />
                <small
                  id={id("email-msg")}
                  className={`epm-msg${fieldError("email") ? " error" : ""}`}
                >
                  {fieldError("email") ||
                    "Esse e-mail também é usado para entrar na plataforma."}
                </small>
              </div>
            </div>

            <div
              role="tabpanel"
              id={id("panel-pessoais")}
              aria-labelledby={id("tab-pessoais")}
              hidden={tab !== "pessoais"}
              className="auth-form"
            >
              <div className="field">
                <label htmlFor={id("fullName")}>Nome completo</label>
                <input id={id("fullName")}
                  type="text"
                  value={values.fullName}
                  autoComplete="name"
                  aria-invalid={fieldError("fullName") ? "true" : undefined}
                  aria-describedby={fieldError("fullName") ? id("fullName-msg") : undefined}
                  onChange={(e) => setField("fullName", e.target.value)}
                  onBlur={() => markTouched("fullName")}
                />
                {fieldError("fullName") && (
                  <small id={id("fullName-msg")} className="epm-msg error">
                    {fieldError("fullName")}
                  </small>
                )}
              </div>

              <div className="field">
                <label htmlFor={id("socialName")}>
                  Nome social <em className="epm-optional">(opcional)</em>
                </label>
                <input id={id("socialName")}
                  type="text"
                  value={values.socialName}
                  maxLength={60}
                  aria-invalid={fieldError("socialName") ? "true" : undefined}
                  aria-describedby={id("socialName-msg")}
                  onChange={(e) => setField("socialName", e.target.value)}
                  onBlur={() => markTouched("socialName")}
                />
                <small
                  id={id("socialName-msg")}
                  className={`epm-msg${fieldError("socialName") ? " error" : ""}`}
                >
                  {fieldError("socialName") ||
                    "Se preencher, usaremos esse nome para chamar você na plataforma."}
                </small>
              </div>

              <div className="epm-city-row">
                <div className="field">
                  <label htmlFor={id("city")}>Cidade</label>
                  <input id={id("city")}
                    type="text"
                    value={values.city}
                    autoComplete="address-level2"
                    aria-invalid={fieldError("city") ? "true" : undefined}
                    aria-describedby={fieldError("city") ? id("city-msg") : undefined}
                    onChange={(e) => setField("city", e.target.value)}
                    onBlur={() => markTouched("city")}
                  />
                  {fieldError("city") && (
                    <small id={id("city-msg")} className="epm-msg error">
                      {fieldError("city")}
                    </small>
                  )}
                </div>

                <div className="field">
                  <label htmlFor={id("state")}>UF</label>
                  <select id={id("state")}
                    value={values.state}
                    autoComplete="address-level1"
                    aria-invalid={fieldError("state") ? "true" : undefined}
                    aria-describedby={fieldError("state") ? id("state-msg") : undefined}
                    onChange={(e) => setField("state", e.target.value)}
                    onBlur={() => markTouched("state")}
                  >
                    <option value="">UF</option>
                    {PROFILE_UFS.map((uf) => (
                      <option key={uf} value={uf}>
                        {uf}
                      </option>
                    ))}
                  </select>
                  {fieldError("state") && (
                    <small id={id("state-msg")} className="epm-msg error">
                      {fieldError("state")}
                    </small>
                  )}
                </div>
              </div>

              <div className="field">
                <label htmlFor={id("phone")}>
                  Telefone / WhatsApp <em className="epm-optional">(opcional)</em>
                </label>
                <input id={id("phone")}
                  type="tel"
                  inputMode="tel"
                  placeholder="(79) 99999-0000"
                  value={values.phone}
                  autoComplete="tel"
                  aria-invalid={fieldError("phone") ? "true" : undefined}
                  aria-describedby={id("phone-msg")}
                  onChange={(e) => setField("phone", formatPhone(e.target.value))}
                  onBlur={() => markTouched("phone")}
                />
                <small
                  id={id("phone-msg")}
                  className={`epm-msg${fieldError("phone") ? " error" : ""}`}
                >
                  {fieldError("phone") ||
                    "Usado apenas para ajudar na recuperação da sua senha."}
                </small>
              </div>

              <div className="epm-pref">
                <strong>Preferência de contato</strong>
                <label className="epm-switch" htmlFor={id("notify")}>
                  <span className="epm-switch-text">
                    <span id={id("notify-label")}>
                      Avisos de atualização por e-mail
                    </span>
                    <small id={id("notify-desc")}>
                      Receba um e-mail quando houver novidades nos seus
                      atendimentos. O acompanhamento completo continua na
                      plataforma.
                    </small>
                  </span>
                  <input
                    id={id("notify")}
                    type="checkbox"
                    role="switch"
                    aria-labelledby={id("notify-label")}
                    aria-describedby={id("notify-desc")}
                    checked={values.notifyByEmail}
                    onChange={(e) => setField("notifyByEmail", e.target.checked)}
                  />
                </label>
              </div>
            </div>

            {submitError && (
              <p className="epm-submit-error" role="alert">
                {submitError}
              </p>
            )}
          </div>

          <footer className="epm-footer">
            {confirmDiscard ? (
              <>
                <p className="epm-discard-text" role="alert">
                  Descartar as alterações?
                </p>
                <button
                  type="button"
                  className="outline-button"
                  onClick={() => setConfirmDiscard(false)}
                >
                  Continuar editando
                </button>
                <button
                  type="button"
                  className="outline-button epm-danger"
                  onClick={onClose}
                >
                  Descartar
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="outline-button"
                  onClick={requestClose}
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="primary-button"
                  disabled={saving}
                >
                  {saving ? "Salvando…" : "Salvar alterações"}
                </button>
              </>
            )}
          </footer>
        </form>
      </section>
    </div>,
    document.body,
  );
}
