export type YearLevel=1|2|3|4;
export type CatalogCategory="year-level"|"specialization"|"math-foundation";
export type CatalogClassification="ched-common-course"|"ched-specialized-course"|"supplementary-math-foundation"|"additional-ce-review-topic";
export type ContentAvailability="coming-soon"|"in-preparation"|"has-published-content";
export const SPECIALIZATIONS=["Construction Engineering and Management","Geotechnical Engineering","Structural Engineering","Transportation Engineering","Water Resources Engineering"] as const;
export type Specialization=(typeof SPECIALIZATIONS)[number];
export interface CatalogSubject{slug:string;title:string;summary:string;yearLevel:YearLevel|null;semester:string|null;category:CatalogCategory;classification:CatalogClassification;specialization:Specialization|null;aliases:string[];sourceReference:string;sourceNote:string;availability:ContentAvailability;displayOrder:number}
