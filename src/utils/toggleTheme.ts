import type { MouseEvent } from "react";

interface ViewTransitionDocument extends Document {
  startViewTransition?: (update: () => void) => { ready: Promise<void> };
}

export function toggleTheme(e: MouseEvent<HTMLButtonElement>, apply: () => void): void {
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  const transitionDocument = document as ViewTransitionDocument;

  if (!transitionDocument.startViewTransition || reduceMotion) {
    apply();
    return;
  }

  const bounds = e.currentTarget.getBoundingClientRect();
  const x = e.clientX || bounds.left + bounds.width / 2;
  const y = e.clientY || bounds.top + bounds.height / 2;
  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );

  const transition = transitionDocument.startViewTransition(apply);
  void transition.ready.then(() => {
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0 at ${x}px ${y}px)`,
          `circle(${radius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 600,
        easing: "cubic-bezier(.65,0,.35,1)",
        pseudoElement: "::view-transition-new(root)",
      },
    );
  });
}
