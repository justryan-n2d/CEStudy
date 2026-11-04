import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
};

export function ScrollReveal({ children, className = "", delayMs = 0 }: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    if (reduceMotion || typeof IntersectionObserver === "undefined") {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        setRevealed(true);
        observer.unobserve(entry.target);
      }
    }, { rootMargin: "0px 0px -36px 0px", threshold: 0.08 });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const style: CSSProperties | undefined = delayMs > 0 ? { transitionDelay: `${delayMs}ms` } : undefined;
  return (
    <div
      ref={elementRef}
      className={`scroll-reveal${revealed ? " is-visible" : ""} ${className}`.trim()}
      data-reveal-state={revealed ? "visible" : "waiting"}
      style={style}
    >
      {children}
    </div>
  );
}
