import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { SongRecord } from "server/models/song";
import { api } from "../api";
import type { PlaylistRecord } from "server/models/playlist";
import BottomPlayer from "../components/BottomPlayer";
import { addToPlaylistAndPlay } from "../tools";
import { usePlayer } from "../hooks/player";

export default () => {
  const { id } = useParams();
  const player = usePlayer();
  const [playlist, setPlaylist] = useState<PlaylistRecord>();

  useEffect(() => {
    api.playlist.getPlaylist(Number(id)).then((res) => {
      setPlaylist(res);
    });
  }, [id]);
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto">
        {playlist?.songs.map((s) => (
          <div
            key={s.id}
            onClick={() => {
              const { idx, playlist } = addToPlaylistAndPlay(
                s,
                player.currentPlaylist,
                player.currentIndex
              );
              player.setCurrentPlaylist(playlist);
              player.setCurrentIndex(idx);
            }}
          >
            {s.name}
          </div>
        ))}
      </div>
      <div>
        <BottomPlayer></BottomPlayer>
      </div>
    </div>
  );
};
