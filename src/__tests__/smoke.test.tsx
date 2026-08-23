import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ALGORITHMS } from "../data/algorithmsList";
import { VisualizerPage } from "../pages/VisualizerPage";
import App from "../App";

describe("App shell", () => {
  it("renders the home page by default", () => {
    render(<App />);
    expect(screen.getByText("Algorithm Visualizer")).toBeTruthy();
  });
});

describe.each(ALGORITHMS)("$meta.name", ({ meta }) => {
  it("renders and can step forward without throwing", () => {
    const { container } = render(<VisualizerPage id={meta.id} />);
    expect(container.textContent).toContain(meta.name);

    const stepBtn = screen.getByLabelText("Step forward");
    // Step forward several times to exercise the reducer/snapshot engine.
    for (let i = 0; i < 15; i++) {
      fireEvent.click(stepBtn);
    }
    expect(container).toBeTruthy();
  });

  it("can play to completion via the scrubber without throwing", () => {
    const { getByLabelText } = render(<VisualizerPage id={meta.id} />);
    const slider = getByLabelText("Scrub to step") as HTMLInputElement;
    const max = Number(slider.max);
    fireEvent.change(slider, { target: { value: String(max) } });
    expect(slider.value).toBe(String(max));
  });
});
