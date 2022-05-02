import { User } from 'src/entities/User';
import parseUser from 'src/lib/parseUser';
import { withSessionApi } from 'src/lib/withSession';
import { error, httpMethodError, success } from 'src/server/response';
import { unresolved } from 'src/utils/server';
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

      // ldap.on('error', (err) => {
      //   logger.error(err);
      // });

      // todo auf diesen callback wird iwie nicht gewartet mit await und .then
      // todo db verbindung schließt sich dann schon vorher

      // ldap.destroy();

      const ldapUser = await ldap.authenticate(username, password);

      if (error) {
        error(res, ldapUser.error.instance, ldapUser.error.fields, 401);
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

      dbUser.first_name = ldapUser.data.givenName;
      dbUser.last_name = ldapUser.data.sn;
      dbUser.email = ldapUser.data.mail;
      dbUser.dn = ldapUser.data.distinguishedName;

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

export default withSessionApi(handler, 'sessions');

export const config = unresolved;
