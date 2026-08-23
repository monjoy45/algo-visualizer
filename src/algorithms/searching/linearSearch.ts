import type { EventGenerator } from "../../types/events";
import type { AlgorithmDefinition } from "../../types/algorithm";

export interface LinearSearchInput {
  values: number[];
  target: number;
}

export function* linearSearchGen(input: LinearSearchInput): EventGenerator {
  const { values, target } = input;
  let step = 0;

  for (let i = 0; i < values.length; i++) {
    // Comparing arr[i] against a target (not a second array cell) — reuse COMPARE
    // with both indices equal to [i, i], which highlights exactly cell i.
    yield { category: "array", type: "COMPARE", indices: [i, i], step: step++, stepId: "compare" };
    if (values[i] === target) {
      yield { category: "array", type: "MARK_SORTED", index: i, step: step++, stepId: "found" };
      return;
    }
  }
}

export const linearSearch: AlgorithmDefinition<LinearSearchInput> = {
  id: "linear-search",
  name: "Linear Search",
  category: "array",
  tier: "A",
  description:
    "Scans the array from left to right, checking each element against the target value until a match is found or the array is exhausted.",
  timeComplexity: "O(n) worst/average case, O(1) best case",
  spaceComplexity: "O(1)",
  run: linearSearchGen,
  pseudocode: [
    { id: "compare", text: "for i from 0 to n-1: if arr[i] == target", indent: 0 },
    { id: "found", text: "return i (match found)", indent: 1 },
  ],
};