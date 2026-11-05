import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PracticeWorkspace } from "../components/PracticeWorkspace";

describe("PracticeWorkspace", () => {
  it("keeps the question primary and renders no tools panel or trigger when tools are absent", () => {
    render(
      <PracticeWorkspace>
        <h2>TEST PRACTICE QUESTION</h2>
        <p>TEST QUESTION CONTENT</p>
      </PracticeWorkspace>,
    );

    expect(screen.getByRole("heading", { name: "TEST PRACTICE QUESTION" })).toBeInTheDocument();
    expect(screen.getByText("TEST QUESTION CONTENT")).toBeInTheDocument();
    expect(screen.queryByRole("complementary", { name: "Practice tools" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Open practice tools" })).not.toBeInTheDocument();
  });

  it("exposes supplied tools as a distinct desktop workspace region", () => {
    render(
      <PracticeWorkspace tools={<button type="button">TEST TOOL ACTION</button>}>
        <h2>TEST PRACTICE QUESTION</h2>
      </PracticeWorkspace>,
    );

    expect(screen.getByRole("heading", { name: "TEST PRACTICE QUESTION" })).toBeInTheDocument();
    const tools = screen.getByRole("complementary", { name: "Practice tools" });
    expect(within(tools).getByRole("heading", { name: "Practice tools" })).toBeInTheDocument();
    expect(within(tools).getByRole("button", { name: "TEST TOOL ACTION" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open practice tools" })).toHaveAttribute("aria-controls", tools.id);
  });

  it("makes the question content and trigger inert while the mobile tools sheet is open", async () => {
    const user = userEvent.setup();
    render(
      <PracticeWorkspace tools={<button type="button">TEST TOOL ACTION</button>}>
        <h2>TEST PRACTICE QUESTION</h2>
      </PracticeWorkspace>,
    );

    const trigger = screen.getByRole("button", { name: "Open practice tools" });
    await user.click(trigger);

    expect(screen.getByTestId("practice-workspace-content")).toHaveAttribute("inert");
    expect(trigger).toHaveAttribute("inert");
    expect(screen.getByRole("dialog", { name: "Practice tools" })).toHaveAttribute("aria-modal", "true");
  });

  it("traps focus and keeps an inaccessible exit state until the mobile sheet slides closed", async () => {
    const user = userEvent.setup();
    render(
      <PracticeWorkspace tools={<button type="button">TEST TOOL ACTION</button>}>
        <h2>TEST PRACTICE QUESTION</h2>
      </PracticeWorkspace>,
    );

    const trigger = screen.getByRole("button", { name: "Open practice tools" });
    await user.click(trigger);

    const dialog = screen.getByRole("dialog", { name: "Practice tools" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    const close = within(dialog).getByRole("button", { name: "Close practice tools" });
    const toolAction = within(dialog).getByRole("button", { name: "TEST TOOL ACTION" });
    expect(close).toHaveFocus();

    await user.keyboard("{Tab}");
    expect(toolAction).toHaveFocus();
    await user.keyboard("{Tab}");
    expect(close).toHaveFocus();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog", { name: "Practice tools" })).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).not.toHaveFocus();

    const sheet = document.querySelector(".practice-workspace__tools");
    const backdrop = document.querySelector(".practice-workspace__backdrop");
    expect(sheet).toHaveClass("is-closing");
    expect(sheet).toHaveAttribute("aria-hidden", "true");
    expect(sheet).toHaveAttribute("inert");
    expect(backdrop).toHaveClass("is-closing");
    expect(screen.getByTestId("practice-workspace-content")).toHaveAttribute("inert");

    const transitionEnd = new Event("transitionend", { bubbles: true });
    Object.defineProperty(transitionEnd, "propertyName", { value: "transform" });
    await act(async () => {
      sheet?.dispatchEvent(transitionEnd);
    });

    await waitFor(() => expect(sheet).not.toHaveClass("is-closing"));
    expect(screen.getByTestId("practice-workspace-content")).not.toHaveAttribute("inert");
    expect(trigger).not.toHaveAttribute("inert");
    expect(trigger).toHaveFocus();
    expect(document.querySelector(".practice-workspace__backdrop")).not.toBeInTheDocument();
  });

  it("closes the mobile tools sheet when its backdrop is activated and completes the exit transition", async () => {
    const user = userEvent.setup();
    render(
      <PracticeWorkspace tools={<button type="button">TEST TOOL ACTION</button>}>
        <h2>TEST PRACTICE QUESTION</h2>
      </PracticeWorkspace>,
    );

    const trigger = screen.getByRole("button", { name: "Open practice tools" });
    await user.click(trigger);
    expect(screen.getByRole("dialog", { name: "Practice tools" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close practice tools backdrop" }));

    expect(screen.queryByRole("dialog", { name: "Practice tools" })).not.toBeInTheDocument();
    const sheet = document.querySelector(".practice-workspace__tools");
    expect(sheet).toHaveClass("is-closing");

    const transitionEnd = new Event("transitionend", { bubbles: true });
    Object.defineProperty(transitionEnd, "propertyName", { value: "transform" });
    await act(async () => {
      sheet?.dispatchEvent(transitionEnd);
    });

    await waitFor(() => expect(sheet).not.toHaveClass("is-closing"));
    expect(trigger).toHaveFocus();
  });
});
