import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  ManyToMany,
} from "typeorm";
import { ExtractType, NewRecord } from "./utils.js";

@Entity()
export class Song extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({
    unique: true,
  })
  code!: string;
  @Column()
  name!: string
  @Column()
  author!: string
}

export type SongRecord = ExtractType<Song>;

export type NewSong = NewRecord<Song>;
