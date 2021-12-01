export type UserStatus = 'idl' | 'sl' | 'rl' | 'admin';
export type UserRegion = 'hamburg' | 'berlin' | 'nord' | 'süd' | 'ost' | 'west' | 'mitte';
export type UserExtrastation = number[] | '*' | null;

export interface ParsedUser {
  /**
   * Jacando ID
   */
  id: string;
  /**
   * username aus AD (sAMAccountName)
   */
  username: string;
  /**
   * Kostenstelle (Stationsnummer)
   */
  kst: number;
  /**
   * 0: keine Berechtigung,
   * 1: IDL,
   * 2: SL,
   * 3: RL,
   * 4: Admin
   */
  access: number;
  /**
   * Region oder null
   * @example "nord"
   */
  region: UserRegion | null;
  /**
   * Array aus stationen, "*" oder null
   */
  extrastation: UserExtrastation;
  /**
   * Mail aus AD und Jacando wurde abgeglichen
   */
  email: string;
  /**
   * Vorname aus Jacando
   */
  firstName: string;
  /**
   * Nachname aus Jacando
   */
  lastName: string;
  /**
   * Geschlecht aus Jacando
   */
  gender: string;
  /**
   * Personalnummer aus Jacando
   */
  personellNumber: number;
}

// Jacando

// aus jacando /employees, ACHTUNG noch andere Attribute die vor response auf jeden Fall raus müssen, immer user parsen
export interface Employee {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  personellNumber: string;
  clients: [{ id: string; name: string }];
  roles: [{ name: string }];
  updatedAt: string; // '2021-11-19T09:52:52.490Z'
  createdAt: string; // '2020-11-27T14:24:27.701Z'
  publicEmail: string;
  imageUrl: string | null; // nicht sicher ob das stimmt, kein Bild zum testen
  archived: boolean;
  customFieldSections: {
    names: {
      en?: string;
      de: string;
    };
    customFields: {
      title: {
        de: string;
      };
      type: string;
      value: string;
    }[];
  }[];
}

// LDAP Active Directory / Domain STARCAR

export interface DomainUser {
  cn: string; // "SC - Bergen, Ole"
  sn: string; // "Bergen"
  l: string; // "Hamburg"
  postalCode: string; // "20537"
  telephoneNumber: string; // "+49 40 654411503"
  givenName: string; // "Ole"
  distinguishedName: string; // "CN=SC - Bergen\\, Ole,OU=_IT,OU=_Flotte,OU=Verwaltung,OU=User,OU=STARCAR,DC=starcar,DC=local"
  // memberOf?
  displayName: string; // "STARCAR GmbH - Ole Bergen"
  streetAddress: string; // "Süderstr. 282"
  sAMAccountName: string; // "bergen"
  sAMAccountType: string; // "805306368"
  userPrincipalName: string; // "bergen@starcar.de"
  objectClass: string[]; // ['top', 'person', 'organizationalPerson', 'user']
  userAccountControl: string; // Account aktiv | 512 = ja, 514 = nein
  mail: string; // "ole.bergen@starcar.de"
}

export interface DomainAllAttributes extends DomainUser {
  dn: string; // "CN=SC - Bergen\\, Ole,OU=_IT,OU=_Flotte,OU=Verwaltung,OU=User,OU=STARCAR,DC=starcar,DC=local"
  controls: [];
  description: string; // "Hat NB von SC"
  instanceType: string; // "4"
  whenCreated: string; // "20170831133711.0Z"
  whenChanged: string; // "20211121090012.0Z"
  uSNCreated: string; // "22797"
  memberOf: string[];
  uSNChanged: string; // "43934556"
  proxyAddresses: string[];
  homeMDB: string; //  "CN=StarCar_User_1,CN=Databases,CN=Exchange Administrative Group (FYDIBOHF23SPDLT),CN=Administrative Groups,CN=Erste Organisation,CN=Microsoft Exchange,CN=Services,CN=Configuration,DC=starcar,DC=local"
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
  mobile: string; // "+49 151 5822 6479"
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

/*
objectClass: [
  "top",
  "person",
  "organizationalPerson",
  "user"
]
memberOf: [
  "CN=Signatur_SCES_Group_IT,OU=Signaturen,OU=Gruppen,DC=starcar,DC=local",
  "CN=Verteiler STARCAR Teamviewer,OU=Emailverteiler,OU=Gruppen,DC=starcar,DC=local",
  "CN=Verteiler STARCAR Concardis,OU=Emailverteiler,OU=Gruppen,DC=starcar,DC=local",
  "CN=PRTG-Admins,OU=PRTG,OU=Gruppen,DC=starcar,DC=local",
  "CN=Mailstore-Benutzer,OU=Gruppen,DC=starcar,DC=local",
  "CN=Verteiler SCES IT,OU=Emailverteiler,OU=Gruppen,DC=starcar,DC=local",
  "CN=Verteiler STARCAR Expansion,OU=Emailverteiler,OU=Gruppen,DC=starcar,DC=local",
  "CN=Verteiler STARCAR Qlik,OU=Emailverteiler,OU=Gruppen,DC=starcar,DC=local",
  "CN=Laufwerk_swot,OU=Laufwerke,OU=Gruppen,DC=starcar,DC=local",
  "CN=Laufwerk_Qlik,OU=Laufwerke,OU=Gruppen,DC=starcar,DC=local",
  "CN=Azure_Lizenz_Microsoft365AudioConferencing,OU=Lizenzen,OU=Microsoft Azure,OU=STARCAR,DC=starcar,DC=local",
  "CN=Azure_Lizenz_Microsoft365BusinessPremium,OU=Lizenzen,OU=Microsoft Azure,OU=STARCAR,DC=starcar,DC=local",
  "CN=Azure Active Directory,CN=Users,DC=starcar,DC=local",
  "CN=Bitrix-Benutzer,OU=Gruppen,DC=starcar,DC=local",
  "CN=vw-20,OU=Drucker_Verwaltung,OU=Drucker,OU=Gruppen,DC=starcar,DC=local",
  "CN=vw-19,OU=Drucker_Verwaltung,OU=Drucker,OU=Gruppen,DC=starcar,DC=local",
  "CN=SC-Hamburg,OU=Emailverteiler,OU=Gruppen,DC=starcar,DC=local",
  "CN=SC-Verwaltung,OU=Emailverteiler,OU=Gruppen,DC=starcar,DC=local",
  "CN=Verteiler STARCAR crent Support,OU=Emailverteiler,OU=Gruppen,DC=starcar,DC=local",
  "CN=Verteiler STARCAR EDV Supportverteiler intern,OU=Emailverteiler,OU=Gruppen,DC=starcar,DC=local",
  "CN=vw-7,OU=Drucker_Verwaltung,OU=Drucker,OU=Gruppen,DC=starcar,DC=local",
  "CN=vw-17,OU=Drucker_Verwaltung,OU=Drucker,OU=Gruppen,DC=starcar,DC=local",
  "CN=Citrix_Desktop_Counter,OU=Citrix,OU=Gruppen,DC=starcar,DC=local",
  "CN=Citrix_Desktop_Verwaltung,OU=Citrix,OU=Gruppen,DC=starcar,DC=local",
  "CN=vw-5,OU=Drucker_Verwaltung,OU=Drucker,OU=Gruppen,DC=starcar,DC=local",
  "CN=Verteiler STARCAR Telefon Support extern,OU=Emailverteiler,OU=Gruppen,DC=starcar,DC=local",
  "CN=Verteiler STARCAR Drucker Support - Intern,OU=Emailverteiler,OU=Gruppen,DC=starcar,DC=local",
  "CN=Verteiler Neue MA,OU=Emailverteiler,OU=Gruppen,DC=starcar,DC=local",
  "CN=Verteiler STARCAR ipad Supportverteiler intern,OU=Emailverteiler,OU=Gruppen,DC=starcar,DC=local",
  "CN=vw-11-std,OU=Drucker_Verwaltung,OU=Drucker,OU=Gruppen,DC=starcar,DC=local",
  "CN=vw-10,OU=Drucker_Verwaltung,OU=Drucker,OU=Gruppen,DC=starcar,DC=local",
  "CN=vw-9,OU=Drucker_Verwaltung,OU=Drucker,OU=Gruppen,DC=starcar,DC=local",
  "CN=vw-2,OU=Drucker_Verwaltung,OU=Drucker,OU=Gruppen,DC=starcar,DC=local",
  "CN=047_K_Dellbrueck_DocuWare,OU=Docuware_Workflow_Gruppen,OU=Gruppen,DC=starcar,DC=local",
  "CN=056_Frankfurt_Griesheim_DocuWare,OU=Docuware_Workflow_Gruppen,OU=Gruppen,DC=starcar,DC=local",
  "CN=060_Kiel_DocuWare,OU=Docuware_Workflow_Gruppen,OU=Gruppen,DC=starcar,DC=local",
  "CN=026_B_Fiat_DocuWare,OU=Docuware_Workflow_Gruppen,OU=Gruppen,DC=starcar,DC=local",
  "CN=050_Essen_DocuWare,OU=Docuware_Workflow_Gruppen,OU=Gruppen,DC=starcar,DC=local",
  "CN=000_Verwaltung_DocuWare,OU=Docuware_Workflow_Gruppen,OU=Gruppen,DC=starcar,DC=local",
  "CN=044_K_Köln Aussteuerungsstation,OU=Docuware_Workflow_Gruppen,OU=Gruppen,DC=starcar,DC=local",
  "CN=046_K_Kalk_DocuWare,OU=Docuware_Workflow_Gruppen,OU=Gruppen,DC=starcar,DC=local",
  "CN=003_Umlage_FFM_DocuWare,OU=Docuware_Workflow_Gruppen,OU=Gruppen,DC=starcar,DC=local",
  "CN=016_HH_Winterhude_DocuWare,OU=Docuware_Workflow_Gruppen,OU=Gruppen,DC=starcar,DC=local",
  "CN=043_K_WT_Köln_Bayenthal_DocuWare,OU=Docuware_Workflow_Gruppen,OU=Gruppen,DC=starcar,DC=local",
  "CN=004_Umlage_K_DocuWare,OU=Docuware_Workflow_Gruppen,OU=Gruppen,DC=starcar,DC=local",
  "CN=023_B_Rudow_DocuWare,OU=Docuware_Workflow_Gruppen,OU=Gruppen,DC=starcar,DC=local",
  "CN=045_K_Ehrenfeld_DocuWare,OU=Docuware_Workflow_Gruppen,OU=Gruppen,DC=starcar,DC=local",
  "CN=017_HH_Großmoorbogen_DocuWare,OU=Docuware_Workflow_Gruppen,OU=Gruppen,DC=starcar,DC=local",
  "CN=R_SC-Alle Benutzer_Docuware,OU=Docuware_Workflow_Gruppen,OU=Gruppen,DC=starcar,DC=local",
  "CN=070_Verwaltung_DocuWare,OU=Docuware_Workflow_Gruppen,OU=Gruppen,DC=starcar,DC=local",
  "CN=024_B_Smart_DocuWare,OU=Docuware_Workflow_Gruppen,OU=Gruppen,DC=starcar,DC=local",
  "CN=055_Frankfurt_Ostend_DocuWare,OU=Docuware_Workflow_Gruppen,OU=Gruppen,DC=starcar,DC=local",
  "CN=006_Umlage_HH_HB_DocuWare,OU=Docuware_Workflow_Gruppen,OU=Gruppen,DC=starcar,DC=local",
  "CN=063_München_DocuWare,OU=Docuware_Workflow_Gruppen,OU=Gruppen,DC=starcar,DC=local",
  "CN=042_K_WT_Köln_Deutz_DocuWare,OU=Docuware_Workflow_Gruppen,OU=Gruppen,DC=starcar,DC=local",
  "CN=022_B_Pankow_DocuWare,OU=Docuware_Workflow_Gruppen,OU=Gruppen,DC=starcar,DC=local",
  "CN=R_Starcar-neu_edit_Docuware,OU=Docuware_Workflow_Gruppen,OU=Gruppen,DC=starcar,DC=local",
  "CN=005_Umlage_HH_HB_H_DocuWare,OU=Docuware_Workflow_Gruppen,OU=Gruppen,DC=starcar,DC=local",
  "CN=019_HH_Wandsbek_DocuWare,OU=Docuware_Workflow_Gruppen,OU=Gruppen,DC=starcar,DC=local",
  "CN=002_Umlage_B_DocuWare,OU=Docuware_Workflow_Gruppen,OU=Gruppen,DC=starcar,DC=local",
  "CN=vpn-full-access,OU=VPN-ASA,OU=Gruppen,DC=starcar,DC=local",
  "CN=hh-verwaltung-global,OU=Laufwerke,OU=Gruppen,DC=starcar,DC=local",
  "CN=tse_nit,OU=Gruppen,DC=starcar,DC=local",
  "CN=StarCar-global,OU=Laufwerke,OU=Gruppen,DC=starcar,DC=local",
  "CN=Darf_Mails_an_Verteiler_Alle_schicken,OU=Emailverteiler,OU=Gruppen,DC=starcar,DC=local",
  "CN=Citrix-ADDISON,OU=zum_aussortieren,OU=Citrix,OU=Gruppen,DC=starcar,DC=local",
  "CN=SC-Alle,OU=Emailverteiler,OU=Gruppen,DC=starcar,DC=local",
  "CN=time-organizer,OU=Gruppen,DC=starcar,DC=local",
  "CN=hh-jenfeld-buchhaltung,OU=Laufwerke,OU=Gruppen,DC=starcar,DC=local"
]
showInAddressBook: [
  "CN=Alle Benutzer,CN=All Address Lists,CN=Address Lists Container,CN=Erste Organisation,CN=Microsoft Exchange,CN=Services,CN=Configuration,DC=starcar,DC=local",
  "CN=Globale Standardadressliste,CN=All Global Address Lists,CN=Address Lists Container,CN=Erste Organisation,CN=Microsoft Exchange,CN=Services,CN=Configuration,DC=starcar,DC=local",
  "CN=All Users,CN=All Address Lists,CN=Address Lists Container,CN=Erste Organisation,CN=Microsoft Exchange,CN=Services,CN=Configuration,DC=starcar,DC=local"
]
proxyAddresses: [
    "X500:/o=ExchangeLabs/ou=Exchange Administrative Group (FYDIBOHF23SPDLT)/cn=Recipients/cn=d4447a4019b04adba1f647e2d5a24fcf-SC - Bergen",
    "smtp:bergen@starcar.de",
    "SMTP:ole.bergen@starcar.de",
    "smtp:bergen@starcargmbh.mail.onmicrosoft.com",
    "smtp:bergen@starcar.local"
  ]
*/
