import { NextApiHandler } from 'next';
import LdapAuth from 'ldapauth-fork';
import { ldapConfig } from '../../../config';
import { withSessionApi } from '../../../src/lib/withSession';
import db from '../../../src/db';
import parseUser from '../../../src/lib/parseUser';
import response from '../../../src/server/response';

const ldap = new LdapAuth(ldapConfig);

const sessionHandler: NextApiHandler = async (req, res) => {
  const {
    body: { username, password },
    session,
    method,
  } = req;
  const { error, success, httpMethodError } = response(res);

  const handleLogin = async () => {
    let errorStatus = 401;
    try {
      const isUndefined = username === undefined || password === undefined;

      if (isUndefined) {
        throw new Error('Benutzername und Passwort müssen angegeben werden');
      }

      ldap.authenticate(username, password, async (err, user) => {
        if (err) {
          throw err instanceof Error ? err : new Error(err);
        }

        const dbUser = await db.users.findOne({ where: { username } });

        if (dbUser === null) throw new Error('Benutzer nicht gefunden');

        // ab hier nicht mehr Auth-Fehler
        errorStatus = 500;

        const parsed = parseUser(dbUser, user);

        session.user = parsed;
        await session.save();
        success('Login erfolgreich');
      });
    } catch (err) {
      error(err, errorStatus);
    }
  };

  const handleLogout = () => {
    try {
      req.session.destroy();
      success('Session entfernt');
    } catch (err) {
      error(err);
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
      httpMethodError(method, ['post', 'delete']);
  }
};

export default withSessionApi(sessionHandler, true);

export const config = {
  api: {
    externalResolver: true,
  },
};
