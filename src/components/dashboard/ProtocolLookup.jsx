import { useState } from "react";
import Status from "./Status";

export default function ProtocolLookup({ cases }) {
  const [token, setToken] = useState("");
  const [result, setResult] = useState(null);

  return (
    <>
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">ACOMPANHAMENTO</span>
          <h1>Consultar protocolo</h1>
          <p>
            Informe o código recebido ao registrar seu atendimento
            para consultar o andamento.
          </p>
        </div>
      </div>

      <div className="protocol-card">
        <label className="field">
          <span>Código do protocolo</span>
          <input
            value={token}
            onChange={e => setToken(e.target.value)}
            placeholder="Ex.: ODR-2026-0184"
          />
        </label>

        <button
          className="primary-button"
          onClick={() =>
            setResult(
              cases.find(
                c => c.id.toLowerCase() === token.trim().toLowerCase()
              ) || false
            )
          }
        >
          Consultar atendimento →
        </button>

        {result === false && (
          <p className="protocol-error">
            Não encontramos esse protocolo na demonstração.
            Confira o código e tente novamente.
          </p>
        )}

        {result && result !== false && (
          <div className="protocol-result">
            <span className="eyebrow">ATENDIMENTO LOCALIZADO</span>
            <h3>{result.title}</h3>
            <p>{result.detail}</p>
            <Status>{result.status}</Status>
            <small>{result.id} · {result.date}</small>
          </div>
        )}
      </div>
    </>
  );
}