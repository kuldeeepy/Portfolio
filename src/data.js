export const RESUME_URL   = "https://drive.google.com/file/d/1tfRMitzGzOLEaxzvIIhUwNHoEAIY3pY5/view?usp=sharing";

// Public URLs — hardcoded on purpose. As env vars these silently rendered as
// text with no href whenever a var was missing, which is what happened in
// production: the four social vars were never set on Vercel.
export const X_URL        = "https://x.com/iamkuldeepY";
export const GIT_URL      = "https://github.com/kuldeeepy";
export const LINKEDIN_URL = "https://www.linkedin.com/in/kuldeeep-yadav/";
export const LEETCODE_URL = "https://leetcode.com/u/kuldeeepy/";

// Order here is the order on the page — newest isn't automatically best.
// `demo` is optional; a row with only `code` just renders one link.
// Four that get the real estate. Order here is the order on the page.
export const projects = [
  {
    name: "checkout-copilot",
    short: "Turns plain English into payment API calls.",
    demo: "https://checkout-copilot.vercel.app",
    code: "https://github.com/kuldeeepy/checkout-copilot",
  },
  {
    name: "algo-trader",
    short: "Backtests trading strategies.",
    code: "https://github.com/kuldeeepy/algo-trader",
  },
  {
    // Repo is private, so this one is demo-only until it's published.
    name: "adscan",
    short: "The ads are spending. Is anything counting?",
    demo: "https://adscan-beta.vercel.app",
  },
  {
    name: "diet-plate",
    short: "Plans a week of meals.",
    code: "https://github.com/kuldeeepy/diet-plate",
  },
];

// Smaller things. These get thrown into the physics canvas — drag them around.
// Live demo where one exists, repo otherwise.
export const playground = [
  { name: "first-mcp-server", url: "https://github.com/kuldeeepy/first-mcp-server" },
  { name: "simple-app-aws",   url: "https://github.com/kuldeeepy/simple-app-aws" },
  { name: "money-tracker",    url: "https://github.com/kuldeeepy/money-tracker" },
  { name: "e-commerce-cicd",  url: "https://github.com/kuldeeepy/e-commerce-cicd" },
  { name: "github-activity",  url: "https://github.com/kuldeeepy/github-activity" },
  { name: "OpenBook",         url: "https://openbook-org.vercel.app" },
];

export const workHistory = [
  {
    role: "Software Engineer",
    company: "Kim.cc",
    from: "2024",
    to: "Now",
    link: "https://kim.cc",
    favicon: "https://www.google.com/s2/favicons?domain=kim.cc&sz=32",
  },
  {
    role: "Founding Engineer",
    company: "Go CrossPay",
    from: "2023",
    to: "2024",
    link: "https://www.gocrosspe.com",
    favicon: "https://www.google.com/s2/favicons?domain=gocrosspe.com&sz=32",
  },
];

export const connectLinks = [
  { label: "Twitter",  value: "@iamkuldeepY",   href: X_URL,        social: "twitter"  },
  { label: "GitHub",   value: "@kuldeeepy",     href: GIT_URL,      social: "github"   },
  { label: "LinkedIn", value: "Kuldeeep Yadav", href: LINKEDIN_URL, social: "linkedin" },
  { label: "Leetcode", value: "@kuldeeepy",     href: LEETCODE_URL, social: "leetcode" },
];
