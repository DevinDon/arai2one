import { SearchResult } from '@iinfinity/movie-crawler';
import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn, PrimaryColumn } from 'typeorm';

export class SearchResultDoc implements SearchResult {

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

export interface Search {

  keyword: string;
  results: SearchResult[];

}

@Entity('search')
export class SearchEntity extends BaseEntity implements Search {

  @PrimaryColumn()
  keyword!: string;

  @Column(type => SearchResultDoc)
  results!: SearchResult[];

}
