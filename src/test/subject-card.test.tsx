import { render,screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe,expect,it } from "vitest";
import { SubjectCard } from "../components/SubjectCard";
import type { CatalogSubject } from "../types/catalog";

const publishedQuestionSubject:CatalogSubject={
  slug:"calculus-1",
  title:"Calculus 1",
  summary:"Limits and derivatives.",
  yearLevel:1,
  semester:"First semester",
  category:"year-level",
  classification:"ched-common-course",
  specialization:null,
  aliases:["calculus"],
  sourceReference:"test fixture",
  sourceNote:"Synthetic test fixture only.",
  availability:"has-published-content",
  displayOrder:1,
};

const algebraSubject:CatalogSubject={
  ...publishedQuestionSubject,
  slug:"basic-algebra",
  title:"Algebra Foundations",
  yearLevel:null,
  semester:null,
  category:"math-foundation",
  classification:"supplementary-math-foundation",
  aliases:["algebra"],
  availability:"in-preparation",
};

describe("subject card navigation",()=>{
  it("opens the reviewer directly for Algebra Foundations",()=>{
    render(<MemoryRouter><SubjectCard subject={algebraSubject}/></MemoryRouter>);
    expect(screen.getByRole("link",{name:/Algebra Foundations/})).toHaveAttribute("href","/study/basic-algebra");
  });

  it("does not send other subjects to the lesson reader just because questions are published",()=>{
    render(<MemoryRouter><SubjectCard subject={publishedQuestionSubject}/></MemoryRouter>);
    expect(screen.getByRole("link",{name:/Calculus 1/})).toHaveAttribute("href","/subjects/calculus-1");
  });
});
