import { SearchResult, Detail, Download } from '@iinfinity/movie-crawler';
import { Entity, BaseEntity } from 'typeorm';

export interface Movie extends Detail { }

// @Entity('movie')
// export class MovieEntity implements Movie {

//   @Column
//   title!: string;
//   image!: string;
//   artist!: string;
//   desc!: string;
//   type!: string;
//   area!: string;
//   date!: string;
//   rate!: string;
//   download!: Download[];

// }
