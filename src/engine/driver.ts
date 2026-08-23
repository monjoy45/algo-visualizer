import type { EventGenerator, VizEvent } from "../types/events";

/**
 * Runs an algorithm generator to completion and materializes its event log.
 * Kept separate from the reducer: the driver only knows how to collect events,
 * never how to interpret them.
 */
export function runToEventLog(gen: EventGenerator, maxEvents = 200_000): VizEvent[] {
  const log: VizEvent[] = [];
  let result = gen.next();
  while (!result.done) {
    log.push(result.value);
    if (log.length >= maxEvents) {
      throw new Error(
        `Algorithm produced more than ${maxEvents} events — likely an infinite loop in the generator.`
      );
    }
    result = gen.next();
  }
  return log;
}
