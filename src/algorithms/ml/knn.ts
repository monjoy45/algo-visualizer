import type { EventGenerator, MLSnapshot } from "../../types/events";
import type { AlgorithmDefinition } from "../../types/algorithm";

export interface KNNInput {
  trainingPoints: { x: number; y: number; label: number }[];
  query: { x: number; y: number };
  k: number;
}

interface Candidate {
  point: { x: number; y: number; label: number };
  dist: number;
}

function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/**
 * Same snapshot-per-iteration temporal model as K-Means (Section 8's ML
 * exception) — here "iteration" is "one more training point considered,"
 * with the running k-nearest set re-sorted after each one.
 */
export function* knnGen(input: KNNInput): EventGenerator {
  let step = 0;
  const { trainingPoints, query, k } = input;

  const best: Candidate[] = [];

  for (let i = 0; i < trainingPoints.length; i++) {
    const p = trainingPoints[i];
    best.push({ point: p, dist: distance(p, query) });
    best.sort((a, b) => a.dist - b.dist);
    if (best.length > k) best.pop();

    const snapshot: MLSnapshot = {
      iteration: i + 1,
      points: trainingPoints.map((tp) => ({ x: tp.x, y: tp.y, cluster: tp.label })),
      // centroids[0] is the query point itself; the rest are the current
      // k-nearest set — reusing the ringed "centroid" marker purely as a
      // highlight, not because these are cluster centers.
      centroids: [{ x: query.x, y: query.y }, ...best.map((b) => ({ x: b.point.x, y: b.point.y }))],
      converged: i === trainingPoints.length - 1,
    };
    yield { category: "ml", type: "ITERATION_SNAPSHOT", step: step++, snapshot };
  }
}

export const knn: AlgorithmDefinition<KNNInput> = {
  id: "knn",
  name: "K-Nearest Neighbors",
  category: "ml",
  tier: "A",
  description:
    "Classifies a query point by measuring its distance to every labeled training point, keeping a running set of the k closest ones seen so far, and taking a majority vote among their labels.",
  timeComplexity: "O(n log k) with a running sorted top-k (O(n × k) naive)",
  spaceComplexity: "O(k)",
  run: knnGen,
  pseudocode: [
    { id: "scanPoint", text: "for each training point: compute distance to query", indent: 0 },
    { id: "updateNeighbors", text: "insert into the running k-nearest set, keep it sorted, cap at k", indent: 1 },
    { id: "final", text: "predicted label = majority vote among the final k neighbors", indent: 0 },
  ],
};