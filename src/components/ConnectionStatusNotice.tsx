import { useNetworkStatus } from "../hooks/useNetworkStatus";

export function ConnectionStatusNotice() {
  const isOnline = useNetworkStatus();

  if (isOnline) return null;

  return (
    <div className="connection-status-notice" role="status" aria-live="polite">
      <span className="connection-status-indicator" aria-hidden="true" />
      <p>
        <strong>You're offline.</strong>{" "}
        Some CEStudy content may be unavailable until your connection returns.
      </p>
    </div>
  );
}
