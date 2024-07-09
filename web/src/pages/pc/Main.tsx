import { useState, useEffect } from "react";
import { NavLink, Link, Outlet } from "react-router-dom";
import type { PlaylistRecord } from "server/models/playlist";
import { api } from "../../api";

export default () => {
  const [playlists, setPlaylists] = useState<PlaylistRecord[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<number>();

  useEffect(() => {
    api.playlist.listPlaylist().then((res) => {
      setPlaylists(res);
      setSelectedPlaylist(res.at(0)?.id);
    });
    api.user.currentUser();
  }, []);
  return (
    <div className="h-full flex">
      <aside className="bg-gray-200 w-48">
        {playlists.map((p) => (
          <div
            key={p.id}
            onClick={() => {
              // setSelectedPlaylist(p.id);
            }}
          >
            <NavLink to={`/playlist/${p.id}`}>{p.name}</NavLink>
          </div>
        ))}
      </aside>
      <main className="flex-1 flex flex-col">
        <div>
          <Link to={"/search"}>
            <input type="search"></input>
          </Link>
        </div>
        <div className="flex-1 overflow-auto">
          <Outlet></Outlet>
          {/* {selectedPlaylist !== undefined && (
              <Playlist id={selectedPlaylist}></Playlist>
            )} */}
        </div>
      </main>
    </div>
  );
};
