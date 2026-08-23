import type { EventGenerator } from "../../types/events";
import type { AlgorithmDefinition } from "../../types/algorithm";

export interface KnapsackInput {
  weights: number[];
  values: number[];
  capacity: number;
}

export function* knapsackGen(input: KnapsackInput): EventGenerator {
  let step = 0;
  const n = input.weights.length;
  const rows = n + 1;
  const cols = input.capacity + 1;

  yield { category: "grid", type: "INIT", rows, cols, step: step++, stepId: "init" };

  const table: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let r = 0; r < rows; r++) {
    yield { category: "grid", type: "SET_CELL", row: r, col: 0, value: 0, step: step++, stepId: "baseCase" };
  }
  for (let c = 0; c < cols; c++) {
    yield { category: "grid", type: "SET_CELL", row: 0, col: c, value: 0, step: step++, stepId: "baseCase" };
  }

  for (let i = 1; i <= n; i++) {
    const weight = input.weights[i - 1];
    const value = input.values[i - 1];
    for (let w = 1; w <= input.capacity; w++) {
      if (weight > w) {
        yield {
          category: "grid",
          type: "COMPARE_CELL",
          row: i,
          col: w,
          dependsOn: [[i - 1, w]],
          step: step++,
          stepId: "tooHeavy",
        };
        table[i][w] = table[i - 1][w];
      } else {
        yield {
          category: "grid",
          type: "COMPARE_CELL",
          row: i,
          col: w,
          dependsOn: [
            [i - 1, w],
            [i - 1, w - weight],
          ],
          step: step++,
          stepId: "compareChoices",
        };
        table[i][w] = Math.max(table[i - 1][w], value + table[i - 1][w - weight]);
      }
      yield { category: "grid", type: "SET_CELL", row: i, col: w, value: table[i][w], step: step++, stepId: "setCell" };
    }
  }

  yield { category: "grid", type: "MARK_FINAL", row: n, col: input.capacity, step: step++, stepId: "final" };
}

export const knapsack: AlgorithmDefinition<KnapsackInput> = {
  id: "knapsack-01",
  name: "0/1 Knapsack",
  category: "grid",
  tier: "A",
  description:
    "Fills a DP table where dp[i][w] is the best value achievable using the first i items within capacity w.",
  timeComplexity: "O(n × capacity)",
  spaceComplexity: "O(n × capacity)",
  run: knapsackGen,
  pseudocode: [
    { id: "baseCase", text: "dp[0][*] = dp[*][0] = 0", indent: 0 },
    { id: "tooHeavy", text: "if weight[i] > w: dp[i][w] = dp[i-1][w]", indent: 1 },
    { id: "compareChoices", text: "else: dp[i][w] = max(dp[i-1][w], value[i] + dp[i-1][w-weight[i]])", indent: 1 },
    { id: "setCell", text: "write dp[i][w]", indent: 1 },
    { id: "final", text: "answer = dp[n][capacity]", indent: 0 },
  ],
};
