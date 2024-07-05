import { useState } from "react";
import { api } from "../api";
import { usePlayer } from "../hooks/player";
import { addToPlaylistAndPlay } from "../tools";

export default () => {
  const [songs, setSongs] = useState<
    Awaited<ReturnType<typeof api.source.search>>
  >([]);
  const { currentPlaylist, setCurrentPlaylist, currentIndex, setCurrentIndex } =
    usePlayer();
  return (
    <div className="h-full flex flex-col">
      <header>
        <input
          type="search"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const target = e.target as HTMLInputElement;
              api.source.search("bilibili", target.value).then((res) => {
                setSongs(res);
              });
            }
          }}
        />
      </header>
      <div>
        {songs.map((s) => (
          <div
            key={s.code}
            className="border"
            onClick={() => {
              const { idx, playlist } = addToPlaylistAndPlay(
                s,
                currentPlaylist,
                currentIndex
              );
              setCurrentPlaylist(playlist);
              setCurrentIndex(idx);
            }}
          >
            {s.name}
          </div>
        ))}
      </div>
    </div>
  );
};
