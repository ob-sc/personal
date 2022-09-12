import axios from 'axios';
import { ParsedUser } from 'src/common/types/server';
import useRequest from 'src/common/hooks/useRequest';

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

export const postAccessBit = (userId: number, bitPosition: number) =>
  axios.post(`${route}/${userId}/access/${bitPosition}`);

export const deleteAccessBit = (userId: number, bitPosition: number) =>
  axios.delete(`${route}/${userId}/access/${bitPosition}`);
