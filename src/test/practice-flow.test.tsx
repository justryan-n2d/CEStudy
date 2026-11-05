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

  it("recovers from a failed load when the student retries", async () => {
    const user = userEvent.setup();
    let resolveRetry: (questions: PracticeQuestion[]) => void = () => {
      throw new Error("Retry request was not started.");
    };
    vi.mocked(fetchPublishedPracticeQuestions)
      .mockRejectedValueOnce(new Error("Network unavailable"))
      .mockImplementationOnce(() => new Promise<PracticeQuestion[]>((resolve) => {
        resolveRetry = resolve;
      }));

    render(<MemoryRouter><PracticePage /></MemoryRouter>);

    expect(await screen.findByRole("heading", { name: "Practice unavailable" })).toBeInTheDocument();
    expect(fetchPublishedPracticeQuestions).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "Retry" }));

    expect(await screen.findByText("Loading practice…")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Practice unavailable" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "TEST PROMPT ONE" })).not.toBeInTheDocument();

    resolveRetry(demo);

    expect(await screen.findByRole("heading", { name: "TEST PROMPT ONE" })).toBeInTheDocument();
    expect(fetchPublishedPracticeQuestions).toHaveBeenCalledTimes(2);
    expect(fetchPublishedPracticeQuestions).toHaveBeenNthCalledWith(1, "basic-algebra");
    expect(fetchPublishedPracticeQuestions).toHaveBeenNthCalledWith(2, "basic-algebra");
  });

  it("locks a submitted answer and removes the submit action", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><PracticePage /></MemoryRouter>);

    expect(await screen.findByRole("heading", { name: "TEST PROMPT ONE" })).toBeInTheDocument();
    const checkAnswer = screen.getByRole("button", { name: /check answer/i });
    expect(checkAnswer).toBeDisabled();

    await user.click(screen.getByRole("radio", { name: "TEST OPTION B" }));
    expect(checkAnswer).toBeEnabled();
    await user.click(checkAnswer);

    expect(screen.getByRole("radio", { name: "TEST OPTION A" })).toBeDisabled();
    expect(screen.getByRole("radio", { name: "TEST OPTION B" })).toBeDisabled();
    expect(screen.queryByRole("button", { name: /check answer/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next question/i })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Correct.");
  });

  it("restarts a completed session at question one with a cleared answer and score", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><PracticePage /></MemoryRouter>);

    expect(await screen.findByRole("heading", { name: "TEST PROMPT ONE" })).toBeInTheDocument();
    await user.click(screen.getByRole("radio", { name: "TEST OPTION B" }));
    await user.click(screen.getByRole("button", { name: /check answer/i }));
    await user.click(screen.getByRole("button", { name: /next question/i }));

    expect(await screen.findByRole("heading", { name: "TEST PROMPT TWO" })).toBeInTheDocument();
    await user.click(screen.getByRole("radio", { name: "TEST OPTION A" }));
    await user.click(screen.getByRole("button", { name: /check answer/i }));
    await user.click(screen.getByRole("button", { name: /see results/i }));

    expect(screen.getByText("You answered 1 out of 2 questions correctly.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(await screen.findByRole("heading", { name: "TEST PROMPT ONE" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "TEST OPTION A" })).not.toBeChecked();
    expect(screen.getByRole("radio", { name: "TEST OPTION B" })).not.toBeChecked();
    expect(screen.getByRole("button", { name: /check answer/i })).toBeDisabled();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("keeps questions hidden and uses concise copy when none have been published",async()=>{
    vi.mocked(fetchPublishedPracticeQuestions).mockResolvedValueOnce([]);
    render(<MemoryRouter><PracticePage/></MemoryRouter>);
    expect(await screen.findByRole("heading",{name:"Questions coming soon"})).toBeInTheDocument();
    expect(screen.getByText("We're reviewing these questions.")).toBeInTheDocument();
    expect(screen.queryByText(/session is not saved between visits/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/student-facing AI tutor/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Draft questions are kept private/i)).not.toBeInTheDocument();
    expect(screen.getByRole("link",{name:"Browse subjects"})).toHaveClass("button-primary");
  });
});
