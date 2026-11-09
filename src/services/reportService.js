/**
 * Operações e estrutura de dados do relato (atendimento).
 *
 * O registro só pode acontecer depois da confirmação explícita do usuário.
 * A validação definitiva é do backend: o que o navegador envia aqui é apenas
 * a proposta do usuário, nunca uma fonte confiável.
 */
import { ENDPOINTS, ApiError, request } from "./api";

/**
 * Campos do resumo do relato. Para ampliar o contrato, acrescente o campo
 * aqui: normalização, tela de revisão e edição passam a considerá-lo.
 * Nenhum campo é obrigatório na coleta: ela é progressiva.
 */
export const REPORT_FIELDS = Object.freeze([
  { key: "company", label: "Empresa", multiline: false, maxLength: 200 },
  { key: "category", label: "Categoria", multiline: false, maxLength: 100 },
  { key: "description", label: "Descrição do ocorrido", multiline: true, maxLength: 2000 },
  { key: "requestedSolution", label: "Solução desejada", multiline: true, maxLength: 500 },
]);

/**
 * Converte o `summary` recebido (ou editado) no formato interno.
 * Campos ausentes viram "" (nunca inventamos valores). Devolve null se o
 * objeto não for utilizável (não é objeto ou não tem nenhum dado).
 */
export function normalizeSummary(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;

  const summary = {};
  let hasContent = false;

  for (const { key } of REPORT_FIELDS) {
    const value = typeof raw[key] === "string" ? raw[key].trim() : "";
    summary[key] = value;
    if (value) hasContent = true;
  }

  return hasContent ? summary : null;
}

/** Regra mínima de interface; o backend faz a validação definitiva. */
export function canRegister(summary) {
  return Boolean(summary?.description?.trim());
}

/**
 * Registra o relato confirmado e devolve o protocolo gerado pelo backend.
 *
 * PROPOSTA de contrato (pendente de alinhamento):
 *   Envio:    { conversationId, summary: { company, category, description, requestedSolution } }
 *   Resposta: { protocol: "..." }   // opcionalmente "status"
 *
 * Se a resposta não trouxer um protocolo, lança erro: jamais fabricamos um.
 *
 * @param {object} params
 * @param {string} params.conversationId
 * @param {object} params.summary resumo revisado/editado pelo usuário
 * @param {true} params.userConfirmed deve ser exatamente `true` (clique do usuário)
 * @param {AbortSignal} [params.signal]
 * @returns {Promise<{protocol: string, status: string|null}>}
 */
export async function registerReport({ conversationId, summary, userConfirmed, signal }) {
  if (userConfirmed !== true) {
    throw new Error("O registro exige confirmação explícita do usuário.");
  }

  const cleanSummary = normalizeSummary(summary);
  if (!conversationId || !cleanSummary) throw new ApiError("client");

  const data = await request(ENDPOINTS.reportRegister, {
    body: { conversationId, summary: cleanSummary },
    signal,
  });

  const protocol = typeof data?.protocol === "string" ? data.protocol.trim() : "";
  if (!protocol) throw new ApiError("invalid_response");

  return {
    protocol,
    status: typeof data.status === "string" ? data.status : null,
  };
}
