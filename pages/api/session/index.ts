import { NextApiHandler } from 'next';
import { Employee } from '../../../types/user';
import { withSessionApi } from '../../../src/lib/withSession';
import ldap from '../../../src/server/ldap';
import jacando from '../../../src/server/jacando';
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
    let errorStatus = 400;
    try {
      const isUndefined = username === undefined || password === undefined;

      if (isUndefined) {
        throw new Error('Benutzername und Passwort müssen angegeben werden');
      }

      const client = await ldap.client();
      const [adUser] = await ldap.operation.search(client, username);
      await ldap.operation.auth(client, adUser?.distinguishedName ?? '', password);
      client.destroy();

      const dbUser = await db.users.findOne({ where: { username } });

      if (dbUser === null) throw new Error('Benutzer nicht gefunden');

      // ab hier nicht mehr User-Eingabefehler
      errorStatus = 500;

      const { id } = dbUser;

      const employees = jacando('employees');
      const employee = await employees.get<Employee>(id);

      const user = parseUser(dbUser, adUser, employee);

      session.user = user;
      await session.save();
      success('Login erfolgreich');
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
      httpMethodError(method, { post: true, delete: true });
  }
};

export default withSessionApi(sessionHandler, true);

export const config = {
  api: {
    externalResolver: true,
  },
};
