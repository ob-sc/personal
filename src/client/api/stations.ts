import axios from 'axios';
import { StationModel } from '../../../types/data';
import useRequest from '../hooks/useRequest';

const route = '/api/stations';

export const useGetStation = (id: number) =>
  useRequest<StationModel>({
    url: `${route}/${id}`,
  });

export const useGetStations = () => useRequest<StationModel[]>({ url: route });

export const postStation = (values: unknown) => axios.post(route, values);
