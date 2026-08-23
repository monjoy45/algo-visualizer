import { useState } from "react";
import { binarySearch, binarySearchGen, type BinarySearchInput } from "../algorithms/searching/binarySearch";
import { ArrayRenderer } from "../renderers/ArrayRenderer";
import { PlaybackControls } from "../components/PlaybackControls";
import { PseudocodePanel } from "../components/PseudocodePanel";
import { EventTicker } from "../components/EventTicker";
import { useAlgorithmRunner } from "../hooks/useAlgorithmRunner";
import { initArrayState, applyArrayEvent, type ArrayState } from "../engine/reducer";
import type { ArrayEvent } from "../types/events";

const DEFAULT_INPUT: BinarySearchInput = { values: [4, 9, 15, 22, 30, 41, 48, 55, 63, 70], target: 48 };

export function BinarySearchVisualizer() {
  const [input] = useState<BinarySearchInput>(DEFAULT_INPUT);

  const { events, state, playback, currentStepId } = useAlgorithmRunner<ArrayState, ArrayEvent>(
    () => binarySearchGen(input),
    initArrayState(input.values),
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
        <PseudocodePanel lines={binarySearch.pseudocode} activeId={currentStepId} />
        <div className="border-t border-[var(--ink-700)] px-4 py-3 font-mono text-xs text-[var(--paper-faint)]">
          searching for <span className="text-[var(--signal-compare)]">{input.target}</span> in a sorted array
        </div>
      </div>
      <div className="h-72 min-w-0 lg:h-auto">
        <EventTicker events={events} step={playback.step} />
      </div>
    </div>
  );
}
