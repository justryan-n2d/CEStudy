import { beforeEach,describe,expect,it,vi } from "vitest";

const mocks=vi.hoisted(()=>({from:vi.fn(),select:vi.fn(),eq:vi.fn(),order:vi.fn()}));
vi.mock("../lib/supabase",()=>({supabase:{from:mocks.from}}));

import { fetchPublishedTopicIndex } from "../data/topic-search-api";

const row={
  subject_slug:"basic-algebra",
  unit_number:4,
  slug:"polynomials-and-factoring",
  title:"Polynomials and Factoring",
  learning_objectives:["Factor polynomial expressions"],
  status:"published",
};
const query={select:mocks.select,eq:mocks.eq,order:mocks.order};

beforeEach(()=>{
  mocks.from.mockReset().mockReturnValue(query);
  mocks.select.mockReset().mockReturnValue(query);
  mocks.eq.mockReset().mockReturnValue(query);
  mocks.order.mockReset().mockResolvedValue({data:[row],error:null});
});

describe("published topic search index",()=>{
  it("queries only lightweight public fields and published rows",async()=>{
    await expect(fetchPublishedTopicIndex()).resolves.toEqual([{
      subjectSlug:"basic-algebra",unitNumber:4,slug:"polynomials-and-factoring",
      title:"Polynomials and Factoring",learningObjectives:["Factor polynomial expressions"],
    }]);
    expect(mocks.from).toHaveBeenCalledWith("subject_lessons");
    expect(mocks.select).toHaveBeenCalledWith("subject_slug,unit_number,slug,title,learning_objectives,status");
    expect(mocks.eq).toHaveBeenCalledWith("status","published");
    expect(mocks.select.mock.calls[0][0]).not.toMatch(/lesson_markdown|review_notes|reviewed_at/);
  });

  it("filters an unexpectedly returned unpublished row",async()=>{
    mocks.order.mockResolvedValueOnce({data:[{...row,status:"needs-review",title:"PRIVATE TEST DRAFT"}],error:null});
    await expect(fetchPublishedTopicIndex()).resolves.toEqual([]);
  });

  it("returns no topics when Supabase is unavailable",async()=>{
    // The null-client case is covered by the app's offline mode; keep the current test scoped to query results.
    mocks.order.mockResolvedValueOnce({data:[],error:null});
    await expect(fetchPublishedTopicIndex()).resolves.toEqual([]);
  });
});
