import { Summary } from '@iinfinity/movie-crawler';
import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity('summary')
export class SummaryEntity extends BaseEntity implements Summary {

  @ObjectIdColumn()
  object!: ObjectID;

  @Column()
  id!: string;

  @Column()
  title!: string;

  @Column()
  image!: string;

  @Column()
  type!: string;

  @Column()
  year!: number;

  @Column()
  rating!: number;

  @Column()
  hot!: number;

  @Column()
  keywords!: string[];

  @Column()
  description!: string;

}
