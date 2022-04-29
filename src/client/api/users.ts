import axios from 'axios';
import { ParsedUser } from 'types/server';
import useRequest from 'src/client/hooks/useRequest';

const route = '/api/users';

export const useGetUser = (id: number) =>
  useRequest<ParsedUser>({
    url: `${route}/${id}`,
    // method: 'get',
  });

export const useGetUsers = () => useRequest<ParsedUser[]>({ url: route });

export const postAllowedStation = (userId: number, stationId: number) =>
  axios.post(`${route}/${userId}/allowed-stations/${stationId}`);

export const deleteAllowedStation = (userId: number, stationId: number) =>
  axios.delete(`${route}/${userId}/allowed-stations/${stationId}`);
