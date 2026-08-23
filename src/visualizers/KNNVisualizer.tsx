import { useMemo, useState } from "react";
import { knn, knnGen, type KNNInput } from "../algorithms/ml/knn";
import { CoordinatePlaneRenderer } from "../renderers/CoordinatePlaneRenderer";
import { PlaybackControls } from "../components/PlaybackControls";
import { PseudocodePanel } from "../components/PseudocodePanel";
import { EventTicker } from "../components/EventTicker";
import { usePlayback } from "../hooks/usePlayback";
import { runToEventLog } from "../engine/driver";
import type { MLEvent } from "../types/events";
import { randomArray } from "../utils/random";

const NUM_CLASSES = 3;

function makeInput(seed: number): KNNInput {
  const xs = randomArray(30, 0, 100, seed);
  const ys = randomArray(30, 0, 100, seed + 1);
  const labels = randomArray(30, 0, NUM_CLASSES - 1, seed + 2);
  const trainingPoints = xs.map((x, i) => ({ x, y: ys[i], label: labels[i] }));
  const query = { x: randomArray(1, 10, 90, seed + 3)[0], y: randomArray(1, 10, 90, seed + 4)[0] };
  return { trainingPoints, query, k: 5 };
}

function predictLabel(input: KNNInput): number {
  const scored = input.trainingPoints
    .map((p) => ({ label: p.label, dist: Math.hypot(p.x - input.query.x, p.y - input.query.y) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, input.k);
  const votes = new Map<number, number>();
  for (const s of scored) votes.set(s.label, (votes.get(s.label) ?? 0) + 1);
  return [...votes.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

export function KNNVisualizer() {
  const [seed, setSeed] = useState(11);
  const input: KNNInput = useMemo(() => makeInput(seed), [seed]);

  const events = useMemo(() => runToEventLog(knnGen(input)) as MLEvent[], [input]);
  const playback = usePlayback({ totalSteps: events.length, baseIntervalMs: 500 });
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
        <PseudocodePanel lines={knn.pseudocode} />
        <p className="px-4 py-2 font-mono text-[11px] text-[var(--paper-faint)]">
          k = {input.k} — the first ring is the query point; the other rings are the current k-nearest set. Predicted
          class once all points are scanned: {predictLabel(input)}
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