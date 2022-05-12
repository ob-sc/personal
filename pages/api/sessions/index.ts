import { User } from 'entities/User';
import parseUser from 'lib/parseUser';
import { withSessionApi } from 'lib/withSession';
import { error, httpMethodError, success } from 'server/response';
import { unresolved } from 'utils/server';
import { NextApiHandlerWithConnections } from 'types/server';

const handler: NextApiHandlerWithConnections = async (req, res) => {
  try {
    const {
      body: { username, password },
      session,
      method,
      db,
      ldap,
    } = req;
    if (!ldap) throw new Error('AD nicht verfügbar');
    if (!db) throw new Error('Datenbank nicht verfügbar');

    const login = async () => {
      const isUndefined = username === undefined || password === undefined;

      if (isUndefined) {
        error(res, 'Benutzername und Passwort müssen angegeben werden', 401);
      }

      const [ldapUser] = await ldap.authenticate(username, password);

      const userRepository = db.getRepository(User);

      let dbUser = await userRepository.findOne({
        where: { username },
        relations: { region: true, allowedStations: true },
      });

      if (dbUser === null) {
        dbUser = new User();
        dbUser.username = username;
      }

      dbUser.first_name = ldapUser.givenName;
      dbUser.last_name = ldapUser.sn;
      dbUser.email = ldapUser.mail;
      dbUser.dn = ldapUser.distinguishedName;

      dbUser = await userRepository.save(dbUser);

      const parsed = parseUser(dbUser);

      session.user = parsed;
      await session.save();

      success(res, 'Login erfolgreich');
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

export default withSessionApi(handler, 'sessions', true);

export const config = unresolved;
