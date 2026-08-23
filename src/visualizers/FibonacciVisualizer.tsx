import { useState } from "react";
import { fibonacci, fibonacciGen } from "../algorithms/dp/fibonacci";
import { GridRenderer } from "../renderers/GridRenderer";
import { PlaybackControls } from "../components/PlaybackControls";
import { PseudocodePanel } from "../components/PseudocodePanel";
import { EventTicker } from "../components/EventTicker";
import { useAlgorithmRunner } from "../hooks/useAlgorithmRunner";
import { initGridState, applyGridEvent, type GridState } from "../engine/reducer";
import type { GridEvent } from "../types/events";

export function FibonacciVisualizer() {
  const [n, setN] = useState(10);

  const { events, state, playback, currentStepId } = useAlgorithmRunner<GridState, GridEvent>(
    () => fibonacciGen(n),
    initGridState(),
    applyGridEvent,
    [n]
  );

  return (
    <div className="grid min-w-0 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="min-w-0">
        <GridRenderer state={state} />
        <PlaybackControls
          step={playback.step}
          totalSteps={events.length}
          status={playback.status}
          speed={playback.speed}
          onPlay={playback.play}
          onPause={playback.pause}
          onReset={playback.reset}
          onStepForward={playback.stepForward}
          onStepBackward={playback.stepBackward}
          onSeek={playback.seek}
          onSpeedChange={playback.setSpeed}
        />
        <PseudocodePanel lines={fibonacci.pseudocode} activeId={currentStepId} />
        <div className="flex items-center gap-2 border-t border-[var(--ink-700)] px-4 py-3">
          <label className="font-mono text-xs text-[var(--paper-dim)]" htmlFor="fib-n">
            n =
          </label>
          <input
            id="fib-n"
            type="number"
            min={2}
            max={15}
            value={n}
            onChange={(e) => setN(Math.min(15, Math.max(2, Number(e.target.value) || 2)))}
            className="w-16 rounded border border-[var(--ink-600)] bg-[var(--ink-800)] px-2 py-1 text-xs text-[var(--paper)]"
          />
        </div>
      </div>
      <div className="h-72 min-w-0 lg:h-auto">
        <EventTicker events={events} step={playback.step} />
      </div>
    </div>
  );
}