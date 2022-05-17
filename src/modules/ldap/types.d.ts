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
