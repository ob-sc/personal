import { ParsedUser } from 'src/common/types/server';
import { User } from 'src/entities/User';

const parseUser = (user: User): ParsedUser => {
  const {
    id,
    username,
    first_name,
    last_name,
    access,
    region,
    allowedStations,
    email,
    dn,
  } = user;

  const dnParts = dn.split('=');
  const station = Number(dnParts[2].substring(0, 3));
  const ouStation = Number.isNaN(station) ? 0 : station;
  const allowedIds = allowedStations?.map((stat) => stat.id) ?? [];

  return {
    id,
    username,
    region,
    email: email?.toLowerCase() ?? '',
    firstName: first_name ?? '',
    lastName: last_name ?? '',
    fullName: `${first_name} ${last_name}`,
    access: access ?? 0,
    stations: [ouStation, ...allowedIds],
  };
};

export default parseUser;
