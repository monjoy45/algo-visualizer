import type { EventGenerator, VizEvent } from "../../types/events";
import type { AlgorithmDefinition } from "../../types/algorithm";

export function* quickSortGen(input: number[]): EventGenerator {
  const arr = [...input];
  let step = 0;

  function* partition(lo: number, hi: number): Generator<VizEvent, number, unknown> {
    const pivot = arr[hi];
    yield {
      category: "array",
      type: "HIGHLIGHT_RANGE",
      low: lo,
      high: hi,
      mid: hi,
      step: step++,
      stepId: "choosePivot",
    };

    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      yield { category: "array", type: "COMPARE", indices: [j, hi], step: step++, stepId: "compare" };
      if (arr[j] < pivot) {
        i++;
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          yield { category: "array", type: "SWAP", indices: [i, j], step: step++, stepId: "swapSmaller" };
        }
      }
    }
    if (i + 1 !== hi) {
      [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
      yield { category: "array", type: "SWAP", indices: [i + 1, hi], step: step++, stepId: "swapPivot" };
    }
    yield { category: "array", type: "MARK_SORTED", index: i + 1, step: step++, stepId: "pivotPlaced" };
    return i + 1;
  }

  function* sort(lo: number, hi: number): EventGenerator {
    if (lo > hi) return;
    if (lo === hi) {
      yield { category: "array", type: "MARK_SORTED", index: lo, step: step++, stepId: "pivotPlaced" };
      return;
    }
    const p = yield* partition(lo, hi);
    yield { category: "array", type: "CLEAR_HIGHLIGHT", step: step++, stepId: "recurse" };
    yield* sort(lo, p - 1);
    yield* sort(p + 1, hi);
  }

  yield* sort(0, arr.length - 1);
}

export const quickSort: AlgorithmDefinition<number[]> = {
  id: "quick-sort",
  name: "Quick Sort",
  category: "array",
  tier: "A",
  description:
    "Picks the last element as a pivot, partitions the array so smaller elements land to its left and larger elements to its right, then recursively sorts each side.",
  timeComplexity: "O(n log n) average, O(n²) worst case (e.g. already-sorted input with a last-element pivot)",
  spaceComplexity: "O(log n) average recursion stack, O(n) worst case",
  run: quickSortGen,
  pseudocode: [
    { id: "choosePivot", text: "choose arr[hi] as pivot", indent: 0 },
    { id: "compare", text: "for j from lo to hi-1: compare arr[j] with pivot", indent: 1 },
    { id: "swapSmaller", text: "if arr[j] < pivot: swap into the left partition", indent: 2 },
    { id: "swapPivot", text: "swap pivot into its final sorted position", indent: 0 },
    { id: "pivotPlaced", text: "pivot's index is now sorted", indent: 0 },
    { id: "recurse", text: "recursively partition the left and right sub-arrays", indent: 0 },
  ],
};