import type { NextApiHandler } from 'next';
import Jacando, { parseUser } from '../../../lib/jacando';
import ldap from '../../../lib/ldap';
import { Employee, User } from '../../../types/api';

const directoryHandler: NextApiHandler = async (req, res) => {
  const { method } = req;

  if (method?.toUpperCase() === 'GET') {
    const client = ldap.client();
    const allAD = await ldap.operation.search(client);
    client.unbind();

    const jacando = new Jacando('/employees');
    const employees: Employee[] = await jacando.get();

    const jacandoParsed: User[] = [];

    for (let i = 0; i < employees.length; i++) {
      const employee = employees[i];
      const user = parseUser(employee);
      jacandoParsed.push(user);
    }

    res.status(200).json({ ad: allAD, jacando: jacandoParsed });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Methode ${method} nicht erlaubt` });
  }
};

export default directoryHandler;
