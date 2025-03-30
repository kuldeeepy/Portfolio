import React from "react";

function Skill() {
  return (
    <div className="mb-6">
      <h2 className="font-semibold my-3">Skills</h2>
      <ul className="list-disc list-inside pl-3">
        <li>
          <strong>Frontend:</strong> I work with React and Vue.js for building
          user interfaces, and I use Tailwind CSS and MUI for styling.
        </li>
        <li className="my-4">
          <strong>Backend:</strong> I use Node.js for the backend, with Express
          to set up the server.
        </li>
        <li>
          <strong>Databases:</strong> I’ve worked with MongoDB, MySQL,
          PostgreSQL, and Firebase, and I use draw.io to visualize data flow.
        </li>
        <li className="my-3">
          <strong>Miscellaneous:</strong> For API testing, I use Hoppscotch
          (formerly PostWoman), and I prefer deploying apps on Render and
          Vercel.
        </li>
      </ul>
    </div>
  );
}

export default Skill;
