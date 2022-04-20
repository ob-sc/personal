import useRequest from '../hooks/useRequest';
import { UserModel } from '../../../types/data';

const route = '/api/users';

export const useGetUser = (id: number) =>
  useRequest<UserModel>({
    url: `${route}/${id}`,
    // method: 'get',
  });

export const useGetUsers = () => useRequest<UserModel[]>({ url: route });
