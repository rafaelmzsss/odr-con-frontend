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
    firstName: "",
    lastName: "",
    age: "",
    name: "", // responsável (empresa)
    company: "",
    document: "", // CNPJ (empresa)
    email: "",
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

  const personName = `${form.firstName} ${form.lastName}`.trim();

  onEnter(
    role,
    (role === "empresa" ? form.name : personName) ||
      (role === "empresa" ? "Equipe Conecta" : form.email.split("@")[0]),
    form.email,
    { fullName: role === "empresa" ? form.name : personName }
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

                <Field
                  label="Idade"
                  name="age"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  max="120"
                  placeholder="Digite sua idade"
                  value={form.age}
                  onChange={update}
                  required
                />
              </>
            )}

            {mode === "cadastro" && role === "empresa" && (
              <Field
                label="Nome do responsável"
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

            {mode === "cadastro" && role === "empresa" && (
              <Field
                label="CNPJ"
                name="document"
                inputMode="numeric"
                placeholder="00.000.000/0000-00"
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
              autoComplete="email"
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

          {role === "pessoa" && mode === "login" && (
            <button
              className="anonymous-button"
              type="button"
              onClick={() => onEnter("pessoa", "Visitante anônimo")}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" />
                <path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87" />
                <path d="M3 3l18 18" />
              </svg>
              Registrar relato sem me identificar
            </button>
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