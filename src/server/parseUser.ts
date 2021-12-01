import {
  DomainUser,
  Employee,
  ParsedUser,
  UserExtrastation,
  UserRegion,
  UserStatus,
} from '../../types/user';
import { UserTable } from '../db/users';

// todo alle throws testen

type ParseUser = (dbUser: UserTable, domainUser: DomainUser, employee: Employee) => ParsedUser;

const findStation = (employee: Employee) => {
  let kst;
  for (const { names, customFields } of employee.customFieldSections) {
    if (names.de === 'API') {
      kst = customFields?.find(({ title }) => title.de === 'Kostenstelle')?.value;
    }
  }
  kst = Number(kst);
  return Number.isNaN(kst) ? undefined : kst;
};

const parseUser: ParseUser = (dbUser, domainUser, employee) => {
  const { username, access, region, extrastation } = dbUser;

  const kst = findStation(employee);
  if (kst === undefined) {
    throw new Error(`Fehlerhafte Kostenstelle in Jacando bei Benutzer ${username}`);
  }

  const adMail = domainUser.mail.toLowerCase();

  if (adMail !== employee.email.toLowerCase()) {
    throw new Error(`AD Mail-Adresse von ${username} entspricht nicht der Jacando Adresse`);
  }

  const userRegion = typeof region === 'string' ? (region.toLowerCase() as UserRegion) : null;

  const numericAccess = {
    idl: 1,
    sl: 2,
    rl: 3,
    admin: 4,
  };

  const accessIndex = access?.toLowerCase() ?? 'undefined';
  const numAccess = numericAccess[accessIndex as UserStatus] ?? 0;

  let extra = extrastation as UserExtrastation;
  // wenn nicht null (muss so weil der type number[] hat, extrastation hier aber nur string oder null sein kann)
  if (typeof extra === 'string') {
    const extraStationString = extra.replace(/\s+/g, '');
    if (extraStationString !== '*') {
      const extraStations = extraStationString.split(',');
      // extra = number[]
      extra = extraStations.map((s) => Number(s));
      for (const station of extra) {
        if (Number.isNaN(station)) {
          throw new Error(`Ungültige Station in Feld extrastation von ${username}`);
        }
      }
      // extra = "*"
    } else extra = extraStationString;
    // wenn kein string: extra = null
  } else extra = null;

  const user: ParsedUser = {
    id: employee.id,
    username,
    kst,
    access: numAccess,
    region: userRegion,
    extrastation: extra,
    email: adMail,
    firstName: employee.firstName.trim(),
    lastName: employee.lastName.trim(),
    gender: employee.gender.trim(),
    personellNumber: Number(employee.personellNumber),
  };

  return user;
};

export default parseUser;
