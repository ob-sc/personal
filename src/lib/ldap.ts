import ldapjs from 'ldapjs';
import log from './log';
import cfg from '../config';

const baseDN = 'DC=starcar,DC=local';
const ldpaUserDN = `CN=${cfg.ldap.user},CN=Users,${baseDN}`;

const ldapClient = (): ldapjs.Client => {
  const client = ldapjs.createClient({
    url: cfg.ldap.url,
  });

  client.on('error', (err) => {
    log.error(err);
  });

  return client;
};

const auth = (dn: string, password: string) =>
  new Promise((resolve, reject) => {
    ldapClient.bind(dn, password, (err: any) => {
      if (err) reject(err);
      else resolve(true);
    });
  });

// ohne user = alle
// todo error handling besser
const search = (user?: string) =>
  new Promise((resolve, reject) => {
    const client = ldapClient();

    client.bind(ldpaUserDN, cfg.ldap.password, (err: any) => {
      if (err) log.error(err);
    });
    const filter = user ? `(sAMAccountName=${user})` : '(sAMAccountType=805306368)';
    const options: ldapjs.SearchOptions = { filter, scope: 'sub' };
    client.search(baseDN, options, (err: any, res: any) => {
      if (err) {
        log.error(err);
        reject(err);
        return;
      }
      res.on('searchEntry', (entry: any) => {
        resolve(entry.object);
      });
    });
  });

const ldap = { auth, search };

export default ldap;
