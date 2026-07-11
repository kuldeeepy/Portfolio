import VisitorLocation from "./VisitorLocation";
import ThemeToggleIcon from "./ThemeToggleIcon";

export default function Footer({ theme, toggleTheme }) {
  const isLight = theme === "light";

  return (
    <footer
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
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
