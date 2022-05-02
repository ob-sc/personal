import { ldapConfig } from 'config';
import ldap from 'ldapjs';
import logger from 'src/lib/log';
import { isDev } from 'src/utils/shared';
import { DomainAllAttributes, LdapError } from 'types/server';

// todo objectclass von sven / lenny holen?

const searchAttributes = [
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
  'userPrincipalName',
  'userAccountControl',
  'mail',
];
// baseDN: 'DC=starcar,DC=local'
// searchBase: `OU=User,OU=STARCAR,${baseDN}`,
// searchFilter: '(sAMAccountName={{username}})',

const parseLdapError = (err: unknown): LdapError => {
  let instance;
  let field = null;

  if (!isDev) instance = new Error('Fehler bei LDAP Authentifizierung');
  else instance = new Error(String(err));

  // pw falsch, vermutlich Instanz von LDAPError
  if (err instanceof Error && err.message.includes('data 52e')) {
    instance = new Error('Passwort falsch');
    field = 'password';
  }

  // user nicht gefunden, komischerweise nur string
  if (typeof err === 'string' && err.includes('no such user')) {
    instance = new Error('Benutzer nicht gefunden');
    field = 'username';
  }

  const fields = field ? [field] : [];

  return { instance, fields };
};

const ldapClient = ldap.createClient(ldapConfig.options);

ldapClient.on('error', (err) => {
  logger.error(parseLdapError(err));
});

ldapClient.once('connect', () => {
  console.log('ldap connected');
  ldapClient.once('close', () => {
    console.log('ldap closed');
  });
});

ldapClient.once('destroy', () => {
  console.log('ldap destroyed');
});

const adminBind = () => {
  return new Promise((resolve, reject) => {
    ldapClient.bind(ldapConfig.bindDN, ldapConfig.bindCredentials, (err) => {
      if (err) reject(parseLdapError(err));
      resolve(true);
    });
  });
}

const authenticate = async (
  username: string,
  password: string
): Promise<{ data: DomainAllAttributes; error: LdapError }> => {
await adminBind();


  return new Promise((resolve, reject) => {
    ldapClient.search('DC=starcar,DC=local', 
    {scope: "sub",}
    )))
}

const ldapConnection = {
  authenticate,
  destroy: () => {
    ldapClient.unbind();
    // ldapClient.destroy();
  },
};
/*
tap.test('socket destroy', function (t) {
  const clt = ldap.createClient({
    socketPath: t.context.socketPath,
    bindDN: BIND_DN,
    bindCredentials: BIND_PW
  })

  clt.once('connect', function () {
    t.ok(clt)
    clt._socket.once('close', function () {
      t.ok(!clt.connected)
      t.end()
    })
    clt.destroy()
  })

  clt.once('destroy', function () {
    t.ok(clt.destroyed)
  })
})
*/

export default ldapConnection;
