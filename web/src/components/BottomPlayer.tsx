import { useNavigate } from "react-router-dom";
import { usePlayer } from "../hooks/player";

export default () => {
  const player = usePlayer();
  const { currentPlaylist, currentIndex, playing } = player;
  const currentSong = currentPlaylist.at(currentIndex);
  const navigate = useNavigate();

  if (!currentSong) return null;

  return (
    <div
      className="w-full overflow-hidden flex p-1 border-t"
      onClick={() => navigate("/player")}
    >
      <img src={`/images/${currentSong.code}`} className="w-12 h-12" />
      <div className="flex-1 overflow-hidden flex items-center">
        <span className="flex-1 overflow-hidden text-nowrap text-ellipsis">
          {currentSong.name}
        </span>
        -<span className="text-gray-500">{currentSong.author}</span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();

          if (playing) {
            player.pause();
          } else {
            player.play();
          }
        }}
      >
        {playing ? "pause" : "play"}
      </button>
    </div>
  );
};
