import type { Relation } from 'typeorm';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Region } from 'src/entities/Region';
import { Station } from 'src/entities/Station';
import { NULL, UNIQUE } from 'src/common/utils/server';
import { Crent } from 'src/entities/Crent';
import { Hardware } from 'src/entities/Hardware';

/**
 * Benutzer aus der Datenbank, quasi als Erweiterung vom AD (per LDAP).
 * Die Berechtigungen (in `access` und `stations`) kommen nicht aus dem AD.
 * Siehe auch `src/modules/ldap/types.d.ts` und `src/common/types/server.d.ts`
 */
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  // --- Aus dem AD: ---

  @Column('varchar', { ...UNIQUE })
  username!: string;

  @Column('varchar', { ...NULL })
  first_name!: string | null;

  @Column('varchar', { ...NULL })
  last_name!: string | null;

  @Column('varchar', { ...NULL })
  email!: string | null;

  @Column('tinyint', { width: 1, default: 1 })
  active!: 0 | 1;

  // Wird aus DN erstellt, also quasi Überordner des Benutzers
  // Ist entweder Zahl der Station oder Abteilung
  @Column('varchar')
  location!: string;

  // --- Aus der App: ---

  // siehe src/common/utils/user.ts
  @Column('binary', { length: 1, ...NULL })
  access!: Buffer | null;

  @Column('date', { ...NULL })
  entry_date!: string | null;

  @Column('varchar', { ...NULL })
  position!: string | null;

  @Column('int', { ...NULL })
  qlik!: number | null;

  @Column('int', { ...NULL })
  region_id!: number | null;

  @Column('int', { ...NULL })
  crent_id!: number | null;

  @Column('int', { ...NULL })
  hardware_id!: number | null;

  // --- Relationen: ---

  @ManyToOne(() => Region, (region) => region.users)
  @JoinColumn({ name: 'region_id' })
  region!: Relation<Region>;

  @ManyToOne(() => Crent, (crent) => crent.users)
  @JoinColumn({ name: 'crent_id' })
  crent!: Relation<Crent>;

  @ManyToOne(() => Hardware, (hardware) => hardware.users)
  @JoinColumn({ name: 'hardware_id' })
  hardware!: Relation<Hardware>;

  // Freigegebene Stationen, eigene n:n Tabelle
  @ManyToMany(() => Station, (station) => station.users, {
    cascade: true,
  })
  @JoinTable({
    name: 'allowed_stations',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'station_id' },
  })
  allowed_stations!: Relation<Station[]>;
}

/* todo
 qlik: 0-2, 0: kein qlik, 1: angefordert (beim onboarding oder sonst auch?), 2: aktiv
 man könnte zb auf der startseite oder iwo anders sagen qlik angefordert: diese user

 */
