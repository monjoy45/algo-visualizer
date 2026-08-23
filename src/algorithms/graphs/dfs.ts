import type { EventGenerator } from "../../types/events";
import type { AlgorithmDefinition } from "../../types/algorithm";
import type { GraphInput } from "./bfs";

export function* dfsGen(input: GraphInput): EventGenerator {
  let step = 0;
  yield { category: "graph", type: "INIT", nodes: input.nodes, edges: input.edges, step: step++, stepId: "init" };

  const adjacency = new Map<string, string[]>();
  for (const n of input.nodes) adjacency.set(n.id, []);
  for (const e of input.edges) {
    adjacency.get(e.source)?.push(e.target);
    adjacency.get(e.target)?.push(e.source);
  }

  const visited = new Set<string>();
  const stack: string[] = [input.startId];
  yield { category: "graph", type: "ENQUEUE", id: input.startId, queue: [...stack], step: step++, stepId: "pushStart" };

  while (stack.length > 0) {
    const curr = stack.pop()!;
    yield { category: "graph", type: "DEQUEUE", id: curr, queue: [...stack], step: step++, stepId: "pop" };

    if (visited.has(curr)) continue;
    visited.add(curr);
    yield { category: "graph", type: "VISIT", id: curr, step: step++, stepId: "visit" };
    yield { category: "graph", type: "MARK_VISITED", id: curr, step: step++, stepId: "markVisited" };

    const neighbors = adjacency.get(curr) ?? [];
    for (let i = neighbors.length - 1; i >= 0; i--) {
      const neighbor = neighbors[i];
      if (!visited.has(neighbor)) {
        stack.push(neighbor);
        yield {
          category: "graph",
          type: "ENQUEUE",
          id: neighbor,
          queue: [...stack],
          step: step++,
          stepId: "push",
        };
      }
    }
  }
}

export const dfs: AlgorithmDefinition<GraphInput> = {
  id: "dfs",
  name: "Depth-First Search",
  category: "graph",
  tier: "B",
  description: "Explores a graph by diving as deep as possible along one path before backtracking, using a stack.",
  timeComplexity: "O(V + E)",
  spaceComplexity: "O(V)",
  run: dfsGen,
  pseudocode: [
    { id: "pushStart", text: "stack = [start]", indent: 0 },
    { id: "pop", text: "curr = stack.pop()", indent: 1 },
    { id: "visit", text: "if curr unvisited: visit(curr)", indent: 1 },
    { id: "markVisited", text: "mark curr visited", indent: 1 },
    { id: "push", text: "push unvisited neighbors onto stack", indent: 1 },
  ],
};
