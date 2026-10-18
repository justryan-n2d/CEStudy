import { render,screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter,Route,Routes } from "react-router-dom";
import { beforeEach,describe,expect,it,vi } from "vitest";

const topicSearchMocks=vi.hoisted(()=>({fetchPublishedTopicIndex:vi.fn()}));
vi.mock("../data/topic-search-api",()=>({fetchPublishedTopicIndex:topicSearchMocks.fetchPublishedTopicIndex}));
import { CatalogPage } from "../pages/CatalogPage";
import { YearLevelPage } from "../pages/YearLevelPage";

beforeEach(()=>topicSearchMocks.fetchPublishedTopicIndex.mockReset().mockResolvedValue([]));

describe("catalog pages",()=>{
  it("shows curriculum transparency and searches titles and aliases",async()=>{
    const user=userEvent.setup();
    render(<MemoryRouter><CatalogPage/></MemoryRouter>);
    expect(await screen.findByRole("link",{name:/read the ched reference/i})).toHaveAttribute("href","https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf");
    const search=screen.getByRole("searchbox",{name:/search subjects/i});
    await user.type(search,"statics");
    expect(await screen.findByRole("link",{name:/Statics of Rigid Bodies/})).toBeInTheDocument();
    expect(screen.queryByRole("link",{name:/Calculus 1/})).not.toBeInTheDocument();
    expect(screen.queryByText("View subject →")).not.toBeInTheDocument();
    await user.clear(search);
    expect(await screen.findByRole("link",{name:/Calculus 1/})).toBeInTheDocument();
  });

  it("keeps advanced filters collapsed until requested",async()=>{
    const user=userEvent.setup();
    render(<MemoryRouter><CatalogPage/></MemoryRouter>);
    const filters=screen.getByText("Filters").closest("details");
    expect(filters).not.toHaveAttribute("open");
    await user.click(screen.getByText("Filters"));
    expect(filters).toHaveAttribute("open");
    expect(screen.getByLabelText("Year level")).toBeInTheDocument();
    expect(screen.getByLabelText("Subject family")).toBeInTheDocument();
  });

  it("offers a recoverable no-results state",async()=>{
    const user=userEvent.setup();
    render(<MemoryRouter><CatalogPage/></MemoryRouter>);
    await user.type(screen.getByRole("searchbox",{name:/search subjects/i}),"no-such-subject");
    expect(await screen.findByRole("heading",{name:/no subjects found/i})).toBeInTheDocument();
    await user.click(screen.getByRole("button",{name:/clear search/i}));
    expect(await screen.findByRole("link",{name:/Calculus 1/})).toBeInTheDocument();
  });

  it("renders all four year-level routes",async()=>{
    const titles=["First year","Second year","Third year","Fourth year"];
    for(const [i,year] of [1,2,3,4].entries()){
      const view=render(<MemoryRouter initialEntries={["/year/"+year]}><Routes><Route path="/year/:year" element={<YearLevelPage/>}/></Routes></MemoryRouter>);
      expect(await screen.findByRole("heading",{name:titles[i]})).toBeInTheDocument();
      view.unmount();
    }
  });

  it("announces the result count and supports combined catalog filters",async()=>{
    const user=userEvent.setup();
    render(<MemoryRouter><CatalogPage/></MemoryRouter>);
    const search=screen.getByRole("searchbox",{name:/search subjects/i});
    await user.type(search,"statics");
    await user.click(screen.getByText("Filters"));
    await user.selectOptions(screen.getByLabelText("Year level"),"2");
    await user.selectOptions(screen.getByLabelText("Subject family"),"year-level");
    await user.selectOptions(screen.getByLabelText("Classification"),"ched-common-course");
    await user.selectOptions(screen.getByLabelText("Content status"),"coming-soon");
    const count=await screen.findByText("1 result");
    expect(count).toHaveAttribute("role","status");
    expect(count).toHaveAttribute("aria-atomic","true");
    expect(await screen.findByRole("link",{name:/Statics of Rigid Bodies/})).toBeInTheDocument();
    expect(screen.queryByRole("link",{name:/Calculus 1/})).not.toBeInTheDocument();
  });

  it("filters unassigned math foundations and clears all filter values",async()=>{
    const user=userEvent.setup();
    render(<MemoryRouter><CatalogPage/></MemoryRouter>);
    await user.click(screen.getByText("Filters"));
    await user.selectOptions(screen.getByLabelText("Year level"),"none");
    await user.selectOptions(screen.getByLabelText("Subject family"),"math-foundation");
    await user.selectOptions(screen.getByLabelText("Classification"),"supplementary-math-foundation");
    await user.selectOptions(screen.getByLabelText("Content status"),"in-preparation");
    expect(await screen.findByRole("link",{name:/Basic and Advanced Algebra/})).toHaveAttribute("href","/study/basic-algebra");
    expect(screen.getByText("1 result")).toBeInTheDocument();
    await user.click(screen.getByRole("button",{name:/clear filters/i}));
    expect(await screen.findByText("72 results")).toBeInTheDocument();
    expect(await screen.findByRole("link",{name:/Calculus 1/})).toBeInTheDocument();
    expect(screen.getByRole("searchbox",{name:/search subjects/i})).toHaveValue("");
  });

  it("finds a published topic from the main catalog search",async()=>{
    const user=userEvent.setup();
    topicSearchMocks.fetchPublishedTopicIndex.mockResolvedValue([{
      subjectSlug:"basic-algebra",
      unitNumber:4,
      slug:"polynomials-and-factoring",
      title:"Polynomials and Factoring",
      learningObjectives:["Factor polynomial expressions"],
      status:"published",
    }]);
    render(<MemoryRouter><CatalogPage/></MemoryRouter>);
    const search=screen.getByRole("searchbox",{name:/search subjects/i});
    await user.type(search,"factoring");
    const topic=await screen.findByRole("link",{name:/Polynomials and Factoring/});
    expect(topic).toHaveAttribute("href","/study/basic-algebra/4");
    expect(screen.getByRole("heading",{name:"Matching topics"})).toBeInTheDocument();
    expect(screen.queryByRole("heading",{name:/No results found/i})).not.toBeInTheDocument();
  });
});
