import { afterEach,beforeEach,describe,expect,it,vi } from "vitest";
import { render,screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { PracticePage } from "../pages/PracticePage";
import { fetchPublishedPracticeQuestions } from "../data/practice-api";
import type { PracticeQuestion } from "../types/study-content";
vi.mock("../data/practice-api",()=>({fetchPublishedPracticeQuestions:vi.fn()}));
const demo:PracticeQuestion[]=[
{id:"q1",subjectSlug:"basic-algebra",topic:"Linear equations",prompt:"Solve for x: 2x = 6.",choices:["x = 2","x = 3"],correctAnswer:"x = 3",solutionSteps:["Divide both sides by 2.","x = 3."],explanation:"2x = 6, so x = 3.",sourceNote:"Test fixture only.",displayOrder:1},
{id:"q2",subjectSlug:"basic-algebra",topic:"Linear equations",prompt:"Solve for y: y + 4 = 9.",choices:["y = 4","y = 5"],correctAnswer:"y = 5",solutionSteps:["Subtract 4.","y = 5."],explanation:"9 − 4 = 5.",sourceNote:"Test fixture.",displayOrder:2}
];
describe("practice flow",()=>{
beforeEach(()=>vi.mocked(fetchPublishedPracticeQuestions).mockResolvedValue(demo));afterEach(()=>vi.clearAllMocks());
it("checks answers, reveals steps, advances, and shows the score",async()=>{const user=userEvent.setup();render(<MemoryRouter><PracticePage/></MemoryRouter>);
expect(await screen.findByRole("heading",{name:"Solve for x: 2x = 6."})).toBeInTheDocument();await user.click(screen.getByRole("radio",{name:"x = 3"}));await user.click(screen.getByRole("button",{name:/check answer/i}));
expect(screen.getByRole("status")).toHaveTextContent("Correct.");expect(screen.getByText("Divide both sides by 2.")).toBeInTheDocument();
await user.click(screen.getByRole("button",{name:/next question/i}));expect(await screen.findByRole("heading",{name:"Solve for y: y + 4 = 9."})).toBeInTheDocument();
await user.click(screen.getByRole("radio",{name:"y = 4"}));await user.click(screen.getByRole("button",{name:/check answer/i}));expect(screen.getByRole("status")).toHaveTextContent("Not quite.");expect(screen.getByText("The correct answer is y = 5.")).toBeInTheDocument();
await user.click(screen.getByRole("button",{name:/see results/i}));expect(screen.getByRole("heading",{name:/practice session complete/i})).toBeInTheDocument();expect(screen.getByText("You answered 1 out of 2 questions correctly.")).toBeInTheDocument()});
it("keeps questions hidden when none have been published",async()=>{vi.mocked(fetchPublishedPracticeQuestions).mockResolvedValueOnce([]);render(<MemoryRouter><PracticePage/></MemoryRouter>);expect(await screen.findByRole("heading",{name:/practice questions are being reviewed/i})).toBeInTheDocument()});
});
