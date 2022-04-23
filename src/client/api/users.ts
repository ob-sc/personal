import User from '../../entities/User';
import useRequest from '../hooks/useRequest';

const route = '/api/users';

export const useGetUser = (id: number) =>
  useRequest<User>({
    url: `${route}/${id}`,
    // method: 'get',
  });

export const useGetUsers = () => useRequest<User[]>({ url: route });
