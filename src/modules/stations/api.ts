import axios from 'axios';
import { Station } from 'src/entities/Station';
import useRequest from 'src/common/hooks/useRequest';
import { StringValueEntitiy as SVEntity } from 'src/entities';

const route = '/api/stations';

export const useGetStation = (id: number) =>
  useRequest<Station>({
    url: `${route}/${id}`,
  });

export const useGetStations = () => useRequest<Station[]>({ url: route });

export const postStation = (values: SVEntity) => axios.post(route, values);

export const putStation = (values: SVEntity) => axios.put(route, values);
