import { useState } from "react";
import { reverseLinkedList, reverseLinkedListGen } from "../algorithms/linkedList/reverseLinkedList";
import { LinkedListRenderer } from "../renderers/LinkedListRenderer";
import { PlaybackControls } from "../components/PlaybackControls";
import { PseudocodePanel } from "../components/PseudocodePanel";
import { EventTicker } from "../components/EventTicker";
import { useAlgorithmRunner } from "../hooks/useAlgorithmRunner";
import { initLinkedListState, applyLinkedListEvent, type LinkedListState } from "../engine/reducer";
import type { LinkedListEvent } from "../types/events";
import { randomArray } from "../utils/random";

export function LinkedListReversalVisualizer() {
  const [input, setInput] = useState<number[]>(() => randomArray(6, 1, 50, 7));

  const { events, state, playback, currentStepId } = useAlgorithmRunner<LinkedListState, LinkedListEvent>(
    () => reverseLinkedListGen(input),
    initLinkedListState(),
    applyLinkedListEvent,
    [input]
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
        <PseudocodePanel lines={reverseLinkedList.pseudocode} activeId={currentStepId} />
        <div className="flex items-center gap-2 border-t border-[var(--ink-700)] px-4 py-3">
          <button
            onClick={() => setInput(randomArray(6, 1, 50))}
            className="rounded border border-[var(--ink-600)] px-3 py-1.5 text-xs text-[var(--paper-dim)] hover:border-[var(--signal-active)] hover:text-[var(--paper)]"
          >
            New random list
          </button>
        </div>
      </div>
      <div className="h-72 min-w-0 lg:h-auto">
        <EventTicker events={events} step={playback.step} />
      </div>
    </div>
  );
}