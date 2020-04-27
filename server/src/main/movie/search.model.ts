import { SearchResult } from '@iinfinity/movie-crawler';
import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

export interface Search extends SearchResult { }

@Entity('search')
export class SearchEntity extends BaseEntity implements Search {

  @ObjectIdColumn()
  id!: ObjectID;

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
