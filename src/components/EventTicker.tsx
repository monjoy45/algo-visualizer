import { useEffect, useRef } from "react";
import type { VizEvent } from "../types/events";

function describe(e: VizEvent): string {
  switch (e.category) {
    case "array":
      switch (e.type) {
        case "COMPARE":
          return `compare  a[${e.indices[0]}] , a[${e.indices[1]}]`;
        case "SWAP":
          return `swap     a[${e.indices[0]}] <-> a[${e.indices[1]}]`;
        case "SET":
          return `set      a[${e.index}] = ${e.value}`;
        case "MARK_SORTED":
          return `sorted   a[${e.index}]`;
        case "HIGHLIGHT_RANGE":
          return `range    [${e.low}, ${e.high}]${e.mid !== undefined ? ` mid=${e.mid}` : ""}`;
        case "CLEAR_HIGHLIGHT":
          return `clear    highlight`;
      }
      break;
    case "linkedList":
      switch (e.type) {
        case "INIT":
          return `init     list`;
        case "VISIT":
          return `visit    ${e.id}`;
        case "INSERT":
          return `insert   ${e.id} = ${e.value}`;
        case "DELETE":
          return `delete   ${e.id}`;
        case "POINTER":
          return `pointer  ${e.label} -> ${e.id ?? "null"}`;
      }
      break;
    case "tree":
      switch (e.type) {
        case "INSERT_NODE":
          return `insert   node ${e.id} = ${e.value}`;
        case "VISIT":
          return `visit    ${e.id}`;
        case "COMPARE":
          return `compare  ${e.id} vs ${e.value}`;
        case "FOUND":
          return `found    ${e.id}`;
        case "NOT_FOUND":
          return `not found`;
      }
      break;
    case "graph":
      switch (e.type) {
        case "INIT":
          return `init     graph`;
        case "VISIT":
          return `visit    ${e.id}`;
        case "ENQUEUE":
          return `+        ${e.id}`;
        case "DEQUEUE":
          return `-        ${e.id}`;
        case "RELAX_EDGE":
          return `relax    ${e.source} -> ${e.target}`;
        case "MARK_VISITED":
          return `visited  ${e.id}`;
      }
      break;
    case "grid":
      switch (e.type) {
        case "INIT":
          return `init     table`;
        case "SET_CELL":
          return `dp[${e.row}][${e.col}] = ${e.value}`;
        case "COMPARE_CELL":
          return `dp[${e.row}][${e.col}]  <-  ${e.dependsOn.map(([r, c]) => `dp[${r}][${c}]`).join(", ")}`;
        case "MARK_FINAL":
          return `answer   dp[${e.row}][${e.col}]`;
      }
      break;
    case "ml":
      return `iter ${e.snapshot.iteration}  ${e.snapshot.converged ? "converged" : "reassign + recenter"}`;
    case "callStack":
      switch (e.type) {
        case "PUSH":
          return `call     ${e.frame}`;
        case "POP":
          return `return`;
      }
      break;
  }
  return (e as VizEvent).type;
}

export function EventTicker({ events, step }: { events: VizEvent[]; step: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll ONLY this panel's own list, never the page. scrollIntoView() was
  // used before, but it walks up every scrollable ancestor (including the
  // <main> the visualizer sits in) and drags the whole page down to keep the
  // ticker line visible — pulling focus off the visualization on every step.
  // Computing scrollTop by hand and calling scrollTo() on this container
  // keeps the effect fully local to the event-trace panel.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const activeEl = el.querySelector<HTMLElement>(`[data-idx="${step - 1}"]`);
    if (!activeEl) return;

    const containerRect = el.getBoundingClientRect();
    const activeRect = activeEl.getBoundingClientRect();

    const elTop = activeRect.top - containerRect.top + el.scrollTop;
    const elBottom = elTop + activeRect.height;

    if (elTop < el.scrollTop) {
      el.scrollTo({ top: elTop, behavior: "smooth" });
    } else if (elBottom > el.scrollTop + el.clientHeight) {
      el.scrollTo({ top: elBottom - el.clientHeight, behavior: "smooth" });
    }
  }, [step]);

  const visible = events.slice(0, Math.max(step, 0));

  return (
    <div className="flex h-full flex-col border-l border-[var(--ink-700)] bg-[var(--ink-900)]">
      <div className="flex items-center gap-1.5 border-b border-[var(--ink-700)] px-3 py-2.5">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--signal-active-bright)" }} aria-hidden />
        <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--paper-faint)]">
          Event trace
        </span>
      </div>
      <div ref={containerRef} className="flex-1 overflow-y-auto px-2 py-2 font-mono text-[11px] leading-6">
        {visible.length === 0 && <div className="px-1 text-[var(--paper-faint)]">— press play —</div>}
        {visible.map((e, i) => {
          const isActive = i === step - 1;
          return (
            <div
              key={i}
              data-idx={i}
              className={`flex gap-2 rounded px-1.5 py-px transition-colors ${
                isActive
                  ? "bg-[var(--signal-active)]/12 text-[var(--paper)] ring-1 ring-inset ring-[var(--signal-active)]/25"
                  : "text-[var(--paper-dim)]"
              }`}
            >
              <span className="w-8 shrink-0 text-right text-[var(--paper-faint)]">{i + 1}</span>
              <span className="truncate">{describe(e)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}