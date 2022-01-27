import useRequest from '../hooks/useRequest';
import DBUser from '../../db/users';

export const useGetUser = (id: number) =>
  useRequest<DBUser>({
    url: `/api/users/${id}`,
    // method: 'get',
  });

export const useGetUsers = () => useRequest<DBUser[]>({ url: '/api/users' });
