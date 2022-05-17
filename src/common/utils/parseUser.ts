import { ParsedUser } from 'src/common/types/server';
import { checkBit } from 'src/common/utils/bitwise';
import { User } from 'src/entities/User';

interface FeatureAccess {
  read: boolean;
  write: boolean;
}

export interface Access {
  admin: FeatureAccess;
  users: FeatureAccess;
  temps: FeatureAccess;
  work_shifts: FeatureAccess;
  weekends: FeatureAccess;
  stations: FeatureAccess;
  regions: FeatureAccess;
  tbd: FeatureAccess; // todo to be declared, falls ich später noch eine Berechtigung brauche
}

/**
 * `access` ist 2 byte BE. Jede Tabelle (und damit jedes Feature) hat 2 Bits für Berechtigungen,
 * _Lesen_ und _Schreiben_ (in dieser Reihenfolge).
 *
 * Features (Tabellen) werden in dieser Reihenfolge geparsed:
 * `tbd` > `regions` > `stations` > `weekends` > `work_shifts` > `temps` > `users` > `admin`
 *
 * `admin` write ist LSB, also hat ein ungerader integer immer admin write.
 *
 * Beispiel: `0b0000000000101000` bzw `0x0028` ist nur das Lesen von `temps` und `users`.
 */
export const parseAccess = (access: number): Access => ({
  tbd: {
    read: checkBit(access, 15),
    write: checkBit(access, 14),
  },
  regions: {
    read: checkBit(access, 13),
    write: checkBit(access, 12),
  },
  stations: {
    read: checkBit(access, 11),
    write: checkBit(access, 10),
  },
  weekends: {
    read: checkBit(access, 9),
    write: checkBit(access, 8),
  },
  work_shifts: {
    read: checkBit(access, 7),
    write: checkBit(access, 6),
  },
  temps: {
    read: checkBit(access, 5),
    write: checkBit(access, 4),
  },
  users: {
    read: checkBit(access, 3),
    write: checkBit(access, 2),
  },
  admin: {
    read: checkBit(access, 1),
    write: checkBit(access, 0),
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

  return {
    id,
    username,
    region,
    email: email?.toLowerCase() ?? null,
    firstName: first_name,
    lastName: last_name,
    fullName: `${first_name} ${last_name}`,
    access: parseAccess((access as Buffer).readUIntBE(0, 2)),
    location,
    stations: allowed_stations?.map((stat) => stat.id) ?? [],
  };
};

export default parseUser;

// todo /admin seite in der man berechtigungsgruppen eingeben kann, diese dann bei neuer ma erstellen
// todo statt dn direkt station / abteilung in db eintragen

// https://medium.com/swlh/an-illustrated-guide-to-bitwise-operators-60b1b1ad5ac
