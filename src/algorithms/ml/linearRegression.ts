import type { EventGenerator, MLSnapshot } from "../../types/events";
import type { AlgorithmDefinition } from "../../types/algorithm";

export interface LinearRegressionInput {
  points: { x: number; y: number }[];
  learningRate: number;
  iterations: number;
}

const LINE_SAMPLES = 12;

/**
 * CoordinatePlaneRenderer only draws points and ringed "centroid" markers —
 * it has no polyline primitive. To show the fitted line without touching the
 * renderer, we sample it at LINE_SAMPLES evenly spaced x-positions each
 * iteration and pass those as "centroids." As the line converges the row of
 * rings visibly straightens into the fit; it reads as a dashed line rather
 * than a solid one. A true polyline would need a small CoordinatePlaneRenderer
 * change — left out of this drop-in file on purpose.
 */
export function* linearRegressionGen(input: LinearRegressionInput): EventGenerator {
  let step = 0;
  const { points, learningRate, iterations } = input;
  const n = points.length;
  if (n === 0) return;

  let m = 0;
  let b = 0;

  const minX = Math.min(...points.map((p) => p.x));
  const maxX = Math.max(...points.map((p) => p.x));

  function sampleLine(slope: number, intercept: number) {
    return Array.from({ length: LINE_SAMPLES }, (_, i) => {
      const x = minX + (i / (LINE_SAMPLES - 1)) * (maxX - minX || 1);
      return { x, y: slope * x + intercept };
    });
  }

  for (let iter = 0; iter < iterations; iter++) {
    let gradM = 0;
    let gradB = 0;
    for (const p of points) {
      const err = m * p.x + b - p.y;
      gradM += err * p.x;
      gradB += err;
    }
    gradM = (2 / n) * gradM;
    gradB = (2 / n) * gradB;

    m -= learningRate * gradM;
    b -= learningRate * gradB;

    const converged = Math.abs(gradM) < 1e-4 && Math.abs(gradB) < 1e-4;

    const snapshot: MLSnapshot = {
      iteration: iter + 1,
      points: points.map((p) => ({ x: p.x, y: p.y, cluster: 0 })),
      centroids: sampleLine(m, b),
      converged,
    };
    yield { category: "ml", type: "ITERATION_SNAPSHOT", step: step++, snapshot };

    if (converged) break;
  }
}

export const linearRegression: AlgorithmDefinition<LinearRegressionInput> = {
  id: "linear-regression",
  name: "Linear Regression (Gradient Descent)",
  category: "ml",
  tier: "A",
  description:
    "Fits a line y = mx + b to a scatter of points by repeatedly computing the gradient of the mean-squared error with respect to m and b, then nudging both a small step opposite the gradient.",
  timeComplexity: "O(n × iterations)",
  spaceComplexity: "O(n)",
  run: linearRegressionGen,
  pseudocode: [
    { id: "computeGradients", text: "for each point: accumulate gradient of MSE w.r.t. m and b", indent: 0 },
    { id: "updateParams", text: "m -= learningRate × gradM; b -= learningRate × gradB", indent: 0 },
    { id: "checkConvergence", text: "stop once both gradients are near zero", indent: 0 },
  ],
};