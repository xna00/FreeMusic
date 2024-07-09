import { useEffect, useState } from "react";
import { api } from "../../api";
import type { PlaylistRecord } from "server/models/playlist";
import { addToPlaylistAndPlay } from "../../tools";
import { usePlayer } from "../../hooks/player";
import { useParams } from "react-router-dom";

export default () => {
  const { id } = useParams();
  const player = usePlayer();
  const [playlist, setPlaylist] = useState<PlaylistRecord>();

  useEffect(() => {
    if (id) {
      api.playlist.getPlaylist(Number(id)).then((res) => {
        setPlaylist(res);
      });
    }
  }, [id]);

  return (
    <div>
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
  );
};
