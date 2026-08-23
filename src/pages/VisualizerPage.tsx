import { getAlgorithm } from "../data/algorithmsList";

const CATEGORY_LABEL: Record<string, string> = {
  array: "Array",
  linkedList: "Linked List",
  tree: "Tree",
  graph: "Graph",
  grid: "DP Table",
  ml: "Machine Learning",
  callStack: "Call Stack",
};

export function VisualizerPage({ id, onBack }: { id: string; onBack?: () => void }) {
  const entry = getAlgorithm(id);

  if (!entry) {
    return <div className="p-8 text-sm text-[var(--paper-faint)]">Unknown algorithm.</div>;
  }

  const { meta, Visualizer } = entry;

  return (
    <div className="mx-auto min-w-0 max-w-3xl px-6 py-8 sm:px-8 sm:py-10">
      {onBack && (
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-1.5 font-mono text-xs text-[var(--paper-faint)] hover:text-[var(--paper)]"
        >
          <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
            <path d="M10 2 4 8l6 6 1.4-1.4L6.8 8l4.6-4.6L10 2z" />
          </svg>
          all algorithms
        </button>
      )}

      <div className="mb-2 flex items-center gap-2">
        <span className="rounded-full border border-[var(--accent)]/40 bg-[var(--accent-soft)] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[var(--accent-bright)]">
          {CATEGORY_LABEL[meta.category] ?? meta.category}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--paper-faint)]">
          tier {meta.tier}
        </span>
      </div>
      <h1 className="mb-3 font-[var(--font-display)] text-3xl">{meta.name}</h1>
      <p className="mb-4 text-[15px] leading-7 text-[var(--paper-dim)]">{meta.description}</p>
      <div className="mb-8 flex flex-wrap gap-2 font-mono text-xs">
        <span className="rounded border border-[var(--ink-700)] px-2 py-1 text-[var(--paper-faint)]">
          time {meta.timeComplexity}
        </span>
        <span className="rounded border border-[var(--ink-700)] px-2 py-1 text-[var(--paper-faint)]">
          space {meta.spaceComplexity}
        </span>
      </div>

      <div className="min-w-0 overflow-hidden rounded-lg border border-[var(--ink-700)] bg-[var(--ink-800)] shadow-[0_1px_0_rgba(255,255,255,0.03)_inset,0_20px_40px_-24px_rgba(0,0,0,0.6)]">
        <Visualizer />
      </div>
    </div>
  );
}