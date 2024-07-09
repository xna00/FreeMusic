import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";
import { usePlayer } from "../../hooks/player";
import HeartIcon from "../icons/Heart.svg";
import ListIcon from "../icons/List.svg";
import NextIcon from "../icons/Next.svg";
import PauseIcon from "../icons/Pause.svg";
import PlayIcon from "../icons/Play.svg";
import PrevIcon from "../icons/Prev.svg";
import { useDuration } from "../../hooks/useDuration";
import { plainText } from "../../tools";

const formatTime = (sec: number) => {
  const m = ((sec / 60) | 0).toString().padStart(2, "0");
  const s = (sec % 60 | 0).toString().padStart(2, "0");
  return `${m}:${s}`;
};
export default () => {
  const player = usePlayer();
  const { duration, currentTime, setCurrentTime } = useDuration();
  const [loved, setLoved] = useState(false);
  const currentSong = player.currentPlaylist.at(player.currentIndex);
  const navigate = useNavigate();

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
  return currentSong ? (
    <div
      // className="shadow-[0px_-1px_5px_rgba(182,182,182,0.75)]"
      onClick={() => {
        navigate("/player");
      }}
    >
      <div
        className="relative group py-1"
        onClick={(e) => {
          const target = e.currentTarget as HTMLDivElement;
          console.log(duration, e.clientX, target.clientWidth);
          const time = duration * (e.clientX / target.clientWidth);
          player.audioPlayer.currentTime = time;
          setCurrentTime(time);
        }}
      >
        <div className="bg-gray-300">
          <div
            className="h-0.5 bg-red-300"
            style={{
              width: `${
                (currentTime / duration > 1 ? 1 : currentTime / duration) * 100
              }%`,
            }}
          ></div>
        </div>

        <div
          className="w-3 h-3 bg-red-300 rounded-full absolute top-1/2
                     [transform:translate(-50%,-50%)] hidden group-hover:block"
          style={{
            left: `${(currentTime / duration) * 100}%`,
          }}
        ></div>
      </div>
      <div className="p-2 flex items-center justify-between ">
        <div className="flex items-center flex-1 overflow-hidden">
          <img
            src={`/images/${currentSong.code}`}
            className="w-10 h-10 object-cover rounded"
          ></img>
          <div className="ml-2 flex-1 overflow-hidden">
            <div className="inline-flex max-w-full items-center">
              <span className="text-sm text-gray-800 inline-block flex-1 text-nowrap overflow-hidden text-ellipsis">
                {plainText(currentSong.name)}
              </span>
              -
              <span className="text-sm text-gray-600 flex-shrink-0">
                {currentSong.author}
              </span>
            </div>
            <div className="text-xs text-gray-400">
              {formatTime(currentTime)}/{formatTime(duration)}
            </div>
          </div>
        </div>

        <div className="flex justify-around items-center w-[300px]">
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
            <PauseIcon
              className="w-8 h-8"
              onClick={() => player.pause()}
            ></PauseIcon>
          ) : (
            <PlayIcon
              className="w-8 h-8"
              onClick={() => player.play()}
            ></PlayIcon>
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

          <button popovertarget="mypopover">
            <ListIcon></ListIcon>
          </button>
        </div>
        <div className="flex-1">R</div>
      </div>
      <div
        className="h-full ml-[100%] -translate-x-full transition-all border-l w-[40vw]"
        popover="auto"
        id="mypopover"
      >
        {player.currentPlaylist.map((p, i) => (
          <div
            key={p.code}
            onClick={() => {
              player.setCurrentIndex(i);
            }}
          >
            {plainText(p.name)}
          </div>
        ))}
      </div>
    </div>
  ) : null;
};
