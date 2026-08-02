import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App.jsx";
import About from "./pages/About.jsx";
import WritingsList from "./pages/WritingsList.jsx";
import WritingPost from "./pages/WritingPost.jsx";
import "./index.css";

// Apply the stored/system theme on first paint for every route (direct links
// to /writings land before App's own theme effect runs).
const stored = localStorage.getItem("theme");
const theme =
  stored ||
  (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
document.documentElement.setAttribute("data-theme", theme);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/about" element={<About />} />
        <Route path="/writings" element={<WritingsList />} />
        <Route path="/writings/:slug" element={<WritingPost />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
