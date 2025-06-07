import { Route, Routes } from "react-router-dom";
import Head from "./components/Head";
import About from "./pages/About";
import Project from "./pages/Project";
import Contact from "./pages/Contact";
import Options from "./components/Options.jsx";
import Foot from "./components/Foot.jsx";
import { getUserTheme } from "./services/service.js";

function App() {
  const theme = getUserTheme();

  return (
    <div
      className={`w-screen ${
        theme === "dark" ? "bg-[#1b1b18] text-white" : "bg-[#fdfdfc] text-black"
      }`}
    >
      <div className="relative max-w-xl mx-auto px-5 py-20 w-full">
        <div
          className={`absolute top-0 left-0 bg-gradient-to-b from-[#1b1b18] to-[#fdfdfc] h-10 w-full ${
            theme === "dark" ? "blur-[100px]" : "blur-[40px]"
          }`}
        />
        <Head theme={theme} />
        <Options theme={theme} />
        <Routes>
          <Route path="/" element={<About theme={theme} />} />
          <Route path="/about" element={<About />} />
          {/* <Route path="/project" element={<Project />} /> */}
          <Route path="/contact" element={<Contact theme={theme} />} />
        </Routes>
        <Foot theme={theme} />
        <div
          className={`absolute bottom-0 left-0 bg-gradient-to-b from-[#1b1b18] to-[#fdfdfc] h-10 w-full ${
            theme === "dark" ? "blur-[100px]" : "blur-[40px]"
          }`}
        />
      </div>
    </div>
  );
}

export default App;
// fdfdfc
