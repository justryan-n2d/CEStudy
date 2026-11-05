import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

const mocks = vi.hoisted(() => ({
  token: null as string | null,
  fetchContentReviewBundle: vi.fn(),
  updateContentReviewStatus: vi.fn(),
  unlockContentReview: vi.fn(),
  lockContentReview: vi.fn(),
}));
vi.mock("../data/content-review-api", () => ({
  CONTENT_REVIEW_SESSION_EVENT: "test-content-review-session",
  getContentReviewSessionToken: () => mocks.token,
  fetchContentReviewBundle: mocks.fetchContentReviewBundle,
  updateContentReviewStatus: mocks.updateContentReviewStatus,
  unlockContentReview: mocks.unlockContentReview,
  lockContentReview: mocks.lockContentReview,
}));

import { ContentReviewPage } from "../pages/ContentReviewPage";

const reviewBundle = {
  lessons: [{
    id: "algebra-foundations-unit-00",
    subjectSlug: "basic-algebra",
    unitNumber: 0,
    slug: "readiness-diagnostic",
    title: "Readiness Diagnostic: Find the Skills to Review",
    learningObjectives: ["Identify prerequisite gaps."],
    lessonMarkdown: "# RETIRED DIAGNOSTIC",
    sourceNote: "Retired legacy fixture.",
    status: "retired" as const,
    reviewNotes: "Retired by owner decision.",
    reviewedAt: null,
    updatedAt: "2026-11-05T00:00:00.000Z",
  }, {
    id: "algebra-foundations-unit-04",
    subjectSlug: "basic-algebra",
    unitNumber: 0,
    slug: "solving-linear-equations",
    title: "Solving Linear Equations",
    learningObjectives: ["Solve multi-step equations and verify solutions."],
    lessonMarkdown: "# Solving Linear Equations\n\nApply equivalent operations to both sides.",
    sourceNote: "Synthetic college-level lesson fixture.",
    status: "needs-review" as const,
    reviewNotes: "Awaiting human academic review.",
    reviewedAt: null,
    updatedAt: "2026-11-05T00:00:00.000Z",
  }],
  questions: [{
    id: "algebra-foundations-u00-q01",
    subjectSlug: "basic-algebra",
    topic: "Synthetic question topic",
    prompt: "TEST QUESTION PROMPT",
    choices: ["TEST OPTION A", "TEST OPTION B"],
    correctAnswer: "TEST OPTION B",
    solutionSteps: ["TEST STEP ONE", "TEST STEP TWO"],
    explanation: "TEST ANSWER EXPLANATION",
    sourceNote: "Synthetic test fixture.",
    status: "needs-review" as const,
    reviewNotes: "",
    reviewedAt: null,
    updatedAt: "2026-10-18T00:00:00.000Z",
    displayOrder: 9,
  }],
};

beforeEach(() => {
  mocks.token = null;
  mocks.unlockContentReview.mockReset().mockImplementation(async () => { mocks.token = "test-owner-token"; });
  mocks.lockContentReview.mockReset().mockImplementation(() => { mocks.token = null; });
  mocks.updateContentReviewStatus.mockReset();
  mocks.fetchContentReviewBundle.mockReset().mockResolvedValue(structuredClone(reviewBundle));
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("owner content review", () => {
  it("does not show lesson drafts before owner unlock", () => {
    render(<MemoryRouter><ContentReviewPage /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: "Unlock content review" })).toBeInTheDocument();
    expect(screen.queryByText("TEST DRAFT BODY")).not.toBeInTheDocument();
    expect(mocks.fetchContentReviewBundle).not.toHaveBeenCalled();
  });

  it("unlocks before loading a private draft and requires explicit review confirmation", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ContentReviewPage /></MemoryRouter>);
    await user.type(screen.getByLabelText("Owner access key"), "test-owner-access-key-at-least-32-characters");
    await user.click(screen.getByRole("button", { name: "Unlock review" }));

    expect(await screen.findByRole("heading", { name: "Solving Linear Equations" })).toBeInTheDocument();
    expect(await screen.findByText("Apply equivalent operations to both sides.")).toBeInTheDocument();
    const verifyButton = screen.getByRole("button", { name: "Mark verified" });
    expect(verifyButton).toBeDisabled();

    await user.click(screen.getByRole("checkbox", { name: /I reviewed this lesson against the approved syllabus/i }));
    expect(verifyButton).toBeEnabled();
  });

  it("lets the owner save corrected lesson text while keeping it in review", async () => {
    const user = userEvent.setup();
    mocks.updateContentReviewStatus.mockResolvedValue({ status: "needs-review", catalogAvailabilitySync: true });
    render(<MemoryRouter><ContentReviewPage /></MemoryRouter>);
    await user.type(screen.getByLabelText("Owner access key"), "test-owner-access-key-at-least-32-characters");
    await user.click(screen.getByRole("button", { name: "Unlock review" }));
    await screen.findByRole("heading", { name: "Solving Linear Equations" });

    await waitFor(() => expect(screen.getByLabelText("Lesson title")).toHaveValue("Solving Linear Equations"));
    await user.clear(screen.getByLabelText("Lesson title"));
    await user.type(screen.getByLabelText("Lesson title"), "Corrected Solving Linear Equations");
    await user.click(screen.getByRole("button", { name: "Save edits, keep unpublished" }));

    await waitFor(() => expect(mocks.updateContentReviewStatus).toHaveBeenCalledWith(
      "lesson",
      "algebra-foundations-unit-04",
      "save-edits",
      "Awaiting human academic review.",
      expect.objectContaining({ title: "Corrected Solving Linear Equations" }),
    ));
    expect(await screen.findByText(/edits saved.*remains unpublished/i)).toBeVisible();
  });

  it("prevents verification when lesson edits have not been saved", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ContentReviewPage /></MemoryRouter>);
    await user.type(screen.getByLabelText("Owner access key"), "test-owner-access-key-at-least-32-characters");
    await user.click(screen.getByRole("button", { name: "Unlock review" }));
    await screen.findByRole("heading", { name: "Solving Linear Equations" });
    await waitFor(() => expect(screen.getByLabelText("Lesson title")).toHaveValue("Solving Linear Equations"));

    await user.click(screen.getByRole("checkbox", { name: /I reviewed this lesson against the approved syllabus/i }));
    const verifyButton = screen.getByRole("button", { name: "Mark verified" });
    expect(verifyButton).toBeEnabled();

    await user.clear(screen.getByLabelText("Lesson title"));
    await user.type(screen.getByLabelText("Lesson title"), "Changed but not saved");
    expect(verifyButton).toBeDisabled();
    expect(screen.getByRole("status")).toHaveTextContent(/unsaved changes/i);
    expect(mocks.updateContentReviewStatus).not.toHaveBeenCalledWith(
      "lesson", "algebra-foundations-unit-04", "verify", expect.anything(), expect.anything(),
    );
  });

  it("shows question answer details only when the owner expands them", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ContentReviewPage /></MemoryRouter>);
    await user.type(screen.getByLabelText("Owner access key"), "test-owner-access-key-at-least-32-characters");
    await user.click(screen.getByRole("button", { name: "Unlock review" }));
    await screen.findByRole("heading", { name: "Solving Linear Equations" });
    await user.click(screen.getByRole("tab", { name: /Practice questions/i }));

    expect((await screen.findAllByText("TEST QUESTION PROMPT")).length).toBeGreaterThan(0);
    expect(screen.getByText("Correct answer:")).not.toBeVisible();
    await user.click(screen.getByText("Show answer key and solution"));
    expect(screen.getByText("Correct answer:")).toBeVisible();
    expect(screen.getByText("TEST ANSWER EXPLANATION", { selector: "p" })).toBeVisible();
  });
  it("excludes the retired diagnostic and does not display unit numbers", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ContentReviewPage /></MemoryRouter>);
    await user.type(screen.getByLabelText("Owner access key"), "test-owner-access-key-at-least-32-characters");
    await user.click(screen.getByRole("button", { name: "Unlock review" }));

    expect(await screen.findByRole("heading", { name: "Solving Linear Equations" })).toBeInTheDocument();
    expect(screen.queryByText(/Readiness Diagnostic/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Unit \d+$/)).not.toBeInTheDocument();
  });

});