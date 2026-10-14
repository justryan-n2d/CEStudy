import { describe,expect,it } from "vitest";
import { parsePracticeQuestion } from "../types/study-content";
describe("practice content validation",()=>{
const valid={id:"q1",subject_slug:"basic-algebra",topic:"Linear equations",prompt:"Solve 2x = 6.",choices:["x = 2","x = 3"],correct_answer:"x = 3",solution_steps:["Divide both sides by 2."],explanation:"So x = 3.",source_note:"Draft only.",display_order:1};
it("maps well-formed rows into the student-facing data shape",()=>expect(parsePracticeQuestion(valid)).toMatchObject({id:"q1",subjectSlug:"basic-algebra",correctAnswer:"x = 3",choices:["x = 2","x = 3"]}));
it("rejects incomplete content instead of rendering it",()=>{expect(parsePracticeQuestion({...valid,choices:["one"]})).toBeNull();expect(parsePracticeQuestion({...valid,solution_steps:[]})).toBeNull();expect(parsePracticeQuestion({...valid,correct_answer:5})).toBeNull()});
});
