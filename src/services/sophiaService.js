/**
 * Operações da conversa com a Sophia.
 *
 * O frontend apenas envia a mensagem ao backend e interpreta a resposta.
 * Quem consulta o modelo de IA é o backend; aqui não existe resposta
 * simulada nem acesso direto a provedores de IA.
 */
import { ENDPOINTS, ApiError, request } from "./api";
import { normalizeSummary } from "./reportService";

// Limite de interface para mensagens. O backend deve impor o seu próprio.
export const MAX_MESSAGE_LENGTH = 2000;

/**
 * Estados da conversa informados pelo backend.
 * PENDENTE: confirmar a lista definitiva com a equipe de backend. Um status
 * desconhecido é tratado como resposta inesperada (nunca "adivinhado").
 */
export const SOPHIA_STATUS = Object.freeze({
  COLLECTING: "collecting",
  READY_FOR_REVIEW: "ready_for_review",
});

/**
 * Envia uma mensagem do usuário.
 *
 * PROPOSTA de contrato (pendente de alinhamento):
 *   Envio:    { conversationId: string|null, message: string }
 *   Resposta: { conversationId, reply, status, summary? }
 *             `summary` é obrigatório quando status = "ready_for_review".
 *
 * PENDENTE: na 1ª mensagem enviamos `conversationId: null` e o backend cria
 * o identificador. Se a equipe preferir que o frontend gere o ID (ou que
 * exista um endpoint de "iniciar conversa"), ajuste aqui e em api.js.
 *
 * @param {object} params
 * @param {string|null} params.conversationId
 * @param {string} params.message
 * @param {AbortSignal} [params.signal]
 * @returns {Promise<{conversationId: string, reply: string, status: string, summary: object|null}>}
 */
export async function sendMessage({ conversationId, message, signal }) {
  const data = await request(ENDPOINTS.sophiaMessage, {
    body: { conversationId: conversationId ?? null, message },
    signal,
  });

  return parseSophiaResponse(data, conversationId);
}

/** Valida a resposta; qualquer divergência vira "resposta inesperada". */
function parseSophiaResponse(data, sentConversationId) {
  if (!data || typeof data !== "object") throw new ApiError("invalid_response");

  const reply = typeof data.reply === "string" ? data.reply.trim() : "";
  const conversationId =
    typeof data.conversationId === "string" && data.conversationId
      ? data.conversationId
      : sentConversationId;

  if (!reply || !conversationId) throw new ApiError("invalid_response");

  if (!Object.values(SOPHIA_STATUS).includes(data.status)) {
    throw new ApiError("invalid_response");
  }

  let summary = null;
  if (data.status === SOPHIA_STATUS.READY_FOR_REVIEW) {
    summary = normalizeSummary(data.summary);
    if (!summary) throw new ApiError("invalid_response");
  }

  return { conversationId, reply, status: data.status, summary };
}
