import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { PlaylistRecord } from "server/models/playlist";
import { api } from "../../api";
import BottomPlayer from "../../components/BottomPlayer";
import MoreIcon from "../../components/icons/More.svg";

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
      <div className="flex flex-2 items-center">
        <MoreIcon></MoreIcon>
        <Link to="/search">
          <input
            className="bg-gray-200 rounded-full px-2 ml-4"
            placeholder="搜索"
          ></input>
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
