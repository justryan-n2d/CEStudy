import { CATALOG_SUBJECTS } from "./catalog";
import { supabase } from "../lib/supabase";
import type { CatalogSubject,CatalogCategory,CatalogClassification,ContentAvailability,Specialization,YearLevel } from "../types/catalog";
function mapSubject(r:Record<string,unknown>):CatalogSubject{return{
 slug:String(r.slug),title:String(r.title),summary:String(r.summary??""),yearLevel:r.year_level==null?null:Number(r.year_level) as YearLevel,
 semester:r.semester==null?null:String(r.semester),category:String(r.category) as CatalogCategory,classification:String(r.classification) as CatalogClassification,
 specialization:r.specialization==null?null:String(r.specialization) as Specialization,aliases:Array.isArray(r.aliases)?r.aliases.map(String):[],
 sourceReference:String(r.source_reference??""),sourceNote:String(r.source_note??""),availability:String(r.availability) as ContentAvailability,displayOrder:Number(r.display_order??0)
}}
export async function fetchCatalogSubjects():Promise<CatalogSubject[]>{if(!supabase)return CATALOG_SUBJECTS;
 const {data,error}=await supabase.from("catalog_subjects").select("slug,title,summary,year_level,semester,category,classification,specialization,aliases,source_reference,source_note,availability,display_order").order("display_order",{ascending:true});
 if(error)throw new Error("The subject catalog could not be loaded. Check Supabase configuration and public read policies.");
 return (data??[]).map(r=>mapSubject(r as Record<string,unknown>));
}
