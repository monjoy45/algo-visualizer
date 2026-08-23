import type { EventGenerator } from "../../types/events";
import type { AlgorithmDefinition } from "../../types/algorithm";

export function* reverseLinkedListGen(input: number[]): EventGenerator {
  let step = 0;
  const ids = input.map((_, i) => `n${i}`);
  const forwardNodes = input.map((v, i) => ({
    id: ids[i],
    value: v,
    next: i < input.length - 1 ? ids[i + 1] : null,
  }));

  yield { category: "linkedList", type: "INIT", nodes: forwardNodes, step: step++, stepId: "init" };

  let prev: string | null = null;
  let curr: string | null = ids.length > 0 ? ids[0] : null;

  yield { category: "linkedList", type: "POINTER", label: "prev", id: prev, step: step++, stepId: "initPointers" };
  yield { category: "linkedList", type: "POINTER", label: "curr", id: curr, step: step++, stepId: "initPointers" };

  while (curr !== null) {
    const currIdx = ids.indexOf(curr);
    const nextId = currIdx < ids.length - 1 ? ids[currIdx + 1] : null;

    yield { category: "linkedList", type: "POINTER", label: "next", id: nextId, step: step++, stepId: "saveNext" };
    yield { category: "linkedList", type: "VISIT", id: curr, step: step++, stepId: "reverseLink" };

    prev = curr;
    curr = nextId;

    yield { category: "linkedList", type: "POINTER", label: "prev", id: prev, step: step++, stepId: "advance" };
    yield { category: "linkedList", type: "POINTER", label: "curr", id: curr, step: step++, stepId: "advance" };
  }

  // Clear the walk pointers, then re-render the list in its reversed order —
  // node "next" links are recomputed from that order, exactly like INIT does elsewhere.
  yield { category: "linkedList", type: "POINTER", label: "next", id: null, step: step++, stepId: "advance" };
  yield { category: "linkedList", type: "POINTER", label: "curr", id: null, step: step++, stepId: "advance" };

  const reversedIds = [...ids].reverse();
  const reversedNodes = reversedIds.map((id, i) => ({
    id,
    value: input[ids.indexOf(id)],
    next: i < reversedIds.length - 1 ? reversedIds[i + 1] : null,
  }));
  yield { category: "linkedList", type: "INIT", nodes: reversedNodes, step: step++, stepId: "done" };
  if (reversedIds.length > 0) {
    yield { category: "linkedList", type: "POINTER", label: "head", id: reversedIds[0], step: step++, stepId: "done" };
  }
}

export const reverseLinkedList: AlgorithmDefinition<number[]> = {
  id: "reverse-linked-list",
  name: "Reverse a Linked List",
  category: "linkedList",
  tier: "A",
  description:
    "Walks the list once with three pointers (prev, curr, next), flipping each node's link to point backward instead of forward, until curr runs off the end and prev is the new head.",
  timeComplexity: "O(n)",
  spaceComplexity: "O(1) iterative",
  run: reverseLinkedListGen,
  pseudocode: [
    { id: "initPointers", text: "prev = null, curr = head", indent: 0 },
    { id: "saveNext", text: "next = curr.next  (save it before we overwrite the link)", indent: 1 },
    { id: "reverseLink", text: "curr.next = prev", indent: 1 },
    { id: "advance", text: "prev = curr, curr = next", indent: 1 },
    { id: "done", text: "head = prev  (list is now fully reversed)", indent: 0 },
  ],
};