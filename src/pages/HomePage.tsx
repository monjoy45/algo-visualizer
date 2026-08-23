import { ALGORITHMS } from "../data/algorithmsList";

export function HomePage({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-14 sm:px-8">
      <div className="mb-2 font-mono text-xs text-[var(--paper-faint)]">
        Interactive Textbook & Visualizer
      </div>
      <h1 className="mb-5 font-[var(--font-display)] text-3xl font-medium leading-tight text-[var(--paper)]">
        Algorithms
      </h1>
      <p className="mb-4 max-w-2xl text-[15px] leading-7 text-[var(--paper-dim)]">
        Every algorithm here runs the same way underneath: a generator yields events one at a time,
        an event log stores them, and a renderer draws whatever step you're looking at. Scrub backward,
        step forward one operation, or press play — you're always looking at real execution state, not
        a canned animation.
      </p>
      <p className="mb-10 max-w-2xl text-[15px] leading-7 text-[var(--paper-dim)]">
        {ALGORITHMS.length} algorithms are live across six rendering primitives — arrays, a linked list,
        a tree, a graph, a DP table, and a coordinate plane.
      </p>

      <div className="border-t border-[var(--ink-700)] pt-6">
        <div className="mb-3 font-mono text-[11px] font-medium uppercase tracking-wider text-[var(--paper-faint)]">
          Index
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {ALGORITHMS.map(({ meta, primitive }) => (
            <button
              key={meta.id}
              onClick={() => onSelect(meta.id)}
              className="group flex flex-col gap-1 rounded-md border border-[var(--ink-700)] bg-[var(--ink-800)] px-4 py-3 text-left transition-colors hover:border-[var(--accent)] hover:bg-[var(--ink-700)]"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--paper)]">{meta.name}</span>
                <span className="rounded bg-[var(--ink-900)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--paper-dim)] group-hover:text-[var(--paper)]">
                  Tier {meta.tier}
                </span>
              </div>
              <span className="font-mono text-[11px] text-[var(--paper-faint)]">{primitive}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}