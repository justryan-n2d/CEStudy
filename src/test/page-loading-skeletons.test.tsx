import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import type { CatalogSubject } from "../types/catalog";
import type { SubjectLesson } from "../types/lesson-content";
import type { PracticeQuestion as PracticeQuestionData } from "../types/study-content";

const mocks = vi.hoisted(() => ({
  fetchCatalogSubjects: vi.fn(),
  fetchPublishedLessons: vi.fn(),
  fetchPublishedPracticeQuestions: vi.fn(),
}));

vi.mock("../data/catalog-api", () => ({
  fetchCatalogSubjects: mocks.fetchCatalogSubjects,
}));
vi.mock("../data/lesson-api", () => ({
  fetchPublishedLessons: mocks.fetchPublishedLessons,
}));
vi.mock("../data/practice-api", () => ({
  fetchPublishedPracticeQuestions: mocks.fetchPublishedPracticeQuestions,
}));

import { CatalogPage } from "../pages/CatalogPage";
import { YearLevelPage } from "../pages/YearLevelPage";
import { MathFoundationsPage } from "../pages/MathFoundationsPage";
import { SubjectPage } from "../pages/SubjectPage";
import { StudyPage } from "../pages/StudyPage";
import { PracticePage } from "../pages/PracticePage";

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason: unknown) => void;
};

function deferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((onResolve, onReject) => {
    resolve = onResolve;
    reject = onReject;
  });
  return { promise, resolve, reject };
}

function renderPage(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/year/:year" element={<YearLevelPage />} />
        <Route path="/math-foundations" element={<MathFoundationsPage />} />
        <Route path="/subjects/:slug" element={<SubjectPage />} />
        <Route path="/study/:slug" element={<StudyPage />} />
        <Route path="/study/:slug/:unit" element={<StudyPage />} />
        <Route path="/practice/basic-algebra" element={<PracticePage />} />
      </Routes>
    </MemoryRouter>,
  );
}

const catalogRoutes = [
  {
    name: "Subject Catalog",
    path: "/catalog",
    label: "Loading the subject catalog…",
    testId: "subject-grid",
    emptyHeading: "No subjects found",
  },
  {
    name: "Year Levels",
    path: "/year/2",
    label: "Loading year-level subjects…",
    testId: "year-level",
    emptyHeading: "No listed subjects yet",
  },
  {
    name: "Math Foundations",
    path: "/math-foundations",
    label: "Loading math topics…",
    testId: "subject-grid",
    emptyHeading: null,
  },
  {
    name: "Subject Details",
    path: "/subjects/basic-algebra",
    label: "Loading subject details…",
    testId: "subject-detail",
    emptyHeading: "Subject not found",
  },
];

describe("learning page loading skeletons", () => {
  beforeEach(() => {
    localStorage.clear();
    mocks.fetchCatalogSubjects.mockReset().mockReturnValue(new Promise<CatalogSubject[]>(() => undefined));
    mocks.fetchPublishedLessons.mockReset().mockReturnValue(new Promise<SubjectLesson[]>(() => undefined));
    mocks.fetchPublishedPracticeQuestions.mockReset().mockReturnValue(new Promise<PracticeQuestionData[]>(() => undefined));
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it.each(catalogRoutes)("$name shows its matching skeleton while the catalog request is pending", async (route) => {
    renderPage(route.path);

    expect(await screen.findByRole("status", { name: route.label })).toBeInTheDocument();
    expect(document.querySelector(`[data-skeleton="${route.testId}"]`)).toBeInTheDocument();
    await waitFor(() => expect(mocks.fetchCatalogSubjects).toHaveBeenCalledTimes(1));
  });

  it("Study Reader shows the two-column reader skeleton while published lessons are pending", async () => {
    renderPage("/study/basic-algebra");

    expect(await screen.findByRole("status", { name: "Loading reviewer…" })).toBeInTheDocument();
    expect(document.querySelector('[data-skeleton="study-reader"]')).toBeInTheDocument();
    await waitFor(() => expect(mocks.fetchPublishedLessons).toHaveBeenCalledWith("basic-algebra"));
  });

  it("Practice shows the question workspace skeleton while published questions are pending", async () => {
    renderPage("/practice/basic-algebra");

    expect(await screen.findByRole("status", { name: "Loading practice…" })).toBeInTheDocument();
    expect(document.querySelector('[data-skeleton="practice-question"]')).toBeInTheDocument();
    await waitFor(() => expect(mocks.fetchPublishedPracticeQuestions).toHaveBeenCalledWith("basic-algebra"));
  });

  it.each(catalogRoutes)("$name removes its skeleton after an empty catalog response", async (route) => {
    const request = deferred<CatalogSubject[]>();
    mocks.fetchCatalogSubjects.mockReturnValue(request.promise);
    renderPage(route.path);

    expect(await screen.findByRole("status", { name: route.label })).toBeInTheDocument();
    await act(async () => request.resolve([]));

    expect(document.querySelector(`[data-skeleton="${route.testId}"]`)).not.toBeInTheDocument();
    if (route.emptyHeading) {
      expect(await screen.findByRole("heading", { name: route.emptyHeading })).toBeInTheDocument();
    }
  });

  it("Study Reader removes its skeleton when the published lesson response is empty", async () => {
    const request = deferred<SubjectLesson[]>();
    mocks.fetchPublishedLessons.mockReturnValue(request.promise);
    renderPage("/study/basic-algebra");

    expect(await screen.findByRole("status", { name: "Loading reviewer…" })).toBeInTheDocument();
    await act(async () => request.resolve([]));

    expect(document.querySelector('[data-skeleton="study-reader"]')).not.toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "Reviewer content is being prepared" })).toBeInTheDocument();
  });

  it("Practice removes its skeleton when the published question response is empty", async () => {
    const request = deferred<PracticeQuestionData[]>();
    mocks.fetchPublishedPracticeQuestions.mockReturnValue(request.promise);
    renderPage("/practice/basic-algebra");

    expect(await screen.findByRole("status", { name: "Loading practice…" })).toBeInTheDocument();
    await act(async () => request.resolve([]));

    expect(document.querySelector('[data-skeleton="practice-question"]')).not.toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "Questions coming soon" })).toBeInTheDocument();
  });

  it("shows page-specific errors rather than leaving skeletons visible after request failures", async () => {
    mocks.fetchCatalogSubjects.mockRejectedValue(new Error("Catalog request failed."));
    renderPage("/catalog");

    expect(await screen.findByRole("status", { name: "Loading the subject catalog…" })).toBeInTheDocument();
    expect(await screen.findByRole("alert")).toHaveTextContent("Catalog unavailable");
    expect(document.querySelector("[data-skeleton]")).not.toBeInTheDocument();
  });
});
