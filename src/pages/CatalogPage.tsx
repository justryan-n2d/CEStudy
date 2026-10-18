import { useEffect,useMemo,useState } from "react";
import { Link } from "react-router-dom";
import { CatalogFilters } from "../components/CatalogFilters";
import { BrandLoader } from "../components/BrandLoader";
import { CurriculumNotice } from "../components/CurriculumNotice";
import { SubjectCard } from "../components/SubjectCard";
import { ScrollReveal } from "../components/ScrollReveal";
import { useCatalog } from "../hooks/useCatalog";
import { fetchPublishedTopicIndex } from "../data/topic-search-api";
import type { PublishedTopicIndexEntry } from "../data/topic-search-api";

function topicSearchText(topic:PublishedTopicIndexEntry,subjectTitle:string):string {
  return [topic.title,topic.slug,subjectTitle,...topic.learningObjectives].join(" ").normalize("NFKC").toLowerCase();
}

export function CatalogPage(){
  const {subjects,loading,error}=useCatalog();
  const [query,setQuery]=useState("");
  const [year,setYear]=useState("");
  const [category,setCategory]=useState("");
  const [classification,setClassification]=useState("");
  const [availability,setAvailability]=useState("");
  const [publishedTopics,setPublishedTopics]=useState<PublishedTopicIndexEntry[]>([]);
  const [topicSearchError,setTopicSearchError]=useState(false);

  useEffect(()=>{
    let active=true;
    fetchPublishedTopicIndex()
      .then(items=>{if(active)setPublishedTopics(items);})
      .catch(()=>{if(active)setTopicSearchError(true);});
    return()=>{active=false;};
  },[]);

  const normalizedQuery=query.trim().normalize("NFKC").toLowerCase();
  const queryTerms=normalizedQuery.split(/\s+/).filter(Boolean);
  const eligibleSubjects=useMemo(()=>subjects.filter(subject=>{
    const matchesYear=!year||(year==="none"?subject.yearLevel===null:String(subject.yearLevel)===year);
    return matchesYear
      &&(!category||subject.category===category)
      &&(!classification||subject.classification===classification)
      &&(!availability||subject.availability===availability);
  }),[subjects,year,category,classification,availability]);

  const filteredSubjects=useMemo(()=>eligibleSubjects.filter(subject=>{
    const searchable=[subject.title,subject.summary,...subject.aliases,subject.specialization??""].join(" ").normalize("NFKC").toLowerCase();
    return !normalizedQuery||searchable.includes(normalizedQuery);
  }),[eligibleSubjects,normalizedQuery]);

  const matchingTopics=useMemo(()=>{
    if(!normalizedQuery)return [];
    return publishedTopics.filter(topic=>{
      const parent=eligibleSubjects.find(subject=>subject.slug===topic.subjectSlug);
      return Boolean(parent)&&queryTerms.every(term=>topicSearchText(topic,parent?.title??"").includes(term));
    }).slice(0,8);
  },[publishedTopics,eligibleSubjects,normalizedQuery]);

  const clearFilters=()=>{setYear("");setCategory("");setClassification("");setAvailability("");};
  const clear=()=>{setQuery("");clearFilters();};
  const totalResults=filteredSubjects.length+matchingTopics.length;
  const showSearchResults=Boolean(normalizedQuery);

  return <div className="page-wrap">
    <section className="page-intro"><h1>Subject catalog</h1></section>
    <ScrollReveal className="reveal-section">
      <CatalogFilters query={query} onQueryChange={setQuery} year={year} onYearChange={setYear} category={category} onCategoryChange={setCategory} classification={classification} onClassificationChange={setClassification} availability={availability} onAvailabilityChange={setAvailability} onClear={clearFilters}/>
    </ScrollReveal>
    <ScrollReveal className="reveal-section" delayMs={60}>
      <div className="results-heading">
        <h2>{loading?"Loading subjects…":showSearchResults?"Search results":"Subjects and topics"}</h2>
        <span role="status" aria-live="polite" aria-atomic="true">{loading?"":totalResults+" result"+(totalResults===1?"":"s")}</span>
      </div>
      {error?<div className="state-panel state-error" role="alert"><h3>Catalog unavailable</h3><p>{error}</p></div>
      :loading?<div className="state-panel"><BrandLoader label="Loading subjects…"/></div>
      :<>
        {matchingTopics.length>0&&<section className="catalog-topic-results" aria-labelledby="matching-topics-heading">
          <h3 id="matching-topics-heading">Matching topics</h3>
          <div className="topic-search-results">
            {matchingTopics.map(topic=>{
              const parent=subjects.find(subject=>subject.slug===topic.subjectSlug);
              return <Link className="topic-search-result" key={topic.subjectSlug+":"+topic.unitNumber} to={`/study/${topic.subjectSlug}/${topic.unitNumber}`}>
                <span><strong>{topic.title}</strong><small>{parent?.title??topic.subjectSlug} · Unit {topic.unitNumber}</small></span>
                <span aria-hidden="true">→</span>
              </Link>;
            })}
          </div>
        </section>}
        {filteredSubjects.length>0&&<section aria-label={showSearchResults?"Matching subjects":"Subjects"}>
          {showSearchResults&&<h3 className="catalog-subheading">Matching subjects</h3>}
          <div className="subject-grid">{filteredSubjects.map(subject=><SubjectCard key={subject.slug} subject={subject}/>)}</div>
        </section>}
        {filteredSubjects.length===0&&matchingTopics.length===0&&<div className="state-panel">
          <h3>No results found</h3>
          <p>{topicSearchError?"Topic search is unavailable right now. Try a subject name.":"Try a different keyword."}</p>
          <button className="button button-secondary" type="button" onClick={clear}>Clear search</button>
        </div>}
      </>}
    </ScrollReveal>
    <CurriculumNotice/>
  </div>;
}
