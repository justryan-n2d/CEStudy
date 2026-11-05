import { act, cleanup, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import type { SubjectLesson } from "../types/lesson-content";

const { fetchPublishedLessonsMock } = vi.hoisted(() => ({ fetchPublishedLessonsMock: vi.fn() }));
vi.mock("../data/lesson-api", () => ({ fetchPublishedLessons: fetchPublishedLessonsMock }));

import { StudyPage } from "../pages/StudyPage";

const publishedLesson: SubjectLesson = {
  id: "public-test-lesson",
  subjectSlug: "basic-algebra",
  unitNumber: 1,
  slug: "test-lesson",
  title: "Published Test Lesson",
  learningObjectives: ["Identify a test objective"],
  lessonMarkdown: "# Test lesson body\n\nThis lesson is **published**.",
  sourceNote: "Synthetic test fixture.",
  status: "published",
  reviewNotes: "",
  reviewedAt: "2026-10-18T00:00:00.000Z",
  updatedAt: "2026-10-18T00:00:00.000Z",
};

const factoringLesson: SubjectLesson = {
  id: "public-test-factoring",
  subjectSlug: "basic-algebra",
  unitNumber: 4,
  slug: "polynomials-and-factoring",
  title: "Polynomials and Factoring",
  learningObjectives: ["Factor polynomial expressions"],
  lessonMarkdown: "# Factoring\n\nPractice factoring polynomial expressions using common factors.",
  sourceNote: "Synthetic test fixture.",
  status: "published",
  reviewNotes: "",
  reviewedAt: "2026-10-18T00:00:00.000Z",
  updatedAt: "2026-10-18T00:00:00.000Z",
};

function RouteControls() {
  const navigate = useNavigate();
  return (
    <button type="button" onClick={() => navigate("/study/statics-of-rigid-bodies/1")}>
      Open another reviewer
    </button>
  );
}

function renderStudy(path: string, controls = false) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      {controls ? <RouteControls /> : null}
      <Routes>
        <Route path="/study/:slug" element={<StudyPage />} />
        <Route path="/study/:slug/:unit" element={<StudyPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  fetchPublishedLessonsMock.mockReset();
  localStorage.clear();
});
afterEach(() => cleanup());

describe("student lesson reader", () => {
  it("announces loading while published lessons are being fetched", async () => {
    let resolveRequest!: (items: SubjectLesson[]) => void;
    fetchPublishedLessonsMock.mockReturnValue(new Promise<SubjectLesson[]>((resolve) => {
      resolveRequest = resolve;
    }));

    renderStudy("/study/basic-algebra/1");

    expect(screen.getByRole("status")).toHaveTextContent("Loading reviewer…");
    await act(async () => {
      resolveRequest([publishedLesson]);
    });
    expect(await screen.findByRole("heading", { name: "Published Test Lesson" })).toBeInTheDocument();
  });

  it("shows a recoverable error when published lessons cannot be loaded", async () => {
    fetchPublishedLessonsMock.mockRejectedValue(new Error("Published lesson service unavailable."));

    renderStudy("/study/basic-algebra/1");

    expect(await screen.findByRole("alert")).toHaveTextContent("Reviewer unavailable");
    expect(screen.getByRole("alert")).toHaveTextContent("Reviewer content could not be loaded. Check your connection and try again.");
    expect(screen.getByRole("alert")).not.toHaveTextContent("Published lesson service unavailable.");
    expect(screen.queryByRole("button", { name: /Mark as complete/i })).not.toBeInTheDocument();
  });

  it("does not show draft text when no published lessons are returned", async () => {
    fetchPublishedLessonsMock.mockResolvedValue([]);
    renderStudy("/study/basic-algebra");
    expect(await screen.findByRole("heading", { name: "Reviewer content is being prepared" })).toBeInTheDocument();
    expect(screen.queryByText(/private draft secret/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByText(/Browse math foundations/i)).not.toBeInTheDocument();
  });

  it.each(["/study/basic-algebra", "/study/basic-algebra/999"])(
    "does not select an arbitrary lesson for a missing or invalid unit (%s)",
    async (path) => {
      fetchPublishedLessonsMock.mockResolvedValue([publishedLesson, factoringLesson]);

      renderStudy(path);

      expect(await screen.findByRole("heading", { name: "Choose a topic" })).toBeInTheDocument();
      expect(screen.queryByRole("article")).not.toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Published Test Lesson/ })).toBeInTheDocument();
    },
  );

  it("renders only the provided published lesson and keeps objectives out of the visible lesson body", async () => {
    fetchPublishedLessonsMock.mockResolvedValue([publishedLesson]);
    renderStudy("/study/basic-algebra/1");
    expect(await screen.findByRole("heading", { name: "Published Test Lesson" })).toBeInTheDocument();
    expect(screen.queryByText("Identify a test objective")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /Learning Objectives/i })).not.toBeInTheDocument();
    expect(screen.getByRole("article")).toHaveTextContent("This lesson is published.");
    expect(screen.getByRole("article")).not.toHaveTextContent("Identify a test objective");
  });

  it("uses objectives as searchable metadata without rendering a separate objectives section", async () => {
    const user = userEvent.setup();
    fetchPublishedLessonsMock.mockResolvedValue([publishedLesson]);
    renderStudy("/study/basic-algebra");

    const search = await screen.findByRole("searchbox", { name: "Find a topic" });
    await user.type(search, "test objective");

    expect(screen.getByRole("link", { name: /Published Test Lesson/ })).toBeInTheDocument();
    expect(screen.getByText("Identify a test objective").closest("small")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /Learning Objectives/i })).not.toBeInTheDocument();
  });

  it("finds a topic inside the reviewer and opens its matching lesson", async () => {
    const user = userEvent.setup();
    fetchPublishedLessonsMock.mockResolvedValue([publishedLesson, factoringLesson]);
    renderStudy("/study/basic-algebra");
    const search = await screen.findByRole("searchbox", { name: "Find a topic" });
    await user.type(search, "common factors");
    expect(await screen.findByRole("link", { name: /Polynomials and Factoring/ })).toBeInTheDocument();
    expect(screen.getByText(/common factors/i)).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Published Test Lesson/ })).not.toBeInTheDocument();
    await user.click(screen.getByRole("link", { name: /Polynomials and Factoring/ }));
    expect(await screen.findByRole("heading", { name: "Polynomials and Factoring" })).toBeInTheDocument();
    expect(screen.getByRole("article")).toHaveTextContent("Practice factoring polynomial expressions");
    expect(screen.getByRole("searchbox", { name: "Find a topic" })).toHaveValue("");
    expect(screen.getByText(/Browse topics/).closest("details")).not.toHaveAttribute("open");
  });

  it("shows a useful no-results state and does not keep a non-matching lesson open", async () => {
    const user = userEvent.setup();
    fetchPublishedLessonsMock.mockResolvedValue([publishedLesson, factoringLesson]);
    renderStudy("/study/basic-algebra/1");

    const search = await screen.findByRole("searchbox", { name: "Find a topic" });
    await user.type(search, "no-such-engineering-topic");

    expect(screen.getByText("No matching topics. Try another keyword.")).toBeInTheDocument();
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Choose a topic" })).toBeInTheDocument();
  });

  it("keeps lesson navigation available through the progressively disclosed topic list", async () => {
    const user = userEvent.setup();
    const secondLesson: SubjectLesson = {
      ...publishedLesson,
      id: "public-test-lesson-02",
      unitNumber: 2,
      slug: "second-topic",
      title: "Second Published Lesson",
    };
    const thirdLesson: SubjectLesson = {
      ...publishedLesson,
      id: "public-test-lesson-03",
      unitNumber: 3,
      slug: "third-topic",
      title: "Third Published Lesson",
    };
    fetchPublishedLessonsMock.mockResolvedValue([publishedLesson, secondLesson, thirdLesson]);

    renderStudy("/study/basic-algebra/2");

    expect(await screen.findByRole("heading", { name: "Second Published Lesson" })).toBeInTheDocument();
    await user.click(screen.getByText(/Browse topics/));
    const topicNavigation = within(screen.getByRole("complementary", { name: "Reviewer topics" }));
    expect(topicNavigation.getByRole("link", { name: "Published Test Lesson" })).toHaveAttribute("href", "/study/basic-algebra/1");
    expect(topicNavigation.getByRole("link", { name: "Third Published Lesson" })).toHaveAttribute("href", "/study/basic-algebra/3");
    expect(screen.queryByRole("link", { name: /← Previous|Next topic →/ })).not.toBeInTheDocument();
  });

  it("keeps the topic browser discoverable at lesson boundaries without adding competing next/previous buttons", async () => {
    const user = userEvent.setup();
    const secondLesson: SubjectLesson = {
      ...publishedLesson,
      id: "public-test-middle-lesson",
      unitNumber: 2,
      slug: "middle-topic",
      title: "Middle Published Lesson",
    };
    const lastLesson: SubjectLesson = {
      ...publishedLesson,
      id: "public-test-last-lesson",
      unitNumber: 3,
      slug: "last-topic",
      title: "Last Published Lesson",
    };
    fetchPublishedLessonsMock.mockResolvedValue([publishedLesson, secondLesson, lastLesson]);

    const firstView = renderStudy("/study/basic-algebra/1");
    expect(await screen.findByRole("heading", { name: "Published Test Lesson" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /← Previous|Next topic →/ })).not.toBeInTheDocument();
    await user.click(screen.getByText(/Browse topics/));
    const firstTopicNavigation = within(screen.getByRole("complementary", { name: "Reviewer topics" }));
    expect(firstTopicNavigation.getByRole("link", { name: "Middle Published Lesson" })).toHaveAttribute("href", "/study/basic-algebra/2");
    firstView.unmount();

    renderStudy("/study/basic-algebra/3");
    expect(await screen.findByRole("heading", { name: "Last Published Lesson" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /← Previous|Next topic →/ })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Practice problems →" })).toHaveAttribute("href", "/practice/basic-algebra");
  });

  it("ignores a late response for the previous subject after the route changes", async () => {
    let resolveFirst!: (items: SubjectLesson[]) => void;
    let resolveSecond!: (items: SubjectLesson[]) => void;
    const otherSubjectLesson: SubjectLesson = {
      ...publishedLesson,
      id: "statics-introduction",
      subjectSlug: "statics-of-rigid-bodies",
      slug: "statics-introduction",
      title: "Statics Introduction",
    };
    fetchPublishedLessonsMock
      .mockImplementationOnce(() => new Promise<SubjectLesson[]>((resolve) => {
        resolveFirst = resolve;
      }))
      .mockImplementationOnce(() => new Promise<SubjectLesson[]>((resolve) => {
        resolveSecond = resolve;
      }));

    const user = userEvent.setup();
    renderStudy("/study/basic-algebra/1", true);

    await waitFor(() => expect(resolveFirst).toBeDefined());
    await user.click(screen.getByRole("button", { name: "Open another reviewer" }));
    await waitFor(() => expect(resolveSecond).toBeDefined());

    await act(async () => {
      resolveFirst([publishedLesson]);
    });
    expect(screen.getByRole("status")).toHaveTextContent("Loading reviewer…");
    expect(screen.queryByRole("heading", { name: "Published Test Lesson" })).not.toBeInTheDocument();

    await act(async () => {
      resolveSecond([otherSubjectLesson]);
    });
    expect(await screen.findByRole("heading", { name: "Statics Introduction" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Published Test Lesson" })).not.toBeInTheDocument();
  });

  it("keeps the reading task free of streak, completion, and progress controls", async () => {
    fetchPublishedLessonsMock.mockResolvedValue([publishedLesson, factoringLesson]);
    renderStudy("/study/basic-algebra/1");

    expect(await screen.findByRole("heading", { name: "Published Test Lesson" })).toBeInTheDocument();
    expect(screen.queryByText(/days streak/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /mark as complete/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /mark as incomplete/i })).not.toBeInTheDocument();
    expect(screen.queryByText("Completed")).not.toBeInTheDocument();
    expect(screen.queryByText(/progress is saved on this device/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /view my progress/i })).not.toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Recommended lessons" })).toBeInTheDocument();
  });
});
