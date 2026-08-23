import type { EventGenerator } from "../../types/events";
import type { AlgorithmDefinition } from "../../types/algorithm";

export function* kadaneGen(input: number[]): EventGenerator {
  let step = 0;
  if (input.length === 0) return;

  let maxEndingHere = input[0];
  let maxSoFar = input[0];
  let windowStart = 0;
  let bestStart = 0;
  let bestEnd = 0;

  yield { category: "array", type: "HIGHLIGHT_RANGE", low: 0, high: 0, step: step++, stepId: "initWindow" };

  for (let i = 1; i < input.length; i++) {
    yield { category: "array", type: "COMPARE", indices: [i - 1, i], step: step++, stepId: "compare" };
    if (maxEndingHere + input[i] < input[i]) {
      // The running sum has gone negative enough that starting fresh at i beats extending.
      maxEndingHere = input[i];
      windowStart = i;
    } else {
      maxEndingHere += input[i];
    }
    yield { category: "array", type: "HIGHLIGHT_RANGE", low: windowStart, high: i, step: step++, stepId: "extendWindow" };

    if (maxEndingHere > maxSoFar) {
      maxSoFar = maxEndingHere;
      bestStart = windowStart;
      bestEnd = i;
    }
  }

  yield { category: "array", type: "CLEAR_HIGHLIGHT", step: step++, stepId: "clear" };
  for (let i = bestStart; i <= bestEnd; i++) {
    yield { category: "array", type: "MARK_SORTED", index: i, step: step++, stepId: "markBest" };
  }
}

export const kadane: AlgorithmDefinition<number[]> = {
  id: "kadane",
  name: "Kadane's Algorithm (Max Subarray)",
  category: "array",
  tier: "A",
  description:
    "Scans once, keeping a running sum of the best subarray ending at the current position — restarting the window whenever extending it would do worse than starting fresh — while tracking the best sum seen anywhere.",
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  run: kadaneGen,
  pseudocode: [
    { id: "compare", text: "for i from 1 to n-1", indent: 0 },
    { id: "extendWindow", text: "maxEndingHere = max(arr[i], maxEndingHere + arr[i])", indent: 1 },
    { id: "clear", text: "track windowStart whenever a fresh start beats extending", indent: 1 },
    { id: "markBest", text: "highlight the subarray with the best sum found", indent: 0 },
  ],
};