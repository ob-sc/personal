import { UserModel } from '../../types/data';
import { DomainUser, ParsedUser } from '../../types/user';

type ParseUser = (dbUser: UserModel, domainUser: DomainUser) => ParsedUser;

// string aus db (stations in users), mit komma getrennte stationsnummern
export const parseStations = (
  stations: string | null | undefined
): UserStations => {
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

const parseUser: ParseUser = (dbUser, domainUser) => {
  const { username, access: a, region, stations: stationsArray } = dbUser;
  const { distinguishedName, mail, givenName, sn } = domainUser;
  const email = mail?.toLowerCase() ?? '';

  const access = a ?? 0;

  const ouStation = parseOUStation(distinguishedName);

  console.log(dbUser);

  // 0 bei keiner OU Station
  const extraStations = parseStations(stationsArray);

  const stations = [ouStation, ...extraStations];

  const user: ParsedUser = {
    username,
    email,
    firstName: givenName,
    lastName: sn,
    access,
    region,
    stations,
  };

  return user;
};

export default parseUser;
