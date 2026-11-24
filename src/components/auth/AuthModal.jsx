import { useState } from "react";
import Brand from "../Brand";
import { getErrorMessage } from "../../services/api";
import { login, recoverPassword, register } from "../../services/authService";

function Field({ label, ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input {...props} />
    </label>
  );
}

export default function AuthModal({ onClose, onEnter }) {
  const [role, setRole] = useState("pessoa");
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    name: "", // colaborador
    email: "",
    password: "",
  });

  const update = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "recuperar") {
        await recoverPassword(form.email);
        setMode("login");
        setError("Se o e-mail estiver cadastrado, você receberá instruções para redefinir a senha.");
        return;
      }

      const personName = `${form.firstName} ${form.lastName}`.trim();
      const fullName = role === "empresa" ? form.name.trim() : personName;
      const session = mode === "cadastro"
        ? await register({ email: form.email, password: form.password, role, fullName })
        : await login({ email: form.email, password: form.password, role });
      onEnter({ ...session, role, name: session.name || fullName || form.email.split("@")[0] });
  } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) =>
        e.target === e.currentTarget && onClose()
      }
    >
      <section className="auth-modal">
        <button
          className="icon-close"
          onClick={onClose}
          aria-label="Fechar"
        >
          ×
        </button>

        <div className="auth-aside">
          <Brand light />
          <div>
            <span className="eyebrow light">
              Um novo caminho começa aqui
            </span>
            <h2>O diálogo transforma relações.</h2>
            <p>
              Um espaço seguro para registrar, acompanhar e resolver
              conflitos com respeito.
            </p>
          </div>
          <div className="auth-aside-foot">
            ODR-CON · Plataforma de diálogo e resolução
          </div>
        </div>

        <div className="auth-content">
          <div className="auth-mobile-brand">
            <Brand />
          </div>

          <span className="eyebrow">ACESSO À PLATAFORMA</span>
          <h2>
            {mode === "login"
              ? "Que bom ter você por aqui."
              : mode === "recuperar"
                ? "Recuperar acesso"
                : "Crie seu acesso"}
          </h2>

          <p className="muted">
            {mode === "login"
              ? "Entre para continuar sua jornada."
              : mode === "recuperar"
                ? "Informe seu e-mail para consultar a recuperação de senha."
                : "Escolha seu perfil e preencha seus dados."}
          </p>

          <div className="role-switch">
            <button
              className={role === "pessoa" ? "selected" : ""}
              onClick={() => setRole("pessoa")}
            >
              ♙ Pessoa física
            </button>
            <button
              className={role === "empresa" ? "selected" : ""}
              onClick={() => setRole("empresa")}
            >
              ▣ Colaborador
            </button>
          </div>

          <form onSubmit={submit} className="auth-form">
            {mode === "cadastro" && role === "pessoa" && (
              <>
                <div className="field-row">
                  <Field
                    label="Nome"
                    name="firstName"
                    placeholder="Seu nome"
                    autoComplete="given-name"
                    value={form.firstName}
                    onChange={update}
                    required
                  />
                  <Field
                    label="Sobrenome"
                    name="lastName"
                    placeholder="Seu sobrenome"
                    autoComplete="family-name"
                    value={form.lastName}
                    onChange={update}
                    required
                  />
                </div>

              </>
            )}

            {mode === "cadastro" && role === "empresa" && (
              <Field
                label="Nome do colaborador"
                name="name"
                placeholder="Como podemos chamar você?"
                value={form.name}
                onChange={update}
                required
              />
            )}

            <Field
              label="E-mail"
              name="email"
              type="email"
              placeholder="Digite seu endereço de e-mail"
              autoComplete="email"
              value={form.email}
              onChange={update}
              required
            />

            {mode !== "recuperar" && <label className="field">
              <span>Senha</span>
              <div className="password-wrap">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={
                    mode === "cadastro"
                      ? "Escolha uma senha"
                      : "Digite sua senha"
                  }
                  autoComplete={
                    mode === "cadastro" ? "new-password" : "current-password"
                  }
                  minLength={mode === "cadastro" ? 8 : undefined}
                  value={form.password}
                  onChange={update}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </label>}

            {mode === "login" && (
              <button
                type="button"
                className="text-button align-right"
                onClick={() => setMode("recuperar")}
              >
                Esqueci minha senha
              </button>
            )}

            {error && <p className="info-note" role="alert">{error}</p>}
            <button className="primary-button full" type="submit" disabled={busy}>
              {mode === "login"
                ? "Entrar na plataforma"
                : mode === "cadastro"
                  ? "Criar minha conta"
                  : "Continuar"}
              <span>{busy ? "…" : "→"}</span>
            </button>
          </form>

          {role === "pessoa" && mode === "login" && (
            <button
              type="button"
              className="anonymous-button"
              onClick={() => onEnter({ role: "pessoa", name: "Visitante anônimo", email: "", user: null })}
            >
              Conversar com a Priscila anonimamente
            </button>
          )}

          {role === "pessoa" && mode === "login" && (
            <p className="info-note">
              Entre com sua conta ou converse anonimamente com a Priscila.
              Para acompanhar atendimentos, crie uma conta.
            </p>
          )}

          <p className="auth-bottom">
            {mode === "login"
              ? "Ainda não tem acesso?"
              : "Já possui uma conta?"}
            {" "}
            <button
              className="text-button"
              onClick={() =>
                setMode(mode === "login" ? "cadastro" : "login")
              }
            >
              {mode === "login" ? "Criar cadastro" : "Fazer login"}
            </button>
          </p>

          <p className="secure-note">
            ♧ Seus dados são tratados com cuidado e confidencialidade.
          </p>
        </div>
      </section>
    </div>
  );
}
