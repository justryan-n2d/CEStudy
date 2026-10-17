import { useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";

type ModalProps = { title: string; onClose: () => void; children: ReactNode; className?: string };

export function Modal({ title, onClose, children, className = "" }: ModalProps) {
  const titleId = useId();
  const closeButton = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const closeRef = useRef(onClose);
  const requestCloseRef = useRef<() => void>(() => {});
  const closeTimerRef = useRef<number | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => { closeRef.current = onClose; }, [onClose]);

  const requestClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    closeTimerRef.current = window.setTimeout(() => closeRef.current(), prefersReducedMotion ? 0 : 180);
  };
  requestCloseRef.current = requestClose;

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { requestCloseRef.current(); return; }
      if (event.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(
        'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
      )).filter(element => !element.hasAttribute("hidden") && element.getAttribute("aria-hidden") !== "true");
      if (!focusable.length) { event.preventDefault(); return; }
      const first = focusable[0], last = focusable[focusable.length - 1], active = document.activeElement;
      if (event.shiftKey && (active === first || !panel.contains(active))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (active === last || !panel.contains(active))) { event.preventDefault(); first.focus(); }
    };

    document.addEventListener("keydown", handleKeyDown);
    closeButton.current?.focus();
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
      previousFocus?.focus();
    };
  }, []);

  const closingClass = isClosing ? " is-closing" : "";
  return (
    <div className={`modal-backdrop${closingClass}`} role="presentation" onMouseDown={event => {
      if (event.target === event.currentTarget) requestCloseRef.current();
    }}>
      <section ref={panelRef} className={`modal-panel ${className}${closingClass}`.trim()} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <button className="modal-close" ref={closeButton} type="button" onClick={() => requestCloseRef.current()} aria-label="Close dialog">×</button>
        <h2 id={titleId}>{title}</h2>
        {children}
      </section>
    </div>
  );
}
