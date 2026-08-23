import { linkedListOps, linkedListOpsGen, type LinkedListInput } from "../algorithms/linkedList/linkedListOps";
import { LinkedListRenderer } from "../renderers/LinkedListRenderer";
import { PlaybackControls } from "../components/PlaybackControls";
import { PseudocodePanel } from "../components/PseudocodePanel";
import { EventTicker } from "../components/EventTicker";
import { useAlgorithmRunner } from "../hooks/useAlgorithmRunner";
import { initLinkedListState, applyLinkedListEvent, type LinkedListState } from "../engine/reducer";
import type { LinkedListEvent } from "../types/events";

const input: LinkedListInput = {
  values: [12, 27, 5, 41, 8],
  insertValue: 99,
  insertAfterIndex: 1,
  deleteIndex: 3,
};

export function LinkedListVisualizer() {
  const { events, state, playback, currentStepId } = useAlgorithmRunner<LinkedListState, LinkedListEvent>(
    () => linkedListOpsGen(input),
    initLinkedListState(),
    applyLinkedListEvent,
    []
  );

  return (
    <div className="grid min-w-0 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="min-w-0">
        <LinkedListRenderer state={state} />
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
        <PseudocodePanel lines={linkedListOps.pseudocode} activeId={currentStepId} />
      </div>
      <div className="h-72 min-w-0 lg:h-auto">
        <EventTicker events={events} step={playback.step} />
      </div>
    </div>
  );
}
