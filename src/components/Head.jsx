import React from "react";
import Border from "./Border";
import { Link } from "react-router-dom";
import logo from "../assets/picture.jpg";
import { BsTwitterX } from "react-icons/bs";
import { AiFillGithub } from "react-icons/ai";
import { FaLinkedin } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { RxArrowTopRight } from "react-icons/rx";
import { delay, motion, stagger } from "framer-motion";
import { dark } from "@mui/material/styles/createPalette";

let x = import.meta.env.VITE_X;
let git = import.meta.env.VITE_GIT;
let lkd = import.meta.env.VITE_LINKEDIN;
let lcd = import.meta.env.VITE_LEETCODE;
let cv = import.meta.env.VITE_RESUME;

function Head({ theme }) {
  const MotionLink = motion(Link);

  const imageVariant = {
    hidden: { opacity: 0, y: -25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: 0.2,
        duration: 0.5,
        ease: "easeInOut",
      },
      staggerChildren: stagger(0.1, {
        startDelay: 0.2,
      }),
    },
  };

  const iconContainerVariant = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5,
      },
    },
  };

  const iconVariant = {
    hidden: { opacity: 0, x: -25 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const darkClass =
    "bg-[linear-gradient(to_bottom,_#08090A_10%,_#00171F_40%,_#08090A_90%)]";
  const lightClass =
    "bg-[linear-gradient(to_bottom,_#EAEAEA_10%,_#CDCDCD_40%,_#EAEAEA_90%)]";

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false }}
      variants={iconContainerVariant}
      className="overflow-x-hidden"
    >
      <motion.img
        variants={imageVariant}
        src={logo}
        alt="myImage"
        className="rounded-full object-cover size-14 md:size-20"
      />
      <h1
        className={`bg-clip-text text-transparent font-semibold mt-2 text-lg ${
          theme === "dark" ? lightClass : darkClass
        }`}
      >
        Kuldeep yadav
      </h1>
      <h2
        className={`bg-clip-text text-transparent font-medium font-serif ${
          theme === "dark" ? lightClass : darkClass
        }`}
      >
        Software Engineer
      </h2>
      <span className="flex gap-3 my-4">
        <MotionLink variants={iconVariant} to={x} target="_blank" title="x">
          <BsTwitterX fontSize={20} />
        </MotionLink>
        <MotionLink
          variants={iconVariant}
          to={git}
          target="_blank"
          title="github"
        >
          <AiFillGithub fontSize={20} />
        </MotionLink>
        <MotionLink
          variants={iconVariant}
          to={lkd}
          target="_blank"
          title="linkedin"
        >
          <FaLinkedin fontSize={20} />
        </MotionLink>
        <MotionLink
          variants={iconVariant}
          to={lcd}
          target="_blank"
          title="leetcode"
        >
          <SiLeetcode fontSize={20} />
        </MotionLink>
      </span>
      <Link to={cv} target="_blank" title="resume">
        <h1 className="flex gap-[3px] items-center font-medium">
          Resume <RxArrowTopRight fontSize={12} />
        </h1>
      </Link>
      <Border />
    </motion.div>
  );
}

export default Head;
