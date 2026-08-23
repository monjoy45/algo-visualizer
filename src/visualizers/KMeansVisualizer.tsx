import { useMemo, useState } from "react";
import { kmeans, kmeansGen, type KMeansInput } from "../algorithms/ml/kmeans";
import { CoordinatePlaneRenderer } from "../renderers/CoordinatePlaneRenderer";
import { PlaybackControls } from "../components/PlaybackControls";
import { PseudocodePanel } from "../components/PseudocodePanel";
import { EventTicker } from "../components/EventTicker";
import { usePlayback } from "../hooks/usePlayback";
import { runToEventLog } from "../engine/driver";
import type { MLEvent } from "../types/events";
import { randomArray } from "../utils/random";

function makePoints(seed: number) {
  const xs = randomArray(40, 0, 100, seed);
  const ys = randomArray(40, 0, 100, seed + 1);
  return xs.map((x, i) => ({ x, y: ys[i] }));
}

export function KMeansVisualizer() {
  const [seed, setSeed] = useState(7);
  const input: KMeansInput = useMemo(() => ({ points: makePoints(seed), k: 3, maxIterations: 12, seed }), [seed]);

  // ML uses a fundamentally different temporal model: each event already
  // carries the full snapshot, so there is no incremental reducer to run —
  // state at step k is simply events[k - 1].snapshot (Section 3/8).
  const events = useMemo(() => runToEventLog(kmeansGen(input)) as MLEvent[], [input]);
  const playback = usePlayback({ totalSteps: events.length, baseIntervalMs: 900 });
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
        <PseudocodePanel lines={kmeans.pseudocode} />
        <div className="flex items-center gap-2 border-t border-[var(--ink-700)] px-4 py-3">
          <button
            onClick={() => setSeed((s) => s + 1)}
            className="rounded-md border border-[var(--ink-600)] bg-[var(--ink-800)] px-3 py-1.5 text-xs text-[var(--paper-dim)] transition-colors hover:border-[var(--signal-active)]/50 hover:bg-[var(--ink-700)] hover:text-[var(--paper)]"
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
