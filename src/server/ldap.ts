import ldap from 'ldapjs';
import logger from 'src/lib/log';
import { isDev } from 'src/utils/shared';

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
// searchBase: `OU=User,OU=STARCAR,${baseDN}`,
// searchFilter: '(sAMAccountName={{username}})',

// todo mit ldapjs in das modul
const parseLdapError = (
  err: unknown
): { error: Error; field: string | null } => {
  let e;
  let field = null;

  if (!isDev) e = new Error('Fehler bei LDAP Authentifizierung');
  else e = new Error(String(err));

  // pw falsch, vermutlich Instanz von LDAPError
  if (err instanceof Error && err.message.includes('data 52e')) {
    e = new Error('Passwort falsch');
    field = 'password';
  }

  // user nicht gefunden, komischerweise nur string
  if (typeof err === 'string' && err.includes('no such user')) {
    e = new Error('Benutzer nicht gefunden');
    field = 'username';
  }

  return { error: e, field };
};

const ldapClient = ldap.createClient({
  url: ['ldap://127.0.0.1:1389', 'ldap://127.0.0.2:1389'],
  log: logger,
});

ldapClient.on('error', (err) => {
  logger.error(err);
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

export default ldapClient;
