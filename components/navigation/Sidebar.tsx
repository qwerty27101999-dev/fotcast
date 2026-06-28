interface SidebarProps {
  page: string;
  setPage: (page: any) => void;
}

const items = [
  ["dashboard", "📊 Dashboard"],
  ["payroll", "💰 Payroll"],
  ["headcount", "👥 Headcount"],
  ["scenario", "🎯 Scenarios"],
  ["company", "⚙ Company"],
  ["export", "📤 Export"],
];

export function Sidebar({
  page,
  setPage,
}: SidebarProps) {
  return (
    <aside className="sidebar">

      <div className="sidebar-logo">

        <h2>🔮 fot'cast</h2>

        <span>FP&A Platform</span>

      </div>

      <nav>

        {items.map(([id, label]) => (

          <button
            key={id}
            className={
              page === id
                ? "sidebar-item active"
                : "sidebar-item"
            }
            onClick={() => setPage(id)}
          >
            {label}
          </button>

        ))}

      </nav>

    </aside>
  );
}