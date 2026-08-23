import { useMemo } from "react";
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide, type SimulationNodeDatum } from "d3-force";
import type { GraphState } from "../engine/reducer";

interface SimNode extends SimulationNodeDatum {
  id: string;
  label: string;
}

const WIDTH = 480;
const HEIGHT = 280;

export function GraphRenderer({ state, structureLabel = "queue" }: { state: GraphState; structureLabel?: string }) {
  // Layout is computed once per distinct node/edge set (not per playback step) —
  // ticking a fresh simulation on every render would jitter the whole graph
  // every time the user scrubs. d3-force is used purely for the position math;
  // React owns all DOM rendering (Section 7's split).
  const layout = useMemo(() => {
    if (state.nodes.length === 0) return null;

    const simNodes: SimNode[] = state.nodes.map((n) => ({ id: n.id, label: n.label }));
    const simLinks = state.edges.map((e) => ({ source: e.source, target: e.target }));

    const sim = forceSimulation(simNodes)
      .force(
        "link",
        forceLink(simLinks)
          .id((d) => (d as SimNode).id)
          .distance(90)
      )
      .force("charge", forceManyBody().strength(-260))
      .force("center", forceCenter(WIDTH / 2, HEIGHT / 2))
      .force("collide", forceCollide(28))
      .stop();

    for (let i = 0; i < 300; i++) sim.tick();

    const positions = new Map<string, { x: number; y: number }>();
    simNodes.forEach((n) => positions.set(n.id, { x: n.x ?? 0, y: n.y ?? 0 }));
    return positions;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.nodes, state.edges]);

  if (!layout) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-[var(--paper-faint)]">Graph is empty</div>
    );
  }

  return (
    <div className="h-64 w-full overflow-auto px-2" role="img" aria-label="Graph">
      <svg width={WIDTH} height={HEIGHT}>
        {state.edges.map((e) => {
          const s = layout.get(e.source);
          const t = layout.get(e.target);
          if (!s || !t) return null;
          const isRelaxed =
            state.relaxedEdge &&
            ((state.relaxedEdge.source === e.source && state.relaxedEdge.target === e.target) ||
              (state.relaxedEdge.source === e.target && state.relaxedEdge.target === e.source));
          return (
            <line
              key={`${e.source}-${e.target}`}
              x1={s.x}
              y1={s.y}
              x2={t.x}
              y2={t.y}
              stroke={isRelaxed ? "var(--signal-compare)" : "var(--ink-600)"}
              strokeWidth={isRelaxed ? 2.5 : 1.5}
            />
          );
        })}
        {state.nodes.map((n) => {
          const pos = layout.get(n.id);
          if (!pos) return null;
          const isCurrent = state.current === n.id;
          const isVisited = state.visited.has(n.id);
          const isQueued = state.queue.includes(n.id);

          let stroke = "var(--ink-600)";
          let fill = "var(--ink-800)";
          if (isCurrent) {
            stroke = "var(--signal-active)";
            fill = "color-mix(in srgb, var(--signal-active) 30%, var(--ink-800))";
          } else if (isVisited) {
            stroke = "var(--signal-done)";
            fill = "color-mix(in srgb, var(--signal-done) 20%, var(--ink-800))";
          } else if (isQueued) {
            stroke = "var(--signal-compare)";
            fill = "var(--ink-800)";
          }

          return (
            <g key={n.id} className="transition-all duration-150">
              <circle cx={pos.x} cy={pos.y} r={18} fill={fill} stroke={stroke} strokeWidth={2} />
              <text
                x={pos.x}
                y={pos.y + 4}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize={12}
                fill="var(--paper)"
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>
      {state.queue.length > 0 && (
        <div className="mt-2 flex items-center gap-2 font-mono text-xs text-[var(--paper-dim)]">
          <span className="text-[var(--paper-faint)]">{structureLabel}:</span>
          {state.queue.map((id) => (
            <span key={id} className="rounded border border-[var(--signal-compare)]/50 px-1.5 py-0.5">
              {id}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
