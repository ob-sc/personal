import { NextApiRequest, NextApiResponse } from 'next';
import { DataSource } from 'typeorm';
import { DomainUser, LdapClient } from 'src/modules/ldap/types';
import { Region } from 'src/entities/Region';
import { Station } from 'src/entities/Station';
import { User } from 'src/entities/User';
import { Crent } from 'src/entities/Crent';
import { Hardware } from 'src/entities/Hardware';

export type PermittedMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

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

interface NextApiRequestWithConn<T> extends NextApiRequest {
  body: T;
  db?: DataSource;
  ldap?: LdapClient;
}

/** Mit Session, DB ORM und ldapjs Client */
export type ApiHandlerWithConn<RequestBody = NextApiRequest['body']> = (
  req: NextApiRequestWithConn<RequestBody>,
  res: NextApiResponse
) => Promise<void>;

interface AccessModule {
  read: boolean;
  write: boolean;
}

export interface Access {
  admin: AccessModule; // admin read für ad sync, write für settings, berechtigungen etc
  users: AccessModule;
  stations: AccessModule;
  regions: AccessModule;
}

export type AccessPositions = Record<
  keyof Access,
  { read: number; write: number }
>;

export interface ParsedUser {
  id: User['id'];
  username: DomainUser['sAMAccountName'];
  email: DomainUser['mail'] | null;
  firstName: DomainUser['mail'] | null;
  lastName: DomainUser['mail'] | null;
  fullName: string; // `${firstName} ${lastName}`
  access: Access; // Berechtigungen, siehe src/common/utils/user.ts
  stations: Station['id'][]; // Array nur aus IDs
  location: number | string; // string aus Stationsnummer oder Abteilung, siehe src/common/utils/user.ts
  entryDate: User['entry_date'];
  qlik: null | 'Angefordert' | 'Aktiv';
  region: Region | null;
  crent: Crent | null;
  hardware: Hardware | null;
  active: User['active'];
}
