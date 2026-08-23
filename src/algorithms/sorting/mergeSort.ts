import type { EventGenerator } from "../../types/events";
import type { AlgorithmDefinition } from "../../types/algorithm";

export function* mergeSortGen(input: number[]): EventGenerator {
  const arr = [...input];
  let step = 0;

  function* sort(lo: number, hi: number): EventGenerator {
    if (hi - lo <= 1) return;
    const mid = Math.floor((lo + hi) / 2);
    yield { category: "array", type: "HIGHLIGHT_RANGE", low: lo, high: hi - 1, mid, step: step++, stepId: "split" };
    yield* sort(lo, mid);
    yield* sort(mid, hi);

    const left = arr.slice(lo, mid);
    const right = arr.slice(mid, hi);
    let i = 0;
    let j = 0;
    let k = lo;

    while (i < left.length && j < right.length) {
      yield {
        category: "array",
        type: "COMPARE",
        indices: [lo + i, mid + j],
        step: step++,
        stepId: "compareMerge",
      };
      if (left[i] <= right[j]) {
        arr[k] = left[i++];
      } else {
        arr[k] = right[j++];
      }
      yield { category: "array", type: "SET", index: k, value: arr[k], step: step++, stepId: "writeBack" };
      k++;
    }
    while (i < left.length) {
      arr[k] = left[i++];
      yield { category: "array", type: "SET", index: k, value: arr[k], step: step++, stepId: "writeBack" };
      k++;
    }
    while (j < right.length) {
      arr[k] = right[j++];
      yield { category: "array", type: "SET", index: k, value: arr[k], step: step++, stepId: "writeBack" };
      k++;
    }
    yield { category: "array", type: "CLEAR_HIGHLIGHT", step: step++, stepId: "mergedRange" };
  }

  yield* sort(0, arr.length);
  for (let i = 0; i < arr.length; i++) {
    yield { category: "array", type: "MARK_SORTED", index: i, step: step++, stepId: "done" };
  }
}

export const mergeSort: AlgorithmDefinition<number[]> = {
  id: "merge-sort",
  name: "Merge Sort",
  category: "array",
  tier: "B",
  description:
    "Recursively splits the array in half until each piece has one element, then merges pairs of sorted pieces back together in order.",
  timeComplexity: "O(n log n) in all cases",
  spaceComplexity: "O(n)",
  run: mergeSortGen,
  pseudocode: [
    { id: "split", text: "split [lo, hi) into two halves at mid", indent: 0 },
    { id: "compareMerge", text: "compare fronts of left and right halves", indent: 1 },
    { id: "writeBack", text: "write smaller value back into arr[k]", indent: 1 },
    { id: "mergedRange", text: "range merged, sorted", indent: 0 },
    { id: "done", text: "whole array sorted", indent: 0 },
  ],
};
