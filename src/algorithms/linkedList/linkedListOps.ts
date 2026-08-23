import type { EventGenerator } from "../../types/events";
import type { AlgorithmDefinition } from "../../types/algorithm";

export interface LinkedListInput {
  values: number[];
  insertValue: number;
  insertAfterIndex: number; // -1 means insert at head
  deleteIndex: number; // index (post-insert) to delete, -1 to skip
}

export function* linkedListOpsGen(input: LinkedListInput): EventGenerator {
  let step = 0;
  const ids = input.values.map((_, i) => `n${i}`);
  const nodes = input.values.map((v, i) => ({
    id: ids[i],
    value: v,
    next: i < input.values.length - 1 ? ids[i + 1] : null,
  }));

  yield { category: "linkedList", type: "INIT", nodes, step: step++, stepId: "init" };

  // Traverse
  for (const id of ids) {
    yield { category: "linkedList", type: "VISIT", id, step: step++, stepId: "traverse" };
  }

  // Insert
  const newId = `n${ids.length}`;
  const afterId = input.insertAfterIndex === -1 ? null : ids[input.insertAfterIndex] ?? null;
  yield {
    category: "linkedList",
    type: "INSERT",
    id: newId,
    value: input.insertValue,
    afterId,
    step: step++,
    stepId: "insert",
  };
  ids.splice(input.insertAfterIndex === -1 ? 0 : input.insertAfterIndex + 1, 0, newId);

  // Delete
  if (input.deleteIndex >= 0 && input.deleteIndex < ids.length) {
    const targetId = ids[input.deleteIndex];
    yield { category: "linkedList", type: "VISIT", id: targetId, step: step++, stepId: "findDelete" };
    yield { category: "linkedList", type: "DELETE", id: targetId, step: step++, stepId: "delete" };
  }
}

export const linkedListOps: AlgorithmDefinition<LinkedListInput> = {
  id: "linked-list-ops",
  name: "Singly Linked List — Insert / Delete / Traverse",
  category: "linkedList",
  tier: "A",
  description: "Builds a singly linked list, traverses it, inserts a new node, and deletes a node.",
  timeComplexity: "O(n) traverse/insert-by-position/delete-by-position, O(1) insert-at-head",
  spaceComplexity: "O(n)",
  run: linkedListOpsGen,
  pseudocode: [
    { id: "init", text: "build list from values", indent: 0 },
    { id: "traverse", text: "curr = head; while curr: visit(curr); curr = curr.next", indent: 0 },
    { id: "insert", text: "new.next = after.next; after.next = new", indent: 0 },
    { id: "findDelete", text: "walk to node before target", indent: 0 },
    { id: "delete", text: "prev.next = target.next", indent: 0 },
  ],
};
