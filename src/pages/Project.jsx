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

function Project() {
  const projects = [
    { img: one, src: url1 },
    { img: two, src: url2 },
    { img: three, src: url3 },
    { img: four, src: url4 },
    { img: five, src: url5 },
  ];
  return (
    <div className="border overflow-auto p-4 gap-10 w-full flex flex-wrap">
      {projects.map((project, idx) => (
        <Work key={idx} value={project} />
      ))}
    </div>
  );
}

export default Project;
