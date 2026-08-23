import type { PseudocodeLine } from "../types/algorithm";

export function PseudocodePanel({ lines, activeId }: { lines: PseudocodeLine[]; activeId?: string }) {
  return (
    <div className="border-t border-[var(--ink-700)] bg-[var(--ink-900)] px-4 py-3.5">
      <div className="mb-2 flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--paper-faint)]">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--signal-compare)" }} aria-hidden />
        Pseudocode
      </div>
      <div className="font-mono text-xs leading-6">
        {lines.map((line) => (
          <div
            key={line.id}
            className={`rounded px-1.5 transition-colors ${
              line.id === activeId
                ? "bg-[var(--signal-active)]/12 text-[var(--paper)] ring-1 ring-inset ring-[var(--signal-active)]/25"
                : "text-[var(--paper-dim)]"
            }`}
            style={{ paddingLeft: `${line.indent * 16 + 6}px` }}
          >
            {line.text}
          </div>
        ))}
      </div>
    </div>
  );
}