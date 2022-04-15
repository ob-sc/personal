import axios from 'axios';
import useRequest from '../hooks/useRequest';
import DBStation from '../../db/stations';

const route = '/api/stations';

export const useGetStation = (id: number) =>
  useRequest<DBStation>({
    url: `${route}/${id}`,
  });

export const useGetStations = () => useRequest<DBStation[]>({ url: route });

export const postStation = (values: unknown) => axios.post(route, values);
