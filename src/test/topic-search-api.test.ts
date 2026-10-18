import { beforeEach,describe,expect,it,vi } from "vitest";

const mocks=vi.hoisted(()=>({
  from:vi.fn(),
  lessonSelect:vi.fn(),lessonEq:vi.fn(),lessonOrder:vi.fn(),
  practiceSelect:vi.fn(),practiceEq:vi.fn(),practiceOrder:vi.fn(),
}));
vi.mock("../lib/supabase",()=>({supabase:{from:mocks.from}}));

import { fetchPublishedTopicIndex } from "../data/topic-search-api";

const lessonRow={
  subject_slug:"basic-algebra",unit_number:4,slug:"polynomials-and-factoring",
  title:"Polynomials and Factoring",learning_objectives:["Factor polynomial expressions"],status:"published",
};
const questionRows=[
  {subject_slug:"basic-algebra",topic:"Factoring",status:"published"},
  {subject_slug:"basic-algebra",topic:"factoring",status:"published"},
  {subject_slug:"basic-algebra",topic:"Exponents",status:"published"},
];
const lessonQuery={select:mocks.lessonSelect,eq:mocks.lessonEq,order:mocks.lessonOrder};
const practiceQuery={select:mocks.practiceSelect,eq:mocks.practiceEq,order:mocks.practiceOrder};

beforeEach(()=>{
  mocks.from.mockReset().mockImplementation((table:string)=>table==="subject_lessons"?lessonQuery:practiceQuery);
  mocks.lessonSelect.mockReset().mockReturnValue(lessonQuery);
  mocks.lessonEq.mockReset().mockReturnValue(lessonQuery);
  mocks.lessonOrder.mockReset().mockResolvedValue({data:[lessonRow],error:null});
  mocks.practiceSelect.mockReset().mockReturnValue(practiceQuery);
  mocks.practiceEq.mockReset().mockReturnValue(practiceQuery);
  mocks.practiceOrder.mockReset().mockResolvedValue({data:questionRows,error:null});
});

describe("published topic search index",()=>{
  it("loads lightweight published lesson and practice metadata",async()=>{
    await expect(fetchPublishedTopicIndex()).resolves.toEqual([
      {kind:"practice",subjectSlug:"basic-algebra",topic:"Factoring",title:"Factoring",questionCount:2},
      {kind:"practice",subjectSlug:"basic-algebra",topic:"Exponents",title:"Exponents",questionCount:1},
      {kind:"lesson",subjectSlug:"basic-algebra",unitNumber:4,slug:"polynomials-and-factoring",title:"Polynomials and Factoring",learningObjectives:["Factor polynomial expressions"]},
    ]);
    expect(mocks.from).toHaveBeenCalledWith("subject_lessons");
    expect(mocks.from).toHaveBeenCalledWith("practice_questions");
    expect(mocks.lessonSelect).toHaveBeenCalledWith("subject_slug,unit_number,slug,title,learning_objectives,status");
    expect(mocks.practiceSelect).toHaveBeenCalledWith("subject_slug,topic,status");
    expect(mocks.lessonEq).toHaveBeenCalledWith("status","published");
    expect(mocks.practiceEq).toHaveBeenCalledWith("status","published");
    expect(mocks.lessonSelect.mock.calls[0][0]).not.toMatch(/lesson_markdown|review_notes|reviewed_at/);
    expect(mocks.practiceSelect.mock.calls[0][0]).not.toMatch(/prompt|choices|correct_answer|solution_steps|explanation/);
  });

  it("filters unpublished rows even if a response unexpectedly contains them",async()=>{
    mocks.lessonOrder.mockResolvedValueOnce({data:[{...lessonRow,status:"needs-review",title:"PRIVATE TEST DRAFT"}],error:null});
    mocks.practiceOrder.mockResolvedValueOnce({data:[{subject_slug:"basic-algebra",topic:"PRIVATE TEST DRAFT",status:"needs-review"}],error:null});
    await expect(fetchPublishedTopicIndex()).resolves.toEqual([]);
  });

  it("fails closed when either public topic query fails",async()=>{
    mocks.practiceOrder.mockResolvedValueOnce({data:null,error:{message:"blocked"}});
    await expect(fetchPublishedTopicIndex()).rejects.toThrow("Published topics could not be loaded.");
  });

  it("returns no entries when no topics have been published",async()=>{
    mocks.lessonOrder.mockResolvedValueOnce({data:[],error:null});
    mocks.practiceOrder.mockResolvedValueOnce({data:[],error:null});
    await expect(fetchPublishedTopicIndex()).resolves.toEqual([]);
  });
});
