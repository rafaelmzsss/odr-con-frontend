/**
 * Estado e regras do fluxo de conversa da Sophia, fora do componente visual.
 *
 * Responsabilidades:
 * - manter o histórico e o `conversationId` durante a sessão (fechar a janela
 *   do chat não apaga nada; o estado só vive na memória, sem localStorage);
 * - enviar mensagens ao backend, com bloqueio de envio simultâneo, tratamento
 *   de falha e nova tentativa;
 * - controlar a revisão do resumo e o registro após confirmação explícita.
 *
 * O fluxo NÃO usa etapas fixas: quem decide quando há informação suficiente
 * é a IA, via `status` devolvido pelo backend.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { getErrorMessage } from "../services/api";
import { registerReport, canRegister, normalizeSummary } from "../services/reportService";
import { sendMessage, MAX_MESSAGE_LENGTH, SOPHIA_STATUS } from "../services/sophiaService";

export const CHAT_PHASE = Object.freeze({
  COLLECTING: "collecting",
  REVIEWING: "reviewing",
  REGISTERING: "registering",
  REGISTERED: "registered",
});

/** Situação de cada resumo exibido no histórico. */
export const SUMMARY_STATE = Object.freeze({
  ACTIVE: "active",
  SUPERSEDED: "superseded",
  REJECTED: "rejected",
  REGISTERED: "registered",
});

// Saudação local de interface. Não é resposta da IA e não vai ao backend.
const GREETING_TEXT =
  "Olá! Eu sou a Sophia, sua assistente virtual. 💚 Estou aqui para ouvir você e ajudar a organizar seu atendimento. O que aconteceu?";

const REJECTED_NOTICE =
  "Tudo bem. Não vou utilizar essa sugestão. Você pode continuar conversando comigo ou pedir um novo resumo.";

let messageSeq = 0;
const newId = () => `msg-${++messageSeq}`;

const createGreeting = () => ({ id: newId(), from: "sophia", text: GREETING_TEXT, local: true });

export function useSophiaChat({ onRegistered } = {}) {
  const [messages, setMessages] = useState(() => [createGreeting()]);
  const [conversationId, setConversationId] = useState(null);
  const [phase, setPhase] = useState(CHAT_PHASE.COLLECTING);
  const [isWaiting, setIsWaiting] = useState(false); // Sophia "digitando"
  const [error, setError] = useState(null); // { type: "send" | "register", message, messageId? }
  const [registration, setRegistration] = useState(null); // { protocol }

  // Refs: bloqueio síncrono (evita duplo clique antes do re-render) e
  // controle para descartar respostas de uma conversa já encerrada.
  const conversationIdRef = useRef(null);
  const inFlightRef = useRef(false);
  const sessionRef = useRef(0);
  const abortRef = useRef(null);
  const onRegisteredRef = useRef(onRegistered);

  useEffect(() => {
    onRegisteredRef.current = onRegistered;
  }, [onRegistered]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const patchMessage = useCallback((id, patch) => {
    setMessages((list) => list.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }, []);

  /** Envia (ou reenvia) uma mensagem já presente no histórico. */
  const deliver = useCallback(
    async (messageId, text) => {
      inFlightRef.current = true;
      const session = sessionRef.current;
      const controller = new AbortController();
      abortRef.current = controller;

      setIsWaiting(true);
      setError(null);
      patchMessage(messageId, { status: "sending" });

      try {
        const reply = await sendMessage({
          conversationId: conversationIdRef.current,
          message: text,
          signal: controller.signal,
        });
        if (session !== sessionRef.current) return;

        const ready = reply.status === SOPHIA_STATUS.READY_FOR_REVIEW;
        const replyMessage = { id: newId(), from: "sophia", text: reply.reply };
        const summaryMessage = ready
          ? { id: newId(), from: "summary", report: reply.summary, state: SUMMARY_STATE.ACTIVE }
          : null;

        conversationIdRef.current = reply.conversationId;
        setConversationId(reply.conversationId);
        setMessages((list) => {
          const next = list.map((m) => {
            if (m.id === messageId) return { ...m, status: "sent" };
            // Um novo retorno da IA substitui qualquer resumo ainda em revisão.
            if (m.from === "summary" && m.state === SUMMARY_STATE.ACTIVE) {
              return { ...m, state: SUMMARY_STATE.SUPERSEDED };
            }
            return m;
          });
          next.push(replyMessage);
          if (summaryMessage) next.push(summaryMessage);
          return next;
        });
        setPhase(ready ? CHAT_PHASE.REVIEWING : CHAT_PHASE.COLLECTING);
      } catch (err) {
        if (session !== sessionRef.current) return;
        patchMessage(messageId, { status: "failed" });
        setError({ type: "send", messageId, message: getErrorMessage(err) });
      } finally {
        if (session === sessionRef.current) {
          inFlightRef.current = false;
          abortRef.current = null;
          setIsWaiting(false);
        }
      }
    },
    [patchMessage]
  );

  /** Envia o texto do usuário. Devolve true se foi aceito (para limpar o campo). */
  const sendUserMessage = useCallback(
    (rawText) => {
      const text = String(rawText ?? "").trim();
      if (!text || text.length > MAX_MESSAGE_LENGTH) return false;

      const locked =
        inFlightRef.current ||
        phase === CHAT_PHASE.REGISTERING ||
        phase === CHAT_PHASE.REGISTERED ||
        error?.type === "send"; // há uma mensagem pendente de reenvio

      if (locked) return false;

      const id = newId();
      setMessages((list) => [...list, { id, from: "user", text, status: "sending" }]);
      deliver(id, text);
      return true;
    },
    [deliver, phase, error]
  );

  /** Tenta novamente a última mensagem que falhou (sem duplicá-la no histórico). */
  const retrySend = useCallback(() => {
    if (inFlightRef.current || error?.type !== "send") return;
    const failed = messages.find((m) => m.id === error.messageId);
    if (failed) deliver(failed.id, failed.text);
  }, [deliver, error, messages]);

  /** Remove a mensagem que falhou e devolve o texto para o usuário editar. */
  const discardFailedMessage = useCallback(() => {
    if (inFlightRef.current || error?.type !== "send") return "";
    const failed = messages.find((m) => m.id === error.messageId);
    setMessages((list) => list.filter((m) => m.id !== error.messageId));
    setError(null);
    return failed?.text ?? "";
  }, [error, messages]);

  /** Salva a edição do resumo feita pelo usuário. */
  const updateReport = useCallback(
    (id, editedReport) => {
      const clean = normalizeSummary(editedReport);
      if (!clean || phase !== CHAT_PHASE.REVIEWING) return false;
      patchMessage(id, { report: clean });
      return true;
    },
    [patchMessage, phase]
  );

  /** Descarta o resumo. O backend ainda não é avisado (ver docs: pendência). */
  const rejectReport = useCallback(
    (id) => {
      if (inFlightRef.current || phase !== CHAT_PHASE.REVIEWING) return;
      patchMessage(id, { state: SUMMARY_STATE.REJECTED });
      setMessages((list) => [
        ...list,
        { id: newId(), from: "sophia", text: REJECTED_NOTICE, local: true },
      ]);
      setPhase(CHAT_PHASE.COLLECTING);
    },
    [patchMessage, phase]
  );

  /**
   * Registra o relato. Só deve ser chamada a partir do clique do usuário no
   * botão de confirmação; nunca automaticamente.
   */
  const confirmReport = useCallback(async () => {
    const active = messages.find(
      (m) => m.from === "summary" && m.state === SUMMARY_STATE.ACTIVE
    );
    if (!active || inFlightRef.current || phase !== CHAT_PHASE.REVIEWING) return;
    if (!canRegister(active.report) || !conversationIdRef.current) return;

    inFlightRef.current = true;
    const session = sessionRef.current;
    const controller = new AbortController();
    abortRef.current = controller;

    setPhase(CHAT_PHASE.REGISTERING);
    setError(null);

    try {
      const result = await registerReport({
        conversationId: conversationIdRef.current,
        summary: active.report,
        userConfirmed: true,
        signal: controller.signal,
      });
      if (session !== sessionRef.current) return;

      patchMessage(active.id, { state: SUMMARY_STATE.REGISTERED });
      setMessages((list) => [
        ...list,
        {
          id: newId(),
          from: "sophia",
          local: true,
          text: `Seu relato foi registrado. O protocolo é ${result.protocol}. Você poderá acompanhar o andamento na área de atendimentos.`,
        },
      ]);
      setRegistration({ protocol: result.protocol });
      setPhase(CHAT_PHASE.REGISTERED);
      onRegisteredRef.current?.({
        protocol: result.protocol,
        status: result.status,
        conversationId: conversationIdRef.current,
        summary: active.report,
      });
    } catch (err) {
      if (session !== sessionRef.current) return;
      setPhase(CHAT_PHASE.REVIEWING);
      setError({ type: "register", message: getErrorMessage(err) });
    } finally {
      if (session === sessionRef.current) {
        inFlightRef.current = false;
        abortRef.current = null;
      }
    }
  }, [messages, patchMessage, phase]);

  const dismissError = useCallback(() => {
    setError((current) => (current?.type === "register" ? null : current));
  }, []);

  /** Ação explícita para recomeçar. Não é possível durante o registro. */
  const startNewConversation = useCallback(() => {
    if (phase === CHAT_PHASE.REGISTERING) return;
    abortRef.current?.abort();
    abortRef.current = null;
    sessionRef.current += 1; // invalida qualquer resposta ainda em trânsito
    inFlightRef.current = false;
    conversationIdRef.current = null;

    setMessages([createGreeting()]);
    setConversationId(null);
    setPhase(CHAT_PHASE.COLLECTING);
    setIsWaiting(false);
    setError(null);
    setRegistration(null);
  }, [phase]);

  return {
    messages,
    conversationId,
    phase,
    isWaiting,
    isRegistering: phase === CHAT_PHASE.REGISTERING,
    error,
    registration,
    hasUserMessages: messages.some((m) => m.from === "user"),
    sendUserMessage,
    retrySend,
    discardFailedMessage,
    updateReport,
    rejectReport,
    confirmReport,
    dismissError,
    startNewConversation,
  };
}
