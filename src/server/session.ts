import ldap from '../lib/ldap';
import log from '../lib/log';

export const createSession = async (username: string, password: string) => {
  const dn = await ldap.search(username);
  log.debug(dn);
  const auth = await ldap.auth(username, password);
  log.debug(auth);
};
