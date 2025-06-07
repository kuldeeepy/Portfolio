export const getUserLocation = async () => {
  //   try {
  //     const resp = await fetch("https://ipwho.is");
  //     const data = await resp.json();
  //     return {
  //       success: true,
  //       message: "User location fetched successfully",
  //       location: { city: data.city, region: data.region },
  //     };
  //   } catch (error) {
  //     console.error("Error fetching user location:", error);
  //     return {
  //       success: false,
  //       message: "Failed to fetch user location",
  //     };
  //   }
  return {
    success: true,
    message: "User location fetched successfully",
    location: { city: "Bangalore", region: "Karnataka" }, // Mock data for testing
  };
};

export const getUserTheme = () => {
  const theme = localStorage.getItem("theme");
  if (theme) {
    return theme;
  } else {
    const isDarkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    return isDarkMode ? "dark" : "light";
  }
};

export const getLastSong = async () => {
  const baseUrl = "https://ws.audioscrobbler.com/2.0";
  const name = import.meta.env.VITE_LASTFM_USER;
  const apiKey = import.meta.env.VITE_LOSTFM_API_KEY;
  const url = `${baseUrl}/?method=user.getrecenttracks&user=${name}&api_key=${apiKey}&format=json&limit=1
`;
  try {
    const resp = await fetch(url);
    const data = await resp.json();

    return {
      success: true,
      message: "Last song fetched successfully",
      song: data.recenttracks.track[0],
    };
  } catch (error) {
    console.error("Error fetching last song:", error);
    return {
      success: false,
      message: "Failed to fetch last song",
    };
  }
};
