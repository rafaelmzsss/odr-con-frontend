/** Balão de texto da conversa (usuário ou Sophia). Resumos usam ReportSummary. */
export default function ChatMessage({ message }) {
  const mine = message.from === "user";

  return (
    <div className={`chat-line ${mine ? "mine" : ""}`}>
      <div className="chat-bubble">
        {message.text}
        {message.status === "failed" && (
          <span className="chat-failed">Não enviada</span>
        )}
      </div>
    </div>
  );
}
