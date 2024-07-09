import { useEffect, useState } from "react";
import { usePlayer } from "./player";
import { throttle } from "../tools";

export const useDuration = () => {
  const player = usePlayer();
  const [duration, setDuration] = useState(player.audioPlayer.duration);
  const [currentTime, setCurrentTime] = useState(
    player.audioPlayer.currentTime
  );

  useEffect(() => {
    const c = new AbortController();
    player.audioPlayer.addEventListener(
      "durationchange",
      () => {
        setDuration(player.audioPlayer.duration);
      },
      {
        signal: c.signal,
      }
    );
    player.audioPlayer.addEventListener(
      "timeupdate",
      throttle(() => {
        setCurrentTime(player.audioPlayer.currentTime);
      }, 500),
      {
        signal: c.signal,
      }
    );
    return () => {
      c.abort();
    };
  }, []);

  return {
    duration,
    currentTime,
    setCurrentTime,
  };
};
