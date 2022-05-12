import { ApiRequestHandler } from 'types/server';
import { User } from 'entities/User';
import { success } from 'server/response';

export const allLdapUsers: ApiRequestHandler<User> = async (
  res,
  repo,
  data
) => {
  if (!data || !data.ldap) throw new Error('Kein LDAP-Client vorhanden');

  const { ldap } = data;

  await ldap.connect();
  const ldapUsers = await ldap.search();

  success(res, ldapUsers);
};
