import type { EventGenerator } from "../../types/events";
import type { AlgorithmDefinition } from "../../types/algorithm";

export interface CoinChangeInput {
  coins: number[];
  amount: number;
}

export function* coinChangeGen(input: CoinChangeInput): EventGenerator {
  let step = 0;
  const { coins, amount } = input;
  const cols = amount + 1;

  yield { category: "grid", type: "INIT", rows: 1, cols, step: step++, stepId: "init" };

  const dp: number[] = new Array(cols).fill(Infinity);
  dp[0] = 0;
  yield { category: "grid", type: "SET_CELL", row: 0, col: 0, value: 0, step: step++, stepId: "baseCase" };

  for (let a = 1; a <= amount; a++) {
    const dependsOn: [number, number][] = coins.filter((c) => c <= a).map((c) => [0, a - c] as [number, number]);
    yield { category: "grid", type: "COMPARE_CELL", row: 0, col: a, dependsOn, step: step++, stepId: "considerCoins" };

    let best = Infinity;
    for (const c of coins) {
      if (c <= a && dp[a - c] + 1 < best) best = dp[a - c] + 1;
    }
    dp[a] = best;
    // -1 is the conventional "unreachable with these coins" marker (same convention as LeetCode's Coin Change).
    yield { category: "grid", type: "SET_CELL", row: 0, col: a, value: best === Infinity ? -1 : best, step: step++, stepId: "setCell" };
  }

  yield { category: "grid", type: "MARK_FINAL", row: 0, col: amount, step: step++, stepId: "final" };
}

export const coinChange: AlgorithmDefinition<CoinChangeInput> = {
  id: "coin-change",
  name: "Coin Change (Fewest Coins)",
  category: "grid",
  tier: "A",
  description:
    "Builds a table where dp[a] is the fewest coins needed to make amount a, by trying every coin denomination and taking the best of dp[a - coin] + 1 across all of them.",
  timeComplexity: "O(amount × number of coin denominations)",
  spaceComplexity: "O(amount)",
  run: coinChangeGen,
  pseudocode: [
    { id: "baseCase", text: "dp[0] = 0", indent: 0 },
    { id: "considerCoins", text: "for a from 1 to amount: for each coin <= a", indent: 1 },
    { id: "setCell", text: "dp[a] = min over coins of (dp[a - coin] + 1), or -1 if unreachable", indent: 2 },
    { id: "final", text: "answer = dp[amount]", indent: 0 },
  ],
};