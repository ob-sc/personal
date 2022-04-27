import { InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { withSessionSsr } from '../../src/lib/withSession';
import Layout from '../../src/client/components/layout/Layout';
import { useGetUser } from '../../src/client/api/users';
import StationsContainer from '../../src/client/components/stations/StationsContainer';
import { useGetStations } from '../../src/client/api/stations';
import { Typography } from '@mui/material';
import { fullName } from '../../src/utils/shared';

export const getServerSideProps = withSessionSsr();

const SingleUserPage = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { id } = router.query;
  const { data, isValidating } = useGetUser(Number(id));

  const stations = useGetStations();

  const name = fullName(user);

  return data !== undefined ? (
    <Layout loading={isValidating} session={user}>
      <Typography variant="h2">{name}</Typography>
      <StationsContainer stations={stations.data ?? []} user={data} />
    </Layout>
  ) : null;
};

export default SingleUserPage;

// todo nur access, regionen und stationen anpassen
