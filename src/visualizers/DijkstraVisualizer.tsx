import { useState } from "react";
import { dijkstra, dijkstraGen, type WeightedGraphInput } from "../algorithms/graphs/dijkstra";
import { GraphRenderer } from "../renderers/GraphRenderer";
import { PlaybackControls } from "../components/PlaybackControls";
import { PseudocodePanel } from "../components/PseudocodePanel";
import { EventTicker } from "../components/EventTicker";
import { useAlgorithmRunner } from "../hooks/useAlgorithmRunner";
import { initGraphState, applyGraphEvent, type GraphState } from "../engine/reducer";
import type { GraphEvent } from "../types/events";

const DEFAULT_INPUT: WeightedGraphInput = {
  nodes: [
    { id: "A", label: "A" },
    { id: "B", label: "B" },
    { id: "C", label: "C" },
    { id: "D", label: "D" },
    { id: "E", label: "E" },
    { id: "F", label: "F" },
  ],
  edges: [
    { source: "A", target: "B", weight: 4 },
    { source: "A", target: "C", weight: 2 },
    { source: "B", target: "D", weight: 5 },
    { source: "C", target: "D", weight: 8 },
    { source: "C", target: "F", weight: 10 },
    { source: "D", target: "E", weight: 2 },
    { source: "E", target: "F", weight: 3 },
  ],
  startId: "A",
};

export function DijkstraVisualizer() {
  const [input] = useState<WeightedGraphInput>(DEFAULT_INPUT);

  const { events, state, playback, currentStepId } = useAlgorithmRunner<GraphState, GraphEvent>(
    () => dijkstraGen(input),
    initGraphState(),
    applyGraphEvent,
    [input]
  );

  return (
    <div className="grid min-w-0 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="min-w-0">
        <GraphRenderer state={state} structureLabel="frontier" />
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
        <PseudocodePanel lines={dijkstra.pseudocode} activeId={currentStepId} />
        <p className="px-4 py-2 font-mono text-[11px] text-[var(--paper-faint)]">
          Edge weights: A–B 4, A–C 2, B–D 5, C–D 8, C–F 10, D–E 2, E–F 3
        </p>
      </div>
      <div className="h-72 min-w-0 lg:h-auto">
        <EventTicker events={events} step={playback.step} />
      </div>
    </div>
  );
}