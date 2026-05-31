export const getUserLocation = async () => {
  try {
    const resp = await fetch("https://get.geojs.io/v1/ip/geo.json");
    const data = await resp.json();
    if (data.city && data.region) {
      return { success: true, location: { city: data.city, region: data.region } };
    }
    return { success: false };
  } catch {
    return { success: false };
  }
};


export const getLastSong = async () => {
  const baseUrl = "https://ws.audioscrobbler.com/2.0";
  const name   = import.meta.env.VITE_LASTFM_USER;
  const apiKey = import.meta.env.VITE_LOSTFM_API_KEY;
  const url    = `${baseUrl}/?method=user.getrecenttracks&user=${name}&api_key=${apiKey}&format=json&limit=1`;
  try {
    const resp = await fetch(url);
    const data = await resp.json();
    return { success: true, song: data.recenttracks.track[0] };
  } catch {
    return { success: false };
  }
};
