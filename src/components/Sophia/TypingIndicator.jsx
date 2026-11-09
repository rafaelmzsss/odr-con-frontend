/** Indicador de que a Sophia está preparando uma resposta. */
export default function TypingIndicator() {
  return (
    <div className="chat-line" role="status" aria-label="Sophia está digitando">
      <div className="chat-bubble typing-bubble">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
