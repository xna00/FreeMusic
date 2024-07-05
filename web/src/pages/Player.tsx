import { Link } from "react-router-dom";
import { usePlayer } from "../hooks/player";
import PlayIcon from "../components/icons/Play.svg";
import PauseIcon from "../components/icons/Pause.svg";
import PrevIcon from "../components/icons/Prev.svg";
import NextIcon from "../components/icons/Next.svg";
import { plainText } from "../tools";
import HeartIcon from "../components/icons/Heart.svg";
import ListIcon from "../components/icons/List.svg";
import { useEffect, useState } from "react";
import { api } from "../api";
import LeftIcon from "../components/icons/Left.svg";

export default () => {
  const player = usePlayer();
  const [loved, setLoved] = useState(false);
  const currentSong = player.currentPlaylist.at(player.currentIndex);

  const loadLoved = () => {
    if (currentSong) {
      api.song.isLiked(currentSong.code).then((res) => {
        setLoved(res);
      });
    }
  };
  useEffect(() => {
    loadLoved();
  }, [currentSong]);
  if (!currentSong) return null;
  return (
    <div className="h-full flex flex-col">
      <header className="flex">
        <Link to={"/"}>
          <LeftIcon></LeftIcon>
        </Link>
        <div>{plainText(currentSong.name)}</div>
      </header>
      <div className="flex-1 flex flex-col items-center">
        <img
          className="w-[50vw] h-[50vw] object-cover rounded-full animate-[spin_16s_linear_infinite]"
          src={`/images/${currentSong.code}`}
        />
      </div>
      <div className="mt-auto flex justify-around items-center">
        <HeartIcon
          className={
            loved
              ? "fill-[#d81e06]"
              : "stroke-black stroke-[50] fill-transparent"
          }
          onClick={() => {
            (loved
              ? api.song.unlike(currentSong.code)
              : api.song.like(currentSong.code)
            ).then(loadLoved);
          }}
        ></HeartIcon>
        <PrevIcon
          onClick={() => {
            let i = player.currentIndex - 1;
            if (i < 0) {
              i = player.currentPlaylist.length - 1;
            }
            player.setCurrentIndex(i);
          }}
        ></PrevIcon>
        {player.playing ? (
          <PauseIcon onClick={() => player.pause()}></PauseIcon>
        ) : (
          <PlayIcon onClick={() => player.play()}></PlayIcon>
        )}
        <NextIcon
          onClick={() => {
            let i = player.currentIndex + 1;
            if (i >= player.currentPlaylist.length) {
              i = 0;
            }
            player.setCurrentIndex(i);
          }}
        ></NextIcon>
        <ListIcon></ListIcon>
      </div>
    </div>
  );
};
