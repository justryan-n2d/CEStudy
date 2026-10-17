import { useRef, useState } from "react";
import { Modal } from "../components/Modal";
import { submitPublicMessage } from "../data/public-messages";

type Provider = "gcash" | "paypal";

function validQrSource(value: string): string {
  // Use a same-origin asset to match the site's restrictive img-src CSP.
  return value.startsWith("/") && !value.startsWith("//") ? value : "";
}

function validExternalUrl(value: string): string {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" ? value : "";
  } catch {
    return "";
  }
}

function newSubmissionId() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, character => {
    const random = Math.floor(Math.random() * 16);
    return (character === "x" ? random : (random & 0x3) | 0x8).toString(16);
  });
}

export function SupportPage() {
  const gcashQrUrl = validQrSource(import.meta.env.VITE_GCASH_QR_URL?.trim() ?? "");
  const paypalUrl = validExternalUrl(import.meta.env.VITE_PAYPAL_SUPPORT_URL?.trim() ?? "");
  const [provider, setProvider] = useState<Provider | null>(null);
  const [note, setNote] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const submissionId = useRef<string | null>(null);

  function openProvider(next: Provider) {
    setProvider(next);
    setNote("");
    setConfirmed(false);
    setError("");
    submissionId.current = null;
  }

  function closeProvider() {
    if (sending) return;
    setProvider(null);
    setError("");
  }

  const methodConfigured = provider === "gcash" ? Boolean(gcashQrUrl) : provider === "paypal" ? Boolean(paypalUrl) : false;

  async function handleComplete() {
    if (!provider || !methodConfigured || !confirmed || sending) return;
    setSending(true);
    setError("");
    submissionId.current ??= newSubmissionId();
    try {
      await submitPublicMessage({
        type: "support",
        clientSubmissionId: submissionId.current,
        provider,
        message: note.trim(),
        confirmed: true,
      });
      setProvider(null);
      setNote("");
      setConfirmed(false);
      submissionId.current = null;
      setSuccessOpen(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "We couldn't record your confirmation. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="page-wrap">
      <section className="page-intro">
        <h1>Support CEStudy</h1>
        <p>Choose a payment method to view its details.</p>
      </section>

      <div className="support-method-grid">
        <article className="support-method-card">
          <div className="payment-mark payment-mark-gcash" aria-hidden="true">G</div>
          <div className="support-method-copy">
            <h2>GCash</h2>
            <p>View the GCash QR code and optional note.</p>
          </div>
          <button className="button button-secondary" type="button" onClick={() => openProvider("gcash")}>View GCash details</button>
        </article>
        <article className="support-method-card">
          <div className="payment-mark payment-mark-paypal" aria-hidden="true">P</div>
          <div className="support-method-copy">
            <h2>PayPal</h2>
            <p>Open the PayPal support link, then confirm once finished.</p>
          </div>
          <button className="button button-secondary" type="button" onClick={() => openProvider("paypal")}>View PayPal details</button>
        </article>
      </div>

      <p className="support-note">Support confirmations are self-reported. CEStudy does not verify a payment automatically.</p>

      {provider && (
        <Modal title={provider === "gcash" ? "Support via GCash" : "Support via PayPal"} onClose={closeProvider} className="support-modal">
          {provider === "gcash" ? (
            gcashQrUrl ? (
              <div className="support-qr-wrap">
                <img className="support-qr" src={gcashQrUrl} alt="GCash payment QR code" width={260} height={260} />
                <p className="field-hint">Scan this QR code in GCash. Check the recipient details before sending.</p>
              </div>
            ) : (
              <p className="inline-status inline-status-warning" role="status">The GCash QR code has not been configured yet.</p>
            )
          ) : (
            paypalUrl ? (
              <a className="button button-primary paypal-open-link" href={paypalUrl} target="_blank" rel="noopener noreferrer">Open PayPal <span aria-hidden="true">↗</span></a>
            ) : (
              <p className="inline-status inline-status-warning" role="status">The PayPal support link has not been configured yet.</p>
            )
          )}

          <label className="form-field support-note-field">
            <span>Optional message</span>
            <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} maxLength={500} placeholder="Leave a short note with your support." />
          </label>
          <label className="confirmation-check">
            <input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} disabled={!methodConfigured || sending} />
            <span>I have sent support using {provider === "gcash" ? "GCash" : "PayPal"}.</span>
          </label>
          {error && <p className="inline-status inline-status-error" role="alert">{error}</p>}
          <button className="button button-primary modal-action" type="button" onClick={handleComplete} disabled={!methodConfigured || !confirmed || sending}>
            {sending ? <><span className="loading-spinner" aria-hidden="true" /> Sending...</> : "Complete"}
          </button>
        </Modal>
      )}

      {successOpen && (
        <Modal title="Support confirmation sent" onClose={() => setSuccessOpen(false)} className="success-modal">
          <span className="success-mark" aria-hidden="true">✓</span>
          <p>Your support confirmation was sent to the authorized CEStudy inbox. Payment has not been verified automatically.</p>
          <button className="button button-primary" type="button" onClick={() => setSuccessOpen(false)}>Close</button>
        </Modal>
      )}
    </div>
  );
}
