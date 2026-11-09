import { useState } from "react";
import Brand from "../Brand";

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

  const [form, setForm] = useState({
    name: "",
    email: "",
    document: "",
    company: "",
    password: "",
  });

  const update = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();

    if (mode === "recuperar") {
      setMode("login");
      return;
    }

    onEnter(
      role,
      form.name || (role === "empresa" ? "Equipe Conecta" : "Amanda")
    );
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
              : "Crie seu acesso"}
          </h2>

          <p className="muted">
            {mode === "login"
              ? "Entre para continuar sua jornada."
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
              ▣ Empresa
            </button>
          </div>

          <form onSubmit={submit} className="auth-form">
            {mode === "cadastro" && (
              <Field
                label={
                  role === "empresa"
                    ? "Nome do responsável"
                    : "Nome completo"
                }
                name="name"
                placeholder="Como podemos chamar você?"
                value={form.name}
                onChange={update}
                required
              />
            )}

            {role === "empresa" && (
              <Field
                label="Nome da empresa"
                name="company"
                placeholder="Razão social ou nome fantasia"
                value={form.company}
                onChange={update}
                required={mode === "cadastro"}
              />
            )}

            {mode === "cadastro" && (
              <Field
                label={role === "empresa" ? "CNPJ" : "CPF"}
                name="document"
                placeholder={
                  role === "empresa"
                    ? "00.000.000/0000-00"
                    : "000.000.000-00"
                }
                value={form.document}
                onChange={update}
                required
              />
            )}

            <Field
              label="E-mail"
              name="email"
              type="email"
              placeholder="Digite seu endereço de e-mail"
              value={form.email}
              onChange={update}
              required
            />

            <label className="field">
              <span>Senha</span>
              <div className="password-wrap">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
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
            </label>

            {mode === "login" && (
              <button
                type="button"
                className="text-button align-right"
                onClick={() => setMode("recuperar")}
              >
                Esqueci minha senha
              </button>
            )}

            {mode === "recuperar" && (
              <p className="info-note">
                Informe seu e-mail acima. Enviaremos as instruções
                para redefinir sua senha quando a recuperação estiver
                integrada.
              </p>
            )}

            <button className="primary-button full" type="submit">
              {mode === "login"
                ? "Entrar na plataforma"
                : mode === "cadastro"
                  ? "Criar minha conta"
                  : "Continuar"}
              <span>→</span>
            </button>
          </form>

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

          {role === "pessoa" && mode === "login" && (
            <button
              className="anonymous-link"
              type="button"
              onClick={() => onEnter("pessoa", "Visitante anônimo")}
            >
              Prefiro registrar um relato sem me identificar
            </button>
          )}

          <p className="secure-note">
            ♧ Seus dados são tratados com cuidado e confidencialidade.
          </p>
        </div>
      </section>
    </div>
  );
}