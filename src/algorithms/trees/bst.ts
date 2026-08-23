import type { EventGenerator } from "../../types/events";
import type { AlgorithmDefinition } from "../../types/algorithm";

interface BSTNode {
  id: string;
  value: number;
  left: BSTNode | null;
  right: BSTNode | null;
}

export interface BSTInput {
  values: number[];
  searchValue: number;
}

export function* bstGen(input: BSTInput): EventGenerator {
  let step = 0;
  let nextId = 0;
  // A holder object, not a bare `let`, so TS's control-flow narrowing (which
  // doesn't see mutations made inside the nested `insert` closure) can't
  // narrow this down to `null` at the point the search loop reads it.
  const tree: { root: BSTNode | null } = { root: null };

  function* insert(value: number): EventGenerator {
    const id = `t${nextId++}`;
    const newNode: BSTNode = { id, value, left: null, right: null };

    if (tree.root === null) {
      tree.root = newNode;
      yield { category: "tree", type: "INSERT_NODE", id, value, parentId: null, step: step++, stepId: "insertRoot" };
      return;
    }

    let curr: BSTNode = tree.root;
    while (true) {
      yield { category: "tree", type: "COMPARE", id: curr.id, value, step: step++, stepId: "compare" };
      if (value < curr.value) {
        if (curr.left === null) {
          curr.left = newNode;
          yield { category: "tree", type: "INSERT_NODE", id, value, parentId: curr.id, step: step++, stepId: "insertLeft" };
          return;
        }
        curr = curr.left;
      } else {
        if (curr.right === null) {
          curr.right = newNode;
          yield { category: "tree", type: "INSERT_NODE", id, value, parentId: curr.id, step: step++, stepId: "insertRight" };
          return;
        }
        curr = curr.right;
      }
    }
  }

  for (const v of input.values) {
    yield* insert(v);
  }

  // Search
  let curr = tree.root;
  let found = false;
  while (curr !== null) {
    yield { category: "tree", type: "VISIT", id: curr.id, step: step++, stepId: "search" };
    if (curr.value === input.searchValue) {
      yield { category: "tree", type: "FOUND", id: curr.id, step: step++, stepId: "found" };
      found = true;
      break;
    }
    curr = input.searchValue < curr.value ? curr.left : curr.right;
  }
  if (!found) {
    yield { category: "tree", type: "NOT_FOUND", step: step++, stepId: "notFound" };
  }
}

export const bst: AlgorithmDefinition<BSTInput> = {
  id: "bst",
  name: "Binary Search Tree — Insert & Search",
  category: "tree",
  tier: "A",
  description: "Inserts each value into a binary search tree, then searches for a target value.",
  timeComplexity: "O(h) per operation, where h is tree height (O(log n) balanced, O(n) worst case)",
  spaceComplexity: "O(n)",
  run: bstGen,
  pseudocode: [
    { id: "insertRoot", text: "if tree empty: new node becomes root", indent: 0 },
    { id: "compare", text: "compare value against current node", indent: 0 },
    { id: "insertLeft", text: "insert as left child", indent: 1 },
    { id: "insertRight", text: "insert as right child", indent: 1 },
    { id: "search", text: "visit node; compare to target", indent: 0 },
    { id: "found", text: "target found", indent: 1 },
    { id: "notFound", text: "reached null — target not present", indent: 1 },
  ],
};
