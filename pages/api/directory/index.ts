import { NextApiHandlerWithConnections } from 'types/server';
import { withSessionApi } from 'lib/withSession';
import { unresolved } from 'utils/server';
import { error, httpMethodError } from 'server/response';
import { allLdapUsers } from 'server/handler/directory';

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
    const { method } = req;
    switch (method?.toUpperCase()) {
      case 'GET':
        await allLdapUsers(req, res);
        break;
      default:
        httpMethodError(res, method, ['GET']);
    }
  } catch (err) {
    error(res, err);
  }
};

export default withSessionApi(handler, '/directory', true);

export const config = unresolved;
