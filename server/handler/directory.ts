import { NextApiHandlerWithConnections } from 'types/server';
import { success } from 'server/response';
import { ApiError } from 'utils/server';

export const allLdapUsers: NextApiHandlerWithConnections = async (req, res) => {
  const { ldap } = req;
  if (!ldap) throw new ApiError('Kein LDAP-Client vorhanden');

  await ldap.connect();
  const ldapUsers = await ldap.search();

  success(res, ldapUsers);
};
