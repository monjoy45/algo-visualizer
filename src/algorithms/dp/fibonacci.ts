import type { EventGenerator } from "../../types/events";
import type { AlgorithmDefinition } from "../../types/algorithm";

export function* fibonacciGen(n: number): EventGenerator {
  let step = 0;
  const cols = n + 1;
  yield { category: "grid", type: "INIT", rows: 1, cols, step: step++, stepId: "init" };

  const dp: number[] = new Array(cols).fill(0);

  yield { category: "grid", type: "SET_CELL", row: 0, col: 0, value: 0, step: step++, stepId: "baseCase" };
  if (cols > 1) {
    dp[1] = 1;
    yield { category: "grid", type: "SET_CELL", row: 0, col: 1, value: 1, step: step++, stepId: "baseCase" };
  }

  for (let i = 2; i <= n; i++) {
    yield {
      category: "grid",
      type: "COMPARE_CELL",
      row: 0,
      col: i,
      dependsOn: [
        [0, i - 1],
        [0, i - 2],
      ],
      step: step++,
      stepId: "recurrence",
    };
    dp[i] = dp[i - 1] + dp[i - 2];
    yield { category: "grid", type: "SET_CELL", row: 0, col: i, value: dp[i], step: step++, stepId: "setCell" };
  }

  yield { category: "grid", type: "MARK_FINAL", row: 0, col: n, step: step++, stepId: "final" };
}

export const fibonacci: AlgorithmDefinition<number> = {
  id: "fibonacci-dp",
  name: "Fibonacci (Tabulation)",
  category: "grid",
  tier: "A",
  description:
    "Builds a bottom-up table where dp[i] = dp[i-1] + dp[i-2], so each value is computed exactly once instead of recomputed exponentially like naive recursion.",
  timeComplexity: "O(n)",
  spaceComplexity: "O(n) for the full table (O(1) if only the last two values are kept)",
  run: fibonacciGen,
  pseudocode: [
    { id: "baseCase", text: "dp[0] = 0, dp[1] = 1", indent: 0 },
    { id: "recurrence", text: "for i from 2 to n: depends on dp[i-1] and dp[i-2]", indent: 1 },
    { id: "setCell", text: "dp[i] = dp[i-1] + dp[i-2]", indent: 1 },
    { id: "final", text: "answer = dp[n]", indent: 0 },
  ],
};