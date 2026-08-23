import type { EventGenerator } from "../../types/events";
import type { AlgorithmDefinition } from "../../types/algorithm";

export function* bubbleSortGen(input: number[]): EventGenerator {
  const arr = [...input];
  const n = arr.length;
  let step = 0;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      yield { category: "array", type: "COMPARE", indices: [j, j + 1], step: step++, stepId: "compare" };
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        yield { category: "array", type: "SWAP", indices: [j, j + 1], step: step++, stepId: "swap" };
      }
    }
    yield { category: "array", type: "MARK_SORTED", index: n - 1 - i, step: step++, stepId: "markSorted" };
  }
  if (n > 0) {
    yield { category: "array", type: "MARK_SORTED", index: 0, step: step++, stepId: "markSorted" };
  }
}

export const bubbleSort: AlgorithmDefinition<number[]> = {
  id: "bubble-sort",
  name: "Bubble Sort",
  category: "array",
  tier: "A",
  description:
    "Repeatedly steps through the array, comparing adjacent elements and swapping them if they're in the wrong order.",
  timeComplexity: "O(n²) average/worst, O(n) best (already sorted)",
  spaceComplexity: "O(1)",
  run: bubbleSortGen,
  pseudocode: [
    { id: "outer", text: "for i from 0 to n - 2", indent: 0 },
    { id: "inner", text: "for j from 0 to n - i - 2", indent: 1 },
    { id: "compare", text: "if arr[j] > arr[j + 1]", indent: 2 },
    { id: "swap", text: "swap arr[j], arr[j + 1]", indent: 3 },
    { id: "markSorted", text: "mark position as sorted", indent: 1 },
  ],
};
