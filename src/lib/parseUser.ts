import { DomainUser, ParsedUser } from '../../types/server';
import { User } from '../entities/User';

export const parseOUStation = (dn: string) => {
  const dnParts = dn.split('=');
  const station = Number(dnParts[2].substring(0, 3));
  return Number.isNaN(station) ? 0 : station;
};

const parseUser = (dbUser: User, domainUser: DomainUser) => {
  const { username, access: a, region, allowedStations } = dbUser;
  const { distinguishedName, mail, givenName, sn } = domainUser;
  const email = mail?.toLowerCase() ?? '';

  const access = a ?? 0;

  const ouStation = parseOUStation(distinguishedName);

  const allowedIds = allowedStations?.map((stat) => stat.id) ?? [];

  const stations: number[] = [ouStation, ...allowedIds];

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
