import useRequest from 'src/client/hooks/useRequest';
import { Region } from 'src/entities/Region';

const route = '/api/regions';

export const useGetRegions = () => useRequest<Region[]>({ url: route });
