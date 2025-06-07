import { dark } from "@mui/material/styles/createPalette";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";

const tabs = ["About", "Contact"];

const Options = ({ theme }) => {
  const [selected, setSelected] = useState(tabs[0]);

  const lightClass = "text-primaryBlack hover:text-primaryBlack/80";
  const darkClass = "text-primaryWhite hover:text-primaryWhite/80";
  return (
    <div className="mb-8 flex flex-wrap items-center gap-2">
      {tabs.map((tab) => (
        <Tab
          text={tab}
          selected={selected === tab}
          setSelected={setSelected}
          key={tab}
          theme={theme}
          lightClass={lightClass}
          darkClass={darkClass}
        />
      ))}
    </div>
  );
};

const Tab = ({ text, selected, setSelected, theme, lightClass, darkClass }) => {
  return (
    <Link
      to={text == "About" ? `/` : `${text.toLowerCase()}`}
      onClick={() => setSelected(text)}
      className={`${
        selected && theme === "dark"
          ? "text-primaryBlack"
          : selected && theme === "light"
          ? "text-primaryWhite"
          : theme === "dark"
          ? darkClass
          : lightClass
      } relative rounded-md px-2 py-1 text-sm font-medium transition-colors`}
    >
      <span className="relative z-10">{text}</span>
      {selected && (
        <motion.span
          layoutId="tab"
          transition={{ duration: 0.4 }}
          className={`absolute inset-0 z-0 rounded-md ${
            theme === "dark" ? "bg-primaryWhite" : "bg-primaryBlack"
          }`}
        ></motion.span>
      )}
    </Link>
  );
};

export default Options;
