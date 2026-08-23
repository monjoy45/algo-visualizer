import { useCallback, useEffect, useRef, useState } from "react";

export type PlaybackStatus = "idle" | "playing" | "paused" | "finished";

interface UsePlaybackOptions {
  totalSteps: number;
  /** ms between steps at speed = 1 */
  baseIntervalMs?: number;
}

/**
 * A small explicit state machine. It only knows "what step am I on" —
 * it never touches events or reducers directly (Section 6/10).
 * Uses requestAnimationFrame rather than setInterval so tab-throttling
 * doesn't desync playback speed from wall-clock time.
 */
export function usePlayback({ totalSteps, baseIntervalMs = 500 }: UsePlaybackOptions) {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<PlaybackStatus>("idle");
  const [speed, setSpeed] = useState(1);

  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);

  const stepRef = useRef(step);
  stepRef.current = step;
  const speedRef = useRef(speed);
  speedRef.current = speed;

  useEffect(() => {
    if (status !== "playing") return;

    const tick = (now: number) => {
      const interval = baseIntervalMs / speedRef.current;
      if (now - lastTickRef.current >= interval) {
        lastTickRef.current = now;
        const next = stepRef.current + 1;
        if (next >= totalSteps) {
          setStep(totalSteps);
          setStatus("finished");
          return;
        }
        setStep(next);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [status, totalSteps, baseIntervalMs]);

  const play = useCallback(() => {
    if (totalSteps === 0) return;
    if (stepRef.current >= totalSteps) setStep(0);
    lastTickRef.current = performance.now();
    setStatus("playing");
  }, [totalSteps]);

  const pause = useCallback(() => setStatus("paused"), []);

  const reset = useCallback(() => {
    setStep(0);
    setStatus("idle");
  }, []);

  const stepForward = useCallback(() => {
    setStatus((s) => (s === "playing" ? "paused" : s));
    setStep((s) => Math.min(s + 1, totalSteps));
  }, [totalSteps]);

  const stepBackward = useCallback(() => {
    setStatus((s) => (s === "playing" ? "paused" : s));
    setStep((s) => Math.max(s - 1, 0));
  }, []);

  const seek = useCallback(
    (target: number) => {
      setStatus((s) => (s === "playing" ? "paused" : s));
      setStep(Math.max(0, Math.min(target, totalSteps)));
    },
    [totalSteps]
  );

  return { step, status, speed, setSpeed, play, pause, reset, stepForward, stepBackward, seek };
}
