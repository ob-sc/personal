import axios from 'axios';

const route = '/api/sessions';

export const postSession = (values: unknown) => axios.post(route, values);

export const deleteSession = () => axios.delete(route);
