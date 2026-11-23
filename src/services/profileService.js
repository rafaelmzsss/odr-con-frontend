/**
 * Perfil do usuário: dados da conta e dados pessoais.
 *
 * A validação definitiva é do backend: o que o navegador envia aqui é apenas
 * a proposta do usuário, nunca uma fonte confiável. As regras abaixo existem
 * só para dar retorno rápido na tela.
 */
import { ENDPOINTS, ApiError, request } from "./api";

/**
 * ⚠️ MODO DEMONSTRAÇÃO: enquanto o endpoint de perfil não existir no backend
 * (ver docs/INTEGRACAO_BACKEND.md, seção 2.3), o salvamento acontece só na
 * sessão em memória, como o login e o cadastro. Quando o backend estiver
 * pronto, troque para `true`: `updateProfile` passa a chamar o servidor.
 */
export const PROFILE_BACKEND_READY = false;

export const PROFILE_UFS = Object.freeze([
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA",
  "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
]);

export const EMPTY_PROFILE = Object.freeze({
  username: "",
  email: "",
  fullName: "",
  socialName: "",
  city: "",
  state: "",
  phone: "", // somente dígitos
  notifyByEmail: true,
});

const USERNAME_RE = /^[a-z0-9_]{3,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Sugere um nome de usuário a partir do e-mail (letras minúsculas, números e _). */
export function usernameFromEmail(email) {
  return String(email ?? "")
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .slice(0, 20);
}

/** Perfil inicial criado na entrada (login/cadastro). Nada é inventado: o que não se sabe fica vazio. */
export function createInitialProfile({ email = "", fullName = "" } = {}) {
  return {
    ...EMPTY_PROFILE,
    email,
    fullName: fullName.trim(),
    username: usernameFromEmail(email),
  };
}

/** Nome exibido no painel: nome social, senão nome completo, senão nome de usuário. */
export function getDisplayName(profile, fallback = "") {
  return (
    profile?.socialName?.trim() ||
    profile?.fullName?.trim() ||
    profile?.username ||
    fallback
  );
}

/** Máscara de telefone brasileiro: (79) 99999-0000 ou (79) 3333-4444. */
export function formatPhone(value) {
  const d = String(value ?? "").replace(/\D/g, "").slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** Devolve { campo: "mensagem" } só com os campos inválidos (objeto vazio = tudo certo). */
export function validateProfile(v) {
  const errors = {};

  if (!v.username) errors.username = "Escolha um nome de usuário.";
  else if (!USERNAME_RE.test(v.username))
    errors.username = "Use de 3 a 20 caracteres: letras minúsculas, números e _.";

  if (!v.email.trim()) errors.email = "Informe seu e-mail.";
  else if (!EMAIL_RE.test(v.email.trim())) errors.email = "Digite um e-mail válido.";

  if (!v.fullName.trim()) errors.fullName = "Informe seu nome completo.";
  else if (v.fullName.trim().split(/\s+/).length < 2)
    errors.fullName = "Informe nome e sobrenome.";

  if (v.socialName.trim().length > 60)
    errors.socialName = "Use no máximo 60 caracteres.";

  if (!v.city.trim()) errors.city = "Informe sua cidade.";
  if (!v.state) errors.state = "Escolha a UF.";

  const phoneDigits = v.phone.replace(/\D/g, "");
  if (phoneDigits && phoneDigits.length < 10)
    errors.phone = "Digite o DDD e o número completo.";

  return errors;
}

/** Converte os valores do formulário no formato enviado/guardado (telefone só com dígitos). */
export function toProfilePayload(v) {
  return {
    username: v.username.trim(),
    email: v.email.trim().toLowerCase(),
    fullName: v.fullName.trim().replace(/\s+/g, " "),
    socialName: v.socialName.trim(),
    city: v.city.trim(),
    state: v.state,
    phone: v.phone.replace(/\D/g, ""),
    notifyByEmail: Boolean(v.notifyByEmail),
  };
}

/** Valida a resposta do servidor. Devolve null se não for utilizável. */
function normalizeProfile(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;

  const profile = { ...EMPTY_PROFILE };
  for (const key of Object.keys(EMPTY_PROFILE)) {
    if (key === "notifyByEmail") {
      if (typeof raw[key] === "boolean") profile[key] = raw[key];
    } else if (typeof raw[key] === "string") {
      profile[key] = raw[key].trim();
    }
  }

  return profile.username && profile.email ? profile : null;
}

/**
 * Salva o perfil e devolve a versão final dos dados.
 *
 * PROPOSTA de contrato (pendente de alinhamento): PATCH /api/me/profile
 * com o payload de `toProfilePayload`; resposta: o perfil atualizado.
 * 409 = nome de usuário ou e-mail já em uso.
 *
 * @throws {ApiError}
 */
export async function updateProfile(values) {
  const payload = toProfilePayload(values);

  if (!PROFILE_BACKEND_READY) return payload;

  const data = await request(ENDPOINTS.profileUpdate, { body: payload });
  const profile = normalizeProfile(data);
  if (!profile) throw new ApiError("invalid_response");
  return profile;
}
