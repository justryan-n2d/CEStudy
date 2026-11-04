import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { useState } from "react";
import { Modal } from "../components/Modal";
import stylesheet from "../styles/global.css?raw";

afterEach(() => cleanup());

function ModalHarness() {
  const [open, setOpen] = useState(true);
  return open
    ? <Modal title="Details" onClose={() => setOpen(false)}><p>Details content</p></Modal>
    : <p>Dialog closed</p>;
}

describe("modal enter and exit motion", () => {
  it("plays the closing state before unmounting when close is requested", async () => {
    const user = userEvent.setup();
    render(<ModalHarness />);
    await user.click(screen.getByRole("button", { name: "Close dialog" }));
    expect(screen.getByRole("dialog")).toHaveClass("is-closing");
    expect(screen.getByRole("presentation")).toHaveClass("is-closing");
    expect(await screen.findByText("Dialog closed")).toBeInTheDocument();
  });

  it("defines short enter and exit animations and respects reduced motion", () => {
    expect(stylesheet).toContain("@keyframes ce-modal-panel-in");
    expect(stylesheet).toContain("@keyframes ce-modal-panel-out");
    expect(stylesheet).toContain(".modal-panel.is-closing");
    expect(stylesheet).toContain("@media(prefers-reduced-motion:reduce){.modal-backdrop,.modal-panel{animation:none!important}}");
  });
});
