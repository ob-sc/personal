import { ApiHandlerWithConn } from 'src/common/types/server';
import { withSessionApi } from 'src/common/middleware/withSession';
import { ApiError, unresolved } from 'src/common/utils/server';
import { error, httpMethodError } from 'src/common/utils/response';
import { allLdapUsers } from 'src/modules/ldap/apiHandler';
import { noAccessText } from 'src/config/constants';

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

const handler: ApiHandlerWithConn = async (req, res) => {
  try {
    const { method } = req;
    const { write } = req.session.user?.access.users ?? {};

    switch (method?.toUpperCase()) {
      case 'POST':
        if (!write) throw new ApiError(noAccessText, 403);

        break;
      case 'GET':
        // hier write obwohl es eig read wäre, aber ldap ist wichtiger als users read aus dn
        if (!write) throw new ApiError(noAccessText, 403);
        await allLdapUsers(req, res);
        break;
      default:
        httpMethodError(res, method, ['GET']);
    }
  } catch (err) {
    error(res, err);
  }
};

export default withSessionApi(handler, true);

export const config = unresolved;
