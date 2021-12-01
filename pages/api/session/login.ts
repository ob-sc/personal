import { NextApiHandler } from 'next';
import { Employee } from '../../../types/user';
import { withSessionApi } from '../../../src/lib/withSession';
import ldap from '../../../src/server/ldap';
import { errorResponse } from '../../../src/lib/util';
import Jacando from '../../../src/server/jacando';
import logger from '../../../src/lib/log';
import db from '../../../src/db';
import parseUser from '../../../src/server/parseUser';

const loginHandler: NextApiHandler = async (req, res) => {
  const {
    body: { username, password },
    session,
    method,
  } = req;

  if (method?.toUpperCase() === 'POST') {
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

      const jacando = new Jacando(`/employees/${id}`);
      const employee = await jacando.get<Employee>();

      const user = parseUser(dbUser, adUser, employee);

      session.user = user;
      await session.save();
      res.status(200).json({ message: 'Login erfolgreich' });
    } catch (error) {
      logger.error(error);
      res.status(errorStatus).json(errorResponse(error));
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Methode ${method} nicht erlaubt` });
  }
};

export default withSessionApi(loginHandler);
