import type { NextApiHandler } from 'next';
import db from '../../../src/db';
import Jacando from '../../../src/server/jacando';
import ldap from '../../../src/server/ldap';
import { Employee } from '../../../types/api';

const syncAdHandler: NextApiHandler = async (req, res) => {
  const { method } = req;

  if (method?.toUpperCase() === 'GET') {
    // DB (MySQL)
    const dbUsers = await db.users.findAll();

    // AD (LDAP)
    const client = await ldap.client();
    const adUsers = await ldap.operation.search(client);
    // client.unbind();
    client.destroy();

    // Jacando X
    const jacando = new Jacando('/employees');
    const jacandoUsers: Employee[] = await jacando.get();

    // neue DB Einträge für response
    const newEntries: string[] = [];

    // für jeden AD-User
    for (let i = 0; i < adUsers.length; i++) {
      const adUser = adUsers[i];
      const dbUsersIndex = dbUsers.findIndex(
        (dbUser) => dbUser.username.toLowerCase() === adUser.sAMAccountName.toLowerCase()
      );
      // wenn nicht in DB eingetragen und Mail im AD vorhanden suche in Jacando nach Mail
      // manche AD User haben keine Mail, das sind dann keine richtigen User
      if (dbUsersIndex === -1 && adUser.mail) {
        const jacandoUser = jacandoUsers.find(
          (jacUser) => jacUser.email.toLowerCase() === adUser.mail.toLowerCase()
        );
        // wenn Jacando User gefunden dann Eintrag in DB
        if (jacandoUser) {
          db.users.create({
            id: jacandoUser.id,
            username: adUser.sAMAccountName.toLowerCase(),
            domain: 'starcar',
          });
          newEntries.push(adUser.sAMAccountName.toLowerCase());
        } // todo else error (nicht in jacando gefunden) ?
      }
    }

    res.status(200).json({ newEntries, previousEntries: dbUsers });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Methode ${method} nicht erlaubt` });
  }
};

export default syncAdHandler;
