import { Route, Routes } from "react-router-dom";
import Head from "./components/Head";
import About from "./pages/About";
import Project from "./pages/Project";
import Contact from "./pages/Contact";
import Options from "./components/Options.jsx";
import Foot from "./components/Foot.jsx";

function App() {
  return (
    <div className="md:mx-auto max-w-xl ">
      <Head />
      <Options />
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/about" element={<About />} />
        <Route path="/project" element={<Project />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Foot />
    </div>
  );
}

export default App;
