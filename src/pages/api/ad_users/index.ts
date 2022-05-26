import { ApiHandlerWithConn } from 'src/common/types/server';
import { withSessionApi } from 'src/common/middleware/withSession';
import { ApiError, unresolved } from 'src/common/utils/server';
import { error, httpMethodError } from 'src/common/utils/response';
import { createLdapUser, syncLdapUsers } from 'src/modules/ldap/apiHandler';
import { noAccessText } from 'src/config/constants';

const handler: ApiHandlerWithConn = async (req, res) => {
  try {
    const { method } = req;
    const { access } = req.session.user ?? {};

    switch (method?.toUpperCase()) {
      case 'POST':
        if (!access?.users.write) throw new ApiError(noAccessText, 403);
        await createLdapUser(req, res);
        break;
      case 'PUT':
        // lässt sich nicht RESTful darstellen, also halt PUT
        if (!access?.admin.read) throw new ApiError(noAccessText, 403);
        await syncLdapUsers(req, res);
        break;
      default:
        httpMethodError(res, method, ['POST', 'PUT']);
    }
  } catch (err) {
    error(res, err);
  }
};

export default withSessionApi(handler, true);

export const config = unresolved;
