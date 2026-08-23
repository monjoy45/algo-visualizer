import { useState } from "react";
import { knapsack, knapsackGen, type KnapsackInput } from "../algorithms/dp/knapsack";
import { GridRenderer } from "../renderers/GridRenderer";
import { PlaybackControls } from "../components/PlaybackControls";
import { PseudocodePanel } from "../components/PseudocodePanel";
import { EventTicker } from "../components/EventTicker";
import { useAlgorithmRunner } from "../hooks/useAlgorithmRunner";
import { initGridState, applyGridEvent, type GridState } from "../engine/reducer";
import type { GridEvent } from "../types/events";

const DEFAULT_INPUT: KnapsackInput = {
  weights: [2, 3, 4, 5],
  values: [3, 4, 5, 6],
  capacity: 8,
};

export function KnapsackVisualizer() {
  const [input] = useState<KnapsackInput>(DEFAULT_INPUT);

  const { events, state, playback, currentStepId } = useAlgorithmRunner<GridState, GridEvent>(
    () => knapsackGen(input),
    initGridState(),
    applyGridEvent,
    [input]
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
        <PseudocodePanel lines={knapsack.pseudocode} activeId={currentStepId} />
      </div>
      <div className="h-72 min-w-0 lg:h-auto">
        <EventTicker events={events} step={playback.step} />
      </div>
    </div>
  );
}
