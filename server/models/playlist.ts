import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { ExtractType, NewRecord, OmitFrom } from "./utils.js";
import { User } from "./user.js";
import { Song, SongRecord } from "./song.js";

@Entity()
export class Playlist extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({})
  name!: string;
  @ManyToOne(() => User)
  user!: User;
  @ManyToMany(() => Song)
  @JoinTable()
  songs!: Song[];
}

export type PlaylistRecord = OmitFrom<
  ExtractType<Playlist>,
  "user" | "songs"
> & {
  songs: SongRecord[];
};

export type NewPlaylist = OmitFrom<NewRecord<Playlist>, "songs" | "user">;
