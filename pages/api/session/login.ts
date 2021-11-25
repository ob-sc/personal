import { NextApiHandler } from 'next';
import { withSessionApi } from '../../../lib/withSession';
import ldap from '../../../lib/ldap';
import { errorResponse } from '../../../lib/util';
import Jacando from '../../../lib/jacando';
import log from '../../../lib/log';
import { Employee } from '../../../types/api';
import { UserModel } from '../../../db';

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

      const dbUser = await UserModel.findOne({ where: { username } });

      if (dbUser === null) {
        throw new Error('Benutzer nicht gefunden');
      }

      // ab hier nicht mehr User-Eingabefehler
      errorStatus = 500;

      const { id } = dbUser;
      // const id = '5ea5e0b251080508555bcb59';

      const jacando = new Jacando(`/employees/${id}`);
      const employee: Employee = await jacando.get();

      const user = jacando.parseUser(employee);

      session.user = {
        ...user,
        username: adUser.sAMAccountName,
        isLoggedIn: true,
      };
      await session.save();
      res.status(200).json(session.user);
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
