import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import { NULL, UNIQUE } from '../utils/server';
import { Region } from './Region';
import { User } from './User';

@Entity({ name: 'stations' })
export class Station {
  @PrimaryColumn({ ...UNIQUE })
  id!: number;

  @Column('varchar', { ...UNIQUE })
  name!: string;

  @Column('varchar', { ...NULL })
  address!: string | null;

  @Column('int', { ...NULL })
  zip!: number | null;

  @Column('varchar', { ...NULL })
  city!: string | null;

  @Column('varchar', { ...NULL })
  telephone!: string | null;

  @Column('varchar', { ...NULL })
  fax!: string | null;

  @Column('varchar', { ...NULL })
  email!: string | null;

  // @ForeignKey(() => Region)
  @Column('int')
  region_id!: number;

  // @ForeignKey(() => Region)
  @Column('int', { ...NULL })
  subregion_id!: number | null;

  // ---

  @ManyToOne(() => Region, (region) => region.users)
  @JoinColumn({ name: 'region_id' })
  region!: Relation<Region>;

  @ManyToOne(() => Region, (region) => region.users)
  @JoinColumn({ name: 'subregion_id' })
  subregion!: Relation<Region>;

  @ManyToMany(() => User, (user) => user.allowedStations)
  users!: Relation<User[]>;
}
