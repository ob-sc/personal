import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { IsEmail } from 'class-validator';
import { Region } from 'src/entities/Region';
import { Station } from 'src/entities/Station';
import { NULL, UNIQUE } from 'src/utils/server';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { ...UNIQUE })
  username!: string;

  @Column('varchar')
  first_name!: string;

  @Column('varchar')
  last_name!: string;

  @IsEmail()
  @Column('varchar')
  email!: string;

  @Column('varchar')
  dn!: string;

  @Column('int', { ...NULL })
  access!: number;

  @Column('int', { ...NULL })
  region_id!: number | null;

  @Column('tinyint', { default: 1 })
  active!: boolean;

  // ---

  @ManyToOne(() => Region, (region) => region.users)
  @JoinColumn({ name: 'region_id' })
  region!: Relation<Region>;

  @ManyToMany(() => Station, (station) => station.users)
  @JoinTable({
    name: 'allowed_stations',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'station_id' },
  })
  allowedStations!: Relation<Station[]>;
}
