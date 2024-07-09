import { useState } from "react";
import { api } from "../../api";
import { usePlayer } from "../../hooks/player";
import { addToPlaylistAndPlay } from "../../tools";
import LeftIcon from "../../components/icons/Left.svg";
import { useNavigate, useNavigation } from "react-router-dom";

export default () => {
  const [songs, setSongs] = useState<
    Awaited<ReturnType<typeof api.source.search>>
  >([]);
  const navigate = useNavigate();

  const { currentPlaylist, setCurrentPlaylist, currentIndex, setCurrentIndex } =
    usePlayer();
  return (
    <div className="h-full flex flex-col">
      <header className="flex">
        <LeftIcon onClick={() => navigate(-1)}></LeftIcon>
        <input
          className="bg-gray-100 outline-none ml-2"
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
