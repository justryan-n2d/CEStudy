import { describe,expect,it } from "vitest";
import { CATALOG_SUBJECTS } from "../data/catalog";
import { SPECIALIZATIONS } from "../types/catalog";
describe("catalog contract",()=>{
it("includes all four year levels",()=>{for(const year of [1,2,3,4])expect(CATALOG_SUBJECTS.some(s=>s.yearLevel===year)).toBe(true)});
it("includes all five specialization areas",()=>{for(const label of SPECIALIZATIONS)expect(CATALOG_SUBJECTS.some(s=>s.specialization===label)).toBe(true)});
it("includes year-independent mathematics foundations",()=>{const list=CATALOG_SUBJECTS.filter(s=>s.category==="math-foundation");expect(list.length).toBeGreaterThanOrEqual(6);expect(list.every(s=>s.yearLevel===null)).toBe(true);expect(list.some(s=>s.slug==="basic-algebra")).toBe(true)});
it("does not present generic numbered specialty slots as real subjects",()=>{expect(CATALOG_SUBJECTS.some(s=>/professional course - specialized [1-5]/i.test(s.title))).toBe(false)});
it("keeps content status separate from subject discovery",()=>{expect(CATALOG_SUBJECTS.some(s=>s.availability==="coming-soon")).toBe(true);expect(CATALOG_SUBJECTS.every(s=>Boolean(s.sourceNote))).toBe(true)});
});
