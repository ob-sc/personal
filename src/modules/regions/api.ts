import axios from 'axios';
import { FormValues } from 'src/common/components/Form';
import useRequest from 'src/common/hooks/useRequest';
import { Region } from 'src/entities/Region';

const route = '/api/regions';

// export const useGetRegion = (id: number) =>
//   useRequest<Region>({
//     url: `${route}/${id}`,
//   });

// nicht cachen
export const getRegion = (id: number) => axios.get<Region>(`${route}/${id}`);

export const useGetRegions = () => useRequest<Region[]>({ url: route });

export const postRegion = (values: FormValues) => axios.post(route, values);

export const deleteRegion = (id: number) => axios.delete(`${route}/${id}`);
