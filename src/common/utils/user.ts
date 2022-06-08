import { Access, AccessPositions, ParsedUser } from 'src/common/types/server';
import { checkBit } from 'src/common/utils/bitwise';
import { User } from 'src/entities/User';
import { DomainUser } from 'src/modules/ldap/types';
import { Repository } from 'typeorm';

/** Positionen des Bits mit Berechtigung innerhalb der 2 Byte, siehe `parseAccess()` */
export const ap: AccessPositions = {
  regions: {
    read: 15,
    write: 14,
  },
  stations: {
    read: 13,
    write: 12,
  },
  weekends: {
    read: 11,
    write: 10,
  },
  work_shifts: {
    read: 9,
    write: 8,
  },
  temps: {
    read: 7,
    write: 6,
  },
  users: {
    read: 5,
    write: 4,
  },
  controlling: {
    read: 3,
    write: 2,
  },
  admin: {
    read: 1,
    write: 0,
  },
};

/**
 * `access` ist 2 byte BE. Jede Tabelle (jedes Feature) hat 2 Bits für Berechtigungen,
 * _Lesen_ und _Schreiben_ (in dieser Reihenfolge).
 *
 * Features (Tabellen) werden in dieser Reihenfolge geparsed:
 * `regions` > `stations` > `weekends` > `work_shifts` > `temps` > `users` > `controlling` > `admin`
 *
 * `admin` write ist LSB, also hat ein ungerader integer immer admin write.
 *
 * Beispiel: `0b0000000010100000` bzw `0x00A0` ist nur das Lesen von `temps` und `users`.
 */
export const parseAccess = (access: number): Access => ({
  regions: {
    read: checkBit(access, ap.regions.read),
    write: checkBit(access, ap.regions.write),
  },
  stations: {
    read: checkBit(access, ap.stations.read),
    write: checkBit(access, ap.stations.write),
  },
  weekends: {
    read: checkBit(access, ap.weekends.read),
    write: checkBit(access, ap.weekends.write),
  },
  work_shifts: {
    read: checkBit(access, ap.work_shifts.read),
    write: checkBit(access, ap.work_shifts.write),
  },
  temps: {
    read: checkBit(access, ap.temps.read),
    write: checkBit(access, ap.temps.write),
  },
  users: {
    read: checkBit(access, ap.users.read),
    write: checkBit(access, ap.users.write),
  },
  controlling: {
    read: checkBit(access, ap.controlling.read),
    write: checkBit(access, ap.controlling.write),
  },
  admin: {
    read: checkBit(access, ap.admin.read),
    write: checkBit(access, ap.admin.write),
  },
});

/** Erstelle User-Objekt aus User in der Datenbank, auch für Session */
export function readUser(user: User) {
  const {
    id,
    username,
    first_name,
    last_name,
    access,
    region,
    allowed_stations,
    email,
    location,
    entry_date,
    crent,
    hardware,
    qlik,
    active,
  } = user;

  const accessFromBinary = Buffer.isBuffer(access)
    ? access.readUIntBE(0, 2)
    : 0;

  const numOrStringLocation = !Number.isNaN(Number(location))
    ? Number(location)
    : location.replaceAll('_', '');

  const qlikString = qlik === 1 ? 'Angefordert' : qlik === 2 ? 'Aktiv' : null;

  const nameString =
    last_name && !first_name ? last_name : `${first_name} ${last_name}`;

  const parsed: ParsedUser = {
    id,
    username,
    region,
    crent,
    hardware,
    active,
    email: email?.toLowerCase() ?? null,
    firstName: first_name,
    lastName: last_name,
    fullName: nameString,
    access: parseAccess(accessFromBinary),
    location: numOrStringLocation,
    stations: allowed_stations?.map((stat) => stat.id) ?? [],
    entryDate: entry_date,
    qlik: qlikString,
  };

  return parsed;
}

// username extra für login
export async function writeUser(
  repo: Repository<User>,
  ldapUser: DomainUser,
  username = ldapUser.sAMAccountName
) {
  // suche username aus request in der db
  let dbUser = await repo.findOne({
    where: { username },
    relations: ['region', 'allowed_stations'],
  });

  // wenn kein user: Modell erstellen
  if (dbUser === null) {
    dbUser = new User();
    dbUser.username = username;
    // dbUser.access = emptyAccess; // im entity default gesetzt
  }

  // in jedem Fall Modell updaten
  dbUser.first_name = ldapUser.givenName;
  dbUser.last_name = ldapUser.sn;
  dbUser.email = ldapUser.mail;
  dbUser.active = ldapUser.userAccountControl === '512' ? 1 : 0;

  // aus DN die Station / Abteilung ermitteln
  // das ist sehr statisch, wenn der tree im AD also geändert wird knallts
  const dn = ldapUser.distinguishedName;
  const dnParts = dn.split('=');
  // eslint-disable-next-line prefer-destructuring
  const locationPart = dnParts[2];
  const station = locationPart.substring(0, 3);
  const [department] = locationPart.split(',');

  dbUser.location = !Number.isNaN(Number(station)) ? station : department;

  // und am Ende speichern‚
  dbUser = await repo.save(dbUser);

  return dbUser;
}
