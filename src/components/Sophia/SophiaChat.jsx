import { useEffect, useRef, useState } from "react";

import { useSophiaChat, CHAT_PHASE } from "../../hooks/useSophiaChat";
import { MAX_MESSAGE_LENGTH } from "../../services/sophiaService";

import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import ReportSummary from "./ReportSummary";

import "./Sophia.css";

/**
 * Janela da Sophia. Apenas interface: o estado da conversa fica em
 * useSophiaChat e a comunicação com o backend em services/.
 *
 * Este componente permanece montado enquanto o usuário está no painel e
 * apenas deixa de renderizar quando fechado; por isso fechar e reabrir não
 * apaga a conversa.
 */
export default function SophiaChat({ open, onClose, onRegistered, onTrackCase }) {
  const chat = useSophiaChat({ onRegistered });
  const {
    messages,
    phase,
    isWaiting,
    isRegistering,
    error,
    hasUserMessages,
  } = chat;

  const [draft, setDraft] = useState("");
  const [adjusting, setAdjusting] = useState(false);
  const [confirmingNew, setConfirmingNew] = useState(false);

  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Mantém a última mensagem visível.
  useEffect(() => {
    const el = listRef.current;
    if (open && el) el.scrollTop = el.scrollHeight;
  }, [open, messages, isWaiting, error]);

  if (!open) return null;

  const registered = phase === CHAT_PHASE.REGISTERED;
  const hasFailedMessage = error?.type === "send";
  const inputDisabled = isWaiting || isRegistering || hasFailedMessage;

  const handleSend = () => {
    if (chat.sendUserMessage(draft)) {
      setDraft("");
      setAdjusting(false);
    }
  };

  const handleRequestAdjustments = () => {
    setAdjusting(true);
    inputRef.current?.focus();
  };

  const handleEditFailed = () => {
    setDraft(chat.discardFailedMessage());
    inputRef.current?.focus();
  };

  const handleNewConversation = () => {
    chat.startNewConversation();
    setDraft("");
    setAdjusting(false);
    setConfirmingNew(false);
  };

  // Pedir confirmação só se houver conversa em andamento (não registrada).
  const requestNewConversation = () => {
    if (hasUserMessages && !registered) setConfirmingNew(true);
    else handleNewConversation();
  };

  const placeholder = adjusting
    ? "Diga o que deseja ajustar no resumo..."
    : "Escreva sua mensagem...";

  return (
    <section className="chat-window">
      <header className="chat-header">
        <div className="sophia-avatar">✧</div>
        <div>
          <strong>Sophia</strong>
          <small><i /> Assistente virtual ODR-CON</small>
        </div>
        <button
          type="button"
          className="chat-new"
          onClick={requestNewConversation}
          disabled={isRegistering}
          title="Nova conversa"
          aria-label="Iniciar nova conversa"
        >
          ↻
        </button>
        <button type="button" onClick={onClose} aria-label="Fechar Sophia">×</button>
      </header>

      <div className="chat-context">
        Seus relatos são tratados com confidencialidade. Evite compartilhar senhas ou dados bancários.
      </div>

      {confirmingNew && (
        <div className="chat-confirm" role="alertdialog" aria-label="Nova conversa">
          <p>Descartar a conversa atual e começar outra?</p>
          <button type="button" onClick={() => setConfirmingNew(false)}>Continuar aqui</button>
          <button type="button" onClick={handleNewConversation}>Nova conversa</button>
        </div>
      )}

      <div className="chat-messages" ref={listRef} aria-live="polite">
        {messages.map((m) =>
          m.from === "summary" ? (
            <ReportSummary
              key={m.id}
              report={m.report}
              state={m.state}
              busy={isWaiting || isRegistering}
              onSave={(edited) => chat.updateReport(m.id, edited)}
              onRequestAdjustments={handleRequestAdjustments}
              onReject={() => chat.rejectReport(m.id)}
              onConfirm={chat.confirmReport}
            />
          ) : (
            <ChatMessage key={m.id} message={m} />
          )
        )}
        {isWaiting && <TypingIndicator />}
      </div>

      {error && (
        <div className="chat-error" role="alert">
          <p>{error.message}</p>
          {error.type === "send" ? (
            <>
              <button type="button" onClick={chat.retrySend} disabled={isWaiting}>
                Tentar novamente
              </button>
              <button type="button" onClick={handleEditFailed}>Editar mensagem</button>
            </>
          ) : (
            <button type="button" onClick={chat.dismissError}>Fechar aviso</button>
          )}
        </div>
      )}

      {registered ? (
        <div className="chat-done">
          {onTrackCase && (
            <button type="button" onClick={onTrackCase}>Acompanhar atendimento</button>
          )}
          <button type="button" onClick={handleNewConversation}>Nova conversa</button>
        </div>
      ) : (
        <ChatInput
          value={draft}
          onChange={setDraft}
          onSend={handleSend}
          disabled={inputDisabled}
          placeholder={placeholder}
          maxLength={MAX_MESSAGE_LENGTH}
          inputRef={inputRef}
        />
      )}

      <footer className="chat-foot">
        Sophia pode cometer erros. Revise as informações antes de enviar.
      </footer>
    </section>
  );
}
