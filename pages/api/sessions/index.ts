import LdapAuth from 'ldapauth-fork';
import { NextApiHandlerWithDB } from '../../../src/utils/server';
import { ldapConfig } from '../../../config';
import { withSessionApi } from '../../../src/lib/withSession';
import parseUser from '../../../src/lib/parseUser';
import { error, httpMethodError, success } from '../../../src/server/response';
import { isDev, unresolved } from '../../../src/utils/shared';
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

const handler: NextApiHandlerWithDB = async (req, res) => {
  try {
    const {
      body: { username, password },
      session,
      method,
      db,
    } = req;
    if (!db) throw new Error('Datenbank nicht verfügbar');

    const login = async () => {
      const isUndefined = username === undefined || password === undefined;

      if (isUndefined) {
        error(res, 'Benutzername und Passwort müssen angegeben werden', 401);
      }

      const ldap = new LdapAuth(ldapConfig);

      // ldap.on('error', (err) => {
      //   logger.error(err);
      // });

      // todo auf diesen callback wird iwie nicht gewartet mit await und .then
      // todo db verbindung schließt sich dann schon vorher

      ldap.authenticate(username, password, async (err, user) => {
        ldap.close();

        if (err) {
          const ldapError = parseLdapError(err);
          const field = ldapError.field ? [ldapError.field] : null;
          error(res, ldapError.error, field, 401);
          return;
        }

        const userRepository = db.getRepository(User);
        console.log(2);

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
    };

    const logout = () => {
      req.session.destroy();
      success(res, 'Session entfernt');
    };

    switch (method?.toUpperCase()) {
      case 'POST':
        await login();
        break;
      case 'DELETE':
        logout();
        break;
      default:
        httpMethodError(res, method, ['POST', 'DELETE']);
    }
  } catch (err) {
    error(res, err);
  }
};

export default withSessionApi(handler, 'sessions');

export const config = unresolved;
