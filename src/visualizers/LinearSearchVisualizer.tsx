import { useState } from "react";
import { linearSearch, linearSearchGen, type LinearSearchInput } from "../algorithms/searching/linearSearch";
import { ArrayRenderer } from "../renderers/ArrayRenderer";
import { PlaybackControls } from "../components/PlaybackControls";
import { PseudocodePanel } from "../components/PseudocodePanel";
import { EventTicker } from "../components/EventTicker";
import { useAlgorithmRunner } from "../hooks/useAlgorithmRunner";
import { initArrayState, applyArrayEvent, type ArrayState } from "../engine/reducer";
import type { ArrayEvent } from "../types/events";
import { randomArray } from "../utils/random";

function makeInput(seed?: number): LinearSearchInput {
  const values = randomArray(10, 5, 95, seed);
  const target = values[Math.floor(Math.random() * values.length)];
  return { values, target };
}

export function LinearSearchVisualizer() {
  const [input, setInput] = useState<LinearSearchInput>(() => makeInput(4));

  const { events, state, playback, currentStepId } = useAlgorithmRunner<ArrayState, ArrayEvent>(
    () => linearSearchGen(input),
    initArrayState(input.values),
    applyArrayEvent,
    [input]
  );

  return (
    <div className="grid min-w-0 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="min-w-0">
        <div className="px-4 pt-3 font-mono text-xs text-[var(--paper-dim)]">
          Searching for target = <span className="text-[var(--signal-active)]">{input.target}</span>
        </div>
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
        <PseudocodePanel lines={linearSearch.pseudocode} activeId={currentStepId} />
        <div className="flex items-center gap-2 border-t border-[var(--ink-700)] px-4 py-3">
          <button
            onClick={() => setInput(makeInput())}
            className="rounded border border-[var(--ink-600)] px-3 py-1.5 text-xs text-[var(--paper-dim)] hover:border-[var(--signal-active)] hover:text-[var(--paper)]"
          >
            New random array + target
          </button>
        </div>
      </div>
      <div className="h-72 min-w-0 lg:h-auto">
        <EventTicker events={events} step={playback.step} />
      </div>
    </div>
  );
}