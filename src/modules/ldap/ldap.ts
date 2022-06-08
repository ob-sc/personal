import ldap from 'ldapjs';
import { ldapConfig } from 'src/config';
import { DomainUser, LdapClient } from 'src/modules/ldap/types';
import { ApiError, parseLdapError } from 'src/common/utils/server';
import log from 'src/common/utils/log';

function ldapConnection(): LdapClient {
  const baseDN = 'DC=starcar,DC=local';
  const searchBase = `OU=User,OU=STARCAR,${baseDN}`;

  const ldapClient = ldap.createClient(ldapConfig.options);

  ldapClient.on('error', (err) => {
    log.error(err);
  });

  // ldapClient.on('connect', () => {
  //   log.debug('ldap connected');
  //   ldapClient.on('close', () => {
  //     log.debug('ldap closed');
  //   });
  // });
  // ldapClient.on('destroy', () => {
  //   log.debug('ldap destroyed');
  // });

  const bind = (username: string, password: string) =>
    new Promise<void>((resolve, reject) => {
      // log.debug('bind'); // todo
      ldapClient.bind(username, password, async (err) => {
        if (err) {
          reject(parseLdapError(err));
          return;
        }
        resolve();
      });
    });

  const connect: LdapClient['connect'] = async () =>
    bind(ldapConfig.bindDN, ldapConfig.bindPW);

  const search: LdapClient['search'] = (user) =>
    new Promise<DomainUser[]>((resolve, reject) => {
      // client.bind(ldapUserDN, ldapConfig.password, (err) => {
      //   if (err) reject(createError(err));
      // });
      const filter = user
        ? `(sAMAccountName=${user})`
        : '(sAMAccountType=805306368)';
      const options: ldap.SearchOptions = {
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
          'mail',
        ],
      };
      ldapClient.search(searchBase, options, (err, res) => {
        if (err) reject(parseLdapError(err));

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

  const authenticate: LdapClient['authenticate'] = async (
    username,
    password
  ) => {
    // bind für search
    await connect();
    const [user] = await search(username);
    if (!user) throw new ApiError('Benutzer nicht gefunden', 400, ['username']);
    // bind mit user und pw aus form
    await bind(user.distinguishedName, password);
    return user;
  };

  const add: LdapClient['add'] = (dn, entry) =>
    new Promise<void>((resolve, reject) => {
      ldapClient.add(dn, entry, (err) => {
        if (err) reject(err);
        resolve();
      });

      // noch aktiv setzen mit userAccountControl = 512
    });

  /*  


{
  dn: 'CN=SC - Bergen\\, Ole,OU=_IT,OU=_Flotte,OU=Verwaltung,OU=User,OU=STARCAR,DC=starcar,DC=local',
  controls: [],
  objectClass: [ 'top', 'person', 'organizationalPerson', 'user' ],
  cn: 'SC - Bergen, Ole',
  sn: 'Bergen',
  l: 'Hamburg',
  postalCode: '20537',
  givenName: 'Ole',
  distinguishedName: 'CN=SC - Bergen\\, Ole,OU=_IT,OU=_Flotte,OU=Verwaltung,OU=User,OU=STARCAR,DC=starcar,DC=local',
  displayName: 'STARCAR GmbH - Ole Bergen',
  streetAddress: 'Süderstr. 282',
  userAccountControl: '512',
  sAMAccountName: 'bergen',
  sAMAccountType: '805306368',
  userPrincipalName: 'bergen@starcar.de',
  mail: 'ole.bergen@starcar.de'


    */

  return {
    client: ldapClient,
    add,
    authenticate,
    connect,
    search,
    destroy: () => {
      ldapClient.destroy();
    },
  };
}

export default ldapConnection;
