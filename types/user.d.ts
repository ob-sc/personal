export type UserAccess = 'idl' | 'sl' | 'rl' | 'admin';
export type UserRegion = 'alle' | 'hamburg' | 'berlin' | 'nord' | 'süd' | 'ost' | 'west' | 'mitte';
export type UserStations = number[];

export interface ParsedUser {
  /** username aus AD (sAMAccountName) */
  username: string;
  /** Mail aus AD */
  email: string;
  /** Vorname aus AD */
  firstName: string;
  /** Nachname aus AD */
  lastName: string;
  /** leer (0), idl (1), sl (2), rl (3), admin (4) */
  access: number;
  /** Region oder null */
  region: UserRegion | null;
  /** Array aus stationen, "*" oder null */
  stations: UserStations;
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

export interface DomainAllAttributes extends DomainUser {
  dn: string; // "CN=SC - Bergen\\, Ole,OU=_IT,OU=_Flotte,OU=Verwaltung,OU=User,OU=STARCAR,DC=starcar,DC=local"
  sAMAccountType: string; // "805306368", diesen Typ für MA
  objectClass: string[]; // ['top', 'person', 'organizationalPerson', 'user']
  controls: [];
  description: string; // "Hat NB von SC"
  instanceType: string; // "4"
  whenCreated: string; // "20170831133711.0Z"
  whenChanged: string; // "20211121090012.0Z"
  uSNCreated: string; // "22797"
  memberOf: string[];
  uSNChanged: string; // "43934556"
  proxyAddresses: string[];
  homeMDB: string; // "CN=StarCar_User_1,CN=Databases,CN=Exchange Administrative Group (FYDIBOHF23SPDLT),CN=Administrative Groups,CN=Erste Organisation,CN=Microsoft Exchange,CN=Services,CN=Configuration,DC=starcar,DC=local"
  mDBUseDefaults: string; // "TRUE"
  mailNickname: string; // "bergen"
  objectGUID: string;
  badPwdCount: string;
  codePage: string;
  countryCode: string;
  badPasswordTime: string;
  lastLogoff: string;
  lastLogon: string;
  pwdLastSet: string;
  primaryGroupID: string; // "513"
  objectSid: string;
  accountExpires: string;
  logonCount: string;
  showInAddressBook: string[];
  legacyExchangeDN: string; // "/o=Erste Organisation/ou=Exchange Administrative Group (FYDIBOHF23SPDLT)/cn=Recipients/cn=083fce1c1d7743e09df805e266603edd-SC -"
  lockoutTime: string;
  objectCategory: string; // "CN=Person,CN=Schema,CN=Configuration,DC=starcar,DC=local"
  msNPAllowDialin: string;
  dSCorePropagationData: string[];
  'mS-DS-ConsistencyGuid': string;
  lastLogonTimestamp: string;
  msTSExpireDate: string;
  msTSLicenseVersion: string;
  msTSManagingLS: string;
  msTSLicenseVersion2: string;
  msTSLicenseVersion3: string;
  'msDS-KeyCredentialLink': string[];
  mobile: string;
  thumbnailPhoto: string;
  msExchHomeServerName: string; // "/o=Erste Organisation/ou=Exchange Administrative Group (FYDIBOHF23SPDLT)/cn=Configuration/cn=Servers/cn=SC-05"
  msExchMailboxSecurityDescriptor: string;
  msExchUserAccountControl: string; // "0"
  msExchMailboxGuid: string;
  msExchPoliciesExcluded: string;
  msExchRecipientTypeDetails: string; // "1"
  msExchCalendarLoggingQuota: string; // "6291456"
  msExchVersion: string; // "88218628259840"
  msExchArchiveQuota: string;
  msExchRBACPolicyLink: string; // "CN=Default Role Assignment Policy,CN=Policies,CN=RBAC,CN=Erste Organisation,CN=Microsoft Exchange,CN=Services,CN=Configuration,DC=starcar,DC=local"
  msExchRecipientDisplayType: string;
  'msDS-ExternalDirectoryObjectId': string;
  msExchELCMailboxFlags: string;
  msExchMobileMailboxFlags: string;
  msExchWhenMailboxCreated: string;
  msExchDumpsterWarningQuota: string;
  msExchUMDtmfMap: string[];
  msExchTextMessagingState: string[];
  msExchDumpsterQuota: string;
  msExchDelegateListBL: string; // "CN=Onboarding,OU=Arbeitspostfächer,OU=Verwaltung,OU=User,OU=STARCAR,DC=starcar,DC=local"
  msExchArchiveWarnQuota: string;
}
