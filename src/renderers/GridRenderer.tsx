import type { GridState } from "../engine/reducer";

export function GridRenderer({ state }: { state: GridState }) {
  if (state.rows === 0) {
    return <div className="flex h-64 items-center justify-center text-sm text-[var(--paper-faint)]">Grid not initialized</div>;
  }

  const isDependency = (r: number, c: number) => state.dependsOn.some(([dr, dc]) => dr === r && dc === c);
  const isActive = (r: number, c: number) => state.activeCell?.[0] === r && state.activeCell?.[1] === c;
  const isFinal = (r: number, c: number) => state.finalCell?.[0] === r && state.finalCell?.[1] === c;

  return (
    <div className="h-64 w-full overflow-auto px-2" role="img" aria-label="Dynamic programming table">
      <table className="border-collapse font-mono text-xs">
        <tbody>
          {state.values.map((row, r) => (
            <tr key={r}>
              {row.map((val, c) => {
                let border = "border-[var(--ink-700)]";
                let bg = "bg-[var(--ink-800)]";
                if (isFinal(r, c)) {
                  border = "border-[var(--signal-done)]";
                  bg = "bg-[var(--signal-done)]/20";
                } else if (isActive(r, c)) {
                  border = "border-[var(--signal-active)]";
                  bg = "bg-[var(--signal-active)]/20";
                } else if (isDependency(r, c)) {
                  border = "border-[var(--signal-compare)]";
                  bg = "bg-[var(--signal-compare)]/15";
                }
                return (
                  <td key={c} className={`h-8 w-9 border text-center transition-all duration-150 ${border} ${bg}`}>
                    {val ?? ""}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
