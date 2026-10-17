import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ScrollReveal } from "../components/ScrollReveal";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("ScrollReveal", () => {
  it("shows content immediately when IntersectionObserver is unavailable", async () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    render(<ScrollReveal><p>Useful content</p></ScrollReveal>);
    const wrapper = screen.getByText("Useful content").parentElement;
    await waitFor(() => expect(wrapper).toHaveAttribute("data-reveal-state", "visible"));
  });

  it("reveals the section when it first enters the viewport, then unobserves it", async () => {
    const observerBox: { current: TestIntersectionObserver | null } = { current: null };
    class TestIntersectionObserver {
      readonly observed: Element[] = [];
      readonly unobserved: Element[] = [];
      constructor(private callback: IntersectionObserverCallback) { observerBox.current = this; }
      observe(target: Element) { this.observed.push(target); }
      unobserve(target: Element) { this.unobserved.push(target); }
      disconnect() {}
      reveal() {
        const target = this.observed[0];
        if (!target) throw new Error("No target was observed.");
        const rectangle = target.getBoundingClientRect();
        this.callback([{
          isIntersecting: true, target, intersectionRatio: 0.2,
          boundingClientRect: rectangle, intersectionRect: rectangle,
          rootBounds: null, time: 1,
        }], this as unknown as IntersectionObserver);
      }
    }

    vi.stubGlobal("IntersectionObserver", TestIntersectionObserver);
    render(<ScrollReveal><p>Section heading</p></ScrollReveal>);
    const wrapper = screen.getByText("Section heading").parentElement;
    expect(wrapper).toHaveAttribute("data-reveal-state", "waiting");
    observerBox.current?.reveal();
    await waitFor(() => expect(wrapper).toHaveAttribute("data-reveal-state", "visible"));
    expect(observerBox.current?.unobserved).toContain(wrapper);
  });
});
