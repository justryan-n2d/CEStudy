import { afterEach,beforeEach,describe,expect,it,vi } from "vitest";
import { cleanup,render,screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter,Route,Routes } from "react-router-dom";
import type { SubjectLesson } from "../types/lesson-content";

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

beforeEach(()=>fetchPublishedLessonsMock.mockReset());
afterEach(()=>cleanup());

describe("student lesson reader",()=>{
  it("does not show draft text when no published lessons are returned",async()=>{
    fetchPublishedLessonsMock.mockResolvedValue([]);
    renderStudy("/study/basic-algebra");
    expect(await screen.findByRole("heading",{name:"Lessons are being prepared"})).toBeInTheDocument();
    expect(screen.queryByText(/private draft secret/i)).not.toBeInTheDocument();
  });

  it("renders only the provided published lesson and its objectives",async()=>{
    fetchPublishedLessonsMock.mockResolvedValue([publishedLesson]);
    renderStudy("/study/basic-algebra/1");
    expect(await screen.findByRole("heading",{name:"Published Test Lesson"})).toBeInTheDocument();
    expect(screen.getByText("Identify a test objective")).toBeInTheDocument();
    expect(screen.getByRole("article")).toHaveTextContent("This lesson is published.");
  });

  it("finds a topic inside the reviewer and opens its matching lesson",async()=>{
    const user=userEvent.setup();
    fetchPublishedLessonsMock.mockResolvedValue([publishedLesson,factoringLesson]);
    renderStudy("/study/basic-algebra");
    const search=await screen.findByRole("searchbox",{name:"Find a topic"});
    await user.type(search,"factoring");
    expect(await screen.findByRole("link",{name:/Polynomials and Factoring/})).toBeInTheDocument();
    expect(screen.queryByRole("link",{name:/Published Test Lesson/})).not.toBeInTheDocument();
    await user.click(screen.getByRole("link",{name:/Polynomials and Factoring/}));
    expect(await screen.findByRole("heading",{name:"Polynomials and Factoring"})).toBeInTheDocument();
    expect(screen.getByRole("article")).toHaveTextContent("Practice factoring polynomial expressions");
  });
});
