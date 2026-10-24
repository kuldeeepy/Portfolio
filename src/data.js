import kimLogo from "./assets/kim-logo.jpg";
import shotAlgo from "./assets/shots/algo-trader.webp";
import shotCheckout from "./assets/shots/checkout-copilot.webp";
import shotWhisperly from "./assets/shots/whisperly.png";

// Overridable from Vercel so a new resume upload needs no code change.
// The literal is a fallback, not a placeholder: if the env var is missing the
// link still works. Leaving it env-only is what left the social links dead.
export const RESUME_URL   =
  import.meta.env.VITE_RESUME ||
  "https://drive.google.com/file/d/1Q184-FIHp8oUcqPK_d4RXsBH7Q-bL8qQ/view?usp=sharing";

// Public URLs — hardcoded on purpose. As env vars these silently rendered as
// text with no href whenever a var was missing, which is what happened in
// production: the four social vars were never set on Vercel.
export const X_URL        = "https://x.com/itskuldeeep";
export const GIT_URL      = "https://github.com/kuldeeepy";
export const LINKEDIN_URL = "https://www.linkedin.com/in/kuldeeep-yadav/";
export const LEETCODE_URL = "https://leetcode.com/u/kuldeeepy/";

// Personal account — this is what the contribution graph reads.
export const GIT_USER = "kuldeeepy";

// Used by "Message me" and the mail icon in the social row. Empty hides the
// icon: a mailto: to a guessed address is worse than none.
export const EMAIL = "kuldeeep.yadav1@gmail.com";

// `frame` shapes the thumbnail: a browser chrome for web apps, a handset for
// mobile ones. At 80px the silhouette is what reads, not the screenshot.
// Order here is the order on the page — newest isn't automatically best.
// `demo` is optional; a row with only `code` just renders one link.
// Four that get the real estate. Order here is the order on the page.
export const projects = [
  {
    name: "sleeplog",
    frame: "browser",
    short: "Sleep tracking with just a phone.",
    code: "https://github.com/kuldeeepy/sleeplog",
  },
  {
    name: "webmcp recorder",
    frame: "browser",
    tag: "Recent",
    short: "Teach a web task once, it runs per row.",
    code: "https://github.com/kuldeeepy/webmcp-recorder",
  },
  {
    name: "botsense",
    frame: "browser",
    shot: shotCheckout,
    short: "Real-time monitoring for AI agents.",
    code: "https://github.com/kuldeeepy/botsense",
    demo: "https://botsense.vercel.app",
  },
  {
    name: "algo trader",
    frame: "browser",
    shot: shotAlgo,
    short: "Backtests intraday strategies.",
    code: "https://github.com/kuldeeepy/algo-trader",
    demo: "https://algo-trader-six.vercel.app",
  },
];

// Smaller things. These get thrown into the physics canvas — drag them around.
// Live demo where one exists, repo otherwise.
export const playground = [
  // Demo rather than repo: this one is still private.
  { name: "whisperly",           url: "https://github.com/kuldeeepy/whisperly" },
  { name: "adscan",           url: "https://adscan-beta.vercel.app" },
  { name: "oci-a1-hunter",    url: "https://github.com/kuldeeepy/oci-a1-hunter" },
  { name: "first-mcp-server", url: "https://github.com/kuldeeepy/first-mcp-server" },
  { name: "money-tracker",    url: "https://github.com/kuldeeepy/money-tracker" },
  { name: "winkscroll",       url: "https://github.com/kuldeeepy/winkscroll" },
  { name: "jev food",         url: "https://jev-food.vercel.app" },
  { name: "gunrun",           url: "https://gunrun-orpin.vercel.app" },
];

// `start`/`end` are "YYYY-MM"; `end: null` means current. Duration is computed
// from them, so it stays right without anyone editing a hardcoded "10 mos".
export const workHistory = [
  {
    role: "Software Engineer",
    company: "Kim.cc",
    location: "Hybrid",
    start: "2024-12",
    end: null,
    link: "https://kim.cc",
    // Real logo, stored locally: the LinkedIn CDN URL it came from carries an
    // expiry token and would have 404'd in a couple of weeks.
    logo: kimLogo,
  },
  {
    role: "Founding Engineer",
    company: "CrossPe",
    location: "Remote",
    start: "2024-04",
    end: "2024-06",
    link: "https://www.gocrosspe.com",
    favicon: "https://www.google.com/s2/favicons?domain=gocrosspe.com&sz=64",
  },
];

// Footer icon row. `label` is the accessible name — the row itself is icons only.
export const connectLinks = [
  { label: "Twitter",  href: X_URL,        social: "twitter"  },
  { label: "GitHub",   href: GIT_URL,      social: "github"   },
  { label: "LinkedIn", href: LINKEDIN_URL, social: "linkedin" },
  { label: "Leetcode", href: LEETCODE_URL, social: "leetcode" },
  ...(EMAIL ? [{ label: "Email", href: `mailto:${EMAIL}`, social: "mail" }] : []),
];
