import { useState } from "react";
import { coinChange, coinChangeGen, type CoinChangeInput } from "../algorithms/dp/coinChange";
import { GridRenderer } from "../renderers/GridRenderer";
import { PlaybackControls } from "../components/PlaybackControls";
import { PseudocodePanel } from "../components/PseudocodePanel";
import { EventTicker } from "../components/EventTicker";
import { useAlgorithmRunner } from "../hooks/useAlgorithmRunner";
import { initGridState, applyGridEvent, type GridState } from "../engine/reducer";
import type { GridEvent } from "../types/events";

const DEFAULT_INPUT: CoinChangeInput = { coins: [1, 3, 4], amount: 10 };

export function CoinChangeVisualizer() {
  const [input, setInput] = useState<CoinChangeInput>(DEFAULT_INPUT);

  const { events, state, playback, currentStepId } = useAlgorithmRunner<GridState, GridEvent>(
    () => coinChangeGen(input),
    initGridState(),
    applyGridEvent,
    [input]
  );

  return (
    <div className="grid min-w-0 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="min-w-0">
        <div className="px-4 pt-3 font-mono text-xs text-[var(--paper-dim)]">
          coins = [{input.coins.join(", ")}]
        </div>
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
        <PseudocodePanel lines={coinChange.pseudocode} activeId={currentStepId} />
        <div className="flex items-center gap-2 border-t border-[var(--ink-700)] px-4 py-3">
          <label className="font-mono text-xs text-[var(--paper-dim)]" htmlFor="coin-amount">
            amount =
          </label>
          <input
            id="coin-amount"
            type="number"
            min={1}
            max={20}
            value={input.amount}
            onChange={(e) =>
              setInput({ ...input, amount: Math.min(20, Math.max(1, Number(e.target.value) || 1)) })
            }
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