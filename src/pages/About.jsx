import React from "react";
import Experience from "../components/Experience";
import Spotify from "../components/spotify";
import Project from "./Project";

function About({ theme }) {
  return (
    <div className="overflow-x-hidden">
      <Spotify />
      <div className="my-4">
        I work on web, alongside experimenting with other things, also have keen
        interest in entrepreneurship and science fiction stuff.
      </div>

      <div className="my-4">
        In my spare time you&apos;ll find me either sleeping or reading about
        interesting startups, indie devs building cool stuff (mostly on X).
      </div>
      <Experience />
      <Project theme={theme} />
    </div>
  );
}

export default About;
