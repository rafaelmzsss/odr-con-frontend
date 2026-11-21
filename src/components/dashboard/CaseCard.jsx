import Status from "./Status";

export default function CaseCard({ item, onClick }) {
  return (
    <button className="case-card" onClick={onClick}>
      <div className="case-top">
        <span className="case-category">
          {item.category || "Atendimento"}
        </span>

        <Status>{item.status}</Status>
      </div>

      <h3>{item.title}</h3>
      <p>{item.detail}</p>

      <div className="case-bottom">
        <span>{item.id}</span>
        <span>{item.date}　↗</span>
      </div>
    </button>
  );
}