import { Column, Entity, ManyToMany, PrimaryColumn, Relation } from 'typeorm';
import { NOT_NULL, NULL, UNIQUE } from '../utils/server';
import User from './User';

// @Table({ tableName: 'stations', timestamps: false })
@Entity()
class Station {
  @PrimaryColumn({ ...UNIQUE })
  id!: number;

  @Column('string', { ...UNIQUE, ...NOT_NULL })
  name!: string;

  @Column('string', { ...NULL })
  address!: string | null;

  @Column('int', { ...NULL })
  zip!: number | null;

  @Column('string', { ...NULL })
  city!: string | null;

  @Column('string', { ...NULL })
  telephone!: string | null;

  @Column('string', { ...NULL })
  fax!: string | null;

  @Column('string', { ...NULL })
  email!: string | null;

  // @ForeignKey(() => Region)
  @Column('int', { ...NOT_NULL })
  region_id!: number;

  // @ForeignKey(() => Region)
  @Column('int', { ...NULL })
  subregion_id!: number | null;

  // ---

  @ManyToMany(() => User, (user) => user.allowedStations)
  users!: Relation<User[]>;
}

export default Station;
