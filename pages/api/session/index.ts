import { NextApiHandler } from 'next';
import LdapAuth from 'ldapauth-fork';
import { ldapConfig } from '../../../config';
import { withSessionApi } from '../../../src/lib/withSession';
import db from '../../../src/db';
import parseUser from '../../../src/lib/parseUser';
import response from '../../../src/server/response';

const sessionHandler: NextApiHandler = async (req, res) => {
  const {
    body: { username, password },
    session,
    method,
  } = req;
  const { error, success, httpMethodError } = response(res);

  const handleLogin = async () => {
    try {
      const isUndefined = username === undefined || password === undefined;

      if (isUndefined) {
        error('Benutzername und Passwort müssen angegeben werden', 403);
      }

      const ldap = new LdapAuth(ldapConfig);

      ldap.authenticate(username, password, async (err, user) => {
        ldap.close();
        if (err) {
          error(err, 403);
          return;
        }

        const dbUser = await db.users.findOne({ where: { username } });

        if (dbUser === null) throw new Error('Benutzer nicht gefunden');

        const parsed = parseUser(dbUser, user);

        session.user = parsed;
        await session.save();

        success('Login erfolgreich');
      });
    } catch (err) {
      error(err);
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
