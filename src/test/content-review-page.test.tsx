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
    learningObjectives: ["Identify prerequisite gaps", "Check prerequisite skills"],
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

    await waitFor(() => expect(screen.getByLabelText("Lesson title")).toHaveValue("Readiness Diagnostic Test"));
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
    expect(await screen.findByText(/edits saved.*remains unpublished/i)).toBeVisible();
  });

  it("prevents verification when lesson edits have not been saved", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ContentReviewPage /></MemoryRouter>);
    await user.type(screen.getByLabelText("Owner access key"), "test-owner-access-key-at-least-32-characters");
    await user.click(screen.getByRole("button", { name: "Unlock review" }));
    await screen.findByRole("heading", { name: "Readiness Diagnostic Test" });
    await waitFor(() => expect(screen.getByLabelText("Lesson title")).toHaveValue("Readiness Diagnostic Test"));

    await user.click(screen.getByRole("checkbox", { name: /I reviewed this lesson against the approved syllabus/i }));
    const verifyButton = screen.getByRole("button", { name: "Mark verified" });
    expect(verifyButton).toBeEnabled();

    await user.clear(screen.getByLabelText("Lesson title"));
    await user.type(screen.getByLabelText("Lesson title"), "Changed but not saved");
    expect(verifyButton).toBeDisabled();
    expect(screen.getByRole("status")).toHaveTextContent(/unsaved changes/i);
    expect(mocks.updateContentReviewStatus).not.toHaveBeenCalledWith(
      "lesson", "algebra-foundations-unit-00", "verify", expect.anything(), expect.anything(),
    );
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

  it("loads lesson objectives, choices, and solution steps with real line breaks", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ContentReviewPage /></MemoryRouter>);
    await user.type(screen.getByLabelText("Owner access key"), "test-owner-access-key-at-least-32-characters");
    await user.click(screen.getByRole("button", { name: "Unlock review" }));
    await screen.findByRole("heading", { name: "Readiness Diagnostic Test" });

    await waitFor(() => expect(screen.getByLabelText(/Learning objectives/)).toHaveValue(
      "Identify prerequisite gaps\nCheck prerequisite skills",
    ));
    await user.click(screen.getByRole("tab", { name: /Practice questions/i }));
    await waitFor(() => {
      expect(screen.getByLabelText(/Answer choices/)).toHaveValue("TEST OPTION A\nTEST OPTION B");
      expect(screen.getByLabelText(/Worked solution steps/)).toHaveValue("TEST STEP ONE\nTEST STEP TWO");
    });
  });

  it("saves each edited multiline objective as a separate item", async () => {
    const user = userEvent.setup();
    mocks.updateContentReviewStatus.mockResolvedValue({ status: "needs-review", catalogAvailabilitySync: true });
    render(<MemoryRouter><ContentReviewPage /></MemoryRouter>);
    await user.type(screen.getByLabelText("Owner access key"), "test-owner-access-key-at-least-32-characters");
    await user.click(screen.getByRole("button", { name: "Unlock review" }));
    await screen.findByRole("heading", { name: "Readiness Diagnostic Test" });

    const objectives = screen.getByLabelText(/Learning objectives/);
    await user.clear(objectives);
    await user.type(objectives, "First revised objective{enter}Second revised objective");
    await user.click(screen.getByRole("button", { name: "Save edits, keep unpublished" }));

    await waitFor(() => expect(mocks.updateContentReviewStatus).toHaveBeenCalledWith(
      "lesson",
      "algebra-foundations-unit-00",
      "save-edits",
      "",
      expect.objectContaining({ learningObjectives: ["First revised objective", "Second revised objective"] }),
    ));
  });

  it("saves multiline question choices and solution steps as arrays", async () => {
    const user = userEvent.setup();
    mocks.updateContentReviewStatus.mockResolvedValue({ status: "needs-review", catalogAvailabilitySync: true });
    render(<MemoryRouter><ContentReviewPage /></MemoryRouter>);
    await user.type(screen.getByLabelText("Owner access key"), "test-owner-access-key-at-least-32-characters");
    await user.click(screen.getByRole("button", { name: "Unlock review" }));
    await screen.findByRole("heading", { name: "Readiness Diagnostic Test" });
    await user.click(screen.getByRole("tab", { name: /Practice questions/i }));

    const choices = screen.getByLabelText(/Answer choices/);
    await user.clear(choices);
    await user.type(choices, "Revised choice A{enter}Revised choice B");
    const answer = screen.getByLabelText(/Correct answer/);
    await user.clear(answer);
    await user.type(answer, "Revised choice B");
    const steps = screen.getByLabelText(/Worked solution steps/);
    await user.clear(steps);
    await user.type(steps, "Revised step one{enter}Revised step two");
    await user.click(screen.getByRole("button", { name: "Save edits, keep unpublished" }));

    await waitFor(() => expect(mocks.updateContentReviewStatus).toHaveBeenCalledWith(
      "question",
      "algebra-foundations-u00-q01",
      "save-edits",
      "",
      expect.objectContaining({
        choices: ["Revised choice A", "Revised choice B"],
        solutionSteps: ["Revised step one", "Revised step two"],
      }),
    ));
  });

});
