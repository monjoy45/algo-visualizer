import { useState } from "react";
import { kadane, kadaneGen } from "../algorithms/arrays/kadane";
import { ArrayRenderer } from "../renderers/ArrayRenderer";
import { PlaybackControls } from "../components/PlaybackControls";
import { PseudocodePanel } from "../components/PseudocodePanel";
import { EventTicker } from "../components/EventTicker";
import { useAlgorithmRunner } from "../hooks/useAlgorithmRunner";
import { initArrayState, applyArrayEvent, type ArrayState } from "../engine/reducer";
import type { ArrayEvent } from "../types/events";
import { randomArray } from "../utils/random";

// NOTE: ArrayRenderer scales bar height as (value / max) * 100%, with no handling
// for negative values — a negative bar just collapses to the 4px min-height rather
// than rendering below a baseline. The numeric label above each bar is still
// correct, so the algorithm is fully legible, but the bar chart itself is visually
// misleading for negative entries. If you want a true above/below-baseline bar
// chart, ArrayRenderer needs a zero-line and signed-height support — that's a
// renderer change, intentionally left out of this drop-in file.
function randomSignedArray(size: number, min: number, max: number, seed?: number): number[] {
  return randomArray(size, min, max, seed);
}

export function KadaneVisualizer() {
  const [input, setInput] = useState<number[]>(() => randomSignedArray(10, -8, 12, 6));

  const { events, state, playback, currentStepId } = useAlgorithmRunner<ArrayState, ArrayEvent>(
    () => kadaneGen(input),
    initArrayState(input),
    applyArrayEvent,
    [input]
  );

  return (
    <div className="grid min-w-0 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="min-w-0">
        <ArrayRenderer state={state} />
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
        <PseudocodePanel lines={kadane.pseudocode} activeId={currentStepId} />
        <div className="flex items-center gap-2 border-t border-[var(--ink-700)] px-4 py-3">
          <button
            onClick={() => setInput(randomSignedArray(10, -8, 12))}
            className="rounded border border-[var(--ink-600)] px-3 py-1.5 text-xs text-[var(--paper-dim)] hover:border-[var(--signal-active)] hover:text-[var(--paper)]"
          >
            New random array
          </button>
        </div>
      </div>
      <div className="h-72 min-w-0 lg:h-auto">
        <EventTicker events={events} step={playback.step} />
      </div>
    </div>
  );
}