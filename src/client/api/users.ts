import useRequest from '../hooks/useRequest';
import DBUser from '../../db/users';

const route = '/api/users';

export const useGetUser = (id: number) =>
  useRequest<DBUser>({
    url: `${route}/${id}`,
    // method: 'get',
  });

export const useGetUsers = () => useRequest<DBUser[]>({ url: route });
