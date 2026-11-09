/**
 * Cliente HTTP central do ODR-CON.
 *
 * Tudo que fala com o backend (Spring Boot) passa por aqui: URL base,
 * cabeçalhos, timeout, interpretação do status HTTP e tradução de falhas em
 * mensagens amigáveis. Nenhum outro arquivo deve chamar `fetch` diretamente.
 *
 * SEGURANÇA: este arquivo não contém chaves nem credenciais. A chave da
 * OpenAI vive apenas no backend. Nunca coloque segredos em variáveis VITE_*,
 * pois elas são embutidas no JavaScript entregue ao navegador.
 */

// Configurável por ambiente (ver .env.example). Ex.: http://localhost:8080
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

export const API_BASE_URL = String(rawBaseUrl).trim().replace(/\/+$/, "");
export const isApiConfigured = API_BASE_URL !== "";

// Uma IA pode levar alguns segundos; acima disso consideramos falha.
const DEFAULT_TIMEOUT_MS = 30_000;

/**
 * Rotas e métodos usados pelo frontend, em um único lugar.
 *
 * ⚠️ PENDENTE COM A EQUIPE DE BACKEND: os caminhos abaixo são PROPOSTAS para
 * alinhamento. Não existem endpoints confirmados. Ajuste aqui quando o
 * contrato definitivo for fechado (ver docs/INTEGRACAO_BACKEND.md).
 */
export const ENDPOINTS = Object.freeze({
  // PROPOSTA: envia uma mensagem do usuário e recebe a resposta da Sophia.
  sophiaMessage: { method: "POST", path: "/api/sophia/messages" },
  // PROPOSTA: registra o relato APÓS confirmação explícita do usuário.
  reportRegister: { method: "POST", path: "/api/reports" },
});

/* ------------------------------------------------------------------ */
/* Erros                                                               */
/* ------------------------------------------------------------------ */

const USER_MESSAGES = {
  not_configured: "A Sophia ainda não está conectada ao servidor neste ambiente.",
  network: "Não consegui me conectar ao servidor. Verifique sua internet e tente novamente.",
  timeout: "O servidor demorou demais para responder. Tente novamente.",
  unavailable: "O atendimento está temporariamente indisponível. Tente novamente em alguns instantes.",
  server: "Ocorreu um problema no servidor. Tente novamente em instantes.",
  unauthorized: "Sua sessão não é mais válida. Entre novamente para continuar.",
  forbidden: "Você não tem permissão para realizar esta ação.",
  rate_limited: "Muitas solicitações em pouco tempo. Aguarde um instante e tente novamente.",
  client: "Não foi possível processar a solicitação. Revise as informações e tente novamente.",
  invalid_response: "Recebi uma resposta inesperada do servidor. Tente novamente.",
  aborted: "Solicitação cancelada.",
  unknown: "Algo deu errado. Tente novamente.",
};

/**
 * Erro padronizado da camada HTTP. Guarda só o tipo e o status; o corpo da
 * resposta do servidor NUNCA é repassado à interface, para não expor
 * detalhes internos nem conteúdo sensível.
 */
export class ApiError extends Error {
  constructor(kind, { status = null } = {}) {
    super(kind);
    this.name = "ApiError";
    this.kind = kind;
    this.status = status;
  }

  get userMessage() {
    return USER_MESSAGES[this.kind] ?? USER_MESSAGES.unknown;
  }
}

/** Mensagem segura para exibir ao usuário a partir de qualquer erro. */
export function getErrorMessage(error) {
  return error instanceof ApiError ? error.userMessage : USER_MESSAGES.unknown;
}

function kindFromStatus(status) {
  if (status === 401) return "unauthorized";
  if (status === 403) return "forbidden";
  if (status === 408) return "timeout";
  if (status === 429) return "rate_limited";
  if (status === 502 || status === 503 || status === 504) return "unavailable";
  if (status >= 500) return "server";
  return "client";
}

/* ------------------------------------------------------------------ */
/* Autenticação (preparação para o futuro)                             */
/* ------------------------------------------------------------------ */

let authTokenProvider = null;

/**
 * Registra uma função que devolve o token de acesso atual (pode ser async).
 * Quando existir autenticação real, basta chamar `setAuthTokenProvider` uma
 * vez; todas as requisições passam a enviar `Authorization: Bearer ...`.
 * O token deve ficar em memória (ou em cookie HttpOnly gerido pelo backend),
 * nunca em log. Hoje nenhum provider é registrado.
 */
export function setAuthTokenProvider(provider) {
  authTokenProvider = typeof provider === "function" ? provider : null;
}

/* ------------------------------------------------------------------ */
/* Requisição                                                          */
/* ------------------------------------------------------------------ */

/**
 * Executa uma requisição JSON.
 *
 * @param {{method: string, path: string}} endpoint item de ENDPOINTS
 * @param {{body?: unknown, signal?: AbortSignal, timeoutMs?: number}} [options]
 * @returns {Promise<unknown>} corpo JSON (ou null em 204)
 * @throws {ApiError}
 */
export async function request(endpoint, { body, signal, timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  if (!isApiConfigured) throw new ApiError("not_configured");

  const controller = new AbortController();
  let timedOut = false;

  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  const forwardAbort = () => controller.abort();
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener("abort", forwardAbort, { once: true });
  }

  try {
    const headers = { Accept: "application/json" };
    if (body !== undefined) headers["Content-Type"] = "application/json";

    const token = await authTokenProvider?.();
    if (token) headers.Authorization = `Bearer ${token}`;

    let response;
    try {
      response = await fetch(`${API_BASE_URL}${endpoint.path}`, {
        method: endpoint.method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
    } catch {
      if (timedOut) throw new ApiError("timeout");
      if (signal?.aborted) throw new ApiError("aborted");
      throw new ApiError("network");
    }

    if (!response.ok) {
      throw new ApiError(kindFromStatus(response.status), { status: response.status });
    }

    if (response.status === 204) return null;

    try {
      return await response.json();
    } catch {
      throw new ApiError("invalid_response", { status: response.status });
    }
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", forwardAbort);
  }
}
