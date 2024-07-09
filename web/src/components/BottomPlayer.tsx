import { useNavigate } from "react-router-dom";
import { usePlayer } from "../hooks/player";
import PauseIcon from "./icons/Pause.svg";
import PlayIcon from "./icons/Play.svg";

export default () => {
  const player = usePlayer();
  const { currentPlaylist, currentIndex, playing } = player;
  const currentSong = currentPlaylist.at(currentIndex);
  const navigate = useNavigate();

  if (!currentSong) return null;

  return (
    <div
      className="w-full overflow-hidden flex py-2 px-2 border-t"
      onClick={() => navigate("/player")}
    >
      <img src={`/images/${currentSong.code}`} className="w-12 h-12 object-cover rounded-lg" />
      <div className="flex-1 overflow-hidden flex items-center">
        <span className="flex-1 overflow-hidden text-nowrap text-ellipsis">
          {currentSong.name}
        </span>
        -<span className="text-gray-500">{currentSong.author}</span>
      </div>
      <button
        className="ml-2"
        onClick={(e) => {
          e.stopPropagation();

          if (!player.audioPlayer.paused) {
            player.pause();
          } else {
            player.play();
          }
        }}
      >
        {playing ? (
          <PauseIcon className="h-8 w-8"></PauseIcon>
        ) : (
          <PlayIcon className="h-8 w-8"></PlayIcon>
        )}
      </button>
    </div>
  );
};
