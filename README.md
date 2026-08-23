# Algorithm Visualizer

A visual debugger fused with an interactive CS textbook — built per the architecture in
`final-architecture-report.md` / `algorithm-taxonomy.md`.

## What's implemented

**Algorithm generator → Event log → Snapshot engine → Reducer → Renderer**, with a
separate playback state machine (`idle/playing/paused/finished`) driven by
`requestAnimationFrame`, and an event ticker (debugger-trace style) as an
independent consumer of the event log.

| Algorithm | Primitive | File |
|---|---|---|
| Bubble Sort | 1D array | `src/algorithms/sorting/bubbleSort.ts` |
| Insertion Sort | 1D array | `src/algorithms/sorting/insertionSort.ts` |
| Merge Sort | 1D array | `src/algorithms/sorting/mergeSort.ts` |
| Binary Search | 1D array | `src/algorithms/searching/binarySearch.ts` |
| Linked List (insert/delete/traverse) | Node-and-arrow (SVG) | `src/algorithms/linkedList/linkedListOps.ts` |
| Binary Search Tree | Node-link tree (d3-hierarchy) | `src/algorithms/trees/bst.ts` |
| Breadth-First Search | Node-link graph (d3-force) | `src/algorithms/graphs/bfs.ts` |
| Depth-First Search | Node-link graph (d3-force) | `src/algorithms/graphs/dfs.ts` |
| 0/1 Knapsack | DP grid/table | `src/algorithms/dp/knapsack.ts` |
| K-Means | Coordinate plane (snapshot-per-iteration model) | `src/algorithms/ml/kmeans.ts` |

Each has: a pure generator (no DOM, no React), a metadata object with pseudocode,
and a visualizer page combining its renderer + playback controls + pseudocode
sync + event ticker.

## Fixed: layout "sliding left" during playback

**Root cause:** `main` and the per-visualizer grid (`grid-cols-[1fr_280px]`) never
set `min-width: 0`. Flexbox/grid items default to `min-width: auto`, so as an SVG
grew during playback (a linked list gaining nodes, a tree filling in), its
intrinsic width forced the *whole layout* wider than the viewport. Since the outer
shell clips with `overflow-hidden`, that extra width got pushed off-screen, and
because the content column is centered with `mx-auto`, the visible portion
appeared to drift left as the widget grew — hiding exactly the interaction you're
trying to watch.

**Fix:** `min-w-0` added at every level of the chain that can force overflow —
`main` in `App.tsx`, the card wrapper in `VisualizerPage.tsx`, and both columns of
each visualizer's grid — plus `overflow-x-hidden` on `main` as a backstop. Wide
content now scrolls *inside* its own bounded box (each renderer already had its
own `overflow-x-auto`) instead of expanding the page around it.

## UI/UX changes in this pass

- Spacebar toggles play/pause (ignored while focus is in a form control)
- Scrubber shows a filled progress track instead of a flat bar
- A "run complete" indicator appears when playback finishes
- Sidebar now groups algorithms by category with a tier badge, instead of one flat list
- Visualizer page has a back link, a colored category chip, and complexity shown as pills
- Home page is a responsive two-column grid (was a single column, cramped at 10 entries)

## Folder structure

```
src/
  types/        event protocol + algorithm metadata types
  engine/       driver, snapshot engine, category reducers (no React here)
  algorithms/   pure generators, one file per algorithm
  renderers/    one component per primitive (Array/LinkedList/Tree/Graph/Grid/CoordinatePlane)
  visualizers/  thin per-algorithm composition of renderer + controls
  components/   PlaybackControls, PseudocodePanel, EventTicker, Sidebar
  hooks/        usePlayback, useAlgorithmRunner — the only seam into React
  data/         algorithmsList.ts — the single registry new algorithms get added to
  pages/        HomePage, VisualizerPage
  utils/        seeded random generator
```

Adding a new algorithm still means: write a generator + metadata, a thin
visualizer, and one line in `src/data/algorithmsList.ts`. It never requires
touching `engine/` or an existing renderer.

## Running it

```bash
npm install
npm run dev       # start dev server
npm run build     # type-check + production build
npm run test      # smoke tests — renders + exercises every visualizer
```

## What's NOT built yet

Dijkstra, A*, N-Queens, and other later-tier algorithms from the taxonomy;
Variable Inspector; Comparison Mode; full accessibility pass (structured text
alternatives for graphs, `aria-live` throttling); Web Worker/virtualization
performance work. All explicitly later phases in the report — not started here.
