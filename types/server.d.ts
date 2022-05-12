import { NextApiRequest, NextApiResponse } from 'next';
import { DataSource, Repository } from 'typeorm';
import { Region } from 'entities/Region';
import { entities } from 'server/database';

/** Array aus input-Feldern, für Übermittlung von fehlerhaften Eingaben */
export type Fields = string[];

export type SuccessResponse =
  | { message: string }
  | object
  | object[]
  | null
  | undefined;

export type ErrorResponse = {
  message: string;
  fields: Fields;
};

export interface LdapError {
  instance: Error;
  fields: Fields;
}

export interface DomainUser {
  cn: string; // "SC - Bergen, Ole"
  sn: string; // "Bergen"
  l: string; // "Hamburg"
  postalCode: string; // "20537"
  telephoneNumber: string; // "+49 40 654411503"
  givenName: string; // "Ole"
  /** Disponenten sind in `OU=[Stationsnummer] - [Station],OU=Counter, ...` */
  distinguishedName: string; // "CN=SC - Bergen\\, Ole,OU=_IT,OU=_Flotte,OU=Verwaltung,OU=User,OU=STARCAR,DC=starcar,DC=local"
  // memberOf?
  displayName: string; // "STARCAR GmbH - Ole Bergen"
  streetAddress: string; // "Süderstr. 282"
  sAMAccountName: string; // "bergen", Login-Name
  userPrincipalName: string; // "bergen@starcar.de"
  userAccountControl: string; // Account aktiv | 512 = ja, 514 = nein
  mail: string; // "ole.bergen@starcar.de"
}

export interface LdapClient {
  client: Client;
  connect: () => Promise<void>;
  authenticate: (username: string, password: string) => Promise<DomainUser[]>;
  search: () => Promise<DomainUser[]>;
  destroy: () => void;
}

/** Session, DB ORM und ldapjs Client in `req` */
type NextApiRequestWithConnections = NextApiRequest & {
  db?: DataSource;
  ldap?: LdapClient;
};

/**
 * Mit Session, DB ORM und ldapjs Client
 * @example
 * const routeHandler: NextApiHandlerWithConnections = async (req, res) => { const { session, db, ldap } = req; ... };
 */
export type NextApiHandlerWithConnections = (
  req: NextApiRequestWithConnections,
  res: NextApiResponse
) => Promise<void>;

export interface ParsedUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  access: number;
  region: Region | null;
  /** IDs, erste Station ist OU-Station, 0 wenn es keine gibt. Rest aus DB. */
  stations: number[];
}

export interface ApiRequestHandlerData {
  ldap?: LdapClient;
  query?: NextApiRequest['query'];
  body?: NextApiRequest['body'];
}

export type ApiRequestHandler<T = typeof entities> = (
  res: NextApiResponse,
  repo: Repository<T>,
  data?: ApiRequestHandlerData
) => Promise<void>;
