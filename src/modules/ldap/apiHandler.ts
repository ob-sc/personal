import { ApiHandlerWithConn } from 'src/common/types/server';
import { success } from 'src/common/utils/response';
import { ApiError } from 'src/common/utils/server';
import { adErrorText } from 'src/config/constants';
import { DomainUser } from 'src/modules/ldap/types';

export const createLdapUser: ApiHandlerWithConn<Partial<DomainUser>> = async (
  req,
  res
) => {
  const { ldap } = req;
  // const { body, ldap } = req;
  if (!ldap) throw new ApiError(adErrorText);

  const cn = `test\\, test`;
  const dn = `CN=${cn},OU=_IT,OU=_Flotte,OU=Verwaltung,OU=User,OU=STARCAR,DC=starcar,DC=local`;
  const entry = {
    cn, // SC - (STARCAR), SCA - (Agentur), SCM - (Mobility), P24 -
    sn: 'Bar',
    l: 'Hamburg',
    postalCode: '20537',
    telephoneNumber: '+49 40 654411503',
    givenName: 'Foo',
    // distinguishedName: dn,
    // memberOf: [],
    displayName: 'STARCAR GmbH - Foo Bar',
    streetAddress: 'Süderstr. 282',
    sAMAccountName: 'foo.bar',
    userPrincipalName: 'foo.bar@starcar.de',
    // mail: 'foo@starcar.de',
    objectClass: ['top', 'person', 'organizationalPerson', 'user'],
    // userAccountControl: '512',
  };

  await ldap.connect();
  await ldap.add(dn, entry);

  const test = ldap.search();

  success(res, test);
};

export const syncLdapUsers: ApiHandlerWithConn = async (req, res) => {
  const { ldap } = req;
  if (!ldap) throw new ApiError(adErrorText);

  await ldap.connect();
  const ldapUsers = await ldap.search();

  success(res, ldapUsers);
};
