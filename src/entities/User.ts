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

  @Column('tinyint', { default: 1 })
  active!: boolean;

  // Wird aus DN erstellt, also quasi Überordner des Benutzers
  // Ist entweder Zahl der Station oder Abteilung
  @Column('varchar')
  location!: string;

  // --- Aus der App: ---

  // siehe src/common/utils/user.ts
  @Column('binary', { length: 2, ...NULL })
  access!: Buffer | null;

  @Column('int', { ...NULL })
  region_id!: number | null;

  @Column('date', { ...NULL })
  entry_date!: string | null;

  // --- Relationen: ---
  @ManyToOne(() => Region, (region) => region.users)
  @JoinColumn({ name: 'region_id' })
  region!: Relation<Region>;

  // Freigegebene Stationen, eigene n:n Tabelle
  @ManyToMany(() => Station, (station) => station.users)
  @JoinTable({
    name: 'allowed_stations',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'station_id' },
  })
  allowed_stations!: Relation<Station[]>;
}

/* todo
 qlik: 0 -3, 0: kein qlik, 1: angefordert (beim onboarding oder sonst auch?), 2: bestellt, 3: aktiv
 man könnte zb auf der startseite oder iwo anders sagen qlik angefordert: diese user



 es fehlt noch hardware, crent, qlik
 */
