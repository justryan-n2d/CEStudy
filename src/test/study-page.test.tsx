import { afterEach,beforeEach,describe,expect,it,vi } from "vitest";
import { cleanup,render,screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter,Route,Routes } from "react-router-dom";
import type { SubjectLesson } from "../types/lesson-content";
import { readLessonHistory } from "../data/learning-history";

const { fetchPublishedLessonsMock } = vi.hoisted(() => ({ fetchPublishedLessonsMock: vi.fn() }));
vi.mock("../data/lesson-api", () => ({ fetchPublishedLessons: fetchPublishedLessonsMock }));

import { StudyPage } from "../pages/StudyPage";

const publishedLesson: SubjectLesson = {
  id:"public-test-lesson",subjectSlug:"basic-algebra",unitNumber:1,slug:"test-lesson",
  title:"Published Test Lesson",learningObjectives:["Identify a test objective"],
  lessonMarkdown:"# Test lesson body\n\nThis lesson is **published**.",
  sourceNote:"Synthetic test fixture.",status:"published",
  reviewNotes:"",reviewedAt:"2026-10-18T00:00:00.000Z",updatedAt:"2026-10-18T00:00:00.000Z",
};
const factoringLesson: SubjectLesson = {
  id:"public-test-factoring",subjectSlug:"basic-algebra",unitNumber:4,slug:"polynomials-and-factoring",
  title:"Polynomials and Factoring",learningObjectives:["Factor polynomial expressions"],
  lessonMarkdown:"# Factoring\n\nPractice factoring polynomial expressions using common factors.",
  sourceNote:"Synthetic test fixture.",status:"published",
  reviewNotes:"",reviewedAt:"2026-10-18T00:00:00.000Z",updatedAt:"2026-10-18T00:00:00.000Z",
};

function renderStudy(path:string) {
  return render(<MemoryRouter initialEntries={[path]}><Routes>
    <Route path="/study/:slug" element={<StudyPage/>}/>
    <Route path="/study/:slug/:unit" element={<StudyPage/>}/>
  </Routes></MemoryRouter>);
}

beforeEach(()=>{fetchPublishedLessonsMock.mockReset();localStorage.clear();});
afterEach(()=>cleanup());

describe("student lesson reader",()=>{
  it("does not show draft text when no published lessons are returned",async()=>{
    fetchPublishedLessonsMock.mockResolvedValue([]);
    renderStudy("/study/basic-algebra");
    expect(await screen.findByRole("heading",{name:"Reviewer content is being prepared"})).toBeInTheDocument();
    expect(screen.queryByText(/private draft secret/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByText(/Browse math foundations/i)).not.toBeInTheDocument();
  });

  it("renders only the provided published lesson and its objectives",async()=>{
    fetchPublishedLessonsMock.mockResolvedValue([publishedLesson]);
    renderStudy("/study/basic-algebra/1");
    expect(await screen.findByRole("heading",{name:"Published Test Lesson"})).toBeInTheDocument();
    expect(screen.queryByText("Identify a test objective")).not.toBeInTheDocument();
    expect(screen.getByRole("article")).toHaveTextContent("This lesson is published.");
    expect(readLessonHistory()).toEqual([expect.objectContaining({
      lessonId: "public-test-lesson",
      subjectSlug: "basic-algebra",
      unitNumber: 1,
      path: "/study/basic-algebra/1",
      title: "Published Test Lesson",
    })]);
  });

  it("finds a topic inside the reviewer and opens its matching lesson",async()=>{
    const user=userEvent.setup();
    fetchPublishedLessonsMock.mockResolvedValue([publishedLesson,factoringLesson]);
    renderStudy("/study/basic-algebra");
    const search=await screen.findByRole("searchbox",{name:"Find a topic"});
    await user.type(search,"common factors");
    expect(await screen.findByRole("link",{name:/Polynomials and Factoring/})).toBeInTheDocument();
    expect(screen.getByText(/common factors/i)).toBeInTheDocument();
    expect(screen.queryByRole("link",{name:/Published Test Lesson/})).not.toBeInTheDocument();
    await user.click(screen.getByRole("link",{name:/Polynomials and Factoring/}));
    expect(await screen.findByRole("heading",{name:"Polynomials and Factoring"})).toBeInTheDocument();
    expect(screen.getByRole("article")).toHaveTextContent("Practice factoring polynomial expressions");
    expect(screen.getByRole("searchbox",{name:"Find a topic"})).toHaveValue("");
    expect(screen.getByText(/Browse topics/).closest("details")).not.toHaveAttribute("open");
  });
  it("lets students mark a published lesson complete and undo completion", async () => {
    const user = userEvent.setup();
    fetchPublishedLessonsMock.mockResolvedValue([publishedLesson]);
    renderStudy("/study/basic-algebra/1");

    expect(await screen.findByRole("heading", { name: "Published Test Lesson" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Mark as complete" }));
    expect(screen.getByRole("button", { name: "Mark as incomplete" })).toHaveAttribute("aria-pressed", "true");
    expect(localStorage.getItem("cestudy:completed-lessons:v1")).toContain("public-test-lesson");

    await user.click(screen.getByRole("button", { name: "Mark as incomplete" }));
    expect(screen.getByRole("button", { name: "Mark as complete" })).toHaveAttribute("aria-pressed", "false");
    expect(JSON.parse(localStorage.getItem("cestudy:completed-lessons:v1") ?? "[]")).toEqual([]);
  });

});
