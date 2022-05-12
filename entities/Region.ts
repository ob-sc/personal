import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Station } from 'entities/Station';
import { User } from 'entities/User';
import { UNIQUE } from 'utils/server';

// todo was ist wenn ich region lösche aber user id noch hat? cascade? testen ob das überhaupt passiert

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

  @OneToMany(() => Station, (station) => station.subregion)
  subStations!: Relation<Station[]>;
}
