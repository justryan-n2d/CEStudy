import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { ReactNode, TransitionEvent } from "react";

type PracticeWorkspaceProps = {
  children: ReactNode;
  tools?: ReactNode;
};

export function PracticeWorkspace({ children, tools }: PracticeWorkspaceProps) {
  const hasTools = tools !== undefined && tools !== null && tools !== false;
  const toolsId = useId();
  const titleId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const toolsRef = useRef<HTMLElement>(null);
  const restoreFocusRef = useRef(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [toolsClosing, setToolsClosing] = useState(false);
  const modalActive = toolsOpen || toolsClosing;

  const closeTools = useCallback(() => {
    if (!toolsOpen) return;

    restoreFocusRef.current = true;
    setToolsOpen(false);

    const prefersReducedMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    setToolsClosing(!prefersReducedMotion);
  }, [toolsOpen]);

  const handleToolsTransitionEnd = useCallback((event: TransitionEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget || event.propertyName !== "transform") return;
    setToolsClosing(false);
  }, []);

  useEffect(() => {
    if (!hasTools || !modalActive) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    if (!toolsOpen) {
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }

    const focusableSelector =
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const getFocusableElements = () => Array.from(
      toolsRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
    ).filter((element) => !element.closest('[hidden], [aria-hidden="true"]'));

    getFocusableElements()[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeTools();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = getFocusableElements();
      if (focusable.length === 0) {
        event.preventDefault();
        toolsRef.current?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !toolsRef.current?.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !toolsRef.current?.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [hasTools, modalActive, toolsOpen, closeTools]);

  useEffect(() => {
    if (!hasTools) {
      setToolsOpen(false);
      setToolsClosing(false);
    }
  }, [hasTools]);

  useEffect(() => {
    if (modalActive || !restoreFocusRef.current) return;
    restoreFocusRef.current = false;
    triggerRef.current?.focus();
  }, [modalActive]);

  const sheetVisible = toolsOpen || toolsClosing;

  return (
    <div className={hasTools ? "practice-workspace practice-workspace--with-tools" : "practice-workspace"} data-testid="practice-workspace">
      <div
        className="practice-workspace__content"
        data-testid="practice-workspace-content"
        inert={modalActive}
      >
        {children}
      </div>

      {hasTools ? (
        <>
          <button
            ref={triggerRef}
            className="button button-secondary practice-workspace__tools-trigger"
            type="button"
            aria-controls={toolsId}
            aria-expanded={toolsOpen}
            inert={modalActive}
            onClick={() => {
              setToolsClosing(false);
              setToolsOpen(true);
            }}
          >
            Open practice tools
          </button>

          {sheetVisible ? (
            <button
              className={toolsClosing
                ? "practice-workspace__backdrop is-closing"
                : "practice-workspace__backdrop is-open"}
              type="button"
              aria-label="Close practice tools backdrop"
              tabIndex={-1}
              onClick={closeTools}
            />
          ) : null}

          <aside
            ref={toolsRef}
            id={toolsId}
            className={[
              "practice-workspace__tools",
              toolsOpen ? "is-open" : "",
              toolsClosing ? "is-closing" : "",
            ].filter(Boolean).join(" ")}
            aria-labelledby={titleId}
            aria-hidden={toolsClosing || undefined}
            inert={toolsClosing}
            role={toolsOpen ? "dialog" : undefined}
            aria-modal={toolsOpen ? "true" : undefined}
            tabIndex={toolsOpen ? -1 : undefined}
            onTransitionEnd={handleToolsTransitionEnd}
          >
            <div className="practice-workspace__tools-header">
              <h2 id={titleId}>Practice tools</h2>
              {toolsOpen ? (
                <button className="button button-quiet practice-workspace__tools-close" type="button" onClick={closeTools}>
                  Close practice tools
                </button>
              ) : null}
            </div>
            <div className="practice-workspace__tools-content">{tools}</div>
          </aside>
        </>
      ) : null}
    </div>
  );
}
