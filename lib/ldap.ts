import ldapjs, { Client } from 'ldapjs';
import { ldapConfig } from '../config';
import { DomainUser } from '../types/api';
import logger from './log';
import { isDev } from './util';

// todo: im debug sieht man, dass zb eine suche worker spawned, die aber bleiben. ist das ein memory leak oder nur vom debugger?

const baseDN = 'DC=starcar,DC=local';
const searchTree = `OU=User,OU=STARCAR,${baseDN}`;
const ldpaUserDN = `CN=${ldapConfig.user},CN=Users,${baseDN}`;

const createError = (err: unknown, notDevMsg = 'LDAP Fehler') => {
  if (!isDev) return new Error(notDevMsg);
  return err instanceof Error ? err : new Error(String(err));
};

const createClient = (): ldapjs.Client => {
  const options: ldapjs.ClientOptions = {
    url: ldapConfig.options.url,
  };
  if (isDev) options.log = logger;
  const client = ldapjs.createClient(options);

  // macht der immer Error read ECONNRESET? brauche ich den?
  client.on('error', (err) => {
    logger.error(err);
  });

  return client;
};

const add = (client: Client, entry: Partial<DomainUser>, dn: string) =>
  new Promise((resolve, reject) => {
    client.bind(ldpaUserDN, ldapConfig.password, (err) => {
      if (err) reject(createError(err));
    });

    client.add(dn, entry, (err) => {
      if (err) reject(createError(err));
      resolve(true);
    });

    /*

     noch aktiv setzen mit userAccountControl = 512


      const cn = 'SC - Bar\\, Foo';
      const dn = `CN=${cn},OU=IT,OU=Verwaltung,OU=User,OU=STARCAR,DC=starcar,DC=local`;
      const entry: ADUser = {
      cn: 'SC - Bar\\, Foo', // SC - (STARCAR), SCA - (Agentur), SCM - (Mobility), P24 -
        sn: 'Bar',
        l: 'Hamburg',
        postalCode: '20537',
        telephoneNumber: '+49 40 654411503',
        givenName: 'Foo',
        // distinguishedName: dn,
        // memberOf: [],
        displayName: 'STARCAR GmbH - Foo Bar',
        streetAddress: 'Süderstr. 282',
        sAMAccountName: 'foo.bar',
        userPrincipalName: 'foo.bar@starcar.de',
        // email: ['foo@starcar.de'],
        objectClass: ['top', 'person', 'organizationalPerson', 'user'],
      };
      ldap.add(client, entry, dn); // todo async? was ist return?
    */
  });

const auth = (client: Client, dn: string, password: string) =>
  new Promise((resolve, reject) => {
    client.bind(dn, password, (err) => {
      if (err) reject(createError(err));
      resolve(true);
    });
  });
const search = (client: Client, user?: string) =>
  new Promise<DomainUser[]>((resolve, reject) => {
    client.bind(ldpaUserDN, ldapConfig.password, (err) => {
      if (err) reject(createError(err));
    });
    const filter = user ? `(sAMAccountName=${user})` : '(sAMAccountType=805306368)';
    const options: ldapjs.SearchOptions = {
      filter,
      scope: 'sub',
      attributes: [
        'cn',
        'sn',
        'l',
        'postalCode',
        'telephoneNumber',
        'givenName',
        'distinguishedName',
        'displayName',
        'streetAddress',
        'sAMAccountName',
        'sAMAccountType',
        'userPrincipalName',
        'userAccountControl',
        'objectClass',
      ],
    };
    client.search(searchTree, options, (err, res) => {
      if (err) reject(createError(err));

      const entries: DomainUser[] = [];

      res.on('searchEntry', (entry) => {
        const userEntry: unknown = entry.object;
        entries.push(userEntry as DomainUser);
      });

      res.on('end', () => {
        resolve(entries);
      });
    });
  });

const ldap = {
  client: createClient,
  operation: {
    add,
    auth,
    /**
     * Ohne param user: alle AD Accounts
     */
    search,
  },
};

export default ldap;
