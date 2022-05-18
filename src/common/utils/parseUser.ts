import { ParsedUser } from 'src/common/types/server';
import { checkBit } from 'src/common/utils/bitwise';
import { User } from 'src/entities/User';

interface AccessModule {
  read: boolean;
  write: boolean;
}

// todo regions könnte eigentlich stations write sein, dann wäre noch eine frei, refactoring schnell gemacht

export interface Access {
  admin: AccessModule;
  users: AccessModule;
  temps: AccessModule;
  work_shifts: AccessModule;
  weekends: AccessModule;
  stations: AccessModule;
  regions: AccessModule;
  controlling: AccessModule; // lohnkanzlei und controlling
}

/** Positionen des Bits mit Berechtigung innerhalb der 2 Byte, siehe `parseAccess()` */
export const accessPositions: Record<
  keyof Access,
  { read: number; write: number }
> = {
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
    read: checkBit(access, accessPositions.regions.read),
    write: checkBit(access, accessPositions.regions.write),
  },
  stations: {
    read: checkBit(access, accessPositions.stations.read),
    write: checkBit(access, accessPositions.stations.write),
  },
  weekends: {
    read: checkBit(access, accessPositions.weekends.read),
    write: checkBit(access, accessPositions.weekends.write),
  },
  work_shifts: {
    read: checkBit(access, accessPositions.work_shifts.read),
    write: checkBit(access, accessPositions.work_shifts.write),
  },
  temps: {
    read: checkBit(access, accessPositions.temps.read),
    write: checkBit(access, accessPositions.temps.write),
  },
  users: {
    read: checkBit(access, accessPositions.users.read),
    write: checkBit(access, accessPositions.users.write),
  },
  controlling: {
    read: checkBit(access, accessPositions.controlling.read),
    write: checkBit(access, accessPositions.controlling.write),
  },
  admin: {
    read: checkBit(access, accessPositions.admin.read),
    write: checkBit(access, accessPositions.admin.write),
  },
});

const parseUser = (user: User): ParsedUser => {
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
  } = user;

  const accessFromBinary = Buffer.isBuffer(access)
    ? access.readUIntBE(0, 2)
    : 0;

  return {
    id,
    username,
    region,
    email: email?.toLowerCase() ?? null,
    firstName: first_name,
    lastName: last_name,
    fullName: `${first_name} ${last_name}`,
    access: parseAccess(accessFromBinary),
    location,
    stations: allowed_stations?.map((stat) => stat.id) ?? [],
  };
};

export default parseUser;
