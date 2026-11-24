import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./PasswordResetModal.css";

export default function PasswordResetModal({ onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage("");

    if (newPassword.length < 8) {
      setMessage("A nova senha precisa ter pelo menos 8 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("A confirmação não corresponde à nova senha.");
      return;
    }

    // A alteração real depende do endpoint de troca de senha no backend.
    setMessage(
      "Os campos foram validados, mas a alteração ainda precisa ser conectada ao backend."
    );
  };

  return createPortal(
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="password-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="password-modal-title"
      >
        <button
          type="button"
          className="icon-close"
          onClick={onClose}
          aria-label="Fechar"
        >
          ×
        </button>

        <span className="eyebrow">SEGURANÇA DA CONTA</span>
        <h2 id="password-modal-title">Alterar senha</h2>
        <p className="password-modal-description">
          Informe sua senha atual e escolha uma nova senha para sua conta.
        </p>

        <form onSubmit={handleSubmit} className="password-modal-form">
          <label className="field">
            <span>Senha atual</span>
            <input
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              required
            />
          </label>

          <label className="field">
            <span>Nova senha</span>
            <input
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
            />
            <small>Use pelo menos 8 caracteres.</small>
          </label>

          <label className="field">
            <span>Confirmar nova senha</span>
            <input
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </label>

          {message && (
            <p className="password-modal-message" role="status">
              {message}
            </p>
          )}

          <div className="password-modal-actions">
            <button type="button" className="outline-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="primary-button">
              Salvar nova senha
            </button>
          </div>
        </form>
      </section>
    </div>,
    document.body
  );
}
