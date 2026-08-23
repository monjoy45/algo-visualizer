import type { EventGenerator } from "../../types/events";
import type { AlgorithmDefinition } from "../../types/algorithm";

export interface WeightedGraphInput {
  nodes: { id: string; label: string }[];
  edges: { source: string; target: string; weight: number }[];
  startId: string;
}

export function* dijkstraGen(input: WeightedGraphInput): EventGenerator {
  let step = 0;
  yield { category: "graph", type: "INIT", nodes: input.nodes, edges: input.edges, step: step++, stepId: "init" };

  const adjacency = new Map<string, { to: string; weight: number }[]>();
  for (const n of input.nodes) adjacency.set(n.id, []);
  for (const e of input.edges) {
    adjacency.get(e.source)?.push({ to: e.target, weight: e.weight });
    adjacency.get(e.target)?.push({ to: e.source, weight: e.weight });
  }

  const dist = new Map<string, number>();
  for (const n of input.nodes) dist.set(n.id, Infinity);
  dist.set(input.startId, 0);

  const settled = new Set<string>();
  // `frontier` doubles as the visualized "priority queue" — re-sorted by
  // tentative distance before every pop, reusing BFS's exact event shapes.
  let frontier: string[] = [input.startId];
  yield {
    category: "graph",
    type: "ENQUEUE",
    id: input.startId,
    queue: [...frontier],
    step: step++,
    stepId: "initDist",
  };

  while (frontier.length > 0) {
    frontier.sort((a, b) => dist.get(a)! - dist.get(b)!);
    const curr = frontier.shift()!;
    if (settled.has(curr)) continue;

    yield { category: "graph", type: "DEQUEUE", id: curr, queue: [...frontier], step: step++, stepId: "dequeueMin" };
    yield { category: "graph", type: "VISIT", id: curr, step: step++, stepId: "visit" };
    settled.add(curr);
    yield { category: "graph", type: "MARK_VISITED", id: curr, step: step++, stepId: "markVisited" };

    for (const { to, weight } of adjacency.get(curr) ?? []) {
      if (settled.has(to)) continue;
      const candidate = dist.get(curr)! + weight;
      yield { category: "graph", type: "RELAX_EDGE", source: curr, target: to, step: step++, stepId: "relax" };
      if (candidate < (dist.get(to) ?? Infinity)) {
        dist.set(to, candidate);
        if (!frontier.includes(to)) frontier.push(to);
        yield { category: "graph", type: "ENQUEUE", id: to, queue: [...frontier], step: step++, stepId: "updateDist" };
      }
    }
  }
}

export const dijkstra: AlgorithmDefinition<WeightedGraphInput> = {
  id: "dijkstra",
  name: "Dijkstra's Algorithm",
  category: "graph",
  tier: "B",
  description:
    "Repeatedly settles the unvisited node with the smallest known tentative distance, then relaxes its outgoing edges to see if they offer a shorter path to its neighbors.",
  timeComplexity: "O((V + E) log V) with a binary-heap priority queue",
  spaceComplexity: "O(V)",
  run: dijkstraGen,
  pseudocode: [
    { id: "initDist", text: "dist[start] = 0, dist[all else] = infinity", indent: 0 },
    { id: "dequeueMin", text: "pick the unsettled node with smallest dist", indent: 0 },
    { id: "visit", text: "settle curr — its distance is now final", indent: 1 },
    { id: "markVisited", text: "mark curr as settled", indent: 1 },
    { id: "relax", text: "for each neighbor: candidate = dist[curr] + weight(curr, neighbor)", indent: 1 },
    { id: "updateDist", text: "if candidate < dist[neighbor]: update dist[neighbor]", indent: 2 },
  ],
};