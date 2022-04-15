import axios from 'axios';

const route = '/api/init';

export const postInit = () => axios.post(route);
