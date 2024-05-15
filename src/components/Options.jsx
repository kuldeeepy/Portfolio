import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";

const tabs = ["About", "Project", "Contact"];

const Options = () => {
  const [selected, setSelected] = useState(tabs[0]);
  return (
    <div className="mb-8 flex flex-wrap items-center gap-2">
      {tabs.map((tab) => (
        <Tab
          text={tab}
          selected={selected === tab}
          setSelected={setSelected}
          key={tab}
        />
      ))}
    </div>
  );
};

const Tab = ({ text, selected, setSelected }) => {
  return (
    <Link
      to={text == "About" ? `/` : `${text.toLowerCase()}`}
      onClick={() => setSelected(text)}
      className={`${
        selected ? "text-white" : "text-gray-500 hover:text-gray-900"
      } relative rounded-md px-2 py-1 text-sm font-medium transition-colors`}
    >
      <span className="relative z-10">{text}</span>
      {selected && (
        <motion.span
          layoutId="tab"
          transition={{ duration: 0.4 }}
          className="absolute inset-0 z-0 rounded-md bg-[#272727]"
        ></motion.span>
      )}
    </Link>
  );
};

export default Options;
