import { NextApiHandler } from 'next';
import { Employee } from '../../../types/api';
import { withSessionApi } from '../../../lib/withSession';
import ldap from '../../../lib/ldap';
import { errorResponse } from '../../../lib/util';
import Jacando, { parseUser } from '../../../lib/jacando';
import log from '../../../lib/log';
import db from '../../../db';

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

      const client = ldap.client();

      const adUser = await ldap.operation.search(client, username);

      await ldap.operation.auth(client, adUser?.distinguishedName ?? '', password);

      client.unbind();

      const dbUser = await db.users.findOne({ where: { username } });

      if (dbUser === null) {
        throw new Error('Benutzer nicht gefunden');
      }

      // ab hier nicht mehr User-Eingabefehler
      errorStatus = 500;

      const { id } = dbUser;

      const jacando = new Jacando(`/employees/${id}`);
      const employee: Employee = await jacando.get();

      const user = parseUser(employee);

      session.user = {
        ...user,
        username: adUser.sAMAccountName,
        isLoggedIn: true,
      };
      await session.save();
      res.status(200).json({ message: 'Login erfolgreich' });
    } catch (error) {
      log.error(error);
      res.status(errorStatus).json(errorResponse(error));
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Methode ${method} nicht erlaubt` });
  }
};

export default withSessionApi(loginHandler);
