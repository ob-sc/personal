import { ApiHandlerWithConn } from 'src/common/types/server';
import { withSessionApi } from 'src/common/middleware/withSession';
import { unresolved } from 'src/common/utils/server';
import { error, httpMethodError } from 'src/common/utils/response';
import { login, logout } from 'src/modules/auth/apiHandler';

const handler: ApiHandlerWithConn = async (req, res) => {
  try {
    const { method } = req;

    switch (method?.toUpperCase()) {
      case 'POST':
        await login(req, res);
        break;
      case 'DELETE':
        logout(req, res);
        break;
      default:
        httpMethodError(res, method, ['POST', 'DELETE']);
    }
  } catch (err) {
    error(res, err);
  }
};

export default withSessionApi(handler, true, true);

export const config = unresolved;
