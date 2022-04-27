import LdapAuth from 'ldapauth-fork';
import { NextApiHandler } from 'next';
import { ldapConfig } from '../../../config';
import { withSessionApi } from '../../../src/lib/withSession';
import parseUser from '../../../src/lib/parseUser';
import { error, httpMethodError, success } from '../../../src/server/response';
import { isDev, unresolved } from '../../../src/utils/shared';
import db from '../../../src/server/database';
import { User } from '../../../src/entities/User';

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
        error(res, 'Benutzername und Passwort müssen angegeben werden', 401);
      }

      const ldap = new LdapAuth(ldapConfig);

      // ldap.on('error', (err) => {
      //   logger.error(err);
      // });

      ldap.authenticate(username, password, async (err, user) => {
        ldap.close();

        if (err) {
          const ldapError = parseLdapError(err);
          const field = ldapError.field ? [ldapError.field] : null;
          error(res, ldapError.error, field, 401);
          return;
        }

        const userRepository = db.getRepository(User);

        let dbUser = await userRepository.findOne({
          where: { username },
          relations: { region: true, allowedStations: true },
        });

        if (dbUser === null) {
          dbUser = new User();
          dbUser.username = username;
        }

        dbUser.first_name = user.givenName;
        dbUser.last_name = user.sn;
        dbUser.email = user.mail;
        dbUser.dn = user.distinguishedName;

        dbUser = await userRepository.save(dbUser);

        const parsed = parseUser(dbUser);

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
      await handleLogin();
      break;
    case 'DELETE':
      handleLogout();
      break;
    default:
      httpMethodError(res, method, ['POST', 'DELETE']);
  }
};

export default withSessionApi(sessionHandler, 'sessions');

export const config = unresolved;
