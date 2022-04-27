import { InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { withSessionSsr } from '../../src/lib/withSession';
import Layout from '../../src/client/components/layout/Layout';
import { useGetUser } from '../../src/client/api/users';
import StationsContainer from '../../src/client/components/stations/StationsContainer';
import { useGetStations } from '../../src/client/api/stations';
import { Typography } from '@mui/material';
import { accessConstants } from '../../config/constants';

export const getServerSideProps = withSessionSsr();

const SingleUserPage = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { id } = router.query;
  const { data, isValidating } = useGetUser(Number(id));

  const stations = useGetStations();

  const name = user.fullName;

  const { hasAccess } = accessConstants(user.access, 'users');

  return (
    <Layout loading={isValidating} session={user} blockAccess={!hasAccess}>
      <Typography variant="h2">{name}</Typography>
      {data !== undefined ? (
        <StationsContainer stations={stations.data ?? []} user={data} />
      ) : (
        <Typography>Fehler</Typography>
      )}
    </Layout>
  );
};

export default SingleUserPage;

// todo nur access, regionen und stationen anpassen
