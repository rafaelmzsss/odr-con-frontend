import { FormEvent, useMemo, useState } from "react"

type Page = "home" | "overview" | "board" | "documents" | "team" | "reports" | "admin" | "login" | "signup"

type IconName = "grid" | "search" | "home" | "folder" | "tag" | "users" | "briefcase" | "plane" | "bell" | "settings" | "user" | "more" | "plus" | "calendar" | "pin" | "flag" | "chevron" | "arrow" | "eye" | "menu" | "close"

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    home: (
      <>
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v10h14V10M9 20v-6h6v6" />
      </>
    ),
    folder: <path d="M3 6h7l2 2h9v11H3z" />,
    tag: (
      <>
        <path d="M3 12 12 3h7l2 2v7l-9 9z" />
        <circle cx="16.5" cy="7.5" r=".8" fill="currentColor" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="4" />
        <path d="M2 21c0-4 3-7 7-7s7 3 7 7M16 4a4 4 0 0 1 0 8M17 15c3 .7 5 2.8 5 6" />
      </>
    ),
    briefcase: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V4h8v3M3 12h18M10 12v2h4v-2" />
      </>
    ),
    plane: <path d="m3 11 7 2 9-9 2 2-7 9 2 6-2 1-4-6-4 4-2-1 3-5-4-1z" />,
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1A8 8 0 0 0 15 6l-.3-2.6h-4L10.4 6A8 8 0 0 0 9 7L6.5 6 4.6 9.5l2 1.5a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a8 8 0 0 0 1.4.8l.3 2.8h4l.3-2.7a8 8 0 0 0 1.5-.9l2.4 1 2-3.4-2-1.5a7 7 0 0 0 .1-1Z" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
      </>
    ),
    more: (
      <>
        <circle cx="5" cy="12" r="1" fill="currentColor" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
        <circle cx="19" cy="12" r="1" fill="currentColor" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M8 3v4M16 3v4M3 10h18" />
      </>
    ),
    pin: <path d="m14 4 6 6-3 1-4 4-1 5-2-2-4-4 5-1 4-4z" />,
    flag: (
      <>
        <path d="M5 22V4" />
        <path d="M5 5h12l-2 4 2 4H5" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
    arrow: <path d="M19 12H5m6-6-6 6 6 6" />,
    eye: (
      <>
        <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12Z" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
  }
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  )
}

const navItems: { label: string; icon: IconName; page: Page }[] = [
  { label: "Visão geral", icon: "home", page: "overview" },
  { label: "Projetos", icon: "folder", page: "board" },
  { label: "Documentos", icon: "tag", page: "documents" },
  { label: "Equipe", icon: "users", page: "team" },
  { label: "Relatórios", icon: "briefcase", page: "reports" },
  { label: "Área de trabalho", icon: "plane", page: "board" },
]

function Logo() {
  return (
    <button className="logo" aria-label="Voltar ao início">
      <span className="logo-mark" />
      <strong>ODR</strong>
    </button>
  )
}

function Sidebar({
  page,
  setPage,
  open,
  onClose,
}: {
  page: Page
  setPage: (p: Page) => void
  open: boolean
  onClose: () => void
}) {
  return (
    <>
      <div className={`scrim ${open ? "show" : ""}`} onClick={onClose} />
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-head">
          <Logo />
          <button className="icon-button mobile-close" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>
        <div className="quick-actions">
          <button className="round-action">
            <Icon name="user" size={16} />
          </button>
          <button
            className="round-action blue"
            onClick={() => setPage("admin")}
          >
            <Icon name="settings" size={16} />
          </button>
          <button className="round-action notice">
            <Icon name="bell" size={16} />
            <span>3</span>
          </button>
        </div>
        <label className="side-search">
          <Icon name="search" size={16} />
          <input placeholder="Buscar..." />
        </label>
        <nav className="side-nav">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={item.page === page ? "active" : ""}
              onClick={() => {
                setPage(item.page)
                onClose()
              }}
            >
              <Icon name={item.icon} size={17} />
              <span>{item.label}</span>
              {item.label === "Área de trabalho" && (
                <>
                  <small>99+</small>
                  <Icon name="chevron" size={14} />
                </>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-foot">
          <button className="secondary-btn" onClick={() => setPage("login")}>
            Entrar
          </button>
          <button className="primary-btn" onClick={() => setPage("signup")}>
            Cadastre-se grátis
          </button>
        </div>
      </aside>
    </>
  )
}

function MobileTop({ onMenu }: { onMenu: () => void }) {
  return (
    <div className="mobile-top">
      <button className="icon-button" onClick={onMenu}>
        <Icon name="menu" />
      </button>
      <Logo />
      <span />
    </div>
  )
}

function Illustration({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`placeholder-art ${compact ? "compact" : ""}`}>
      <span />
      <i />
      <i />
      <i />
    </div>
  )
}

const articles = [
  {
    category: "Estratégia",
    title: "Construa um trabalho melhor, em equipe",
    meta: "Produto · 8 min",
  },
  {
    category: "Cultura",
    title: "Abra espaço para grandes ideias",
    meta: "Pessoas · 6 min",
  },
  {
    category: "Pesquisa",
    title: "Um caminho mais claro para avançar",
    meta: "Design · 5 min",
  },
  {
    category: "Ideias",
    title: "Pequenas mudanças, impacto real",
    meta: "Crescimento · 7 min",
  },
]

function Home({
  goBoard,
  goLogin,
}: {
  goBoard: () => void
  goLogin: () => void
}) {
  return (
    <main className="home-page">
      <section className="hero">
        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />
        <div className="hero-copy">
          <span className="eyebrow">TRABALHO, REIMAGINADO</span>
          <h1>Leve suas ideias adiante.</h1>
          <p>
            Um espaço focado para equipes que querem menos ruído, mais clareza e
            um trabalho melhor — todos os dias.
          </p>
          <div className="hero-actions">
            <button className="primary-btn" onClick={goBoard}>
              Explorar área de trabalho
            </button>
            <button className="secondary-btn" onClick={goLogin}>
              Começar grátis
            </button>
          </div>
        </div>
      </section>
      <section className="stories">
        <div className="section-heading">
          <div>
            <span className="eyebrow">HISTÓRIAS RECENTES</span>
            <h2>Ideias que merecem ser compartilhadas</h2>
          </div>
          <button className="text-link">
            Ver tudo <Icon name="chevron" size={15} />
          </button>
        </div>
        <div className="article-grid">
          {articles.map((article, i) => (
            <article className="article-card" key={article.title}>
              <Illustration compact={i % 2 === 1} />
              <div className="article-content">
                <span className="category">{article.category}</span>
                <h3>{article.title}</h3>
                <p>
                  Reflexões práticas para equipes atentas e para quem está
                  construindo o que vem a seguir.
                </p>
                <div className="author">
                  <span className="avatar">
                    <Icon name="user" size={14} />
                  </span>
                  <div>
                    <strong>Jane Doe</strong>
                    <small>{article.meta}</small>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

const initialColumns = [
  {
    title: "Em andamento",
    cards: [
      { title: "Renovar conceito da página inicial", cat: "Design", art: true },
      { title: "Revisar notas da pesquisa do T3", cat: "Pesquisa", art: true },
    ],
  },
  {
    title: "A fazer",
    cards: [
      { title: "Mapear experiência de integração", cat: "Produto", art: false },
      {
        title: "Criar inventário de componentes",
        cat: "Sistema de design",
        art: true,
      },
      { title: "Preparar atualização semanal", cat: "Operações", art: false },
      { title: "Entrevistas com clientes", cat: "Pesquisa", art: false },
    ],
  },
  {
    title: "Concluído",
    cards: [
      { title: "Definir métricas de sucesso", cat: "Estratégia", art: false },
      {
        title: "Compartilhar briefing do projeto",
        cat: "Planejamento",
        art: false,
      },
      { title: "Workshop da equipe", cat: "Cultura", art: true },
    ],
  },
]

function Members() {
  return (
    <div className="members">
      {[0, 1, 2, 3].map((i) => (
        <span key={i}>
          <Icon name="user" size={11} />
        </span>
      ))}
    </div>
  )
}

function TaskCard({
  title,
  cat,
  art,
}: {
  title: string
  cat: string
  art: boolean
}) {
  return (
    <article className="task-card">
      <span className="task-category">{cat}</span>
      <h3>{title}</h3>
      {art && <Illustration compact />}
      <Members />
      <div className="task-tools">
        <button>
          <Icon name="plus" size={16} />
        </button>
        <button>
          <Icon name="calendar" size={16} />
        </button>
        <button>
          <Icon name="pin" size={16} />
        </button>
        <button>
          <Icon name="flag" size={16} />
        </button>
        <button className="more">
          <Icon name="more" size={17} />
        </button>
      </div>
    </article>
  )
}

function DashboardTabs({
  page,
  setPage,
}: {
  page: Page
  setPage: (p: Page) => void
}) {
  return (
    <div className="dash-tabs">
      <button
        className={page === "overview" ? "active" : ""}
        onClick={() => setPage("overview")}
      >
        Visão geral
      </button>
      <button
        className={page === "board" ? "active" : ""}
        onClick={() => setPage("board")}
      >
        Tarefas <span>7</span>
      </button>
      <button
        className={page === "documents" ? "active" : ""}
        onClick={() => setPage("documents")}
      >
        Documentos <span>12</span>
      </button>
      <button
        className={page === "team" ? "active" : ""}
        onClick={() => setPage("team")}
      >
        Equipe <span>99+</span>
      </button>
      <button
        className={page === "reports" ? "active" : ""}
        onClick={() => setPage("reports")}
      >
        Relatórios
      </button>
      <button
        className={page === "admin" ? "active" : ""}
        onClick={() => setPage("admin")}
      >
        Administração
      </button>
      <button>
        <Icon name="more" size={16} />
      </button>
    </div>
  )
}

function DashboardHead({
  page,
  setPage,
  search,
  setSearch,
}: {
  page: Page
  setPage: (p: Page) => void
  search: string
  setSearch: (v: string) => void
}) {
  return (
    <>
      <div className="dashboard-title">
        <div>
          <span className="eyebrow">SUA ÁREA DE TRABALHO</span>
          <h1>Painel</h1>
        </div>
        <button
          className="primary-btn new-button"
          onClick={() => setPage("board")}
        >
          <Icon name="plus" size={17} /> Nova tarefa
        </button>
      </div>
      <div className="dashboard-bar">
        <DashboardTabs page={page} setPage={setPage} />
        <label className="top-search">
          <Icon name="search" size={17} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar"
          />
        </label>
      </div>
    </>
  )
}

function Board({ setPage }: { setPage: (p: Page) => void }) {
  const [search, setSearch] = useState("")
  const [columns, setColumns] = useState(initialColumns)
  const addTask = (columnIndex: number) => {
    const title = window.prompt("Nome da tarefa")
    if (!title?.trim()) return
    setColumns((cols) =>
      cols.map((col, i) =>
        i === columnIndex
          ? {
              ...col,
              cards: [
                ...col.cards,
                { title: title.trim(), cat: "Nova tarefa", art: false },
              ],
            }
          : col,
      ),
    )
  }
  return (
    <main className="dashboard-page">
      <DashboardHead
        page="board"
        setPage={setPage}
        search={search}
        setSearch={setSearch}
      />
      <div className="board">
        {columns.map((column, ci) => {
          const cards = column.cards.filter((card) =>
            `${card.title} ${card.cat}`
              .toLowerCase()
              .includes(search.toLowerCase()),
          )
          return (
            <section className="board-column" key={column.title}>
              <header>
                <div>
                  <span className="status-dot" />
                  <h2>{column.title}</h2>
                  <small>{cards.length}</small>
                </div>
                <button>
                  <Icon name="more" size={17} />
                </button>
              </header>
              <div className="task-list">
                {cards.map((card, i) => (
                  <TaskCard key={`${card.title}-${i}`} {...card} />
                ))}
              </div>
              <button className="add-task" onClick={() => addTask(ci)}>
                <Icon name="plus" size={17} /> Adicionar tarefa
              </button>
            </section>
          )
        })}
      </div>
    </main>
  )
}

const people = [
  "Jane Doe",
  "Alex Morgan",
  "Maya Chen",
  "Noah Williams",
  "Amelia Hart",
  "Leo Martin",
  "Sofia Rossi",
  "Ethan Reed",
  "Iris Walker",
  "Lucas Kim",
  "Emma Stone",
  "Oliver Hall",
]
const rowTitles = [
  "Direção da página inicial",
  "Pesquisa com clientes",
  "Roteiro do produto",
  "Renovação da marca",
  "Sistema de design",
  "Relatório semanal",
  "Planejamento de lançamento",
  "Estratégia de conteúdo",
  "Encontro da equipe",
  "Experimentos de crescimento",
  "Retrospectiva do T3",
  "Experiência mobile",
]

function Documents({ setPage }: { setPage: (p: Page) => void }) {
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<number[]>([])
  const rows = useMemo(
    () =>
      people
        .map((person, i) => ({
          person,
          title: rowTitles[i],
          status:
            i % 3 === 0 ? "Em revisão" : i % 3 === 1 ? "Rascunho" : "Aprovado",
        }))
        .filter((r) =>
          `${r.person} ${r.title} ${r.status}`
            .toLowerCase()
            .includes(search.toLowerCase()),
        ),
    [search],
  )
  const toggleAll = () =>
    setSelected(selected.length === rows.length ? [] : rows.map((_, i) => i))
  return (
    <main className="dashboard-page documents-page">
      <DashboardHead
        page="documents"
        setPage={setPage}
        search={search}
        setSearch={setSearch}
      />
      <div className="table-shell">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>
                  <input
                    aria-label="Selecionar tudo"
                    type="checkbox"
                    checked={rows.length > 0 && selected.length === rows.length}
                    onChange={toggleAll}
                  />
                </th>
                <th>Autor ↓</th>
                <th>Documento</th>
                <th>Área de trabalho</th>
                <th>Atualizado</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.person}>
                  <td>
                    <input
                      aria-label={`Selecionar ${row.person}`}
                      type="checkbox"
                      checked={selected.includes(i)}
                      onChange={() =>
                        setSelected((v) =>
                          v.includes(i) ? v.filter((x) => x !== i) : [...v, i],
                        )
                      }
                    />
                  </td>
                  <td>
                    <div className="person">
                      <span className="avatar">
                        <Icon name="user" size={14} />
                      </span>
                      <div>
                        <strong>{row.person}</strong>
                        <small>Designer sênior</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <strong className="doc-title">{row.title}</strong>
                  </td>
                  <td>Equipe de produto</td>
                  <td>Há {i + 2} dias</td>
                  <td>
                    <span
                      className={`badge ${
                        i % 3 === 0
                          ? "in-review"
                          : i % 3 === 2
                            ? "approved"
                            : "draft"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td>
                    <button>
                      <Icon name="more" size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <button className="prev">
            <Icon name="arrow" size={14} /> Anterior
          </button>
          {[1, 2, 3, 4, 5].map((n) => (
            <button className={n === 1 ? "current" : ""} key={n}>
              {n}
            </button>
          ))}
          <span>…</span>
          <button>11</button>
          <button className="next">
            Próxima <Icon name="chevron" size={14} />
          </button>
        </div>
      </div>
    </main>
  )
}

const activities = [
  ["Jane moveu “Direção da página inicial”", "Em andamento", "Há 12 min"],
  ["Maya enviou um novo documento", "Pesquisa", "Há 45 min"],
  ["Alex concluiu “Revisão da marca”", "Concluído", "Há 2 horas"],
  ["Noah convidou 3 novos colaboradores", "Equipe", "Ontem"],
]

function Overview({ setPage }: { setPage: (p: Page) => void }) {
  const [search, setSearch] = useState("")
  const metrics = [
    ["Projetos ativos", "12", "+8,2%", "folder" as IconName],
    ["Tarefas concluídas", "84", "+12,4%", "calendar" as IconName],
    ["Membros da equipe", "24", "+3 neste mês", "users" as IconName],
    ["Documentos", "148", "+18 novos", "tag" as IconName],
  ]
  return (
    <main className="dashboard-page">
      <DashboardHead
        page="overview"
        setPage={setPage}
        search={search}
        setSearch={setSearch}
      />
      <div className="metric-grid">
        {metrics
          .filter((metric) =>
            metric[0].toLowerCase().includes(search.toLowerCase()),
          )
          .map(([label, value, change, icon]) => (
            <article className="metric-card" key={label}>
              <div className="metric-icon">
                <Icon name={icon as IconName} size={18} />
              </div>
              <span>{label}</span>
              <strong>{value}</strong>
              <small>{change}</small>
            </article>
          ))}
      </div>
      <div className="overview-grid">
        <section className="workspace-panel progress-panel">
          <header>
            <div>
              <span className="eyebrow">DESEMPENHO</span>
              <h2>Progresso dos projetos</h2>
            </div>
            <button className="text-link" onClick={() => setPage("reports")}>
              Relatório completo <Icon name="chevron" size={14} />
            </button>
          </header>
          <div className="chart">
            {[42, 64, 51, 76, 68, 88, 73, 92].map((height, i) => (
              <div key={i}>
                <span style={{ height: `${height}%` }} />
                <small>{["S", "T", "Q", "Q", "S", "S", "D", "N"][i]}</small>
              </div>
            ))}
          </div>
        </section>
        <section className="workspace-panel activity-panel">
          <header>
            <div>
              <span className="eyebrow">AO VIVO</span>
              <h2>Atividade recente</h2>
            </div>
          </header>
          <div className="activity-list">
            {activities.map(([title, label, time]) => (
              <div className="activity-item" key={title}>
                <span className="avatar">
                  <Icon name="user" size={14} />
                </span>
                <div>
                  <strong>{title}</strong>
                  <small>
                    {label} · {time}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <section className="workspace-panel quick-projects">
        <header>
          <div>
            <span className="eyebrow">PROJETOS</span>
            <h2>Foco atual</h2>
          </div>
          <button className="text-link" onClick={() => setPage("board")}>
            Abrir quadro <Icon name="chevron" size={14} />
          </button>
        </header>
        <div className="focus-grid">
          {[
            ["Renovação do site", "Design", 78],
            ["Experiência mobile", "Produto", 56],
            ["Biblioteca de pesquisa", "Pesquisa", 34],
          ].map(([title, category, progress]) => (
            <article key={title}>
              <span className="category">{category}</span>
              <h3>{title}</h3>
              <div className="progress-track">
                <span style={{ width: `${progress}%` }} />
              </div>
              <div>
                <Members />
                <small>{progress}%</small>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

function Team({ setPage }: { setPage: (p: Page) => void }) {
  const [search, setSearch] = useState("")
  const [invited, setInvited] = useState(false)
  const roles = ["Design", "Produto", "Pesquisa", "Engenharia"]
  const members = people.filter((person) =>
    person.toLowerCase().includes(search.toLowerCase()),
  )
  const invite = () => {
    const email = window.prompt("Endereço de e-mail")
    if (email?.includes("@")) setInvited(true)
  }
  return (
    <main className="dashboard-page">
      <DashboardHead
        page="team"
        setPage={setPage}
        search={search}
        setSearch={setSearch}
      />
      <div className="page-intro">
        <div>
          <span className="eyebrow">24 MEMBROS</span>
          <h2>Conheça sua equipe</h2>
          <p>Todos que colaboram na sua área de trabalho.</p>
        </div>
        <button className="primary-btn" onClick={invite}>
          <Icon name="plus" size={16} /> Convidar membro
        </button>
      </div>
      {invited && (
        <div className="notice-bar">
          Convite enviado com sucesso.
          <button onClick={() => setInvited(false)}>
            <Icon name="close" size={14} />
          </button>
        </div>
      )}
      <div className="team-grid">
        {members.map((person, i) => (
          <article className="member-card" key={person}>
            <button className="card-menu">
              <Icon name="more" size={17} />
            </button>
            <span className="member-avatar">
              <Icon name="user" size={24} />
            </span>
            <h3>{person}</h3>
            <p>Designer sênior de {roles[i % roles.length]}</p>
            <span className="team-role">{roles[i % roles.length]}</span>
            <div className="member-stats">
              <span>
                <strong>{8 + i}</strong> Projetos
              </span>
              <span>
                <strong>{18 + i * 2}</strong> Tarefas
              </span>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}

function Reports({ setPage }: { setPage: (p: Page) => void }) {
  const [search, setSearch] = useState("")
  const [period, setPeriod] = useState("30 dias")
  const exportReport = () => {
    const blob = new Blob(
      ["Relatório da área de trabalho ODR\nTarefas concluídas: 84\n"],
      {
        type: "text/plain",
      },
    )
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "relatorio-odr.txt"
    link.click()
    URL.revokeObjectURL(link.href)
  }
  return (
    <main className="dashboard-page">
      <DashboardHead
        page="reports"
        setPage={setPage}
        search={search}
        setSearch={setSearch}
      />
      <div className="page-intro report-intro">
        <div>
          <span className="eyebrow">ANÁLISES</span>
          <h2>Relatórios da área de trabalho</h2>
          <p>Entenda o ritmo, a carga de trabalho e as entregas.</p>
        </div>
        <div className="report-actions">
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option>7 dias</option>
            <option>30 dias</option>
            <option>90 dias</option>
          </select>
          <button className="secondary-btn" onClick={exportReport}>
            Exportar relatório
          </button>
        </div>
      </div>
      <div className="report-metrics">
        {[
          ["Taxa de conclusão", "86%", "+6,4%"],
          ["Tarefas entregues", period === "7 dias" ? "24" : "84", "+12,8%"],
          ["Tempo médio de ciclo", "3,2d", "-0,8d"],
        ].map(([label, value, change]) => (
          <article key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{change} em relação ao período anterior</small>
          </article>
        ))}
      </div>
      <div className="reports-grid">
        <section className="workspace-panel report-chart">
          <header>
            <div>
              <span className="eyebrow">ENTREGAS</span>
              <h2>Tarefas concluídas</h2>
            </div>
            <span className="report-period">Últimos {period}</span>
          </header>
          <div className="line-chart">
            <div className="grid-lines" />
            <svg viewBox="0 0 600 190" preserveAspectRatio="none">
              <path
                d="M0 145 C55 150 62 105 120 114 S193 76 245 91 S335 55 380 67 S463 26 510 48 S567 22 600 27"
                fill="none"
                stroke="#145cff"
                strokeWidth="4"
              />
              <path
                d="M0 145 C55 150 62 105 120 114 S193 76 245 91 S335 55 380 67 S463 26 510 48 S567 22 600 27 V190 H0Z"
                fill="url(#fade)"
              />
              <defs>
                <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
                  <stop stopColor="#145cff" stopOpacity=".18" />
                  <stop offset="1" stopColor="#145cff" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </section>
        <section className="workspace-panel workload">
          <header>
            <div>
              <span className="eyebrow">EQUIPE</span>
              <h2>Carga de trabalho</h2>
            </div>
          </header>
          {people.slice(0, 5).map((person, i) => (
            <div className="workload-row" key={person}>
              <span className="avatar">
                <Icon name="user" size={13} />
              </span>
              <strong>{person}</strong>
              <div className="progress-track">
                <span style={{ width: `${82 - i * 9}%` }} />
              </div>
              <small>{82 - i * 9}%</small>
            </div>
          ))}
        </section>
      </div>
    </main>
  )
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: () => void
}) {
  return (
    <button
      className={`toggle ${checked ? "on" : ""}`}
      onClick={onChange}
      aria-label={checked ? "Desativar" : "Ativar"}
    >
      <span />
    </button>
  )
}

function Admin({ setPage }: { setPage: (p: Page) => void }) {
  const [search, setSearch] = useState("")
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState({
    email: true,
    desktop: false,
    weekly: true,
    public: false,
  })
  const toggle = (key: keyof typeof settings) =>
    setSettings((value) => ({ ...value, [key]: !value[key] }))
  return (
    <main className="dashboard-page">
      <DashboardHead
        page="admin"
        setPage={setPage}
        search={search}
        setSearch={setSearch}
      />
      <div className="settings-layout">
        <aside className="settings-nav">
          <span>Configurações da área</span>
          <button className="active">Geral</button>
          <button>Notificações</button>
          <button>Membros e funções</button>
          <button>Faturamento</button>
          <button>Segurança</button>
        </aside>
        <section className="workspace-panel settings-panel">
          <header>
            <div>
              <span className="eyebrow">ADMINISTRAÇÃO</span>
              <h2>Configurações gerais</h2>
              <p>
                Gerencie os detalhes e preferências da sua área de trabalho.
              </p>
            </div>
          </header>
          <div className="settings-form">
            <div className="workspace-identity">
              <span className="workspace-logo">OD</span>
              <div>
                <strong>Logo da área de trabalho</strong>
                <small>PNG ou JPG, máx. 2 MB</small>
                <button className="inline-link">Alterar logo</button>
              </div>
            </div>
            <label>
              Nome da área de trabalho
              <input defaultValue="Equipe de Produto ODR" />
            </label>
            <label>
              URL da área de trabalho
              <div className="url-input">
                <span>odr.app/</span>
                <input defaultValue="equipe-produto" />
              </div>
            </label>
            <div className="setting-row">
              <div>
                <strong>Notificações por e-mail</strong>
                <small>Receba atualizações sobre tarefas e documentos.</small>
              </div>
              <Toggle
                checked={settings.email}
                onChange={() => toggle("email")}
              />
            </div>
            <div className="setting-row">
              <div>
                <strong>Notificações no computador</strong>
                <small>Receba alertas enquanto usa a área de trabalho.</small>
              </div>
              <Toggle
                checked={settings.desktop}
                onChange={() => toggle("desktop")}
              />
            </div>
            <div className="setting-row">
              <div>
                <strong>Resumo semanal</strong>
                <small>Um resumo objetivo enviado toda segunda-feira.</small>
              </div>
              <Toggle
                checked={settings.weekly}
                onChange={() => toggle("weekly")}
              />
            </div>
            <div className="settings-actions">
              {saved && <span>Alterações salvas.</span>}
              <button className="primary-btn" onClick={() => setSaved(true)}>
                Salvar alterações
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

type AuthMode = "login" | "signup" | "forgot"

function Auth({
  onSuccess,
  onBack,
  initialMode,
}: {
  onSuccess: () => void
  onBack: () => void
  initialMode: AuthMode
}) {
  const [show, setShow] = useState(false)
  const [message, setMessage] = useState("")
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (mode === "forgot") {
      setMessage("As instruções de redefinição foram enviadas para seu e-mail.")
      return
    }
    setMessage(
      mode === "signup"
        ? "Conta criada. Abrindo sua área de trabalho…"
        : "Boas-vindas de volta. Abrindo sua área de trabalho…",
    )
    window.setTimeout(onSuccess, 600)
  }
  return (
    <main className="login-page">
      <div className="login-brand">
        <Logo />
        <button className="text-link" onClick={onBack}>
          <Icon name="arrow" size={15} /> Voltar ao site
        </button>
      </div>
      <div className="login-glow" />
      <section className="login-card">
        <div className="login-icon">
          <Icon name="grid" size={22} />
        </div>
        <span className="eyebrow">
          {mode === "login"
            ? "BOAS-VINDAS DE VOLTA"
            : mode === "signup"
              ? "COMECE AGORA"
              : "RECUPERAÇÃO DE CONTA"}
        </span>
        <h1>
          {mode === "login"
            ? "Entre na sua conta"
            : mode === "signup"
              ? "Crie sua conta"
              : "Redefina sua senha"}
        </h1>
        <p>
          {mode === "login"
            ? "Insira seus dados para continuar."
            : mode === "signup"
              ? "Comece a organizar o melhor trabalho da sua equipe."
              : "Enviaremos um link seguro de redefinição para seu e-mail."}
        </p>
        <form onSubmit={submit}>
          {mode === "signup" && (
            <label>
              Nome completo
              <input type="text" placeholder="Jane Doe" required />
            </label>
          )}
          <label>
            Endereço de e-mail
            <input type="email" placeholder="voce@empresa.com" required />
          </label>
          {mode !== "forgot" && (
            <label>
              Senha
              <div className="password">
                <input
                  type={show ? "text" : "password"}
                  placeholder={
                    mode === "signup"
                      ? "Pelo menos 6 caracteres"
                      : "Digite sua senha"
                  }
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  aria-label="Mostrar ou ocultar senha"
                >
                  <Icon name="eye" size={16} />
                </button>
              </div>
            </label>
          )}
          {mode === "login" && (
            <div className="form-row">
              <label className="remember">
                <input type="checkbox" /> Lembrar de mim
              </label>
              <button
                type="button"
                className="inline-link"
                onClick={() => {
                  setMode("forgot")
                  setMessage("")
                }}
              >
                Esqueceu a senha?
              </button>
            </div>
          )}
          {mode === "signup" && (
            <label className="remember terms">
              <input type="checkbox" required /> Concordo com os termos e a
              política de privacidade.
            </label>
          )}
          <button className="primary-btn login-submit">
            {mode === "login"
              ? "Entrar"
              : mode === "signup"
                ? "Criar conta"
                : "Enviar link de redefinição"}
          </button>
          {message && <p className="success">{message}</p>}
        </form>
        {mode !== "forgot" && (
          <>
            <div className="divider">
              <span>ou continue com</span>
            </div>
            <div className="socials">
              <button onClick={onSuccess}>
                <strong>G</strong> Google
              </button>
              <button onClick={onSuccess}>
                <strong>◆</strong> Apple
              </button>
              <button onClick={onSuccess}>
                <strong>𝕏</strong> X
              </button>
            </div>
          </>
        )}
        <p className="signup">
          {mode === "login" ? (
            <>
              Ainda não tem uma conta?{" "}
              <button
                onClick={() => {
                  setMode("signup")
                  setMessage("")
                }}
              >
                Cadastre-se grátis
              </button>
            </>
          ) : (
            <>
              {mode === "signup"
                ? "Já tem uma conta?"
                : "Lembrou da sua senha?"}{" "}
              <button
                onClick={() => {
                  setMode("login")
                  setMessage("")
                }}
              >
                Voltar para entrar
              </button>
            </>
          )}
        </p>
      </section>
    </main>
  )
}

export default function App() {
  const [page, setPage] = useState<Page>("home")
  const [menuOpen, setMenuOpen] = useState(false)
  if (page === "login" || page === "signup")
    return (
      <Auth
        onSuccess={() => setPage("overview")}
        onBack={() => setPage("home")}
        initialMode={page === "signup" ? "signup" : "login"}
      />
    )
  return (
    <div className="app-shell">
      <Sidebar
        page={page}
        setPage={setPage}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
      <MobileTop onMenu={() => setMenuOpen(true)} />
      <div className="content-shell">
        {page === "home" && (
          <Home
            goBoard={() => setPage("board")}
            goLogin={() => setPage("signup")}
          />
        )}
        {page === "overview" && <Overview setPage={setPage} />}
        {page === "board" && <Board setPage={setPage} />}
        {page === "documents" && <Documents setPage={setPage} />}
        {page === "team" && <Team setPage={setPage} />}
        {page === "reports" && <Reports setPage={setPage} />}
        {page === "admin" && <Admin setPage={setPage} />}
      </div>
    </div>
  )
}
