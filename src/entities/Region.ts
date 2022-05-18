import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Station } from 'src/entities/Station';
import { User } from 'src/entities/User';
import { UNIQUE } from 'src/common/utils/server';

@Entity({ name: 'regions' })
export class Region {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { ...UNIQUE })
  name!: string;

  // ---

  @OneToMany(() => User, (user) => user.region)
  users!: Relation<User[]>;

  @OneToMany(() => Station, (station) => station.region)
  stations!: Relation<Station[]>;
}
