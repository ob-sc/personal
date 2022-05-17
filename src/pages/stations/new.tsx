import { InferGetServerSidePropsType as IPT } from 'next';
import { useRouter } from 'next/router';
import { Typography } from '@mui/material';
import { withSessionSsr } from 'src/common/middleware/withSession';
import { postStation } from 'src/modules/stations/api';
import { useGetRegions } from 'src/modules/regions/api';
import { selectOptionMapper } from 'src/common/utils/client';
import Layout from 'src/common/components/Layout';
import Form, { FormValues } from 'src/common/components/Form';
import { stationFields } from 'src/modules/stations/columns';

export interface NewStationForm {
  id: string;
  name: string;
  address: string;
  zip: string;
  city: string;
  telephone: string;
  fax: string;
  email: string;
  region_id: string;
  subregion_id: string;
}

export const getServerSideProps = withSessionSsr();

function NewStationPage({ user }: IPT<typeof getServerSideProps>) {
  const router = useRouter();

  const submitHandler = async (values: FormValues) => {
    await postStation(values);
    router.push('/stations');
  };

  const { data, isValidating } = useGetRegions();

  const options = data?.map(selectOptionMapper) ?? [];

  const fields = stationFields(options);

  const hasAccess = user.access.stations.write;

  return (
    <Layout session={user} loading={isValidating} blockAccess={!hasAccess}>
      <Typography variant="h2" gutterBottom>
        Neue Station
      </Typography>
      <Form onSubmit={submitHandler} fields={fields} cols={3} fullWidth />
    </Layout>
  );
}

export default NewStationPage;
