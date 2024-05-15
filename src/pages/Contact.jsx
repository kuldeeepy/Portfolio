import * as React from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

let lkd = import.meta.env.VITE_LINKEDIN;

export default function Contact() {
  return (
    <div className="flex justify-center flex-col">
      <p className="my-6">
        Let's work on something together, fill the details below I'll get back
        to you or drop a dm on{" "}
        <Link to={lkd} target="_blank">
          <em className="underline">linkedin</em>
        </Link>
      </p>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField id="standard-basic" label="Your Name" variant="standard" />
        <TextField
          type="email"
          id="standard-basic"
          label="Email"
          variant="standard"
        />
      </Box>
      <textarea
        placeholder="Write Something.."
        className="resize rounded-md min-h-[90px] max-w-[80%] p-2 border my-4 mx-2 outline-blue-500 border-gray-400 min-w-[75%]"
      ></textarea>
      <button className="group relative max-w-[25%] m-1 inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-lg border-b-2 border-l-2 border-r-2 border-[#272727] bg-gradient-to-tr from-[#272727] to-[#272727] px-4 py-1 text-white shadow-lg transition duration-100 ease-in-out active:translate-y-0.5 active:border-white active:shadow-none">
        <span className="absolute h-0 w-0 rounded-full opacity-10 transition-all duration-300 ease-out group-hover:h-32 group-hover:w-32"></span>
        <span className="relative font-medium">Submit</span>
      </button>
    </div>
  );
}
