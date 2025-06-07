import React, { useEffect, useState } from "react";
import { getLastSong, getUserTheme } from "../services/service";

type SpotifySong = {
  name: string;
  image: string[];
  date: string;
  artist: string;
  album: Object;
};

const Spotify = () => {
  const theme = getUserTheme();
  const [song, setSong] = useState<SpotifySong>();

  const lightClass = "text-primaryBlack hover:text-primaryBlack/80";
  const darkClass = "text-primaryWhite hover:text-primaryWhite/80";

  useEffect(() => {
    const fetchSong = async () => {
      const fetchedSong = await getLastSong();
      if (fetchedSong) {
        const {
          song: { name, image, date, artist, album },
        } = fetchedSong;
        const formattedSong: any = {
          name,
          image,
          date: date["#text"],
          artist: artist["#text"],
          album,
        };
        setSong(formattedSong);
      }
    };

    fetchSong();
  }, []);

  return (
    <div
      className={`flex flex-col gap-y-1 p-1 rounded-[10px] ${
        theme === "light" ? lightClass : darkClass
      }`}
    >
      <div
        className={`flex gap-x-2 p-1  border-[0.5px] shadow-[0_1px_2px_rgba(0,0,0,0.04)] rounded-md w-full items-end ${
          theme === "light" ? lightClass : darkClass
        }`}
      >
        <div className="relative w-[50px] h-[50px] flex-shrink-0">
          <img
            alt="white tee"
            width="50"
            height="50"
            decoding="async"
            loading="lazy"
            className="rounded object-cover"
            style={{ color: "transparent" }}
            src={song?.image[3]["#text"] || "https://via.placeholder.com/50"}
          />
        </div>
        <div className="flex flex-col overflow-hidden w-full">
          <a
            href="https://open.spotify.com/track/6Ac8Byr6GByGr3wDH7JjYh"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="truncate">{song?.album["#text"] || song?.name}</p>
          </a>
          <p className="truncate opacity-50">{song?.artist}</p>
        </div>
      </div>
      <div className="flex flex-row gap-x-1.5 items-center pl-1">
        <span className="relative flex h-2 w-2">
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              theme === "dark" ? "bg-primaryWhite" : "bg-primaryBlack"
            }`}
          ></span>
        </span>
        <div className="text-xs opacity-30">Last played on {song?.date}</div>
      </div>
    </div>
  );
};

export default Spotify;
