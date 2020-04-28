import { Artist, BaseImage, Download, Movie, Rating, ReleaseDate } from '@iinfinity/movie-crawler';
import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

export class DownloadDoc implements Download {

  @Column()
  title!: string;

  @Column()
  uris!: string[];

  @Column()
  size!: string;

  @Column()
  type!: string;

}

class BaseImageDoc implements BaseImage {

  @Column()
  id?: ObjectID;

  @Column()
  title!: string;

  @Column()
  size!: { width: number; height: number; };

  @Column()
  url!: string;

  @Column()
  type: any;

}

class ArtistDoc implements Pick<Artist, 'id' | 'name'> {

  @Column()
  id!: string;

  @Column()
  name!: string;

}

class RatingDoc implements Rating {

  @Column()
  star!: number;

  @Column()
  total!: number;

  @Column()
  star5!: number;

  @Column()
  star4!: number;

  @Column()
  star3!: number;

  @Column()
  star2!: number;

  @Column()
  star1!: number;

}

class ReleaseDateDoc implements ReleaseDate {

  @Column()
  area!: string;

  @Column()
  date!: number;

}

@Entity('movie')
export class MovieEntity extends BaseEntity implements Movie {

  @ObjectIdColumn()
  _id!: ObjectID;

  @Column()
  id!: string;

  @Column(type => BaseImageDoc)
  images!: BaseImageDoc[];

  @Column()
  title!: string;

  @Column()
  year!: number;

  @Column(type => ArtistDoc)
  directors!: ArtistDoc[];

  @Column(type => ArtistDoc)
  writers!: ArtistDoc[];

  @Column(type => ArtistDoc)
  actors!: ArtistDoc[];

  @Column()
  types!: string[];

  @Column()
  areas!: string[];

  @Column()
  languages!: string[];

  @Column(type => ReleaseDateDoc)
  releaseDate!: ReleaseDateDoc[];

  @Column()
  updateDate!: number;

  @Column()
  duration!: number;

  @Column()
  aliases!: string[]

  @Column()
  imdb!: string;

  @Column(type => RatingDoc)
  rating!: RatingDoc;

  @Column()
  description!: string;

  @Column(type => DownloadDoc)
  downloads!: DownloadDoc[];

  @Column()
  links!: string[];

}
