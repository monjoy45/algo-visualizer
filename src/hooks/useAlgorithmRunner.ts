import { useMemo } from "react";
import { runToEventLog } from "../engine/driver";
import { SnapshotEngine } from "../engine/snapshot";
import { usePlayback } from "./usePlayback";
import type { EventGenerator, VizEvent } from "../types/events";

/**
 * The one hook that composes: generator -> event log -> snapshot engine -> playback.
 * This is the only seam between engine/ and React (Section 9's design constraint).
 */
export function useAlgorithmRunner<TState, TEvent extends VizEvent>(
  makeGenerator: () => EventGenerator,
  initialState: TState,
  applyEvent: (state: TState, event: TEvent) => TState,
  deps: unknown[]
) {
  const events = useMemo(() => runToEventLog(makeGenerator()) as TEvent[], deps); // eslint-disable-line react-hooks/exhaustive-deps

  const engine = useMemo(() => new SnapshotEngine(events, initialState, applyEvent), [events]); // eslint-disable-line react-hooks/exhaustive-deps

  const playback = usePlayback({ totalSteps: events.length });
  const state = useMemo(() => engine.stateAt(playback.step), [engine, playback.step]);
  const currentEvent = playback.step > 0 ? events[playback.step - 1] : undefined;
  const currentStepId = currentEvent && "stepId" in currentEvent ? currentEvent.stepId : undefined;

  return { events, state, playback, currentStepId };
}
