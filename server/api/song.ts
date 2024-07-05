import { Playlist } from "../models/playlist.js";
import { Song } from "../models/song.js";
import { getInfo } from "./global.js";
import { _getDetial } from "./source.js";
import { _currentUser } from "./user.js";

const _addToPlaylist = async (playlist: Playlist, code: string) => {
  let song = await Song.findOne({
    where: {
      code,
    },
  });
  if (!song) {
    const d = await _getDetial(code);
    song = new Song();
    song.code = code;
    song.name = d.title;
    song.author = d.author;
    await song.save();
  }
  playlist.songs = [song, ...playlist.songs.filter((s) => s.id !== song.id)];
  await playlist.save();
  return {};
};
export const addToPlaylist = async (code: string, playlistId: number) => {
  const info = getInfo();
  const user = await _currentUser(info);
  const playlist = await Playlist.findOne({
    where: {
      id: playlistId,
      user,
    },
    relations: ["songs"],
  });
  if (!playlist) {
    throw `Playlist ${playlistId} does not existed!`;
  }
  await _addToPlaylist(playlist, code);
  return {};
};

export const isLiked = async (code: string) => {
  const info = getInfo();
  const user = await _currentUser(info);
  const playlist = await Playlist.findOne({
    where: {
      user,
    },
    relations: ["songs"],
  });
  if (!playlist) {
    throw `Playlist does not existed!`;
  }
  return !!playlist.songs.find((s) => s.code === code);
};

export const like = async (code: string) => {
  const info = getInfo();
  const user = await _currentUser(info);
  const playlist = await Playlist.findOne({
    where: {
      user,
    },
    relations: ["songs"],
  });
  if (!playlist) {
    throw `Playlist does not existed!`;
  }
  await _addToPlaylist(playlist, code);
  return {};
};

export const unlike = async (code: string) => {
  const info = getInfo();
  const user = await _currentUser(info);
  const playlist = await Playlist.findOne({
    where: {
      user,
    },
    relations: ["songs"],
  });
  if (!playlist) {
    throw `Playlist does not existed!`;
  }
  playlist.songs = playlist.songs.filter((s) => s.code !== code);
  await playlist.save();
  return {};
};
