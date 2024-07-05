import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { localStorageJson } from "../tools";
import type { NewSong } from "server/models/song";
import { PlayerContext } from "../hooks/player";

const player = new Audio();

const CURRENT_PLAYLIST = "CURRENT_PLAYLIST";
export default () => {
  const [playing, setPlaying] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<NewSong[]>(
    localStorageJson(CURRENT_PLAYLIST, [])
  );
  const [currentIndex, setCurrentIndex] = useState(
    currentPlaylist.length ? 0 : -1
  );

  player.onended = () => {
    console.log("end");
    let i = currentIndex + 1;
    if (i >= currentPlaylist.length) i = 0;
    setCurrentIndex(i);
  };

  player.onplaying = () => {
    setPlaying(true);
  };
  player.onpause = () => {
    setPlaying(false);
  };

  useEffect(() => {
    const code = currentPlaylist.at(currentIndex)?.code;
    if (code) {
      player.src = `/audios/${code}`;
      player.play();
    }
  }, [currentIndex, currentPlaylist]);

  useEffect(() => {
    localStorage.setItem(CURRENT_PLAYLIST, JSON.stringify(currentPlaylist));
  }, [currentPlaylist]);

  return (
    <PlayerContext.Provider
      value={{
        playing,
        currentPlaylist,
        setCurrentPlaylist,
        currentIndex,
        setCurrentIndex,
        play: () => player.play(),
        pause: () => player.pause(),
      }}
    >
      <Outlet></Outlet>
    </PlayerContext.Provider>
  );
};
