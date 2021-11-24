import ldapjs from 'ldapjs';
import cfg from '../config';
import { ADUser } from '../types';
import { isDev } from './util';

const baseDN = 'DC=starcar,DC=local';
const ldpaUserDN = `CN=${cfg.ldap.user},CN=Users,${baseDN}`;

const createError = (err: any) => {
  if (!isDev()) return new Error('LDAP Fehler');
  return err instanceof Error ? err : new Error(err);
};

const ldapClient = (): ldapjs.Client => {
  const client = ldapjs.createClient({
    url: cfg.ldap.url,
  });

  // macht der immer Error read ECONNRESET? brauche ich den?
  // client.on('error', (err) => {
  //   log.error(err);
  // });

  return client;
};

const add = () =>
  new Promise((resolve, reject) => {
    const client = ldapClient();
    const entry = {
      cn: 'foo',
      sn: 'bar',
      email: ['foo@bar.com', 'foo1@bar.com'],
      objectclass: 'fooPerson',
    };
    client.add('cn=foo, o=example', entry, (err) => {
      if (err) reject(createError(err));
      resolve(true);
    });
  });

const auth = (dn: string, password: string) =>
  new Promise((resolve, reject) => {
    const client = ldapClient();
    client.bind(dn, password, (err: any) => {
      client.unbind();
      if (err) reject(createError(err));
      resolve(true);
    });
  });

// ohne user = alle
const search = (user?: string) =>
  new Promise<ADUser>((resolve, reject) => {
    const client = ldapClient();
    client.bind(ldpaUserDN, cfg.ldap.password, (err: any) => {
      if (err) {
        client.unbind();
        reject(createError(err));
      }
    });
    const filter = user ? `(sAMAccountName=${user})` : '(sAMAccountType=805306368)';
    const options: ldapjs.SearchOptions = { filter, scope: 'sub' };
    client.search(baseDN, options, (err: any, res: any) => {
      if (err) {
        client.unbind();
        reject(createError(err));
      }

      res.on('searchEntry', (entry: any) => {
        client.unbind();
        resolve(entry.object);
      });

      res.on('end', () => {
        client.unbind();
        reject(createError('Keinen Benutzer gefunden'));
      });
    });
  });

const ldap = { add, auth, search };

export default ldap;
