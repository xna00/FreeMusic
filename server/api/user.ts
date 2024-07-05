import { User, UserRecord } from "../models/user.js";
import { Info, getInfo } from "./global.js";
import cookie from "cookie";

export const _currentUser = async (info: Info) => {
  const username =
    cookie.parse(info.requestHeaders.cookie || "").SESSIONID ?? "";
  console.log(username);

  const user = await User.findOne({
    where: {
      username,
    },
  });
  if (user) {
    return user;
  }
  info.statusCode = 401;
  throw "";
};

export const currentUser = async (): Promise<UserRecord> => {
  const info = getInfo();
  return _currentUser(info);
};
