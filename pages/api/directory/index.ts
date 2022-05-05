import { withSessionApi } from 'src/lib/withSession';
import { error, httpMethodError, success } from 'src/server/response';
import { unresolved } from 'src/utils/server';
import { NextApiHandlerWithConnections } from 'types/server';

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
