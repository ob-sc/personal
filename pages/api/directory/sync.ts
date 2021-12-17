import type { NextApiHandler } from 'next';
import db from '../../../src/db';
import logger from '../../../src/lib/log';
import { parseOUStation } from '../../../src/lib/parseUser';
import { sanitizedLower } from '../../../src/lib/util';
import { withSessionApi } from '../../../src/lib/withSession';
import jacando from '../../../src/server/jacando';
import ldap from '../../../src/server/ldap';
import response from '../../../src/server/response';
import { Employee } from '../../../types/user';

const syncAdHandler: NextApiHandler = async (req, res) => {
  const { method } = req;
  const { error, success, httpMethodError } = response(res);

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
      const employees = jacando<Employee[]>('employees');

      const jacandoUserPages = {
        p0: await employees.get(0),
        p1: await employees.get(1),
        p2: await employees.get(2),
        p3: await employees.get(3),
        p4: await employees.get(4),
        p5: await employees.get(5),
        p6: await employees.get(6),
        p7: await employees.get(7),
        p8: await employees.get(8),
        p9: await employees.get(9),
      };

      let jacandoUsers = Object.values(jacandoUserPages).flat();

      // suche weitere Seiten, wenn die letzte Seite voll ist
      if (Array.isArray(jacandoUserPages.p9) && jacandoUserPages.p9.length === 100) {
        let isFullPage = true;
        let pageIndex = 9;
        while (isFullPage) {
          pageIndex++;
          const nextPage = await employees.get<Employee[]>(pageIndex);
          jacandoUsers = [...jacandoUsers, ...nextPage];
          if (nextPage.length < 100) isFullPage = false;
        }
      }

      const jacandoUserIds = jacandoUsers.map((user) => user.id);
      const jacandoUserIdsUnique = new Set(jacandoUserIds);

      if (jacandoUserIdsUnique.size !== jacandoUsers.length) {
        logger.error('jacandoUserIdsUnique.size !== jacandoUsers.length');
      }

      for (let i = 0; i < adUsers.length; i++) {
        const adUser = adUsers[i];
        const username = sanitizedLower(adUser.sAMAccountName);
        const dbUsersIndex = dbUsers.findIndex(
          (dbUser) => sanitizedLower(dbUser.username) === username
        );
        // wenn nicht in DB eingetragen und Mail im AD vorhanden: suche in Jacando nach Mail
        // manche AD User haben keine Mail, diese vernachlässigen
        if (dbUsersIndex === -1 && adUser.mail) {
          const jacandoUser = jacandoUsers.find(
            (jacUser) => sanitizedLower(jacUser.email) === sanitizedLower(adUser.mail)
          );
          // wenn Jacando User gefunden: Eintrag in DB, mit Station aus AD
          const adstation = parseOUStation(adUser.distinguishedName);

          if (jacandoUser) {
            db.users.create({
              id: jacandoUser.id,
              username,
              domain: 'starcar',
              adstation,
            });
          }
        }
      }
      success();
    } else httpMethodError(method, { post: true });
  } catch (err) {
    error(err);
  }
};

export default withSessionApi(syncAdHandler);
