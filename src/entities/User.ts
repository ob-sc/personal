import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { NOT_NULL, NULL, UNIQUE } from '../utils/server';
import Region from './Region';
import Station from './Station';

// @Table({ tableName: 'users', timestamps: false })
@Entity()
class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('string', { ...UNIQUE, ...NOT_NULL })
  username!: string;

  @Column('string', { ...NULL })
  access!: number;

  // @ForeignKey(() => Region)
  @Column('int', { ...NULL })
  region_id!: number;

  @Column('tinyint', { ...NOT_NULL, default: 1 })
  active!: boolean;

  // ---

  @ManyToOne(() => Region, (region) => region.users)
  region!: Relation<Region>;

  @ManyToMany(() => Station, (station) => station.users)
  @JoinTable()
  allowedStations!: Relation<Station[]>;
}

export default User;
