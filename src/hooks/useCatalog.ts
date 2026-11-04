import { useCallback, useEffect, useState } from "react";
import { fetchCatalogSubjects } from "../data/catalog-api";
import type { CatalogSubject } from "../types/catalog";

export function useCatalog() {
  const [subjects, setSubjects] = useState<CatalogSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);

  const retry = useCallback(() => {
    setLoading(true);
    setError(null);
    setRequestVersion((current) => current + 1);
  }, []);

  useEffect(() => {
    let active = true;

    fetchCatalogSubjects()
      .then((items) => {
        if (active) setSubjects(items);
      })
      .catch((reason: unknown) => {
        if (active) {
          setError(reason instanceof Error ? reason.message : "The catalog could not be loaded. Check your connection and try again.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [requestVersion]);

  return { subjects, loading, error, retry };
}
