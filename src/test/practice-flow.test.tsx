import { afterEach,beforeEach,describe,expect,it,vi } from "vitest";
import { render,screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { PracticePage } from "../pages/PracticePage";
import { fetchPublishedPracticeQuestions } from "../data/practice-api";
import type { PracticeQuestion } from "../types/study-content";

vi.mock("../data/practice-api",()=>({fetchPublishedPracticeQuestions:vi.fn()}));

const demo:PracticeQuestion[]=[
  {id:"q1",subjectSlug:"basic-algebra",topic:"Test topic",prompt:"TEST PROMPT ONE",choices:["TEST OPTION A","TEST OPTION B"],correctAnswer:"TEST OPTION B",solutionSteps:["TEST STEP ONE","TEST STEP TWO"],explanation:"TEST EXPLANATION ONE",sourceNote:"Synthetic test fixture only.",displayOrder:1},
  {id:"q2",subjectSlug:"basic-algebra",topic:"Test topic",prompt:"TEST PROMPT TWO",choices:["TEST OPTION A","TEST OPTION B"],correctAnswer:"TEST OPTION B",solutionSteps:["TEST STEP ONE","TEST STEP TWO"],explanation:"TEST EXPLANATION TWO",sourceNote:"Synthetic test fixture only.",displayOrder:2}
];

describe("practice flow",()=>{
  beforeEach(()=>vi.mocked(fetchPublishedPracticeQuestions).mockResolvedValue(demo));
  afterEach(()=>vi.clearAllMocks());

  it("checks answers, reveals steps, advances, and shows the score",async()=>{
    const user=userEvent.setup();
    render(<MemoryRouter><PracticePage/></MemoryRouter>);
    expect(await screen.findByRole("heading",{name:"TEST PROMPT ONE"})).toBeInTheDocument();
    await user.click(screen.getByRole("radio",{name:"TEST OPTION B"}));
    await user.click(screen.getByRole("button",{name:/check answer/i}));
    expect(screen.getByRole("status")).toHaveTextContent("Correct.");
    expect(screen.getByText("TEST STEP ONE")).toBeInTheDocument();

    await user.click(screen.getByRole("button",{name:/next question/i}));
    expect(await screen.findByRole("heading",{name:"TEST PROMPT TWO"})).toBeInTheDocument();
    await user.click(screen.getByRole("radio",{name:"TEST OPTION A"}));
    await user.click(screen.getByRole("button",{name:/check answer/i}));
    expect(screen.getByRole("status")).toHaveTextContent("Not quite.");
    expect(screen.getByRole("status")).toHaveTextContent("The correct answer is TEST OPTION B.");

    await user.click(screen.getByRole("button",{name:/see results/i}));
    expect(screen.getByRole("heading",{name:/practice session complete/i})).toBeInTheDocument();
    expect(screen.getByText("You answered 1 out of 2 questions correctly.")).toBeInTheDocument();
  });

  it("keeps questions hidden and uses concise copy when none have been published",async()=>{
    vi.mocked(fetchPublishedPracticeQuestions).mockResolvedValueOnce([]);
    render(<MemoryRouter><PracticePage/></MemoryRouter>);
    expect(await screen.findByRole("heading",{name:"Questions coming soon"})).toBeInTheDocument();
    expect(screen.getByText("We're reviewing these questions.")).toBeInTheDocument();
    expect(screen.queryByText(/session is not saved between visits/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/student-facing AI tutor/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Draft questions are kept private/i)).not.toBeInTheDocument();
    expect(screen.getByRole("link",{name:"Browse subjects"})).toBeInTheDocument();
  });
});
