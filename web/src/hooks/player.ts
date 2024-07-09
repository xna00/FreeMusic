import { createContext, useContext } from "react";
import type { NewSong } from "server/models/song";

export const PlayerContext = createContext<{
  playing: boolean;
  play: () => void;
  pause: () => void;
  currentPlaylist: NewSong[];
  setCurrentPlaylist: (v: NewSong[]) => void;
  currentIndex: number;
  setCurrentIndex: (v: number) => void;
  audioPlayer: HTMLAudioElement;
  currentSong?: NewSong;
  next: () => void;
  prev: () => void;
}>(null!);

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  return ctx;
};
