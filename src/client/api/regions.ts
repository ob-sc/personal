import axios from 'axios';
import useRequest from 'src/client/hooks/useRequest';
import { Region } from 'src/entities/Region';

const route = '/api/regions';

export const useGetRegions = () => useRequest<Region[]>({ url: route });

export const postRegion = (values: unknown) => axios.post(route, values);

export const deleteRegion = () => axios.delete(route);
