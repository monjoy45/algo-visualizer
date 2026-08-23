import { useState } from "react";
import { mergeSort, mergeSortGen } from "../algorithms/sorting/mergeSort";
import { ArrayRenderer } from "../renderers/ArrayRenderer";
import { PlaybackControls } from "../components/PlaybackControls";
import { PseudocodePanel } from "../components/PseudocodePanel";
import { EventTicker } from "../components/EventTicker";
import { useAlgorithmRunner } from "../hooks/useAlgorithmRunner";
import { initArrayState, applyArrayEvent, type ArrayState } from "../engine/reducer";
import type { ArrayEvent } from "../types/events";
import { randomArray } from "../utils/random";

export function MergeSortVisualizer() {
  const [input, setInput] = useState<number[]>(() => randomArray(12, 5, 95, 11));

  const { events, state, playback, currentStepId } = useAlgorithmRunner<ArrayState, ArrayEvent>(
    () => mergeSortGen(input),
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
        <PseudocodePanel lines={mergeSort.pseudocode} activeId={currentStepId} />
        <div className="flex items-center gap-2 border-t border-[var(--ink-700)] px-4 py-3">
          <button
            onClick={() => setInput(randomArray(12, 5, 95))}
            className="rounded-md border border-[var(--ink-600)] bg-[var(--ink-800)] px-3 py-1.5 text-xs text-[var(--paper-dim)] transition-colors hover:border-[var(--signal-active)]/50 hover:bg-[var(--ink-700)] hover:text-[var(--paper)]"
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
