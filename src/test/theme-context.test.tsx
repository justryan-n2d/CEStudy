import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";
import { ThemeToggle } from "../components/ThemeToggle";

function ThemeProbe() {
  const { theme } = useTheme();
  return <output data-testid="current-theme">{theme}</output>;
}

function renderThemeControls() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
      <ThemeProbe />
    </ThemeProvider>,
  );
}

beforeEach(() => {
  window.localStorage.clear();
  delete document.documentElement.dataset.theme;
  document.documentElement.style.colorScheme = "";
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  delete document.documentElement.dataset.theme;
  document.documentElement.style.colorScheme = "";
});

describe("Light/Dark theme foundation", () => {
  it("defaults to Light and exposes explicit Light and Dark choices", () => {
    renderThemeControls();

    expect(screen.getByTestId("current-theme")).toHaveTextContent("light");
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(screen.getByRole("group", { name: "Color theme" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Light" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Dark" })).toHaveAttribute("aria-pressed", "false");
  });

  it("applies the Dark theme and updates the selected control state", async () => {
    const user = userEvent.setup();
    renderThemeControls();

    await user.click(screen.getByRole("button", { name: "Dark" }));

    expect(screen.getByTestId("current-theme")).toHaveTextContent("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.documentElement.style.colorScheme).toBe("dark");
    expect(screen.getByRole("button", { name: "Light" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Dark" })).toHaveAttribute("aria-pressed", "true");
  });

  it("persists the selected theme and restores it after a provider remount", async () => {
    const user = userEvent.setup();
    const firstRender = renderThemeControls();

    await user.click(screen.getByRole("button", { name: "Dark" }));

    expect(window.localStorage.getItem("cestudy:theme:v1")).toBe("dark");

    firstRender.unmount();
    delete document.documentElement.dataset.theme;
    document.documentElement.style.colorScheme = "";

    renderThemeControls();

    expect(screen.getByTestId("current-theme")).toHaveTextContent("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.documentElement.style.colorScheme).toBe("dark");
    expect(screen.getByRole("button", { name: "Dark" })).toHaveAttribute("aria-pressed", "true");
  });

  it("falls back to Light when the stored theme is invalid", () => {
    window.localStorage.setItem("cestudy:theme:v1", "sepia");

    renderThemeControls();

    expect(screen.getByTestId("current-theme")).toHaveTextContent("light");
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(screen.getByRole("button", { name: "Light" })).toHaveAttribute("aria-pressed", "true");
  });

  it("can return from Dark to Light without reloading", async () => {
    const user = userEvent.setup();
    renderThemeControls();

    await user.click(screen.getByRole("button", { name: "Dark" }));
    await user.click(screen.getByRole("button", { name: "Light" }));

    expect(screen.getByTestId("current-theme")).toHaveTextContent("light");
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(document.documentElement.style.colorScheme).toBe("light");
  });
});
