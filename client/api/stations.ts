import axios from 'axios';
import { Station } from 'entities/Station';
import useRequest from 'client/hooks/useRequest';

const route = '/api/stations';

export const useGetStation = (id: number) =>
  useRequest<Station>({
    url: `${route}/${id}`,
  });

export const useGetStations = () => useRequest<Station[]>({ url: route });

export const postStation = (values: unknown) => axios.post(route, values);