import { Artist } from '@iinfinity/movie-crawler';
import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity('artist')
export class ArtistEntity extends BaseEntity implements Artist {

  @ObjectIdColumn()
  object!: ObjectID;

  @Column()
  id!: string;

  @Column()
  name!: string;

}
