import {
  DomainUser,
  Employee,
  ParsedUser,
  UserAccess,
  UserRegion,
  UserStations,
} from '../../types/user';
import { DBUser } from '../db/users';

type ParseUser = (dbUser: DBUser, domainUser: DomainUser, employee: Employee) => ParsedUser;

// string aus db (stations in users), mit komma getrennte stationsnummern
export const parseStations = (stations: string | null | undefined): UserStations => {
  const numStations: UserStations = [];

  if (!stations) return numStations;

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

export const parseOUStation = (dn: string) => {
  const dnParts = dn.split('=');
  const station = Number(dnParts[2].substring(0, 3));
  return Number.isNaN(station) ? 0 : station;
};

const parseUser: ParseUser = (dbUser, domainUser, employee) => {
  const {
    username,
    access: accessString,
    region: regionString,
    adstation,
    stations: stationString,
  } = dbUser;

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

  const user: ParsedUser = {
    id: employee.id,
    username,
    access,
    region,
    adstation,
    stations,
    email,
    firstName: employee.firstName.trim(),
    lastName: employee.lastName.trim(),
    gender: employee.gender.trim(),
    personellNumber: Number(employee.personellNumber),
  };

  return user;
};

export default parseUser;
