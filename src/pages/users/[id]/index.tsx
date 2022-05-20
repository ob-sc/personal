import { InferGetServerSidePropsType as IPT } from 'next';
import { useRouter } from 'next/router';
import { Typography } from '@mui/material';
import { errorText } from 'src/config/constants';
import { withSessionSsr } from 'src/common/middleware/withSession';
import { useGetStations } from 'src/modules/stations/api';
import { useGetUser } from 'src/modules/users/api';
import Layout from 'src/common/components/Layout';
import StationsContainer from 'src/modules/users/components/AllowedStationsContainer';

export const getServerSideProps = withSessionSsr();

function SingleUserPage({ user }: IPT<typeof getServerSideProps>) {
  const router = useRouter();
  const { id } = router.query;
  const { data, isValidating } = useGetUser(Number(id));

  const stations = useGetStations();

  const name = user.fullName;

  const hasAccess = user.access.users.read;

  return (
    <Layout loading={isValidating} session={user} blockAccess={!hasAccess}>
      <Typography variant="h2">{name}</Typography>
      {data !== undefined ? (
        <StationsContainer stations={stations.data ?? []} user={data} />
      ) : (
        <Typography>{errorText}</Typography>
      )}
    </Layout>
  );
}

export default SingleUserPage;

// todo wochenende siehe pages/users/index
