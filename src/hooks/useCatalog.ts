import { useEffect,useState } from "react";
import { fetchCatalogSubjects } from "../data/catalog-api";
import type { CatalogSubject } from "../types/catalog";
export function useCatalog(){const [subjects,setSubjects]=useState<CatalogSubject[]>([]);const [loading,setLoading]=useState(true);const [error,setError]=useState<string|null>(null);
 useEffect(()=>{let active=true;fetchCatalogSubjects().then(items=>{if(active)setSubjects(items)}).catch((e:unknown)=>{if(active)setError(e instanceof Error?e.message:"The catalog could not be loaded.")}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[]);
 return {subjects,loading,error};
}
