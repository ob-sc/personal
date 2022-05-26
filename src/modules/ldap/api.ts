import axios from 'axios';
import { FormValues } from 'src/common/components/Form';

const route = '/api/ad_users';

export const postLdapUser = (values: FormValues) => axios.post(route, values);

export const putLdapUsers = () => axios.put(route);
