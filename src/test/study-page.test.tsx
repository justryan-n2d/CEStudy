import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
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

function renderStudy(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/study/:slug" element={<StudyPage />} />
        <Route path="/study/:slug/:unit" element={<StudyPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => fetchPublishedLessonsMock.mockReset());
afterEach(() => cleanup());

describe("student lesson reader", () => {
  it("does not show draft text when no published lessons are returned", async () => {
    fetchPublishedLessonsMock.mockResolvedValue([]);
    renderStudy("/study/basic-algebra");
    expect(await screen.findByRole("heading", { name: "Lessons are being prepared" })).toBeInTheDocument();
    expect(screen.queryByText(/private draft secret/i)).not.toBeInTheDocument();
  });

  it("renders only the provided published lesson and its objectives", async () => {
    fetchPublishedLessonsMock.mockResolvedValue([publishedLesson]);
    renderStudy("/study/basic-algebra/1");
    expect(await screen.findByRole("heading", { name: "Published Test Lesson" })).toBeInTheDocument();
    expect(screen.getByText("Identify a test objective")).toBeInTheDocument();
    expect(screen.getByText("This lesson is")).toBeInTheDocument();
    expect(screen.getByText("published")).toBeInTheDocument();
  });
});
