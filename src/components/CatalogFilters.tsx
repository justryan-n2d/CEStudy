import type { CatalogCategory,CatalogClassification,ContentAvailability } from "../types/catalog";

interface Props{
  query:string;onQueryChange:(v:string)=>void;
  year:string;onYearChange:(v:string)=>void;
  category:string;onCategoryChange:(v:string)=>void;
  classification:string;onClassificationChange:(v:string)=>void;
  availability:string;onAvailabilityChange:(v:string)=>void;
  onClear:()=>void;
}

export function CatalogFilters(p:Props){
  const activeFilterCount=[p.year,p.category,p.classification,p.availability].filter(Boolean).length;
  return <section className="filters-panel" aria-label="Filter subject catalog">
    <label className="search-field">
      <span>Search subjects or keywords</span>
      <input type="search" value={p.query} onChange={e=>p.onQueryChange(e.target.value)} placeholder="Try logarithms, statics, or fluids"/>
    </label>
    <details className="catalog-extra-filters">
      <summary>Filters{activeFilterCount>0&&<span className="active-filter-count">{activeFilterCount} active</span>}</summary>
      <div className="filter-grid">
        <label><span>Year level</span><select value={p.year} onChange={e=>p.onYearChange(e.target.value)}><option value="">All year levels</option><option value="1">First year</option><option value="2">Second year</option><option value="3">Third year</option><option value="4">Fourth year</option><option value="none">Not assigned to a year</option></select></label>
        <label><span>Subject family</span><select value={p.category} onChange={e=>p.onCategoryChange(e.target.value)}><option value="">All categories</option><option value={"year-level" satisfies CatalogCategory}>Year-level subjects</option><option value={"specialization" satisfies CatalogCategory}>Specializations</option><option value={"math-foundation" satisfies CatalogCategory}>Math foundations</option></select></label>
        <label><span>Classification</span><select value={p.classification} onChange={e=>p.onClassificationChange(e.target.value)}><option value="">All classifications</option><option value={"ched-common-course" satisfies CatalogClassification}>CHED common course</option><option value={"ched-specialized-course" satisfies CatalogClassification}>CHED specialized course</option><option value={"supplementary-math-foundation" satisfies CatalogClassification}>Supplementary math</option><option value={"additional-ce-review-topic" satisfies CatalogClassification}>Additional CE review topic</option></select></label>
        <label><span>Content status</span><select value={p.availability} onChange={e=>p.onAvailabilityChange(e.target.value)}><option value="">Any status</option><option value={"coming-soon" satisfies ContentAvailability}>Coming soon</option><option value={"in-preparation" satisfies ContentAvailability}>In preparation</option><option value={"has-published-content" satisfies ContentAvailability}>Study content available</option></select></label>
      </div>
      {activeFilterCount>0&&<button type="button" className="button button-quiet clear-filters" onClick={p.onClear}>Clear filters</button>}
    </details>
  </section>;
}
