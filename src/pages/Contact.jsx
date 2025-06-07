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

export default function Contact({ theme }) {
  const lightClass = "text-primaryBlack hover:text-primaryBlack/80";
  const darkClass = "text-primaryWhite hover:text-primaryWhite/80";

  const lightInputClass =
    "p-2 outline-none focus:ring-1 focus:ring-primaryBlack border border-gray-300 rounded-lg w-full max-w-[65%] lg:max-w-[55%]";
  const darkInputClass =
    "p-2 outline-none focus:ring-1 focus:ring-gray-100 border border-gray-100 text-primaryBlack rounded-lg w-full max-w-[65%] lg:max-w-[55%]";

  return (
    <form onSubmit={handleSubmit} className="flex justify-center flex-col">
      <p className={`my-6 ${theme === "dark" ? darkClass : lightClass}`}>
        Let&apos;s work on something together, fill the details below I&apos;ll
        get back to you or schedule a{" "}
        <Link to={cld} target="_blank">
          <em className="underline">meet</em>
        </Link>
      </p>
      <div className="flex flex-col gap-2 mx-2">
        <label htmlFor="label">Name</label>
        <input
          name="name"
          type="text"
          placeholder="Oggy"
          className={theme === "dark" ? darkInputClass : lightInputClass}
        />
        <label htmlFor="email" className="mt-2">
          Email
        </label>
        <input
          name="email"
          type="email"
          placeholder="oggy@co"
          className={`${theme === "dark" ? darkInputClass : lightInputClass}`}
        />
      </div>
      <textarea
        name="message"
        placeholder="Write Something.."
        className="resize rounded-md min-h-[90px] max-w-[80%] p-2 border my-4 mx-2 outline-primaryBlack border-gray-400 min-w-[75%]"
      ></textarea>
      <button
        type="submit"
        className={`group relative max-w-[25%] m-1 inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-lg border-b-2 border-l-2 border-r-2 ${
          theme === "dark"
            ? "border-white bg-gradient-to-tr from-white to-white text-[#272727]"
            : "border-[#272727] bg-gradient-to-tr from-[#272727] to-[#272727] text-white"
        } px-4 py-1 shadow-lg transition duration-100 ease-in-out active:translate-y-0.5 active:border-white active:shadow-none`}
      >
        <span
          className={`absolute h-0 w-0 rounded-full ${
            theme === "dark" ? "opacity-5" : "opacity-10"
          } transition-all duration-300 ease-out group-hover:h-32 group-hover:w-32`}
        ></span>
        <span className="relative font-medium">Submit</span>
      </button>
    </form>
  );
}
