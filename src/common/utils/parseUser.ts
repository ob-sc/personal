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
  stations: FeatureAccess;
  regions: FeatureAccess;
}

/**
 * `access` ist eine 10-Bit-Kette mit jeweils 2 Bits für Berechtigungen eines Features,
 * _Lesen_ und _Schreiben_ (in dieser Reihenfolge).
 *
 * Features werden in dieser Reihenfolge geparsed:
 * `admin` > `users` > `temps` > `stations` > `regions`
 *
 * `0b0000001010` ist also nur das Lesen von `temps` und `stations`
 */
export const parseAccess = (access: number): Access => ({
  admin: {
    read: checkBit(access, 9),
    write: checkBit(access, 8),
  },
  users: {
    read: checkBit(access, 7),
    write: checkBit(access, 6),
  },
  temps: {
    read: checkBit(access, 5),
    write: checkBit(access, 4),
  },
  stations: {
    read: checkBit(access, 3),
    write: checkBit(access, 2),
  },
  regions: {
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
    access: parseAccess(access),
    location,
    stations: allowed_stations?.map((stat) => stat.id) ?? [],
  };
};

export default parseUser;

// todo /admin seite in der man berechtigungsgruppen eingeben kann, diese dann bei neuer ma erstellen
// todo statt dn direkt station / abteilung in db eintragen

// https://medium.com/swlh/an-illustrated-guide-to-bitwise-operators-60b1b1ad5ac
