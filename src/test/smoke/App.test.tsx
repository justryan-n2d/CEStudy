import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "../../App";

describe("CEStudy app shell", () => {
  it("renders identity, accessible sidebar navigation, and the main landmark", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole("link", { name: /CEStudy home/i })).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Build your CE foundation/i })).toBeInTheDocument();

    const menuButton = screen.getByRole("button", { name: "Open navigation menu" });
    expect(menuButton).toBeInTheDocument();
    await user.click(menuButton);

    const drawer = screen.getByRole("dialog", { name: "CEStudy navigation" });
    expect(within(drawer).getByRole("navigation", { name: "CEStudy pages" })).toBeInTheDocument();
    expect(menuButton).toHaveAttribute("aria-expanded", "true");
  });
});
