import type { NextApiHandler } from 'next';
import db from '../../../src/db';
import { parseOUStation } from '../../../src/lib/parseUser';
import { withSessionApi } from '../../../src/lib/withSession';
import Jacando from '../../../src/server/jacando';
import ldap from '../../../src/server/ldap';
import response from '../../../src/server/response';
import { Employee } from '../../../types/user';

const syncAdHandler: NextApiHandler = async (req, res) => {
  const { method } = req;
  const { error, success, methodError } = response(res);

  try {
    if (method?.toUpperCase() === 'POST') {
      // DB (MySQL)
      const dbUsers = await db.users.findAll();

      // AD (LDAP)
      const client = await ldap.client();
      const adUsers = await ldap.operation.search(client);
      // client.unbind();
      client.destroy();

      // Jacando X
      const jacando = new Jacando('employees');
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
          // wenn Jacando User gefunden dann Eintrag in DB, mit Station aus AD
          const adstation = parseOUStation(adUser.distinguishedName);

          if (jacandoUser) {
            db.users.create({
              id: jacandoUser.id,
              username,
              domain: 'starcar',
              adstation,
            });
            newEntries.push(username);
          } // else throw new Error(`Kein Jacando User gefunden für ${username}`);
        }
      }
      success({ newEntries, previousEntries: dbUsers });
    } else methodError(method, { post: true });
  } catch (err) {
    error(err);
  }
};

export default withSessionApi(syncAdHandler);
