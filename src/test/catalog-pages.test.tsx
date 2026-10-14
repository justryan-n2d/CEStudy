import { render,screen,waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter,Route,Routes } from "react-router-dom";
import { describe,expect,it } from "vitest";
import { CatalogPage } from "../pages/CatalogPage";
import { YearLevelPage } from "../pages/YearLevelPage";
describe("catalog pages",()=>{
it("shows curriculum transparency and searches titles and aliases",async()=>{const user=userEvent.setup();render(<MemoryRouter><CatalogPage/></MemoryRouter>);
expect(await screen.findByRole("link",{name:/read the ched reference/i})).toHaveAttribute("href","https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf");
const search=screen.getByRole("searchbox",{name:/search subjects/i});await user.type(search,"statics");
expect(await screen.findByRole("link",{name:"Statics of Rigid Bodies"})).toBeInTheDocument();
await waitFor(()=>expect(screen.queryByRole("link",{name:"Calculus 1"})).not.toBeInTheDocument());
await user.clear(search);expect(await screen.findByRole("link",{name:"Calculus 1"})).toBeInTheDocument()});
it("offers a recoverable no-results state",async()=>{const user=userEvent.setup();render(<MemoryRouter><CatalogPage/></MemoryRouter>);await user.type(screen.getByRole("searchbox",{name:/search subjects/i}),"no-such-subject");expect(await screen.findByRole("heading",{name:/no subjects found/i})).toBeInTheDocument();await user.click(screen.getByRole("button",{name:/reset search and filters/i}));expect(await screen.findByRole("link",{name:"Calculus 1"})).toBeInTheDocument()});
it("renders all four year-level routes",async()=>{const titles=["First year","Second year","Third year","Fourth year"];for(const [i,year] of [1,2,3,4].entries()){const view=render(<MemoryRouter initialEntries={["/year/"+year]}><Routes><Route path="/year/:year" element={<YearLevelPage/>}/></Routes></MemoryRouter>);expect(await screen.findByRole("heading",{name:titles[i]})).toBeInTheDocument();view.unmount()}});
});
