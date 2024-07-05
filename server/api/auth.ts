import { NewUser, User } from "../models/user.js";
import { state, idMap } from "./global.js";
import cookie from "cookie";

export const login = async (user: NewUser) => {
  const id = state.id;
  const u = await User.findOneBy({
    username: user.username,
  });
  if (!u) {
    throw "Username is not existed!";
  }
  if (u.password !== user.password) {
    throw "Password is incorrect!";
  }
  idMap[id].responseHeaders = {
    "set-cookie": `SESSIONID=${u.username}; path=/`,
  };

  return {};
};

export const logout = () => {
  const info = idMap[state.id];
  info.responseHeaders = {
    "set-cookie": `SESSIONID=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
  };
  return {};
};
