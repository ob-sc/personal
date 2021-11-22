import { NextApiHandler } from 'next';
import { withSessionApiRoute } from '../../../lib/withSession';
import ldap from '../../../lib/ldap';
import { noArray } from '../../../lib/util';
import log from '../../../lib/log';

declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      id: number;
      admin?: boolean;
    };
  }
}

const loginRoute: NextApiHandler = async (req, res) => {
  const {
    query: { username, password },
    session,
    method,
  } = req;

  if (method?.toUpperCase() === 'POST') {
    const isUndefined = username === undefined || password === undefined;

    if (isUndefined) {
      return res.status(400).json({ error: 'Benutzername und Passwort müssen angegeben werden' });
    }

    // todo ohne any
    const adUser: any = await ldap.search(noArray(username));
    const auth = await ldap.auth(adUser.dn, noArray(password));

    log.debug(adUser);
    log.debug(auth);

    // get user from database then:
    session.user = {
      id: 230,
      admin: true,
    };
    await session.save();
    res.status(200).end();
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Methode ${method} nicht erlaubt` });
  }
};

export default withSessionApiRoute(loginRoute);
