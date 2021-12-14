import { NextApiHandler } from 'next';
import { Employee } from '../../../types/user';
import { withSessionApi } from '../../../src/lib/withSession';
import ldap from '../../../src/server/ldap';
import jacando from '../../../src/server/jacando';
import db from '../../../src/db';
import parseUser from '../../../src/lib/parseUser';
import response from '../../../src/server/response';

const loginHandler: NextApiHandler = async (req, res) => {
  const {
    body: { username, password },
    session,
    method,
  } = req;
  const { error, success, httpMethodError } = response(res);

  let errorStatus = 400;
  try {
    if (method?.toUpperCase() === 'POST') {
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
    } else httpMethodError(method, { post: true });
  } catch (err) {
    error(err, errorStatus);
  }
};

export default withSessionApi(loginHandler, true);
