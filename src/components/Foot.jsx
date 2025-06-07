import React, { useEffect } from "react";
import { getUserLocation } from "../services/service";

const Foot = ({ theme }) => {
  const [user, setUser] = React.useState({ city: "", region: "" });

  useEffect(() => {
    const fetchLocation = async () => {
      const { success, location } = await getUserLocation();
      if (success && location) {
        const { city, region } = location;
        setUser({ city, region });
      }
    };
    fetchLocation();
  }, []);

  const handleModeSwitch = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    window.location.reload();
  };

  return (
    <footer className="w-full mt-40 mb">
      <div className="flex flex-col gap-1">
        <p className="text-xs text-start leading-4 opacity-50">
          &copy; {new Date().getFullYear()} - Kuldeep
        </p>
        <p className="text-xs text-start leading-4 opacity-50">
          Last visitor from {user.city}, {user.region}.
        </p>
      </div>
      <button
        onClick={handleModeSwitch}
        type="button"
        className={`text-xs border px-3 py-1 mt-3 rounded-md cursor-pointer ${
          theme === "dark"
            ? "text-primaryWhite border-primaryWhite border-opacity-50 hover:bg-primaryWhite hover:text-primaryBlack"
            : "text-primaryBlack border-primaryBlack border-opacity-50 hover:bg-primaryBlack hover:text-primaryWhite"
        }`}
      >
        {theme === "dark" ? "Light" : "Dark"} Mode
      </button>
    </footer>
  );
};

export default Foot;
