import { useMemo, useState } from "react";
import { linearRegression, linearRegressionGen, type LinearRegressionInput } from "../algorithms/ml/linearRegression";
import { CoordinatePlaneRenderer } from "../renderers/CoordinatePlaneRenderer";
import { PlaybackControls } from "../components/PlaybackControls";
import { PseudocodePanel } from "../components/PseudocodePanel";
import { EventTicker } from "../components/EventTicker";
import { usePlayback } from "../hooks/usePlayback";
import { runToEventLog } from "../engine/driver";
import type { MLEvent } from "../types/events";

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeInput(seed: number): LinearRegressionInput {
  const rand = mulberry32(seed);
  const trueSlope = 1.8;
  const trueIntercept = 8;
  const points = Array.from({ length: 14 }, () => {
    const x = rand() * 10;
    const noise = (rand() - 0.5) * 6;
    return { x, y: trueSlope * x + trueIntercept + noise };
  });
  return { points, learningRate: 0.006, iterations: 150 };
}

export function LinearRegressionVisualizer() {
  const [seed, setSeed] = useState(21);
  const input: LinearRegressionInput = useMemo(() => makeInput(seed), [seed]);

  const events = useMemo(() => runToEventLog(linearRegressionGen(input)) as MLEvent[], [input]);
  const playback = usePlayback({ totalSteps: events.length, baseIntervalMs: 120 });
  const snapshot = playback.step > 0 ? events[playback.step - 1]?.snapshot ?? null : null;

  return (
    <div className="grid min-w-0 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="min-w-0">
        <CoordinatePlaneRenderer snapshot={snapshot} />
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
        <PseudocodePanel lines={linearRegression.pseudocode} />
        <p className="px-4 py-2 font-mono text-[11px] text-[var(--paper-faint)]">
          The row of rings is the fitted line sampled at 12 points, not a solid stroke — watch it straighten into the
          fit as gradient descent converges.
        </p>
        <div className="flex items-center gap-2 border-t border-[var(--ink-700)] px-4 py-3">
          <button
            onClick={() => setSeed((s) => s + 1)}
            className="rounded border border-[var(--ink-600)] px-3 py-1.5 text-xs text-[var(--paper-dim)] hover:border-[var(--signal-active)] hover:text-[var(--paper)]"
          >
            New random points
          </button>
        </div>
      </div>
      <div className="h-72 min-w-0 lg:h-auto">
        <EventTicker events={events} step={playback.step} />
      </div>
    </div>
  );
}