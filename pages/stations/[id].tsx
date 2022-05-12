import { InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { Typography } from '@mui/material';
import { accessConstants, errorText } from 'config/constants';
import { withSessionSsr } from 'lib/withSession';
import { useGetStations } from 'client/api/stations';
import { useGetUser } from 'client/api/users';
import Layout from 'client/components/layout/Layout';
import StationsContainer from 'client/components/users/id/StationsContainer';

export const getServerSideProps = withSessionSsr();

const SingleStationPage = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { id } = router.query;
  const { data, isValidating } = useGetUser(Number(id));

  const stations = useGetStations();

  const name = user.fullName;

  const { hasAccess } = accessConstants(user.access, 'stations');

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
};

export default SingleStationPage;