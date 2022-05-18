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
import { Region } from 'src/entities/Region';
import { Station } from 'src/entities/Station';
import { NULL, UNIQUE } from 'src/common/utils/server';

/**
 * Benutzer aus der Datenbank, quasi als Erweiterung vom AD (per LDAP).
 * Die Berechtigungen (in `access` und `stations`) kommen nicht aus dem AD.
 */
// todo sollten firstname, lastname und email null sein dürfen?
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { ...UNIQUE })
  username!: string;

  @Column('varchar', { ...NULL })
  first_name!: string | null;

  @Column('varchar', { ...NULL })
  last_name!: string | null;

  @Column('varchar', { ...NULL })
  email!: string | null;

  @Column('varchar')
  location!: string;

  @Column('binary', { length: 2 })
  access!: Buffer;

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
  allowed_stations!: Relation<Station[]>;
}
