import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import stylesheet from "../styles/global.css?raw";
import {
  PracticeQuestionSkeleton,
  SubjectDetailSkeleton,
  SubjectGridSkeleton,
  StudyReaderSkeleton,
  YearLevelSkeleton,
} from "../components/LoadingSkeletons";

afterEach(() => cleanup());

function expectSingleLoadingStatus(label: string) {
  const status = screen.getByRole("status");
  expect(status).toHaveTextContent(label);
  expect(status).toHaveAttribute("aria-live", "polite");
  expect(screen.getAllByRole("status")).toHaveLength(1);

  const region = status.parentElement;
  expect(region).toHaveAttribute("aria-busy", "true");
  expect(region?.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
}

describe("content-shaped loading skeletons", () => {
  it("uses the subject-card grid silhouette without an extra outer card", () => {
    render(<SubjectGridSkeleton label="Loading the subject catalog…" />);

    expectSingleLoadingStatus("Loading the subject catalog…");
    const grid = document.querySelector("[data-skeleton='subject-grid']");
    expect(grid).toHaveClass("subject-grid");
    expect(grid?.querySelectorAll(".subject-card")).toHaveLength(6);
    expect(grid?.querySelector(".state-panel")).not.toBeInTheDocument();
  });

  it("preserves the semester section hierarchy on Year Levels", () => {
    render(<YearLevelSkeleton label="Loading year-level subjects…" />);

    expectSingleLoadingStatus("Loading year-level subjects…");
    const region = document.querySelector("[data-skeleton='year-level']");
    expect(region?.querySelectorAll(".section-block")).toHaveLength(2);
    expect(region?.querySelectorAll(".subject-grid")).toHaveLength(2);
    expect(region?.querySelectorAll(".subject-card")).toHaveLength(6);
  });

  it("matches the subject detail title and metadata hierarchy", () => {
    render(<SubjectDetailSkeleton label="Loading subject details…" />);

    expectSingleLoadingStatus("Loading subject details…");
    const region = document.querySelector("[data-skeleton='subject-detail']");
    expect(region?.querySelector(".detail-wrap .detail-hero")).toBeInTheDocument();
    expect(region?.querySelector(".detail-panel")).toBeInTheDocument();
    expect(region?.querySelector(".state-panel")).not.toBeInTheDocument();
  });

  it("matches the two-column Study reader without adding a Learning Objectives section", () => {
    render(<StudyReaderSkeleton label="Loading reviewer…" />);

    expectSingleLoadingStatus("Loading reviewer…");
    const region = document.querySelector("[data-skeleton='study-reader']");
    expect(region?.querySelector(".study-layout")).toBeInTheDocument();
    expect(region?.querySelector(".study-outline")).toBeInTheDocument();
    expect(region?.querySelector(".study-lesson")).toBeInTheDocument();
    expect(within(region as HTMLElement).queryByText(/Learning Objectives/i)).not.toBeInTheDocument();
  });

  it("matches the question prompt, answer options, and feedback area", () => {
    render(<PracticeQuestionSkeleton label="Loading practice question…" />);

    expectSingleLoadingStatus("Loading practice question…");
    const region = document.querySelector("[data-skeleton='practice-question']");
    expect(region?.querySelector(".practice-question-card")).toBeInTheDocument();
    expect(region?.querySelectorAll(".answer-option")).toHaveLength(4);
    expect(region?.querySelector(".answer-feedback")).toBeInTheDocument();
  });
});

describe("skeleton styling contract", () => {
  it("uses theme-aware semantic tokens for base and highlight colors", () => {
    expect(stylesheet).toMatch(/--ui-skeleton-base\s*:/);
    expect(stylesheet).toMatch(/--ui-skeleton-highlight\s*:/);
    expect(stylesheet).toMatch(/:root\[data-theme="dark"\][\s\S]*?--ui-skeleton-base\s*:/);
    expect(stylesheet).toMatch(/:root\[data-theme="dark"\][\s\S]*?--ui-skeleton-highlight\s*:/);
    expect(stylesheet).toMatch(/\.skeleton-shape\s*\{[^}]*var\(--ui-skeleton-base\)/s);
  });

  it("uses a restrained 1.2-second shimmer and disables it for reduced motion", () => {
    expect(stylesheet).toMatch(/animation:\s*ce-study-skeleton-shimmer\s+1\.2s\s+linear\s+infinite/);
    expect(stylesheet).toMatch(/background-size:\s*200%\s+100%/);
    expect(stylesheet).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.skeleton-shape[^}]*animation:\s*none/s);
  });
});
