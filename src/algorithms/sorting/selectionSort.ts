import type { EventGenerator } from "../../types/events";
import type { AlgorithmDefinition } from "../../types/algorithm";

export function* selectionSortGen(input: number[]): EventGenerator {
  const arr = [...input];
  const n = arr.length;
  let step = 0;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      yield { category: "array", type: "COMPARE", indices: [minIdx, j], step: step++, stepId: "compare" };
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      yield { category: "array", type: "SWAP", indices: [i, minIdx], step: step++, stepId: "swap" };
    }
    yield { category: "array", type: "MARK_SORTED", index: i, step: step++, stepId: "markSorted" };
  }
  if (n > 0) {
    yield { category: "array", type: "MARK_SORTED", index: n - 1, step: step++, stepId: "markSorted" };
  }
}

export const selectionSort: AlgorithmDefinition<number[]> = {
  id: "selection-sort",
  name: "Selection Sort",
  category: "array",
  tier: "A",
  description:
    "Repeatedly finds the minimum element in the unsorted suffix of the array and swaps it into place at the front of that suffix.",
  timeComplexity: "O(n²) in all cases (best, average, worst)",
  spaceComplexity: "O(1)",
  run: selectionSortGen,
  pseudocode: [
    { id: "outer", text: "for i from 0 to n - 2", indent: 0 },
    { id: "compare", text: "for j from i+1 to n-1: track index of minimum value", indent: 1 },
    { id: "swap", text: "swap arr[i] with arr[minIndex]", indent: 1 },
    { id: "markSorted", text: "mark position i as sorted", indent: 1 },
  ],
};