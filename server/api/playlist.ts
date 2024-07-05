import { NewPlaylist, Playlist, PlaylistRecord } from "../models/playlist.js";
import { getInfo } from "./global.js";
import { _currentUser } from "./user.js";

export const listPlaylist = async (): Promise<PlaylistRecord[]> => {
  const info = getInfo();
  const user = await _currentUser(info);
  return Playlist.find({
    where: {
      user,
    },
  });
};

export const createPlaylist = async (playlist: NewPlaylist) => {
  const info = getInfo();
  const user = await _currentUser(info);
  const p = new Playlist();
  p.user = user;
  p.name = playlist.name;
  await p.save();
  return {};
};

export const getPlaylist = async (id: number): Promise<PlaylistRecord> => {
  const info = getInfo();
  const user = await _currentUser(info);
  const p = await Playlist.findOne({
    where: {
      id,
      user,
    },
    relations: ["songs"],
  });
  if (!p) {
    throw "No playlist " + id;
  }
  return p;
};
