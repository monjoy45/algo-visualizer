import { ALGORITHMS } from "../data/algorithmsList";

interface Props {
  activeId: string | null;
  onSelect: (id: string) => void;
}

const CATEGORY_LABEL: Record<string, string> = {
  array: "Sorting & Searching",
  linkedList: "Linked List",
  tree: "Trees",
  graph: "Graphs",
  grid: "Dynamic Programming",
  ml: "Machine Learning",
  callStack: "Call Stack",
};

const CATEGORY_ORDER = ["array", "linkedList", "tree", "graph", "grid", "ml", "callStack"];

export function Sidebar({ activeId, onSelect }: Props) {
  const grouped = CATEGORY_ORDER.map((cat) => ({
    cat,
    items: ALGORITHMS.filter((a) => a.meta.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <nav className="flex h-full w-64 shrink-0 flex-col border-r border-[var(--ink-700)] bg-[var(--ink-900)]">
      <button onClick={() => onSelect("")} className="border-b border-[var(--ink-700)] px-4 py-4 text-left">
        <div className="mb-1.5 h-1 w-6 rounded-full bg-gradient-to-r from-[var(--accent-bright)] to-[var(--accent-deep)]" />
        <div className="font-[var(--font-display)] text-lg leading-tight">Algorithm</div>
        <div className="font-[var(--font-display)] text-lg leading-tight text-[var(--paper-dim)]">Visualizer</div>
      </button>
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-2">
        {grouped.map(({ cat, items }) => (
          <div key={cat} className="mb-1">
            <div className="px-4 pb-1 pt-3 font-mono text-[10px] uppercase tracking-widest text-[var(--paper-faint)]">
              {CATEGORY_LABEL[cat] ?? cat}
            </div>
            {items.map(({ meta, primitive }) => {
              const isActive = activeId === meta.id;
              return (
                <button
                  key={meta.id}
                  onClick={() => onSelect(meta.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative flex w-full flex-col items-start gap-0.5 py-2.5 pl-4 pr-3 text-left transition-colors ${
                    isActive
                      ? "bg-[var(--accent-soft)] text-[var(--paper)]"
                      : "text-[var(--paper-dim)] hover:bg-[var(--ink-800)] hover:text-[var(--paper)]"
                  }`}
                >
                  {isActive && (
                    <span
                      className="absolute left-0 top-0 h-full w-0.5 bg-gradient-to-b from-[var(--accent-bright)] to-[var(--accent-deep)] shadow-[0_0_8px_var(--accent)]"
                      aria-hidden
                    />
                  )}
                  <span className="text-sm">{meta.name}</span>
                  <span className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--paper-faint)]">
                    {primitive}
                    <span className="rounded-sm border border-[var(--ink-600)] px-1 leading-tight">{meta.tier}</span>
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <div className="border-t border-[var(--ink-700)] px-4 py-3 font-mono text-[10px] text-[var(--paper-faint)]">
        <kbd className="rounded border border-[var(--ink-600)] px-1 py-0.5">space</kbd> play / pause
      </div>
    </nav>
  );
}