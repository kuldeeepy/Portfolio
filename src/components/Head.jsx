import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/picture.jpg";
import { BsTwitterX } from "react-icons/bs";
import { AiFillGithub } from "react-icons/ai";
import { FaLinkedin } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import Border from "./Border";

let x = import.meta.env.VITE_X;
let git = import.meta.env.VITE_GIT;
let lkd = import.meta.env.VITE_LINKEDIN;
let lcd = import.meta.env.VITE_LEETCODE;
let cv = import.meta.env.VITE_RESUME;

function Head() {
  return (
    <div>
      <img
        src={logo}
        alt="myImage"
        className="rounded-full object-cover size-14 md:size-20"
      />
      <h2 className="font-semibold mt-2 text-lg">Kuldeep yadav</h2>
      <h3 className="text-gray-500 font-serif">Software Engineer</h3>
      <span className="flex gap-3 my-4">
        <Link to={x} target="_blank">
          <BsTwitterX fontSize={20} />
        </Link>
        <Link to={git} target="_blank">
          <AiFillGithub fontSize={20} />
        </Link>
        <Link to={lkd} target="_blank">
          <FaLinkedin fontSize={20} />
        </Link>
        <Link to={lcd} target="_blank">
          <SiLeetcode fontSize={20}/>
        </Link>
      </span>
      <Link to={cv} target="_blank"><h1 className="font-medium">Resume</h1></Link>
      <Border />
    </div>
  );
}

export default Head;
