import type { LinkedListState } from "../engine/reducer";

const NODE_W = 64;
const NODE_H = 44;
const GAP = 40;
const Y = 60;

export function LinkedListRenderer({ state }: { state: LinkedListState }) {
  const order = state.order;
  const positions = new Map<string, number>();
  order.forEach((id, i) => positions.set(id, 24 + i * (NODE_W + GAP)));

  const width = Math.max(400, 48 + order.length * (NODE_W + GAP));

  return (
    <div className="h-64 w-full overflow-x-auto px-2" role="img" aria-label="Linked list">
      <svg width={width} height={160} className="min-w-full">
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="var(--paper-faint)" />
          </marker>
        </defs>

        {order.map((id, i) => {
          const next = order[i + 1];
          if (!next) return null;
          const x1 = (positions.get(id) ?? 0) + NODE_W;
          const x2 = positions.get(next) ?? 0;
          return (
            <line
              key={`${id}-${next}`}
              x1={x1}
              y1={Y}
              x2={x2 - 4}
              y2={Y}
              stroke="var(--paper-faint)"
              strokeWidth={1.5}
              markerEnd="url(#arrow)"
            />
          );
        })}

        {order.map((id) => {
          const node = state.nodes[id];
          if (!node) return null;
          const x = positions.get(id) ?? 0;
          const isVisiting = state.visiting === id;
          const pointerLabels = Object.entries(state.pointers)
            .filter(([, v]) => v === id)
            .map(([k]) => k);

          return (
            <g key={id}>
              <rect
                x={x}
                y={Y - NODE_H / 2}
                width={NODE_W}
                height={NODE_H}
                rx={6}
                fill={isVisiting ? "color-mix(in srgb, var(--signal-active) 25%, var(--ink-800))" : "var(--ink-800)"}
                stroke={isVisiting ? "var(--signal-active)" : "var(--ink-600)"}
                strokeWidth={isVisiting ? 2 : 1}
                className="transition-all duration-150"
              />
              <text
                x={x + NODE_W / 2}
                y={Y + 5}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize={14}
                fill="var(--paper)"
              >
                {node.value}
              </text>
              {pointerLabels.length > 0 && (
                <text
                  x={x + NODE_W / 2}
                  y={Y - NODE_H / 2 - 8}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={11}
                  fill="var(--signal-compare)"
                >
                  {pointerLabels.join(", ")}
                </text>
              )}
            </g>
          );
        })}

        {order.length === 0 && (
          <text x={20} y={Y} fontFamily="var(--font-mono)" fontSize={13} fill="var(--paper-faint)">
            null
          </text>
        )}
      </svg>
    </div>
  );
}
