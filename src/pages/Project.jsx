import { useState } from "react";
import Work from "../components/Work.jsx";
import one from "../assets/project_one.png";
import two from "../assets/project_two.webp";
import three from "../assets/project_three.png";
import four from "../assets/project_four.png";
import five from "../assets/project_five.webp";

let url1 = import.meta.env.VITE_URL1;
let url2 = import.meta.env.VITE_URL2;
let url3 = import.meta.env.VITE_URL3;
let url4 = import.meta.env.VITE_URL4;
let url5 = import.meta.env.VITE_URL5;

function Project({ theme }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const projects = [
    { img: one, src: url1 },
    { img: two, src: url2 },
    { img: three, src: url3 },
    { img: four, src: url4 },
    { img: five, src: url5 },
  ];

  const handleScroll = (event) => {
    const { scrollLeft, clientWidth } = event.target;
    const index = Math.round(scrollLeft / clientWidth);
    setCurrentIndex(index);
  };

  const topProjects = projects.slice(0, 4);

  return (
    <>
      <h3 className="font-semibold text-start pb-3">Work</h3>
      <div className="lg:hidden flex flex-col items-center gap-4">
        <div
          className="border w-full rounded-lg overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide"
          onScroll={handleScroll}
        >
          <div className="flex hide-scrollbar">
            {projects.map((project, idx) => (
              <div key={idx} className="snap-center shrink-0 w-full">
                <Work value={project} />
              </div>
            ))}
          </div>
        </div>

        {/* Indicator dots */}
        <div className="flex gap-2">
          {projects.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "w-4 bg-black" : "w-1.5 bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
      <div className="flex">
        {topProjects.map((project, idx) => (
          <div
            key={idx}
            className={`hidden lg:block relative h-40 w-40 mb-4 border  ${
              theme === "dark" ? "border-primaryWhite" : "border-primaryBlack"
            } ${
              idx === 0
                ? "rotate-6 translate-x-3 z-0 hover:z-10"
                : idx === 1
                ? "-rotate-6 -translate-x-4 z-0 hover:z-10"
                : idx === 2
                ? "rotate-3 -translate-x-8 z-0 hover:z-10"
                : "-rotate-3 -translate-x-10 z-0 hover:z-10"
            } transition-transform duration-300 rounded-lg hover:scale-105`}
          >
            <Work value={project} />
          </div>
        ))}
      </div>
    </>
  );
}

export default Project;
