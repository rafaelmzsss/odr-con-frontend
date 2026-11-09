import CaseCard from "./CaseCard";

export default function CustomerHome({ cases, setActive, openChat, onSelectCase }) {
  return (
    <>
      <div className="welcome-panel">
        <div>
          <span className="eyebrow">SEU ESPAÇO DE ESCUTA</span>
          <h1>Olá! Que bom ter você por aqui.</h1>
          <p>
            Acompanhe seus atendimentos ou converse com a Sophia
            para registrar uma nova situação.
          </p>

          <button className="primary-button" onClick={openChat}>
            Conversar com a Sophia <span>✧</span>
          </button>
        </div>

        <div className="welcome-art">
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="art-sphere">✧</div>
          <span className="art-star">✦</span>
        </div>
      </div>

      <div className="section-heading">
        <div>
          <span className="eyebrow">ACOMPANHAMENTO</span>
          <h2>Seus atendimentos</h2>
        </div>

        <button
          className="outline-button"
          onClick={() => setActive("atendimentos")}
        >
          Ver todos →
        </button>
      </div>

      <div className="case-grid">
        {cases.slice(0, 3).map(c => (
          <CaseCard
            key={c.id}
            item={c}
            onClick={() => onSelectCase(c)}
          />
        ))}
      </div>

      <div className="tip-panel">
        <span className="tip-icon">✧</span>

        <div>
          <strong>Não sabe por onde começar?</strong>
          <p>
            A Sophia pode ajudar você a organizar seu relato
            e entender os próximos passos.
          </p>
        </div>

        <button className="text-button" onClick={openChat}>
          Falar com Sophia →
        </button>
      </div>
    </>
  );
}