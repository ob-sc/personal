import ldap from 'ldapjs';
import { ldapConfig } from 'config';
import { DomainUser, LdapClient } from 'types/server';
import { ApiError, parseLdapError } from 'utils/server';
import logger from 'lib/log';

function ldapConnection(): LdapClient {
  const baseDN = 'DC=starcar,DC=local';
  const searchBase = `OU=User,OU=STARCAR,${baseDN}`;

  const ldapClient = ldap.createClient(ldapConfig.options);

  ldapClient.on('error', (err) => {
    logger.error(err);
  });

  // ldapClient.on('connect', () => {
  //   logger.debug('ldap connected');
  //   ldapClient.on('close', () => {
  //     logger.debug('ldap closed');
  //   });
  // });
  // ldapClient.on('destroy', () => {
  //   logger.debug('ldap destroyed');
  // });

  const bind = (username: string, password: string) =>
    new Promise<void>((resolve, reject) => {
      // logger.debug('bind'); // todo
      ldapClient.bind(username, password, async (err) => {
        if (err) {
          reject(parseLdapError(err));
          return;
        }
        resolve();
      });
    });

  const connect = async () => bind(ldapConfig.bindDN, ldapConfig.bindPW);

  const search = (user?: string) =>
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

  const authenticate = async (username: string, password: string) => {
    // bind für search
    await connect();
    const [user] = await search(username);
    if (!user) throw new ApiError('Benutzer nicht gefunden', ['username']);
    // bind mit user und pw aus form
    await bind(user.distinguishedName, password);
    return [user];
  };
  /*
const add = (client: Client, entry: Partial<DomainUser>, dn: string) =>
  new Promise((resolve, reject) => {
    client.bind(ldapUserDN, ldapConfig.password, (err) => {
      if (err) reject(createError(err));
    });

    client.add(dn, entry, (err) => {
      if (err) reject(createError(err));
      resolve(true);
    });

      // noch aktiv setzen mit userAccountControl = 512

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
    });




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
    authenticate,
    connect,
    search,
    destroy: () => {
      ldapClient.destroy();
    },
  };
}

export default ldapConnection;
