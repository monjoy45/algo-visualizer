import type { ArrayState } from "../engine/reducer";

export function ArrayRenderer({ state }: { state: ArrayState }) {
  const max = Math.max(...state.values, 1);

  return (
    <div className="flex h-64 items-end gap-1.5 px-2" role="img" aria-label={`Array: ${state.values.join(", ")}`}>
      {state.values.map((value, i) => {
        const isCompared = state.compared?.includes(i);
        const isSwapped = state.swapped?.includes(i);
        const isSorted = state.sorted.has(i);
        const inRange = state.range && i >= state.range.low && i <= state.range.high;
        const isMid = state.range?.mid === i;

        let border = "border-[var(--ink-600)]";
        let bg = "bg-[var(--ink-700)]";
        if (isSorted) {
          border = "border-[var(--signal-done)]";
          bg = "bg-[var(--signal-done)]/20";
        } else if (isSwapped) {
          border = "border-[var(--signal-active)]";
          bg = "bg-[var(--signal-active)]/25";
        } else if (isCompared || isMid) {
          border = "border-[var(--signal-compare)]";
          bg = "bg-[var(--signal-compare)]/20";
        } else if (inRange) {
          border = "border-[var(--paper-faint)]";
          bg = "bg-[var(--ink-600)]";
        }

        return (
          <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1">
            <span className="font-mono text-[10px] text-[var(--paper-faint)]">{value}</span>
            <div
              className={`w-full rounded-t border-t-2 ${border} ${bg} transition-all duration-150`}
              style={{ height: `${(value / max) * 100}%`, minHeight: 4 }}
            />
            <span className="font-mono text-[10px] text-[var(--paper-faint)]">{i}</span>
          </div>
        );
      })}
    </div>
  );
}
