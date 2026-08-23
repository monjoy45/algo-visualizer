import { useEffect } from "react";
import type { PlaybackStatus } from "../hooks/usePlayback";

interface Props {
  step: number;
  totalSteps: number;
  status: PlaybackStatus;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onSeek: (step: number) => void;
  onSpeedChange: (speed: number) => void;
}

const SPEEDS = [0.5, 1, 2, 4];

export function PlaybackControls({
  step,
  totalSteps,
  status,
  speed,
  onPlay,
  onPause,
  onReset,
  onStepForward,
  onStepBackward,
  onSeek,
  onSpeedChange,
}: Props) {
  const isPlaying = status === "playing";
  const isFinished = status === "finished";
  const progressPct = totalSteps === 0 ? 0 : (step / totalSteps) * 100;

  // Spacebar toggles play/pause — but only when focus isn't inside a form
  // control, so it doesn't fight with the scrubber or a speed button.
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.code !== "Space") return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) return;
      e.preventDefault();
      if (isPlaying) onPause();
      else onPlay();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, onPlay, onPause]);

  return (
    <div className="flex flex-col gap-2.5 border-t border-[var(--ink-700)] bg-[var(--ink-900)] px-4 py-3">
      <div className="flex items-center gap-3">
        <button
          onClick={onReset}
          aria-label="Reset to start"
          className="rounded p-1.5 text-[var(--paper-dim)] hover:bg-[var(--ink-700)] hover:text-[var(--paper)]"
        >
          <IconReset />
        </button>
        <button
          onClick={onStepBackward}
          disabled={step === 0}
          aria-label="Step backward"
          className="rounded p-1.5 text-[var(--paper-dim)] hover:bg-[var(--ink-700)] hover:text-[var(--paper)] disabled:opacity-30"
        >
          <IconPrev />
        </button>
        <button
          onClick={isPlaying ? onPause : onPlay}
          disabled={totalSteps === 0}
          aria-label={isPlaying ? "Pause" : "Play"}
          title="Space to play/pause"
          className="rounded-full bg-gradient-to-b from-[var(--accent-bright)] to-[var(--accent-deep)] p-2 text-[var(--ink-950)] shadow-[0_2px_12px_-2px_rgba(201,113,63,0.6)] transition-transform hover:scale-105 disabled:scale-100 disabled:opacity-30 disabled:shadow-none"
        >
          {isPlaying ? <IconPause /> : <IconPlay />}
        </button>
        <button
          onClick={onStepForward}
          disabled={step >= totalSteps}
          aria-label="Step forward"
          className="rounded p-1.5 text-[var(--paper-dim)] hover:bg-[var(--ink-700)] hover:text-[var(--paper)] disabled:opacity-30"
        >
          <IconNext />
        </button>

        <input
          type="range"
          min={0}
          max={totalSteps}
          value={step}
          onChange={(e) => onSeek(Number(e.target.value))}
          style={{
            background: `linear-gradient(to right, var(--accent) ${progressPct}%, var(--ink-700) ${progressPct}%)`,
          }}
          className="mx-2 h-1.5 flex-1 cursor-pointer appearance-none rounded-full accent-[var(--accent)]"
          aria-label="Scrub to step"
        />

        <span className="w-20 shrink-0 text-right font-mono text-xs text-[var(--paper-dim)]">
          {step} / {totalSteps}
        </span>

        <div className="flex shrink-0 items-center gap-1 font-mono text-xs">
          {SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`rounded px-1.5 py-0.5 ${
                speed === s ? "bg-[var(--accent)] text-[var(--ink-950)]" : "text-[var(--paper-faint)] hover:text-[var(--paper)]"
              }`}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>
      {isFinished && (
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--signal-done)]">
          <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
            <path d="M6.4 11.2 3.5 8.3l1.1-1.1 1.8 1.8 4.6-4.6 1.1 1.1z" />
          </svg>
          run complete — scrub back or reset to replay
        </div>
      )}
    </div>
  );
}

function IconPlay() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M4 2.5v11l10-5.5-10-5.5z" />
    </svg>
  );
}
function IconPause() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <rect x="3" y="2.5" width="3.5" height="11" />
      <rect x="9.5" y="2.5" width="3.5" height="11" />
    </svg>
  );
}
function IconPrev() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M4 2v12h1.5V8.9L13 14V2L5.5 7.1V2H4z" />
    </svg>
  );
}
function IconNext() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M12 2v12h-1.5V8.9L3 14V2l7.5 5.1V2H12z" />
    </svg>
  );
}
function IconReset() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 2a6 6 0 104.9 2.55l-1.14.94A4.5 4.5 0 118 3.5V6l4-3-4-3v2z" />
    </svg>
  );
}