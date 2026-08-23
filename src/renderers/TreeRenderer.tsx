import { useMemo } from "react";
import { hierarchy, tree, type HierarchyPointNode } from "d3-hierarchy";
import type { TreeState, TreeNodeState } from "../engine/reducer";

interface HNode {
  id: string;
  value: number;
  children: HNode[];
}

function buildHierarchy(nodes: Record<string, TreeNodeState>): HNode | null {
  const byId = new Map<string, HNode>();
  Object.values(nodes).forEach((n) => byId.set(n.id, { id: n.id, value: n.value, children: [] }));
  let root: HNode | null = null;
  Object.values(nodes).forEach((n) => {
    const hnode = byId.get(n.id)!;
    if (n.parentId === null) {
      root = hnode;
    } else {
      byId.get(n.parentId)?.children.push(hnode);
    }
  });
  return root;
}

const NODE_R = 20;

export function TreeRenderer({ state }: { state: TreeState }) {
  const layout = useMemo(() => {
    const root = buildHierarchy(state.nodes);
    if (!root) return null;
    const h = hierarchy<HNode>(root, (d) => d.children);
    const layoutFn = tree<HNode>().nodeSize([56, 70]);
    return layoutFn(h);
  }, [state.nodes]);

  if (!layout) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-[var(--paper-faint)]">
        Tree is empty
      </div>
    );
  }

  const descendants = layout.descendants();
  const xs = descendants.map((d) => d.x);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const width = Math.max(320, maxX - minX + 80);
  const offsetX = -minX + 40;

  return (
    <div className="h-64 w-full overflow-auto px-2" role="img" aria-label="Binary search tree">
      <svg width={width} height={280}>
        <g>
          {descendants.map((d) =>
            d.children?.map((child) => (
              <line
                key={`${d.data.id}-${child.data.id}`}
                x1={d.x + offsetX}
                y1={d.y + 30}
                x2={child.x + offsetX}
                y2={child.y + 30}
                stroke="var(--paper-faint)"
                strokeWidth={1.5}
              />
            ))
          )}
          {descendants.map((d: HierarchyPointNode<HNode>) => {
            const isVisiting = state.visiting === d.data.id;
            const isComparing = state.comparing === d.data.id;
            const isFound = state.found === d.data.id;

            let stroke = "var(--ink-600)";
            let fill = "var(--ink-800)";
            if (isFound) {
              stroke = "var(--signal-done)";
              fill = "color-mix(in srgb, var(--signal-done) 25%, var(--ink-800))";
            } else if (isComparing) {
              stroke = "var(--signal-compare)";
              fill = "color-mix(in srgb, var(--signal-compare) 25%, var(--ink-800))";
            } else if (isVisiting) {
              stroke = "var(--signal-active)";
              fill = "color-mix(in srgb, var(--signal-active) 25%, var(--ink-800))";
            }

            return (
              <g key={d.data.id} className="transition-all duration-150">
                <circle cx={d.x + offsetX} cy={d.y + 30} r={NODE_R} fill={fill} stroke={stroke} strokeWidth={2} />
                <text
                  x={d.x + offsetX}
                  y={d.y + 35}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={13}
                  fill="var(--paper)"
                >
                  {d.data.value}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
