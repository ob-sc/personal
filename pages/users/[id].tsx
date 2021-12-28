import { InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { CircularProgress } from '@mui/material';
import { withSessionSsr } from '../../src/lib/withSession';
import Layout from '../../src/client/components/layout/Layout';
import useRequest from '../../src/client/hooks/useRequest';
import { ParsedUser } from '../../types/user';

export const getServerSideProps = withSessionSsr();

// Home: NextPage
const User = ({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { id } = router.query;
  const { data, error } = useRequest<ParsedUser>({ url: `/api/users/${id}`, method: 'get' });

  return (
    <Layout session={user}>{!data && !error ? <CircularProgress /> : JSON.stringify(data)}</Layout>
  );
};

export default User;
