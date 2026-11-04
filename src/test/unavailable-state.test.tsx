import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { UnavailableState } from "../components/UnavailableState";

describe("UnavailableState", () => {
  it("shows the supplied cloud-disconnect illustration, contextual message, and retry action", () => {
    const onRetry = vi.fn();
    render(
      <UnavailableState
        title="Catalog unavailable"
        message="The subject catalog could not be loaded. Check your connection and try again."
        onRetry={onRetry}
      />,
    );

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Catalog unavailable");
    expect(alert).toHaveTextContent("Check your connection and try again.");
    expect(screen.getByTestId("unavailable-state-illustration")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
    expect(onRetry).not.toHaveBeenCalled();
  });

  it("runs the supplied retry action only after the student activates Retry", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(
      <UnavailableState
        title="Practice unavailable"
        message="Practice questions could not be loaded."
        onRetry={onRetry}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Retry" }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("keeps an optional secondary navigation action below Retry", () => {
    render(
      <UnavailableState
        title="Subject unavailable"
        message="The subject details could not be loaded."
        onRetry={vi.fn()}
        secondaryAction={<a href="/catalog">Return to subjects</a>}
      />,
    );

    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Return to subjects" })).toHaveAttribute("href", "/catalog");
  });

  it("renders the disconnect artwork as real inline SVG paths, not an external CSS mask", () => {
    render(
      <UnavailableState
        title="Catalog unavailable"
        message="The subject catalog could not be loaded."
        onRetry={vi.fn()}
      />,
    );

    const illustration = screen.getByTestId("unavailable-state-illustration");
    expect(illustration.tagName.toLowerCase()).toBe("svg");
    expect(illustration).toHaveAttribute("viewBox", "0 0 24 24");
    expect(illustration.querySelectorAll("path")).toHaveLength(3);
    expect([...illustration.querySelectorAll("path")].every((path) =>
      path.getAttribute("fill") === "currentColor"
    )).toBe(true);
  });
});
