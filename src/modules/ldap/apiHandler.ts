import { ApiHandlerWithConn } from 'src/common/types/server';
import { success } from 'src/common/utils/response';
import { ApiError } from 'src/common/utils/server';

export const allLdapUsers: ApiHandlerWithConn = async (req, res) => {
  const { ldap } = req;
  if (!ldap) throw new ApiError('Kein LDAP-Client vorhanden');

  await ldap.connect();
  const ldapUsers = await ldap.search();

  success(res, ldapUsers);
};