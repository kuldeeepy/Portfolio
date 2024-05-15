import React from "react";
import { Link } from "react-router-dom";
import { FaExternalLinkAlt } from "react-icons/fa";

function Work({ value }) {
  return (
    <div className="relative">
      <img
        src={value?.img}
        alt="project"
        className="max-w-full object-cover md:w-[190px] transition duration-300 ease-in-out"
      />
      <div className="absolute inset-0 bg-black opacity-0 hover:opacity-50 transition duration-300 ease-in-out">
        <Link to={value?.src} target="_blank">
          <FaExternalLinkAlt
            fontSize={28}
            className="relative top-[40%] left-[45%] text-white"
          />
        </Link>
      </div>
    </div>
  );
}

export default Work;
