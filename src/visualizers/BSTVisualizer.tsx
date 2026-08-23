import { useState } from "react";
import { bst, bstGen, type BSTInput } from "../algorithms/trees/bst";
import { TreeRenderer } from "../renderers/TreeRenderer";
import { PlaybackControls } from "../components/PlaybackControls";
import { PseudocodePanel } from "../components/PseudocodePanel";
import { EventTicker } from "../components/EventTicker";
import { useAlgorithmRunner } from "../hooks/useAlgorithmRunner";
import { initTreeState, applyTreeEvent, type TreeState } from "../engine/reducer";
import type { TreeEvent } from "../types/events";

const DEFAULT_INPUT: BSTInput = { values: [50, 30, 70, 20, 40, 60, 80, 35], searchValue: 60 };

export function BSTVisualizer() {
  const [input] = useState<BSTInput>(DEFAULT_INPUT);

  const { events, state, playback, currentStepId } = useAlgorithmRunner<TreeState, TreeEvent>(
    () => bstGen(input),
    initTreeState(),
    applyTreeEvent,
    [input]
  );

  return (
    <div className="grid min-w-0 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="min-w-0">
        <TreeRenderer state={state} />
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
        <PseudocodePanel lines={bst.pseudocode} activeId={currentStepId} />
      </div>
      <div className="h-72 min-w-0 lg:h-auto">
        <EventTicker events={events} step={playback.step} />
      </div>
    </div>
  );
}
