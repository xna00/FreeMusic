import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { PlaylistRecord } from "server/models/playlist";
import { api } from "../api";
import BottomPlayer from "../components/BottomPlayer";

export default () => {
  const [playlists, setPlaylists] = useState<PlaylistRecord[]>([]);

  useEffect(() => {
    api.playlist.listPlaylist().then((res) => {
      setPlaylists(res);
    });
    api.user.currentUser();
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div>
        <Link to="/search">
          <button>search</button>
        </Link>
      </div>
      <div>
        {playlists.map((p) => (
          <Link to={"/playlist/" + p.id} key={p.id}>
            <div key={p.id}>{p.name}</div>
          </Link>
        ))}
      </div>
      <div className="mt-auto">
        <BottomPlayer></BottomPlayer>
      </div>
    </div>
  );
};
