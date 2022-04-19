import { InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { withSessionSsr } from '../../src/lib/withSession';
import Layout from '../../src/client/components/layout/Layout';
import { postStation } from '../../src/client/api/stations';
import Form from '../../src/client/components/common/Form';
import { FormField } from '../../types';
import { Typography } from '@mui/material';

export const getServerSideProps = withSessionSsr();

const fields: FormField[] = [
  { name: 'h0', label: 'Bezeichnung', type: 'header' },
  { name: 'id', label: 'Nummer', type: 'number', required: true },
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'h1', label: 'Kontakt', type: 'header' },
  {
    name: 'address',
    label: 'Straße & Hausnummer',
    type: 'text',
    required: true,
  },
  { name: 'zip', label: 'Postleitzahl', type: 'text', required: true },
  { name: 'city', label: 'Stadt', type: 'text', required: true },
  { name: 'telephone', label: 'Telefon', type: 'text' },
  { name: 'fax', label: 'Fax', type: 'text' },
  { name: 'email', label: 'Email', type: 'text', required: true },
  { name: 'h2', label: 'Region', type: 'header' },
  { name: 'region', label: 'Region', type: 'text', required: true },
  { name: 'subregion', label: 'Region 2', type: 'text' },
];

// Home: NextPage
const NewStationPage = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  const submitHandler = async (values: unknown) => {
    await postStation(values);

    router.push('/stations');
  };

  return (
    <Layout session={user}>
      <Typography variant="h2" gutterBottom>
        Neue Station
      </Typography>
      <Form submit={submitHandler} fields={fields} cols={3} />
    </Layout>
  );
};

export default NewStationPage;
