import type { EventGenerator, EventCategory } from "./events";

export interface PseudocodeLine {
  id: string;
  text: string;
  indent: number;
}

export interface AlgorithmMetadataBase {
  id: string;
  name: string;
  category: EventCategory;
  tier: "A" | "B";
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  pseudocode: PseudocodeLine[];
}

export interface AlgorithmDefinition<TInput = unknown> extends AlgorithmMetadataBase {
  /** Pure generator — takes validated input, yields VizEvents. No DOM, no React. */
  run: (input: TInput) => EventGenerator;
}
