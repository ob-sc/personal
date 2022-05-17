import axios from 'axios';
import { FormValues } from 'src/common/components/Form';

const route = '/api/sessions';

export const postSession = (values: FormValues) => axios.post(route, values);

export const deleteSession = () => axios.delete(route);
