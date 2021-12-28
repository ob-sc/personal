import { NextApiHandler } from 'next';
import LdapAuth from 'ldapauth-fork';
import { ldapConfig } from '../../../config';
import { withSessionApi } from '../../../src/lib/withSession';
import db from '../../../src/db';
import parseUser from '../../../src/lib/parseUser';
import response from '../../../src/server/response';
import logger from '../../../src/lib/log';

const parseLdapError = (err: unknown): Error => {
  console.log(err);
  // vermutlich LDAPError
  if (err instanceof Error) {
    if (err.message.includes('data 52e')) return new Error('Passwort falsch');
  }

  // das ist komischerweise nur string
  if (typeof err === 'string') {
    if (err.includes('no such user')) return new Error('Benutzer nicht gefunden');
  }

  return new Error(String(err));
};

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

      ldap.on('error', (err) => {
        logger.error(err);
      });

      ldap.authenticate(username, password, async (err, user) => {
        ldap.close((er) => {
          if (er) console.log('ldap close', er);
        });

        if (err) {
          const ldapError = parseLdapError(err);
          error(ldapError, 403);
          return;
        }

        // ole-test
        // Password01

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
