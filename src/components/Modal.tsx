import { useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";

type ModalProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
};

export function Modal({ title, onClose, children, className = "" }: ModalProps) {
  const titleId = useId();
  const closeButton = useRef<HTMLButtonElement>(null);
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
    };
    document.addEventListener("keydown", handleKeyDown);
    closeButton.current?.focus();
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, []);

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className={`modal-panel ${className}`.trim()} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <button className="modal-close" ref={closeButton} type="button" onClick={onClose} aria-label="Close dialog">×</button>
        <h2 id={titleId}>{title}</h2>
        {children}
      </section>
    </div>
  );
}
