import axios from 'axios';

export const postSession = async (values: unknown) =>
  axios.post('/api/sessions', values);

export const deleteSession = async () => axios.delete('/api/sessions');
