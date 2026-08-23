import type { EventGenerator, MLSnapshot } from "../../types/events";
import type { AlgorithmDefinition } from "../../types/algorithm";

export interface KMeansInput {
  points: { x: number; y: number }[];
  k: number;
  maxIterations: number;
  seed?: number;
}

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/**
 * ML algorithms need a fundamentally different temporal model: coarse
 * per-iteration snapshots rather than discrete operation events. This
 * generator yields one ITERATION_SNAPSHOT per pass, not per comparison.
 */
export function* kmeansGen(input: KMeansInput): EventGenerator {
  const rand = mulberry32(input.seed ?? 42);
  let step = 0;

  const shuffled = [...input.points].sort(() => rand() - 0.5);
  let centroids = shuffled.slice(0, input.k).map((p) => ({ ...p }));

  let clusters = input.points.map(() => 0);
  let converged = false;

  for (let iter = 0; iter < input.maxIterations && !converged; iter++) {
    // Assign step
    const newClusters = input.points.map((p) => {
      let best = 0;
      let bestDist = Infinity;
      centroids.forEach((c, ci) => {
        const d = distance(p, c);
        if (d < bestDist) {
          bestDist = d;
          best = ci;
        }
      });
      return best;
    });

    // Update step
    const sums = centroids.map(() => ({ x: 0, y: 0, count: 0 }));
    input.points.forEach((p, i) => {
      const c = newClusters[i];
      sums[c].x += p.x;
      sums[c].y += p.y;
      sums[c].count += 1;
    });
    const newCentroids = centroids.map((c, i) =>
      sums[i].count > 0 ? { x: sums[i].x / sums[i].count, y: sums[i].y / sums[i].count } : c
    );

    converged =
      newClusters.every((c, i) => c === clusters[i]) &&
      newCentroids.every((c, i) => distance(c, centroids[i]) < 1e-6);

    clusters = newClusters;
    centroids = newCentroids;

    const snapshot: MLSnapshot = {
      iteration: iter + 1,
      points: input.points.map((p, i) => ({ x: p.x, y: p.y, cluster: clusters[i] })),
      centroids: centroids.map((c) => ({ ...c })),
      converged,
    };
    yield { category: "ml", type: "ITERATION_SNAPSHOT", step: step++, snapshot };
  }
}

export const kmeans: AlgorithmDefinition<KMeansInput> = {
  id: "kmeans",
  name: "K-Means Clustering",
  category: "ml",
  tier: "A",
  description:
    "Alternates assigning points to the nearest centroid and recomputing centroids from their assigned points, until convergence.",
  timeComplexity: "O(n × k × iterations)",
  spaceComplexity: "O(n + k)",
  run: kmeansGen,
  pseudocode: [
    { id: "assign", text: "for each point: assign to nearest centroid", indent: 0 },
    { id: "update", text: "for each cluster: centroid = mean of assigned points", indent: 0 },
    { id: "repeat", text: "repeat until assignments stop changing", indent: 0 },
  ],
};
