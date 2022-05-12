import { InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { Typography } from '@mui/material';
import { accessConstants } from 'config/constants';
import { withSessionSsr } from 'lib/withSession';
import { postStation } from 'client/api/stations';
import { useGetRegions } from 'client/api/regions';
import { selectOptionMapper } from 'utils/client';
import Layout from 'client/components/layout/Layout';
import Form from 'client/components/common/Form';
import { stationFields } from 'client/tables/stations';

export const getServerSideProps = withSessionSsr();

// Home: NextPage
const NewStationPage = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  const submitHandler = async (values: unknown) => {
    await postStation(values);
    router.push('/stations');
  };

  const { data, isValidating } = useGetRegions();

  const options = data?.map(selectOptionMapper) ?? [];

  const fields = stationFields(options);

  const { permitted } = accessConstants(user.access);
  const hasAccess = permitted['/stations/new'];

  return (
    <Layout session={user} loading={isValidating} blockAccess={!hasAccess}>
      <Typography variant="h2" gutterBottom>
        Neue Station
      </Typography>
      <Form onSubmit={submitHandler} fields={fields} cols={3} />
    </Layout>
  );
};

export default NewStationPage;
