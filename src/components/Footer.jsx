import VisitorLocation from "./VisitorLocation";
import ThemeToggleIcon from "./ThemeToggleIcon";

// Just the visitor line and the theme switch. The social links moved up under
// the profile, where someone deciding whether to reach out actually is.
export default function Footer({ theme, toggleTheme }) {
  const isLight = theme === "light";

  return (
    <footer className="site-footer">
      <VisitorLocation />

      <button
        onClick={toggleTheme}
        aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
        className="theme-toggle-btn"
      >
        <ThemeToggleIcon isLight={isLight} />
        {isLight ? "Dark" : "Light"}
      </button>
    </footer>
  );
}
