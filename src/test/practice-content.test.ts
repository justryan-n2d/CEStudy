import { describe,expect,it } from "vitest";
import { parsePracticeQuestion } from "../types/study-content";
describe("practice content validation",()=>{
const valid={id:"q1",subject_slug:"basic-algebra",topic:"Test topic",prompt:"TEST PROMPT",choices:["TEST OPTION A","TEST OPTION B"],correct_answer:"TEST OPTION B",solution_steps:["TEST STEP"],explanation:"TEST EXPLANATION",source_note:"Draft only.",display_order:1};
it("maps well-formed rows into the student-facing data shape",()=>expect(parsePracticeQuestion(valid)).toMatchObject({id:"q1",subjectSlug:"basic-algebra",correctAnswer:"TEST OPTION B",choices:["TEST OPTION A","TEST OPTION B"]}));
it("rejects incomplete content instead of rendering it",()=>{expect(parsePracticeQuestion({...valid,choices:["one"]})).toBeNull();expect(parsePracticeQuestion({...valid,solution_steps:[]})).toBeNull();expect(parsePracticeQuestion({...valid,correct_answer:5})).toBeNull()});
});
