import type { EventGenerator } from "../../types/events";
import type { AlgorithmDefinition } from "../../types/algorithm";

export interface BinarySearchInput {
  values: number[]; // must already be sorted ascending
  target: number;
}

export function* binarySearchGen(input: BinarySearchInput): EventGenerator {
  const arr = input.values;
  let step = 0;
  let lo = 0;
  let hi = arr.length - 1;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    yield { category: "array", type: "HIGHLIGHT_RANGE", low: lo, high: hi, mid, step: step++, stepId: "narrow" };
    yield { category: "array", type: "COMPARE", indices: [mid, mid], step: step++, stepId: "compareMid" };

    if (arr[mid] === input.target) {
      yield { category: "array", type: "MARK_SORTED", index: mid, step: step++, stepId: "found" };
      return;
    } else if (arr[mid] < input.target) {
      lo = mid + 1;
      yield { category: "array", type: "HIGHLIGHT_RANGE", low: lo, high: hi, step: step++, stepId: "goRight" };
    } else {
      hi = mid - 1;
      yield { category: "array", type: "HIGHLIGHT_RANGE", low: lo, high: hi, step: step++, stepId: "goLeft" };
    }
  }
  yield { category: "array", type: "CLEAR_HIGHLIGHT", step: step++, stepId: "notFound" };
}

export const binarySearch: AlgorithmDefinition<BinarySearchInput> = {
  id: "binary-search",
  name: "Binary Search",
  category: "array",
  tier: "B",
  description:
    "Repeatedly halves a sorted array's search range by comparing the target against the middle element.",
  timeComplexity: "O(log n)",
  spaceComplexity: "O(1)",
  run: binarySearchGen,
  pseudocode: [
    { id: "narrow", text: "mid = (lo + hi) / 2", indent: 0 },
    { id: "compareMid", text: "compare arr[mid] to target", indent: 0 },
    { id: "found", text: "arr[mid] == target — found", indent: 1 },
    { id: "goRight", text: "target > arr[mid]: lo = mid + 1", indent: 1 },
    { id: "goLeft", text: "target < arr[mid]: hi = mid - 1", indent: 1 },
    { id: "notFound", text: "lo > hi — target not present", indent: 0 },
  ],
};
