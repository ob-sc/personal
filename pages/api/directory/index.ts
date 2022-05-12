import { withSessionApi } from 'lib/withSession';
import { error, httpMethodError, success } from 'server/response';
import { unresolved } from 'utils/server';
import { NextApiHandlerWithConnections } from 'types/server';

/* todo
auf /users nur die daten aus der datenbank die nicht durch sync aktualisiert werden darstellen
sync dann per:
- button auf /users (alle)
- cron job (curl auf route?, alle aktualisieren)
- bei login
- bei aufruf /users/:id

* am besten kein parseUser mehr sondern direkt alles geparsed in db, dann bei sync parse
* mach dn speichern sinn? lieber parsen und dann speichern
*/

const handler: NextApiHandlerWithConnections = async (req, res) => {
  try {
    const { method, ldap } = req;
    if (!ldap) throw new Error('AD nicht verfügbar');

    const allLdapUsers = async () => {
      await ldap.connect();
      const data = await ldap.search();

      success(res, data);
    };

    switch (method?.toUpperCase()) {
      case 'GET':
        await allLdapUsers();
        break;
      default:
        httpMethodError(res, method, ['GET']);
    }
  } catch (err) {
    error(res, err);
  }
};

export default withSessionApi(handler, 'directory', true);

export const config = unresolved;
