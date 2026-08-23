import { useState } from "react";
import { lcs, lcsGen, type LCSInput } from "../algorithms/dp/lcs";
import { GridRenderer } from "../renderers/GridRenderer";
import { PlaybackControls } from "../components/PlaybackControls";
import { PseudocodePanel } from "../components/PseudocodePanel";
import { EventTicker } from "../components/EventTicker";
import { useAlgorithmRunner } from "../hooks/useAlgorithmRunner";
import { initGridState, applyGridEvent, type GridState } from "../engine/reducer";
import type { GridEvent } from "../types/events";

const DEFAULT_INPUT: LCSInput = { a: "ABCBDAB", b: "BDCABA" };
const MAX_LEN = 10;

export function LCSVisualizer() {
  const [input, setInput] = useState<LCSInput>(DEFAULT_INPUT);

  const { events, state, playback, currentStepId } = useAlgorithmRunner<GridState, GridEvent>(
    () => lcsGen(input),
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
        <PseudocodePanel lines={lcs.pseudocode} activeId={currentStepId} />
        <div className="flex flex-wrap items-center gap-3 border-t border-[var(--ink-700)] px-4 py-3">
          <label className="flex items-center gap-2 font-mono text-xs text-[var(--paper-dim)]">
            A =
            <input
              type="text"
              value={input.a}
              maxLength={MAX_LEN}
              onChange={(e) => setInput({ ...input, a: e.target.value.toUpperCase().slice(0, MAX_LEN) })}
              className="w-28 rounded border border-[var(--ink-600)] bg-[var(--ink-800)] px-2 py-1 text-xs text-[var(--paper)]"
            />
          </label>
          <label className="flex items-center gap-2 font-mono text-xs text-[var(--paper-dim)]">
            B =
            <input
              type="text"
              value={input.b}
              maxLength={MAX_LEN}
              onChange={(e) => setInput({ ...input, b: e.target.value.toUpperCase().slice(0, MAX_LEN) })}
              className="w-28 rounded border border-[var(--ink-600)] bg-[var(--ink-800)] px-2 py-1 text-xs text-[var(--paper)]"
            />
          </label>
        </div>
      </div>
      <div className="h-72 min-w-0 lg:h-auto">
        <EventTicker events={events} step={playback.step} />
      </div>
    </div>
  );
}