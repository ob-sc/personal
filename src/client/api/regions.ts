import { Region } from '../../entities/Region';
import useRequest from '../hooks/useRequest';

const route = '/api/regions';

export const useGetRegions = () => useRequest<Region[]>({ url: route });
