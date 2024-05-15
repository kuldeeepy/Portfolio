import React from "react";
import Experience from "../components/Experience";
import Skill from "../components/Skill";

function About() {
  return (
    <>
      <div className="my-4">
        Founding Software Engineer at Go CrossPay. Passionate about designing
        scalabale backend systems also have keen interest in entrepreneurship .
      </div>
      <Experience />
      <Skill />
    </>
  );
}

export default About;
