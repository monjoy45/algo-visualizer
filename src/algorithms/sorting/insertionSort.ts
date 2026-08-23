import type { EventGenerator } from "../../types/events";
import type { AlgorithmDefinition } from "../../types/algorithm";

export function* insertionSortGen(input: number[]): EventGenerator {
  const arr = [...input];
  let step = 0;
  yield { category: "array", type: "MARK_SORTED", index: 0, step: step++, stepId: "markFirst" };

  for (let i = 1; i < arr.length; i++) {
    let j = i;
    yield { category: "array", type: "COMPARE", indices: [j - 1, j], step: step++, stepId: "compare" };
    while (j > 0 && arr[j - 1] > arr[j]) {
      [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
      yield { category: "array", type: "SWAP", indices: [j - 1, j], step: step++, stepId: "shift" };
      j--;
      if (j > 0) {
        yield { category: "array", type: "COMPARE", indices: [j - 1, j], step: step++, stepId: "compare" };
      }
    }
    for (let k = 0; k <= i; k++) {
      yield { category: "array", type: "MARK_SORTED", index: k, step: step++, stepId: "markSorted" };
    }
  }
}

export const insertionSort: AlgorithmDefinition<number[]> = {
  id: "insertion-sort",
  name: "Insertion Sort",
  category: "array",
  tier: "B",
  description:
    "Builds the sorted array one element at a time, taking each new element and shifting it left past every larger element already in place.",
  timeComplexity: "O(n²) average/worst, O(n) best (already sorted)",
  spaceComplexity: "O(1)",
  run: insertionSortGen,
  pseudocode: [
    { id: "markFirst", text: "first element is trivially sorted", indent: 0 },
    { id: "compare", text: "for i from 1 to n-1: compare arr[j-1], arr[j]", indent: 0 },
    { id: "shift", text: "while out of order: swap left, j--", indent: 1 },
    { id: "markSorted", text: "prefix [0..i] is now sorted", indent: 0 },
  ],
};
