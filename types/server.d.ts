import { NextApiRequest, NextApiResponse } from 'next';
import { DataSource } from 'typeorm';
import Region from '../src/entities/Region';

export interface ParsedUser {
  /** aus AD */
  username: string;
  /** aus AD */
  email: string;
  /** aus AD */
  firstName: string;
  /** aus AD */
  lastName: string;
  /** aus DB */
  access: number;
  /** aus DB */
  region: Region | null;
  /** IDs, erste Station ist OU-Station, 0 wenn es keine gibt. Rest aus DB. */
  stations: number[];
}

// Active Directory / Domain STARCAR

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

export type SuccessResponse =
  | { message: string }
  | object
  | object[]
  | null
  | undefined;

export type ErrorResponse = {
  message: string;
  field?: string;
};

// in withSession.ts middleware, db wird dort mitgegeben

export type NextApiResponseWithDB = NextApiResponse & {
  db?: DataSource;
  dbInit?: boolean;
};

export type NextApiHandlerWithDB = (
  req: NextApiRequest,
  res: NextApiResponseWithDB
) => void | Promise<void>;
