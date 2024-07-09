import type { NewSong } from "server/models/song";

export const localStorageJson = <T>(key: string, defaultValue: T): T => {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "");
  } catch {
    return defaultValue;
  }
};

export const plainText = (html: string) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.innerText;
};

export const addToPlaylistAndPlay = (
  s: NewSong,
  currentPlaylist: NewSong[],
  currentIndex: number
) => {
  const idx = currentPlaylist.findIndex((p) => p.code === s.code);
  if (idx >= 0) {
    return {
      idx,
      playlist: currentPlaylist,
    };
  }

  return {
    idx: currentIndex + 1,
    playlist: [
      ...currentPlaylist.slice(0, currentIndex + 1),
      {
        code: s.code,
        name: s.name,
        author: s.author,
      },
      ...currentPlaylist.slice(currentIndex + 1),
    ],
  };
};

export const throttle = <P extends unknown[], R>(
  f: (...params: P) => R,
  time: number
) => {
  let locked = false;

  return (...args: P): R | undefined => {
    if (!locked) {
      locked = true;

      setTimeout(() => {
        locked = false;
      }, time);

      return f(...args);
    }
  };
};

export const getImageUrl = (code: string) => `/images/${code}`;
