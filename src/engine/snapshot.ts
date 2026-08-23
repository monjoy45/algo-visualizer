/**
 * Event log + periodic snapshots (Section 8/ADR-3).
 * Not full snapshots per step (memory-heavy for long logs), not pure
 * replay-from-start (slow scrubbing on long logs) — snapshot every
 * `interval` steps, then replay forward from the nearest snapshot.
 */
export class SnapshotEngine<TState, TEvent> {
  private events: TEvent[];
  private initialState: TState;
  private applyEvent: (state: TState, event: TEvent) => TState;
  private interval: number;
  private snapshots: { step: number; state: TState }[] = [];

  constructor(
    events: TEvent[],
    initialState: TState,
    applyEvent: (state: TState, event: TEvent) => TState,
    interval = 50
  ) {
    this.events = events;
    this.initialState = initialState;
    this.applyEvent = applyEvent;
    this.interval = interval;
    this.buildSnapshots();
  }

  private buildSnapshots() {
    let state = this.initialState;
    this.snapshots.push({ step: 0, state });
    for (let i = 0; i < this.events.length; i++) {
      state = this.applyEvent(state, this.events[i]);
      if ((i + 1) % this.interval === 0) {
        this.snapshots.push({ step: i + 1, state });
      }
    }
  }

  /** State immediately after `step` events have been applied (0 = initial state). */
  stateAt(step: number): TState {
    const clamped = Math.max(0, Math.min(step, this.events.length));
    // Find nearest snapshot at or before the target step.
    let lo = 0;
    let hi = this.snapshots.length - 1;
    let best = this.snapshots[0];
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (this.snapshots[mid].step <= clamped) {
        best = this.snapshots[mid];
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    let state = best.state;
    for (let i = best.step; i < clamped; i++) {
      state = this.applyEvent(state, this.events[i]);
    }
    return state;
  }

  get totalSteps() {
    return this.events.length;
  }
}
