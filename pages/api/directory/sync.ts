import type { NextApiHandler } from 'next';
import db from '../../../src/db';
import Jacando from '../../../src/server/jacando';
import ldap from '../../../src/server/ldap';
import { Employee } from '../../../types/user';

const syncAdHandler: NextApiHandler = async (req, res) => {
  const { method } = req;

  if (method?.toUpperCase() === 'GET') {
    try {
      // DB (MySQL)
      const dbUsers = await db.users.findAll();

      // AD (LDAP)
      const client = await ldap.client();
      const adUsers = await ldap.operation.search(client);
      // client.unbind();
      client.destroy();

      // Jacando X
      const jacando = new Jacando('/employees');
      const jacandoUsers = await jacando.get<Employee[]>();

      // neue DB Einträge für response
      const newEntries: string[] = [];

      // für jeden AD-User
      for (let i = 0; i < adUsers.length; i++) {
        const adUser = adUsers[i];
        const username = adUser.sAMAccountName.toLowerCase();
        const dbUsersIndex = dbUsers.findIndex(
          (dbUser) => dbUser.username.toLowerCase() === username
        );
        // wenn nicht in DB eingetragen und Mail im AD vorhanden suche in Jacando nach Mail
        // manche AD User haben keine Mail, das sind dann keine richtigen User
        if (dbUsersIndex === -1 && adUser.mail) {
          const jacandoUser = jacandoUsers.find(
            (jacUser) => jacUser.email.toLowerCase() === adUser.mail.toLowerCase()
          );
          // wenn Jacando User gefunden dann Eintrag in DB

          // todo kst aus jacando

          if (jacandoUser) {
            db.users.create({
              id: jacandoUser.id,
              username,
              domain: 'starcar',
            });
            newEntries.push(username);
          } // else throw new Error(`Kein Jacando User gefunden für ${username}`);
        }
      }

      res.status(200).json({ newEntries, previousEntries: dbUsers });
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : err;
      res.status(500).json({ error: errMsg });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Methode ${method} nicht erlaubt` });
  }
};

export default syncAdHandler;
