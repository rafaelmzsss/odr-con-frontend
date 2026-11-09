import { useEffect } from "react";

/** Campo de envio. Controlado pelo componente pai, que guarda o rascunho. */
export default function ChatInput({
  value,
  onChange,
  onSend,
  disabled,
  placeholder,
  maxLength,
  inputRef,
}) {
  // Foca ao abrir e devolve o foco quando o campo é liberado (ex.: após a resposta).
  useEffect(() => {
    if (!disabled) inputRef?.current?.focus();
  }, [disabled, inputRef]);

  return (
    <form
      className="chat-compose"
      onSubmit={(e) => {
        e.preventDefault();
        if (!disabled) onSend();
      }}
    >
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        aria-label="Mensagem para a Sophia"
        autoComplete="off"
      />
      <button type="submit" aria-label="Enviar" disabled={disabled || !value.trim()}>
        ↑
      </button>
    </form>
  );
}
