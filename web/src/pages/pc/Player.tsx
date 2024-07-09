import { usePlayer } from "../../hooks/player";
import { getImageUrl } from "../../tools";

export default () => {
  const player = usePlayer();
  const currentSong = player.currentPlaylist.at(player.currentIndex);

  if (!currentSong) return null;
  return (
    <div className="h-full flex items-center justify-center">
      <img
        className="w-[50vmin] h-[50vmin] object-cover rounded-full animate-[spin_16s_linear_infinite]"
        style={{
          animationPlayState: player.playing ? "running" : "paused",
        }}
        src={getImageUrl(currentSong.code)}
      ></img>
    </div>
  );
};
