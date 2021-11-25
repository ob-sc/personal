import ldapjs, { Client } from 'ldapjs';
import cfg from '../config';
import { DomainAllAttributes, DomainAttributes } from '../types/api';
import { isDev } from './util';

const baseDN = 'DC=starcar,DC=local';
const ldpaUserDN = `CN=${cfg.ldap.user},CN=Users,${baseDN}`;

const createError = (err: any, notDevMsg = 'LDAP Fehler') => {
  if (!isDev()) return new Error(notDevMsg);
  return err instanceof Error ? err : new Error(err);
};

const createClient = (): ldapjs.Client => {
  const client = ldapjs.createClient({
    url: cfg.ldap.options.url,
  });

  // macht der immer Error read ECONNRESET? brauche ich den?
  // client.on('error', (err) => {
  //   log.error(err);
  // });

  return client;
};

const add = (client: Client, entry: DomainAttributes, dn: string) =>
  new Promise((resolve, reject) => {
    client.bind(ldpaUserDN, cfg.ldap.password, (err: any) => {
      if (err) reject(createError(err));
    });

    client.add(dn, entry, (err) => {
      if (err) reject(createError(err));
      resolve(true);
    });

    /*
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
    client.bind(dn, password, (err: any) => {
      if (err) reject(createError(err));
      resolve(true);
    });
  });

// ohne user = alle
const search = (client: Client, user?: string) =>
  new Promise<DomainAllAttributes>((resolve, reject) => {
    client.bind(ldpaUserDN, cfg.ldap.password, (err: any) => {
      if (err) reject(createError(err));
    });
    const filter = user ? `(sAMAccountName=${user})` : '(sAMAccountType=805306368)';
    const options: ldapjs.SearchOptions = { filter, scope: 'sub' };
    client.search(baseDN, options, (err: any, res: any) => {
      if (err) reject(createError(err));

      res.on('searchEntry', (entry: any) => {
        resolve(entry.object);
      });

      res.on('end', () => {
        reject(createError('Keinen Benutzer gefunden'));
      });
    });
  });

const ldap = { client: createClient, operation: { add, auth, search } };

export default ldap;
