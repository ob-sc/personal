import axios from 'axios';
import { FormValues } from 'src/common/components/Form';
import useRequest from 'src/common/hooks/useRequest';
import { DomainUser } from 'src/modules/ldap/types';

const route = '/api/ad_users';

export const useGetLdapUsers = () => useRequest<DomainUser[]>({ url: route });

export const postLdapUser = (values: FormValues) => axios.post(route, values);

export const putLdapUsers = () => axios.put(route);
