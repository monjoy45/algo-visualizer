import type { ArrayEvent, LinkedListEvent, TreeEvent, GraphEvent, GridEvent } from "../types/events";

// ================= Array =================
export interface ArrayState {
  values: number[];
  compared: [number, number] | null;
  swapped: [number, number] | null;
  sorted: Set<number>;
  range: { low: number; high: number; mid?: number } | null;
}

export function initArrayState(values: number[]): ArrayState {
  return { values: [...values], compared: null, swapped: null, sorted: new Set(), range: null };
}

export function applyArrayEvent(state: ArrayState, e: ArrayEvent): ArrayState {
  switch (e.type) {
    case "COMPARE":
      return { ...state, compared: e.indices, swapped: null };
    case "SWAP": {
      const values = [...state.values];
      const [i, j] = e.indices;
      [values[i], values[j]] = [values[j], values[i]];
      return { ...state, values, swapped: e.indices, compared: null };
    }
    case "SET": {
      const values = [...state.values];
      values[e.index] = e.value;
      return { ...state, values };
    }
    case "MARK_SORTED":
      return { ...state, sorted: new Set(state.sorted).add(e.index) };
    case "HIGHLIGHT_RANGE":
      return { ...state, range: { low: e.low, high: e.high, mid: e.mid } };
    case "CLEAR_HIGHLIGHT":
      return { ...state, range: null, compared: null, swapped: null };
    default:
      return state;
  }
}

// ================= Linked List =================
export interface LLNode {
  id: string;
  value: number;
  next: string | null;
}
export interface LinkedListState {
  nodes: Record<string, LLNode>;
  order: string[];
  visiting: string | null;
  pointers: Record<string, string | null>;
}

export function initLinkedListState(): LinkedListState {
  return { nodes: {}, order: [], visiting: null, pointers: {} };
}

export function applyLinkedListEvent(state: LinkedListState, e: LinkedListEvent): LinkedListState {
  switch (e.type) {
    case "INIT": {
      const nodes: Record<string, LLNode> = {};
      e.nodes.forEach((n) => (nodes[n.id] = n));
      return { ...state, nodes, order: e.nodes.map((n) => n.id) };
    }
    case "VISIT":
      return { ...state, visiting: e.id };
    case "INSERT": {
      const nodes = { ...state.nodes, [e.id]: { id: e.id, value: e.value, next: null } };
      const order = [...state.order];
      if (e.afterId === null) {
        order.unshift(e.id);
      } else {
        nodes[e.afterId] = { ...nodes[e.afterId], next: e.id };
        order.splice(order.indexOf(e.afterId) + 1, 0, e.id);
      }
      return { ...state, nodes, order };
    }
    case "DELETE": {
      const nodes = { ...state.nodes };
      delete nodes[e.id];
      return { ...state, nodes, order: state.order.filter((id) => id !== e.id) };
    }
    case "POINTER":
      return { ...state, pointers: { ...state.pointers, [e.label]: e.id } };
    default:
      return state;
  }
}

// ================= Tree =================
export interface TreeNodeState {
  id: string;
  value: number;
  parentId: string | null;
}
export interface TreeState {
  nodes: Record<string, TreeNodeState>;
  visiting: string | null;
  comparing: string | null;
  found: string | null;
}

export function initTreeState(): TreeState {
  return { nodes: {}, visiting: null, comparing: null, found: null };
}

export function applyTreeEvent(state: TreeState, e: TreeEvent): TreeState {
  switch (e.type) {
    case "INSERT_NODE":
      return {
        ...state,
        nodes: { ...state.nodes, [e.id]: { id: e.id, value: e.value, parentId: e.parentId } },
      };
    case "VISIT":
      return { ...state, visiting: e.id, comparing: null };
    case "COMPARE":
      return { ...state, comparing: e.id };
    case "FOUND":
      return { ...state, found: e.id };
    case "NOT_FOUND":
      return { ...state, found: null };
    default:
      return state;
  }
}

// ================= Graph =================
export interface GraphNodeState {
  id: string;
  label: string;
}
export interface GraphState {
  nodes: GraphNodeState[];
  edges: { source: string; target: string; weight?: number }[];
  visited: Set<string>;
  current: string | null;
  queue: string[];
  relaxedEdge: { source: string; target: string } | null;
}

export function initGraphState(): GraphState {
  return { nodes: [], edges: [], visited: new Set(), current: null, queue: [], relaxedEdge: null };
}

export function applyGraphEvent(state: GraphState, e: GraphEvent): GraphState {
  switch (e.type) {
    case "INIT":
      return { ...state, nodes: e.nodes, edges: e.edges };
    case "VISIT":
      return { ...state, current: e.id };
    case "ENQUEUE":
      return { ...state, queue: e.queue };
    case "DEQUEUE":
      return { ...state, queue: e.queue, current: e.id };
    case "RELAX_EDGE":
      return { ...state, relaxedEdge: { source: e.source, target: e.target } };
    case "MARK_VISITED":
      return { ...state, visited: new Set(state.visited).add(e.id) };
    default:
      return state;
  }
}

// ================= Grid =================
export interface GridState {
  rows: number;
  cols: number;
  values: (number | null)[][];
  activeCell: [number, number] | null;
  dependsOn: [number, number][];
  finalCell: [number, number] | null;
}

export function initGridState(): GridState {
  return { rows: 0, cols: 0, values: [], activeCell: null, dependsOn: [], finalCell: null };
}

export function applyGridEvent(state: GridState, e: GridEvent): GridState {
  switch (e.type) {
    case "INIT":
      return {
        ...state,
        rows: e.rows,
        cols: e.cols,
        values: Array.from({ length: e.rows }, () => Array(e.cols).fill(null)),
      };
    case "SET_CELL": {
      const values = state.values.map((row) => [...row]);
      values[e.row][e.col] = e.value;
      return { ...state, values, activeCell: [e.row, e.col] };
    }
    case "COMPARE_CELL":
      return { ...state, activeCell: [e.row, e.col], dependsOn: e.dependsOn };
    case "MARK_FINAL":
      return { ...state, finalCell: [e.row, e.col] };
    default:
      return state;
  }
}
