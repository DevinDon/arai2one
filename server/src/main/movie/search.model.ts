import { SearchResult } from '@iinfinity/movie-crawler';
import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

export interface Search extends SearchResult {

  keyword: string;

}

@Entity('search')
export class SearchEntity extends BaseEntity implements Search {

  @Column()
  keyword!: string;

  @Column()
  title!: string;

  @Column()
  type!: string;

  @Column()
  year!: number;

  @Column()
  aliases!: string[];

  @Column()
  description!: string;

  @Column()
  rating?: number | undefined;

  @Column()
  url!: string;

}
