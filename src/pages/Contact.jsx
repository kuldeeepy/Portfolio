import * as React from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

let cld = import.meta.env.VITE_CALENDLY;
const mail = import.meta.env.VITE_MAIL_SERVER;

const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");

  try {
    const resp = await fetch(mail, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name, email: email, text: message }),
    });

    await resp.json();
    e.target.reset();
  } catch (error) {
    console.error(error);
  }
};

export default function Contact() {
  return (
    <form onSubmit={handleSubmit} className="flex justify-center flex-col">
      <p className="my-6">
        Let&apos;s work on something together, fill the details below I&apos;ll
        get back to you or schedule a{" "}
        <Link to={cld} target="_blank">
          <em className="underline">meet</em>
        </Link>
      </p>
      <Box
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField name="name" label="Your Name" variant="standard" required />
        <TextField
          name="email"
          type="email"
          label="Email"
          variant="standard"
          required
        />
      </Box>
      <textarea
        name="message"
        placeholder="Write Something.."
        className="resize rounded-md min-h-[90px] max-w-[80%] p-2 border my-4 mx-2 outline-blue-500 border-gray-400 min-w-[75%]"
      ></textarea>
      <button
        type="submit"
        className="group relative max-w-[25%] m-1 inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-lg border-b-2 border-l-2 border-r-2 border-[#272727] bg-gradient-to-tr from-[#272727] to-[#272727] px-4 py-1 text-white shadow-lg transition duration-100 ease-in-out active:translate-y-0.5 active:border-white active:shadow-none"
      >
        <span className="absolute h-0 w-0 rounded-full opacity-10 transition-all duration-300 ease-out group-hover:h-32 group-hover:w-32"></span>
        <span className="relative font-medium">Submit</span>
      </button>
    </form>
  );
}
