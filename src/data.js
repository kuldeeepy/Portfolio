import p2 from "./assets/project_two.webp";
import p3 from "./assets/project_three.png";
import p4 from "./assets/project_four.png";
import p5 from "./assets/project_five.webp";
import iconMoney from "./assets/icon_money.svg";
import iconAlgo  from "./assets/icon_algo.svg";

export const RESUME_URL   = import.meta.env.VITE_RESUME;
export const X_URL        = import.meta.env.VITE_X;
export const GIT_URL      = import.meta.env.VITE_GIT;
export const LINKEDIN_URL = import.meta.env.VITE_LINKEDIN;
export const LEETCODE_URL = import.meta.env.VITE_LEETCODE;

export const projects = [
  { img: p2,         name: "AI Assistant",   url: import.meta.env.VITE_URL2 },
  { img: p3,         name: "Speech Rec",     url: import.meta.env.VITE_URL3 },
  { img: p4,         name: "Social Net",     url: import.meta.env.VITE_URL4 },
  { img: p5,         name: "Movie-X",        url: import.meta.env.VITE_URL5 },
  { img: iconMoney,  name: "Money Tracker",  url: "https://github.com/kuldeeepy/money-tracker" },
  { img: iconAlgo,   name: "Algo Trader",    url: "https://github.com/kuldeeepy/algo-trader"   },
];

export const workHistory = [
  {
    role: "Software Engineer",
    company: "Kim.cc",
    year: "Now",
    link: "https://kim.cc",
    favicon: "https://www.google.com/s2/favicons?domain=kim.cc&sz=32",
  },
  {
    role: "Founding Engineer",
    company: "Go CrossPay",
    year: "2023",
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
