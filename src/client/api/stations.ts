import useRequest from '../hooks/useRequest';
import DBStation from '../../db/stations';

export const useGetStation = (id: number) =>
  useRequest<DBStation>({
    url: `/api/stations/${id}`,
  });

export const useGetStations = () =>
  useRequest<DBStation[]>({ url: '/api/stations' });
