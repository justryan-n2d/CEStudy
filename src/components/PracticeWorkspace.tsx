import { useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";

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
  const [toolsOpen, setToolsOpen] = useState(false);

  function closeToolsAndRestoreFocus() {
    setToolsOpen(false);
    triggerRef.current?.focus();
  }

  useEffect(() => {
    if (!hasTools || !toolsOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusableSelector = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const getFocusableElements = () => Array.from(
      toolsRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
    ).filter((element) => !element.closest('[hidden], [aria-hidden="true"]'));

    getFocusableElements()[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeToolsAndRestoreFocus();
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
  }, [hasTools, toolsOpen]);

  useEffect(() => {
    if (!hasTools) setToolsOpen(false);
  }, [hasTools]);

  return (
    <div className={hasTools ? "practice-workspace practice-workspace--with-tools" : "practice-workspace"} data-testid="practice-workspace">
      <div className="practice-workspace__content">
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
            onClick={() => setToolsOpen(true)}
          >
            Open practice tools
          </button>
          {toolsOpen ? (
            <button
              className="practice-workspace__backdrop"
              type="button"
              aria-label="Close practice tools backdrop"
              tabIndex={-1}
              onClick={closeToolsAndRestoreFocus}
            />
          ) : null}
          <aside
            ref={toolsRef}
            id={toolsId}
            className={toolsOpen ? "practice-workspace__tools is-open" : "practice-workspace__tools"}
            aria-labelledby={titleId}
            role={toolsOpen ? "dialog" : undefined}
            aria-modal={toolsOpen ? "true" : undefined}
            tabIndex={toolsOpen ? -1 : undefined}
          >
            <div className="practice-workspace__tools-header">
              <h2 id={titleId}>Practice tools</h2>
              {toolsOpen ? (
                <button className="button button-quiet practice-workspace__tools-close" type="button" onClick={closeToolsAndRestoreFocus}>
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
