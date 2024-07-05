import { DataSource, DataSourceOptions } from "typeorm";
import { User } from "./user.js";
import { Playlist } from "./playlist.js";
import { Song } from "./song.js";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: `./db.sqlite`,
  entities: [User, Playlist, Song],
  logging: true,
});

AppDataSource.initialize()
  .then((d) => {
    console.log("inited!");
    return AppDataSource.synchronize();
  })
  .then(() => {
    console.log("synced");
  });
