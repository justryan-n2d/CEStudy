import { useTheme } from "../contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="theme-toggle" role="group" aria-label="Color theme">
      <button
        className={`theme-toggle-option${theme === "light" ? " is-selected" : ""}`}
        type="button"
        aria-label="Light"
        aria-pressed={theme === "light"}
        onClick={() => setTheme("light")}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
        </svg>
        <span>Light</span>
      </button>
      <button
        className={`theme-toggle-option${theme === "dark" ? " is-selected" : ""}`}
        type="button"
        aria-label="Dark"
        aria-pressed={theme === "dark"}
        onClick={() => setTheme("dark")}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M20.7 15.1A8.7 8.7 0 0 1 8.9 3.3 8.8 8.8 0 1 0 20.7 15.1Z" />
        </svg>
        <span>Dark</span>
      </button>
    </div>
  );
}
