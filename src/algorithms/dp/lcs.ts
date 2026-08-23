import type { EventGenerator } from "../../types/events";
import type { AlgorithmDefinition } from "../../types/algorithm";

export interface LCSInput {
  a: string;
  b: string;
}

export function* lcsGen(input: LCSInput): EventGenerator {
  let step = 0;
  const { a, b } = input;
  const m = a.length;
  const n = b.length;
  const rows = m + 1;
  const cols = n + 1;

  yield { category: "grid", type: "INIT", rows, cols, step: step++, stepId: "init" };

  const dp: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let i = 0; i <= m; i++) {
    yield { category: "grid", type: "SET_CELL", row: i, col: 0, value: 0, step: step++, stepId: "baseCase" };
  }
  for (let j = 0; j <= n; j++) {
    yield { category: "grid", type: "SET_CELL", row: 0, col: j, value: 0, step: step++, stepId: "baseCase" };
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        yield {
          category: "grid",
          type: "COMPARE_CELL",
          row: i,
          col: j,
          dependsOn: [[i - 1, j - 1]],
          step: step++,
          stepId: "matchChar",
        };
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        yield {
          category: "grid",
          type: "COMPARE_CELL",
          row: i,
          col: j,
          dependsOn: [
            [i - 1, j],
            [i, j - 1],
          ],
          step: step++,
          stepId: "noMatch",
        };
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
      yield { category: "grid", type: "SET_CELL", row: i, col: j, value: dp[i][j], step: step++, stepId: "setCell" };
    }
  }

  yield { category: "grid", type: "MARK_FINAL", row: m, col: n, step: step++, stepId: "final" };
}

export const lcs: AlgorithmDefinition<LCSInput> = {
  id: "longest-common-subsequence",
  name: "Longest Common Subsequence",
  category: "grid",
  tier: "A",
  description:
    "Fills a 2D table where dp[i][j] is the LCS length of the first i characters of string A and the first j characters of string B — matching characters extend the diagonal, mismatches carry forward the best of the cell above or to the left.",
  timeComplexity: "O(m × n)",
  spaceComplexity: "O(m × n)",
  run: lcsGen,
  pseudocode: [
    { id: "baseCase", text: "dp[i][0] = dp[0][j] = 0  (empty-string base case)", indent: 0 },
    { id: "matchChar", text: "if a[i-1] == b[j-1]: dp[i][j] = dp[i-1][j-1] + 1", indent: 1 },
    { id: "noMatch", text: "else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])", indent: 1 },
    { id: "setCell", text: "write dp[i][j]", indent: 1 },
    { id: "final", text: "answer = dp[m][n]", indent: 0 },
  ],
};