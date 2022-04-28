import ldap from 'ldapjs';
import logger from '../lib/log';

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
