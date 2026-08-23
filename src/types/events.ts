/**
 * Event / Step Protocol
 * ---------------------
 * A shared envelope (type, step, category, optional stepId) plus
 * category-namespaced payload families. This is the single contract
 * every algorithm generator produces and every reducer/renderer consumes.
 * Adding algorithm #101 should never require touching this file.
 */

export type EventCategory =
  | "array"
  | "linkedList"
  | "tree"
  | "graph"
  | "grid"
  | "ml"
  | "callStack";

interface BaseEvent {
  step: number;
  /** Semantic id used to sync pseudocode highlighting (Section 11). Not a line number. */
  stepId?: string;
}

// ---------- Array (Sorting / Searching) ----------
export type ArrayEvent =
  | ({ category: "array"; type: "COMPARE"; indices: [number, number] } & BaseEvent)
  | ({ category: "array"; type: "SWAP"; indices: [number, number] } & BaseEvent)
  | ({ category: "array"; type: "SET"; index: number; value: number } & BaseEvent)
  | ({ category: "array"; type: "MARK_SORTED"; index: number } & BaseEvent)
  | ({ category: "array"; type: "HIGHLIGHT_RANGE"; low: number; high: number; mid?: number } & BaseEvent)
  | ({ category: "array"; type: "CLEAR_HIGHLIGHT" } & BaseEvent);

// ---------- Linked List ----------
export type LinkedListEvent =
  | ({ category: "linkedList"; type: "INIT"; nodes: { id: string; value: number; next: string | null }[] } & BaseEvent)
  | ({ category: "linkedList"; type: "VISIT"; id: string } & BaseEvent)
  | ({ category: "linkedList"; type: "INSERT"; id: string; value: number; afterId: string | null } & BaseEvent)
  | ({ category: "linkedList"; type: "DELETE"; id: string } & BaseEvent)
  | ({ category: "linkedList"; type: "POINTER"; label: string; id: string | null } & BaseEvent);

// ---------- Trees ----------
export type TreeEvent =
  | ({ category: "tree"; type: "INSERT_NODE"; id: string; value: number; parentId: string | null } & BaseEvent)
  | ({ category: "tree"; type: "VISIT"; id: string } & BaseEvent)
  | ({ category: "tree"; type: "COMPARE"; id: string; value: number } & BaseEvent)
  | ({ category: "tree"; type: "FOUND"; id: string } & BaseEvent)
  | ({ category: "tree"; type: "NOT_FOUND" } & BaseEvent);

// ---------- Graphs ----------
export type GraphEvent =
  | ({ category: "graph"; type: "INIT"; nodes: { id: string; label: string }[]; edges: { source: string; target: string; weight?: number }[] } & BaseEvent)
  | ({ category: "graph"; type: "VISIT"; id: string } & BaseEvent)
  | ({ category: "graph"; type: "ENQUEUE"; id: string; queue: string[] } & BaseEvent)
  | ({ category: "graph"; type: "DEQUEUE"; id: string; queue: string[] } & BaseEvent)
  | ({ category: "graph"; type: "RELAX_EDGE"; source: string; target: string } & BaseEvent)
  | ({ category: "graph"; type: "MARK_VISITED"; id: string } & BaseEvent);

// ---------- Grid / Table (DP, backtracking) ----------
export type GridEvent =
  | ({ category: "grid"; type: "INIT"; rows: number; cols: number } & BaseEvent)
  | ({ category: "grid"; type: "SET_CELL"; row: number; col: number; value: number } & BaseEvent)
  | ({ category: "grid"; type: "COMPARE_CELL"; row: number; col: number; dependsOn: [number, number][] } & BaseEvent)
  | ({ category: "grid"; type: "MARK_FINAL"; row: number; col: number } & BaseEvent);

// ---------- ML (snapshot-per-iteration temporal model — deliberately different shape) ----------
export interface MLSnapshot {
  iteration: number;
  points: { x: number; y: number; cluster: number }[];
  centroids: { x: number; y: number }[];
  converged: boolean;
}
export type MLEvent = { category: "ml"; type: "ITERATION_SNAPSHOT"; step: number; snapshot: MLSnapshot };

// ---------- Call stack (reused by trees / backtracking / DFS) ----------
export type CallStackEvent =
  | ({ category: "callStack"; type: "PUSH"; frame: string } & BaseEvent)
  | ({ category: "callStack"; type: "POP" } & BaseEvent);

export type VizEvent =
  | ArrayEvent
  | LinkedListEvent
  | TreeEvent
  | GraphEvent
  | GridEvent
  | MLEvent
  | CallStackEvent;

/** A generator produces a flat, ordered event log. Nothing else about it is assumed. */
export type EventGenerator = Generator<VizEvent, void, unknown>;
