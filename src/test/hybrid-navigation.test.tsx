import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Layout } from "../components/Layout";

function renderLayout(path = "/") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Layout>
        <Routes>
          <Route path="*" element={<h1>Test destination</h1>} />
        </Routes>
      </Layout>
    </MemoryRouter>,
  );
}

afterEach(() => cleanup());

describe("CEStudy sidebar navigation", () => {
  it("places the menu control immediately before the master logo", () => {
    renderLayout();

    const header = document.querySelector(".site-header");
    const trigger = screen.getByRole("button", { name: "Open navigation menu" });
    const brand = screen.getByRole("link", { name: "CEStudy home" });

    expect(header?.firstElementChild?.firstElementChild).toBe(trigger);
    expect(trigger.compareDocumentPosition(brand) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("opens one consistent navigation drawer with available destinations and preferences", async () => {
    const user = userEvent.setup();
    renderLayout();

    await user.click(screen.getByRole("button", { name: "Open navigation menu" }));

    const drawer = screen.getByRole("dialog", { name: "CEStudy navigation" });
    const navigation = within(drawer).getByRole("navigation", { name: "CEStudy pages" });
    expect(drawer).toHaveAttribute("aria-modal", "true");

    for (const label of [
      "Home",
      "Subject Catalog",
      "Year Levels",
      "Math Foundations",
      "Progress",
      "About us",
      "Contact CEStudy",
      "Support us",
      "Report a bug",
      "Send feedback",
      "Privacy notice",
    ]) {
      expect(within(navigation).getByRole("link", { name: label })).toBeInTheDocument();
    }

    for (const unavailable of ["Review Materials Hub", "Mock Exam Portal", "Community Forum"]) {
      expect(within(navigation).queryByRole("link", { name: unavailable })).not.toBeInTheDocument();
    }

    expect(within(navigation).getAllByRole("link", { name: "Subject Catalog" })).toHaveLength(1);
    const theme = within(drawer).getByRole("group", { name: "Color theme" });
    expect(within(theme).getByRole("button", { name: "Light" })).toBeInTheDocument();
    expect(within(theme).getByRole("button", { name: "Dark" })).toBeInTheDocument();
  });

  it("closes on Escape and returns focus to the menu trigger", async () => {
    const user = userEvent.setup();
    renderLayout();

    const trigger = screen.getByRole("button", { name: "Open navigation menu" });
    await user.click(trigger);
    expect(screen.getByRole("dialog", { name: "CEStudy navigation" })).toBeInTheDocument();

    await user.keyboard("{Escape}");

    await waitFor(() => expect(screen.queryByRole("dialog", { name: "CEStudy navigation" })).not.toBeInTheDocument());
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });

  it("closes when the backdrop is clicked and restores focus", async () => {
    const user = userEvent.setup();
    renderLayout();

    const trigger = screen.getByRole("button", { name: "Open navigation menu" });
    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "Close navigation menu" }));

    await waitFor(() => expect(screen.queryByRole("dialog", { name: "CEStudy navigation" })).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it("marks the learning destination active and closes after route navigation", async () => {
    const user = userEvent.setup();
    renderLayout("/study/basic-algebra/1");

    await user.click(screen.getByRole("button", { name: "Open navigation menu" }));
    const drawer = screen.getByRole("dialog", { name: "CEStudy navigation" });
    expect(within(drawer).getByRole("link", { name: "Subject Catalog" })).toHaveClass("active");

    await user.click(within(drawer).getByRole("link", { name: "Subject Catalog" }));

    await waitFor(() => expect(screen.queryByRole("dialog", { name: "CEStudy navigation" })).not.toBeInTheDocument());
    await waitFor(() => expect(screen.getByRole("main")).toHaveFocus());
  });
});
