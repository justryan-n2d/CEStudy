import { useSyncExternalStore } from "react";

function subscribe(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;

  window.addEventListener("online", onStoreChange);
  window.addEventListener("offline", onStoreChange);

  return () => {
    window.removeEventListener("online", onStoreChange);
    window.removeEventListener("offline", onStoreChange);
  };
}

function getBrowserOnlineSnapshot(): boolean {
  return typeof navigator === "undefined" ? true : navigator.onLine;
}

function getServerSnapshot(): boolean {
  return true;
}

/**
 * Returns the browser's current online/offline signal.
 * This does not verify public internet, DNS, Cloudflare, or Supabase reachability.
 */
export function useNetworkStatus(): boolean {
  return useSyncExternalStore(subscribe, getBrowserOnlineSnapshot, getServerSnapshot);
}
