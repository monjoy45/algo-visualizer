import type { EventGenerator } from "../../types/events";
import type { AlgorithmDefinition } from "../../types/algorithm";

export interface GraphInput {
  nodes: { id: string; label: string }[];
  edges: { source: string; target: string }[];
  startId: string;
}

export function* bfsGen(input: GraphInput): EventGenerator {
  let step = 0;
  yield { category: "graph", type: "INIT", nodes: input.nodes, edges: input.edges, step: step++, stepId: "init" };

  const adjacency = new Map<string, string[]>();
  for (const n of input.nodes) adjacency.set(n.id, []);
  for (const e of input.edges) {
    adjacency.get(e.source)?.push(e.target);
    adjacency.get(e.target)?.push(e.source);
  }

  const visited = new Set<string>([input.startId]);
  const queue: string[] = [input.startId];
  yield { category: "graph", type: "ENQUEUE", id: input.startId, queue: [...queue], step: step++, stepId: "enqueueStart" };

  while (queue.length > 0) {
    const curr = queue.shift()!;
    yield { category: "graph", type: "DEQUEUE", id: curr, queue: [...queue], step: step++, stepId: "dequeue" };
    yield { category: "graph", type: "VISIT", id: curr, step: step++, stepId: "visit" };
    yield { category: "graph", type: "MARK_VISITED", id: curr, step: step++, stepId: "markVisited" };

    for (const neighbor of adjacency.get(curr) ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
        yield {
          category: "graph",
          type: "ENQUEUE",
          id: neighbor,
          queue: [...queue],
          step: step++,
          stepId: "enqueueNeighbor",
        };
      }
    }
  }
}

export const bfs: AlgorithmDefinition<GraphInput> = {
  id: "bfs",
  name: "Breadth-First Search",
  category: "graph",
  tier: "A",
  description: "Explores a graph level by level from a start node, using a queue as the auxiliary structure.",
  timeComplexity: "O(V + E)",
  spaceComplexity: "O(V)",
  run: bfsGen,
  pseudocode: [
    { id: "enqueueStart", text: "queue = [start]; visited = {start}", indent: 0 },
    { id: "dequeue", text: "curr = queue.dequeue()", indent: 1 },
    { id: "visit", text: "visit(curr)", indent: 1 },
    { id: "markVisited", text: "mark curr visited", indent: 1 },
    { id: "enqueueNeighbor", text: "for unvisited neighbor: mark visited, enqueue", indent: 1 },
  ],
};
