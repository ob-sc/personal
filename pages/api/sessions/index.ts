import { NextApiHandler } from 'next';
import LdapAuth from 'ldapauth-fork';
import { ldapConfig } from '../../../config';
import { withSessionApi } from '../../../src/lib/withSession';
import db from '../../../src/db';
import parseUser from '../../../src/lib/parseUser';
import { error, httpMethodError, success } from '../../../src/server/response';
import logger from '../../../src/lib/log';
import { isDev, unresolved } from '../../../src/lib/util';

// todo mit ldapjs in das modul
const parseLdapError = (err: unknown): Error => {
  // pw falsch, vermutlich Instanz von LDAPError
  if (err instanceof Error && err.message.includes('data 52e')) {
    return new Error('Passwort falsch');
  }

  // user nicht gefunden, komischerweise nur string
  if (typeof err === 'string' && err.includes('no such user')) {
    return new Error('Benutzer nicht gefunden');
  }

  if (!isDev) return new Error('Fehler bei LDAP Authentifizierung');

  return new Error(String(err));
};

const sessionHandler: NextApiHandler = async (req, res) => {
  const {
    body: { username, password },
    session,
    method,
  } = req;

  const handleLogin = async () => {
    try {
      const isUndefined = username === undefined || password === undefined;

      if (isUndefined) {
        error(res, 'Benutzername und Passwort müssen angegeben werden', 403);
      }

      const ldap = new LdapAuth(ldapConfig);

      ldap.on('error', (err) => {
        logger.error(err);
      });

      ldap.authenticate(username, password, async (err, user) => {
        ldap.close();

        if (err) {
          const ldapError = parseLdapError(err);
          error(res, ldapError, 403);
          return;
        }

        let dbUser = await db.users.findOne({ where: { username } });

        if (dbUser === null) {
          dbUser = await db.users.create({
            domain: 'starcar',
            username,
          });
        }

        const parsed = parseUser(dbUser, user);

        session.user = parsed;
        await session.save();

        success(res, 'Login erfolgreich');
      });
    } catch (err) {
      error(res, err);
    }
  };

  const handleLogout = () => {
    try {
      req.session.destroy();
      success(res, 'Session entfernt');
    } catch (err) {
      error(res, err);
    }
  };

  switch (method?.toUpperCase()) {
    case 'POST':
      handleLogin();
      break;
    case 'DELETE':
      handleLogout();
      break;
    default:
      httpMethodError(res, method, ['POST', 'DELETE']);
  }
};

export default withSessionApi(sessionHandler, true);

export const config = unresolved;
