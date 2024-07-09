import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { getImageUrl, localStorageJson } from "../tools";
import type { NewSong } from "server/models/song";
import { PlayerContext } from "../hooks/player";

const player = new Audio();

const CURRENT_PLAYLIST = "CURRENT_PLAYLIST";
const CURRENT_INDEX = "CURRENT_INDEX";
export default () => {
  const [playing, setPlaying] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<NewSong[]>(
    localStorageJson(CURRENT_PLAYLIST, [])
  );
  const [currentIndex, setCurrentIndex] = useState(
    currentPlaylist.length ? localStorageJson(CURRENT_INDEX, 0) : -1
  );

  const currentSong = currentPlaylist.at(currentIndex);

  const next = () => {
    let i = currentIndex + 1;
    if (i >= currentPlaylist.length) i = 0;
    setCurrentIndex(i);
  };

  const prev = () => {
    let i = currentIndex - 1;
    if (i < 0) {
      i = currentPlaylist.length - 1;
    }
    setCurrentIndex(i);
  };

  navigator.mediaSession.playbackState = !currentSong
    ? "none"
    : playing
    ? "playing"
    : "paused";

  navigator.mediaSession.setActionHandler("nexttrack", next);
  navigator.mediaSession.setActionHandler("previoustrack", prev);
  navigator.mediaSession.setActionHandler("seekto", (d) => {
    console.log(d);
    if (d.seekTime) {
      console.log(player.seekable);
      player.currentTime = d.seekTime;
    }
  });

  player.onended = () => {
    console.log("end");
    next();
  };

  player.onplaying = () => {
    setPlaying(true);
  };
  player.onpause = () => {
    setPlaying(false);
  };

  useEffect(() => {
    if (currentSong) {
      const code = currentSong.code;
      player.src = `/audios/${code}`;
      player.play();

      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentSong.name,
        artist: currentSong.author,
        artwork: [
          {
            src: getImageUrl(currentSong.code),
          },
        ],
      });
    }
  }, [currentSong]);

  useEffect(() => {
    localStorage.setItem(CURRENT_PLAYLIST, JSON.stringify(currentPlaylist));
    localStorage.setItem(CURRENT_INDEX, JSON.stringify(currentIndex));
  }, [currentPlaylist, currentIndex]);

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
        audioPlayer: player,
        currentSong,
        next,
        prev,
      }}
    >
      <Outlet></Outlet>
    </PlayerContext.Provider>
  );
};
