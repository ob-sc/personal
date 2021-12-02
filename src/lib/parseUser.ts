import {
  DomainUser,
  Employee,
  ParsedUser,
  UserAccess,
  UserRegion,
  UserStations,
} from '../../types/user';
import { DBUser } from '../db/users';

// todo alle throws testen

type ParseUser = (dbUser: DBUser, domainUser: DomainUser, employee: Employee) => ParsedUser;

export const parseStations = (stations: string | null | undefined): UserStations => {
  if (!stations) return null;

  const numStations: UserStations = [];

  // leerstellen entfernen
  const stationsString = stations.replace(/\s+/g, '');
  const extraStations = stationsString.split(',');
  for (const station of extraStations) {
    const numStation = Number(station);
    if (Number.isNaN(numStation)) {
      throw new Error(`Ungültige Station in stations: ${stationsString}`);
    }
    numStations.push(numStation);
  }

  return numStations;
};

// const findStation = (employee: Employee) => {
//   let kst;
//   for (const { names, customFields } of employee.customFieldSections) {
//     if (names.de === 'API') {
//       kst = customFields?.find(({ title }) => title.de === 'Kostenstelle')?.value;
//     }
//   }
//   kst = Number(kst);
//   return Number.isNaN(kst) ? undefined : kst;
// };

const parseOUStation = (dn: string) => {
  const dnParts = dn.split('=');
  const station = Number(dnParts[2].substring(0, 3));
  return Number.isNaN(station) ? 0 : station;
};

const parseUser: ParseUser = (dbUser, domainUser, employee) => {
  const { username, access: accessString, region: regionString, stations: stationString } = dbUser;

  const ouStation = parseOUStation(domainUser.distinguishedName);

  const email = domainUser.mail.toLowerCase();
  if (email !== employee.email.toLowerCase()) {
    throw new Error(`AD Mail-Adresse von ${username} entspricht nicht der Jacando Adresse`);
  }

  const region =
    typeof regionString === 'string' ? (regionString.toLowerCase() as UserRegion) : null;

  const numericAccess = {
    idl: 1,
    sl: 2,
    rl: 3,
    admin: 4,
  };

  const accessIndex = accessString?.toLowerCase() ?? 'undefined';
  const access = numericAccess[accessIndex as UserAccess] ?? 0;

  const stations = parseStations(stationString);

  if (stations === null || stations.length === 0) {
    throw new Error(`Keine Stationen in Feld stations bei ${username}`);
  }

  const user: ParsedUser = {
    id: employee.id,
    username,
    access,
    region,
    ouStation,
    stations,
    email,
    firstName: employee.firstName.trim(),
    lastName: employee.lastName.trim(),
    gender: employee.gender.trim(),
    personellNumber: Number(employee.personellNumber),
  };

  console.log(user);

  return user;
};

export default parseUser;
