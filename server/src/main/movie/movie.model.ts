import { Detail, Douban, Download } from '@iinfinity/movie-crawler';
import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn, PrimaryColumn } from 'typeorm';

export interface Movie extends Detail { }

export class DoubanDoc implements Douban {

  @Column()
  id!: number;

  @Column()
  commentLink!: string;

  @Column()
  movieLink!: string;

}

export class DownloadDoc implements Download {

  @Column()
  title!: string;

  @Column()
  uri!: string;

  @Column()
  size!: string;

  @Column()
  type!: string;

}

@Entity('movie')
export class MovieEntity extends BaseEntity implements Movie {

  @PrimaryColumn()
  source!: string;

  @Column()
  title!: string;

  @Column()
  year!: number;

  @Column()
  introduction!: string;

  @Column()
  aliases!: string[];

  @Column()
  artists!: string[];

  @Column()
  types!: string[];

  @Column()
  areas!: string[];

  @Column()
  languages!: string[];

  @Column()
  directors!: string[];

  @Column()
  releaseDate!: number;

  @Column()
  updateDate!: number;

  @Column()
  duration!: number;

  @Column()
  rating!: number;

  @Column(type => DoubanDoc)
  douban!: Douban;

  @Column()
  description!: string;

  @Column(type => DownloadDoc)
  downloads!: Download[];

}
