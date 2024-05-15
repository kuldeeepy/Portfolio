import React from "react";

function Skill() {
  return (
    <div className="mb-6">
      <h2 className="font-semibold my-3">Skills</h2>
      <ul className="list-disc list-inide pl-5">
        <li>
          <em className="font-semibold">Frontend -</em> My frontend toolkit
          includes React as a library, Tailwind and MUI for styling the UI.
        </li>
        <li className="my-4">
          <em className="font-semibold">Backend -</em> For the backend part I
          use Node as a runtime env.. on top of that express for establishing
          the server.
        </li>
        <li>
          <em className="font-semibold">Database -</em> To visualize the data
          flow I use draw.io and I've used MongoDB, MySQL, Firebase till now
          (not limited to) also I use Mongoose(ODM) to make things simple.
        </li>
        <li className="my-3">
          <em className="font-semibold">Miscellaneous -</em> Some of the general
          tools include Postman for API testing and some fo the free deployment
          sources I prefer are render and vercel.
        </li>
      </ul>
    </div>
  );
}

export default Skill;
