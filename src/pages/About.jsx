import React from "react";
import Experience from "../components/Experience";
import Skill from "../components/Skill";

function About() {
  return (
    <>
      <div className="my-4">
        I work on web, alongside experimenting with other things, also have keen
        interest in entrepreneurship and science fiction stuff.
      </div>
      <Experience />
      <Skill />
    </>
  );
}

export default About;
