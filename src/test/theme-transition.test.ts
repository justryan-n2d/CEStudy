import type { MouseEvent } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { toggleTheme } from "../utils/toggleTheme";

function createClickEvent(clientX = 120, clientY = 240): MouseEvent<HTMLButtonElement> {
  const button = document.createElement("button");
  button.getBoundingClientRect = () => ({
    x: 20,
    y: 30,
    left: 20,
    top: 30,
    right: 120,
    bottom: 70,
    width: 100,
    height: 40,
    toJSON: () => ({}),
  });

  const event = new MouseEvent("click", { clientX, clientY });
  Object.defineProperty(event, "currentTarget", { configurable: true, value: button });
  return event as unknown as MouseEvent<HTMLButtonElement>;
}

function installViewTransition() {
  const startViewTransition = vi.fn((update: () => void) => {
    update();
    return { ready: Promise.resolve() };
  });

  Object.defineProperty(document, "startViewTransition", {
    configurable: true,
    value: startViewTransition,
  });

  return startViewTransition;
}

function installRootAnimation() {
  const animate = vi.fn();
  Object.defineProperty(document.documentElement, "animate", {
    configurable: true,
    value: animate,
  });
  return animate;
}

beforeEach(() => {
  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: false }));
});

afterEach(() => {
  Reflect.deleteProperty(document, "startViewTransition");
  Reflect.deleteProperty(document.documentElement, "animate");
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("theme view-transition animation", () => {
  it("reveals the next theme from the click position without delaying the theme update", async () => {
    const startViewTransition = installViewTransition();
    const animate = installRootAnimation();
    const apply = vi.fn();

    toggleTheme(createClickEvent(), apply);

    expect(startViewTransition).toHaveBeenCalledOnce();
    expect(startViewTransition).toHaveBeenCalledWith(apply);
    expect(apply).toHaveBeenCalledOnce();

    await Promise.resolve();

    const radius = Math.hypot(904, 528);
    expect(animate).toHaveBeenCalledWith(
      {
        clipPath: [
          "circle(0 at 120px 240px)",
          `circle(${radius}px at 120px 240px)`,
        ],
      },
      {
        duration: 600,
        easing: "cubic-bezier(.65,0,.35,1)",
        pseudoElement: "::view-transition-new(root)",
      },
    );
  });

  it("applies the theme immediately when reduced motion is requested", () => {
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: true }));
    const startViewTransition = installViewTransition();
    const animate = installRootAnimation();
    const apply = vi.fn();

    toggleTheme(createClickEvent(), apply);

    expect(apply).toHaveBeenCalledOnce();
    expect(startViewTransition).not.toHaveBeenCalled();
    expect(animate).not.toHaveBeenCalled();
  });

  it("applies the theme immediately when View Transitions are unsupported", () => {
    const apply = vi.fn();

    toggleTheme(createClickEvent(), apply);

    expect(apply).toHaveBeenCalledOnce();
  });
});
