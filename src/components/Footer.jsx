import VisitorLocation from "./VisitorLocation";
import ThemeToggleIcon from "./ThemeToggleIcon";

// Just the visitor line and the theme switch. The social links moved up under
// the profile, where someone deciding whether to reach out actually is.
export default function Footer({ theme, toggleTheme }) {
  const isLight = theme === "light";
  // The button advertises what it switches TO, so icon and label agree.
  const goingLight = !isLight;

  return (
    <footer className="site-footer">
      <VisitorLocation />

      <button
        onClick={toggleTheme}
        aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
        className="theme-toggle-btn"
      >
        <ThemeToggleIcon sun={goingLight} />
        {goingLight ? "Light" : "Dark"}
      </button>
    </footer>
  );
}
