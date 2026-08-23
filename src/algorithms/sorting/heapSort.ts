import type { EventGenerator } from "../../types/events";
import type { AlgorithmDefinition } from "../../types/algorithm";

export function* heapSortGen(input: number[]): EventGenerator {
  const arr = [...input];
  const n = arr.length;
  let step = 0;

  function* siftDown(start: number, end: number): EventGenerator {
    let root = start;
    while (true) {
      const left = 2 * root + 1;
      if (left > end) break;
      let swapTarget = left;
      if (left + 1 <= end) {
        yield { category: "array", type: "COMPARE", indices: [left, left + 1], step: step++, stepId: "compareChildren" };
        if (arr[left] < arr[left + 1]) swapTarget = left + 1;
      }
      yield { category: "array", type: "COMPARE", indices: [root, swapTarget], step: step++, stepId: "compareRoot" };
      if (arr[root] < arr[swapTarget]) {
        [arr[root], arr[swapTarget]] = [arr[swapTarget], arr[root]];
        yield { category: "array", type: "SWAP", indices: [root, swapTarget], step: step++, stepId: "siftSwap" };
        root = swapTarget;
      } else {
        break;
      }
    }
  }

  // Build a max-heap in place: sift down every non-leaf node, starting from the last one.
  for (let start = Math.floor(n / 2) - 1; start >= 0; start--) {
    yield* siftDown(start, n - 1);
  }

  // Repeatedly move the max (root) to the end of the unsorted region, then re-heapify.
  for (let end = n - 1; end > 0; end--) {
    [arr[0], arr[end]] = [arr[end], arr[0]];
    yield { category: "array", type: "SWAP", indices: [0, end], step: step++, stepId: "moveMax" };
    yield { category: "array", type: "MARK_SORTED", index: end, step: step++, stepId: "markSorted" };
    yield* siftDown(0, end - 1);
  }
  if (n > 0) {
    yield { category: "array", type: "MARK_SORTED", index: 0, step: step++, stepId: "markSorted" };
  }
}

export const heapSort: AlgorithmDefinition<number[]> = {
  id: "heap-sort",
  name: "Heap Sort",
  category: "array",
  tier: "B",
  description:
    "Treats the array as a binary heap. First builds a max-heap in place, then repeatedly swaps the root (the max) to the end of the unsorted region and re-heapifies what remains.",
  timeComplexity: "O(n log n) in all cases",
  spaceComplexity: "O(1) — sorts in place",
  run: heapSortGen,
  pseudocode: [
    { id: "compareChildren", text: "for each non-leaf node (bottom-up): compare its two children", indent: 0 },
    { id: "compareRoot", text: "compare node with its larger child", indent: 1 },
    { id: "siftSwap", text: "if child > node: swap, continue sifting down from child", indent: 2 },
    { id: "moveMax", text: "swap heap root (max) with last unsorted element", indent: 0 },
    { id: "markSorted", text: "mark that position as sorted", indent: 1 },
  ],
};