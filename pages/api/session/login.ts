import { NextApiHandler } from 'next';
import { withSessionApi } from '../../../lib/withSession';
import ldap from '../../../lib/ldap';
import { errorResponse } from '../../../lib/util';
import Jacando from '../../../lib/jacando';
import log from '../../../lib/log';
import { Employee } from '../../../types/jacando';

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

      const adUser = await ldap.search(username);

      // ab hier nicht mehr User-Eingabefehler
      errorStatus = 500;

      await ldap.auth(adUser.dn, password);

      // todo aus DB holen?
      // "5ea5e0b251080508555bcb59"
      const id = '5ea5e0b251080508555bcb59';

      const jacando = new Jacando(`/employees/${id}`);
      const employee: Employee = await jacando.get();

      const user = jacando.safeUser(employee);

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
