import kimLogo from "./assets/kim-logo.jpg";
import shotCheckout from "./assets/shots/checkout-copilot.webp";
import shotAlgo from "./assets/shots/algo-trader.webp";
import shotAdscan from "./assets/shots/adscan.webp";
// Cropped to the app column; the original was a desktop capture with the
// phone-width UI sitting left of centre, so a phone frame cut it in half.
import shotDiet from "./assets/shots/diet-plate-mobile.png";

// Overridable from Vercel so a new resume upload needs no code change.
// The literal is a fallback, not a placeholder: if the env var is missing the
// link still works. Leaving it env-only is what left the social links dead.
export const RESUME_URL   =
  import.meta.env.VITE_RESUME ||
  "https://drive.google.com/file/d/1LH8oKJOWPuqB60mUY-BRbiw2LUf76K0L/view?usp=sharing";

// Public URLs — hardcoded on purpose. As env vars these silently rendered as
// text with no href whenever a var was missing, which is what happened in
// production: the four social vars were never set on Vercel.
export const X_URL        = "https://x.com/iamkuldeepY";
export const GIT_URL      = "https://github.com/kuldeeepy";
export const LINKEDIN_URL = "https://www.linkedin.com/in/kuldeeep-yadav/";
export const LEETCODE_URL = "https://leetcode.com/u/kuldeeepy/";

// Personal account — this is what the contribution graph reads.
export const GIT_USER = "kuldeeepy";

// Fill this in and the mail icon appears in the footer row. Empty on purpose:
// a mailto: to a guessed address is worse than no icon at all.
export const EMAIL = "";

// `frame` shapes the thumbnail: a browser chrome for web apps, a handset for
// mobile ones. At 80px the silhouette is what reads, not the screenshot.
// Order here is the order on the page — newest isn't automatically best.
// `demo` is optional; a row with only `code` just renders one link.
// Four that get the real estate. Order here is the order on the page.
export const projects = [
  {
    name: "checkout copilot",
    frame: "browser",
    shot: shotCheckout,
    tag: "Recent",
    short: "Plain English into payment API calls.",
    demo: "https://checkout-copilot.vercel.app",
    code: "https://github.com/kuldeeepy/checkout-copilot",
  },
  {
    name: "algo trader",
    frame: "browser",
    shot: shotAlgo,
    short: "Backtests intraday strategies.",
    code: "https://github.com/kuldeeepy/algo-trader",
  },
  {
    // Repo is private, so this one is demo-only until it's published.
    name: "adscan",
    frame: "browser",
    shot: shotAdscan,
    short: "Ads are spending. Is anything counting?",
    demo: "https://adscan-beta.vercel.app",
  },
  {
    name: "diet plate",
    frame: "phone",
    shot: shotDiet,
    short: "Plans a week of meals.",
    code: "https://github.com/kuldeeepy/diet-plate",
  },
];

// Smaller things. These get thrown into the physics canvas — drag them around.
// Live demo where one exists, repo otherwise.
export const playground = [
  { name: "oci-a1-hunter",    url: "https://github.com/kuldeeepy/oci-a1-hunter" },
  { name: "first-mcp-server", url: "https://github.com/kuldeeepy/first-mcp-server" },
  { name: "simple-app-aws",   url: "https://github.com/kuldeeepy/simple-app-aws" },
  { name: "money-tracker",    url: "https://github.com/kuldeeepy/money-tracker" },
  { name: "e-commerce-cicd",  url: "https://github.com/kuldeeepy/e-commerce-cicd" },
  { name: "github-activity",  url: "https://github.com/kuldeeepy/github-activity" },
  { name: "OpenBook",         url: "https://openbook-org.vercel.app" },
];

// `start`/`end` are "YYYY-MM"; `end: null` means current. Duration is computed
// from them, so it stays right without anyone editing a hardcoded "10 mos".
// Set to null until the real months are confirmed — a wrong date on a CV is
// worse than a missing one, so the row just shows the year range instead.
export const workHistory = [
  {
    role: "Software Engineer",
    company: "Kim.cc",
    location: "Hybrid",
    start: null,
    end: null,
    from: "2024",
    to: "Now",
    link: "https://kim.cc",
    // Real logo, stored locally: the LinkedIn CDN URL it came from carries an
    // expiry token and would have 404'd in a couple of weeks.
    logo: kimLogo,
  },
  {
    role: "Founding Engineer",
    company: "Go CrossPay",
    location: "Remote",
    start: null,
    end: null,
    from: "2024",
    to: "2024",
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
