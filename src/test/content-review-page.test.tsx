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
    title: "Readiness Diagnostic Test",
    learningObjectives: ["Identify prerequisite gaps"],
    lessonMarkdown: "# TEST DRAFT BODY\n\nPrivate lesson test content.",
    sourceNote: "Synthetic test fixture.",
    status: "needs-review" as const,
    reviewNotes: "",
    reviewedAt: null,
    updatedAt: "2026-10-18T00:00:00.000Z",
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

    expect(await screen.findByRole("heading", { name: "Readiness Diagnostic Test" })).toBeInTheDocument();
    expect(await screen.findByText("TEST DRAFT BODY")).toBeInTheDocument();
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
    await screen.findByRole("heading", { name: "Readiness Diagnostic Test" });

    await user.clear(screen.getByLabelText("Lesson title"));
    await user.type(screen.getByLabelText("Lesson title"), "Corrected Readiness Diagnostic");
    await user.click(screen.getByRole("button", { name: "Save edits, keep unpublished" }));

    await waitFor(() => expect(mocks.updateContentReviewStatus).toHaveBeenCalledWith(
      "lesson",
      "algebra-foundations-unit-00",
      "save-edits",
      "",
      expect.objectContaining({ title: "Corrected Readiness Diagnostic" }),
    ));
    expect(await screen.findByRole("status")).toHaveTextContent(/edits saved.*remains unpublished/i);
  });

  it("shows question answer details only when the owner expands them", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ContentReviewPage /></MemoryRouter>);
    await user.type(screen.getByLabelText("Owner access key"), "test-owner-access-key-at-least-32-characters");
    await user.click(screen.getByRole("button", { name: "Unlock review" }));
    await screen.findByRole("heading", { name: "Readiness Diagnostic Test" });
    await user.click(screen.getByRole("tab", { name: /Practice questions/i }));

    expect((await screen.findAllByText("TEST QUESTION PROMPT")).length).toBeGreaterThan(0);
    expect(screen.getByText("Correct answer:")).not.toBeVisible();
    await user.click(screen.getByText("Show answer key and solution"));
    expect(screen.getByText("Correct answer:")).toBeVisible();
    expect(screen.getByText("TEST ANSWER EXPLANATION", { selector: "p" })).toBeVisible();
  });
});
