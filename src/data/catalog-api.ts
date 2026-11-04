import { CATALOG_SUBJECTS } from "./catalog";
import { supabase } from "../lib/supabase";
import type { CatalogSubject, CatalogCategory, CatalogClassification, ContentAvailability, Specialization, YearLevel } from "../types/catalog";

function mapSubject(row: Record<string, unknown>): CatalogSubject {
  return {
    slug: String(row.slug),
    title: String(row.title),
    summary: String(row.summary ?? ""),
    yearLevel: row.year_level == null ? null : Number(row.year_level) as YearLevel,
    semester: row.semester == null ? null : String(row.semester),
    category: String(row.category) as CatalogCategory,
    classification: String(row.classification) as CatalogClassification,
    specialization: row.specialization == null ? null : String(row.specialization) as Specialization,
    aliases: Array.isArray(row.aliases) ? row.aliases.map(String) : [],
    sourceReference: String(row.source_reference ?? ""),
    sourceNote: String(row.source_note ?? ""),
    availability: String(row.availability) as ContentAvailability,
    displayOrder: Number(row.display_order ?? 0),
  };
}

export async function fetchCatalogSubjects(): Promise<CatalogSubject[]> {
  if (!supabase) return CATALOG_SUBJECTS;
  const { data, error } = await supabase.from("catalog_subjects")
    .select("slug,title,summary,year_level,semester,category,classification,specialization,aliases,source_reference,source_note,availability,display_order")
    .order("display_order", { ascending: true });

  if (error) throw new Error("The subject catalog could not be loaded.");
  return (data ?? []).map((row) => mapSubject(row as Record<string, unknown>));
}
