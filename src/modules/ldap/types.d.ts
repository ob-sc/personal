export interface DomainUser {
  cn: string; // "SC - Bergen, Ole"
  sn: string; // "Bergen"
  l: string; // "Hamburg"
  postalCode: string; // "20537"
  telephoneNumber: string; // "+49 40 654411503"
  givenName: string; // "Ole"
  /** Disponenten sind in `OU=[Stationsnummer] - [Station],OU=Counter, ...` */
  // memberOf?
  displayName: string; // "STARCAR GmbH - Ole Bergen"
  streetAddress: string; // "Süderstr. 282"
  sAMAccountName: string; // "bergen", Login-Name
  userPrincipalName: string; // "bergen@starcar.de"
  userAccountControl: string; // Account aktiv | 512 = ja, 514 = nein
  distinguishedName: string; // "CN=SC - Bergen\, Ole,OU=_IT,OU=_Flotte,OU=Verwaltung,OU=User,OU=STARCAR,DC=starcar,DC=local"
  mail: string; // "ole.bergen@starcar.de"
  objectClass: string[]; // "top", "person", "organizationalPerson", "user"
  // todo optionale nicht optional?
}

export interface LdapClient {
  client: Client;
  add: (dn: string, entry: Partial<DomainUser>) => Promise<void>;
  connect: () => Promise<void>;
  authenticate: (username: string, password: string) => Promise<DomainUser>;
  search: (user?: string) => Promise<DomainUser[]>;
  destroy: () => void;
}
