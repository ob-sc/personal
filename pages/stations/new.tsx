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
  { name: 'id', label: 'Nummer', type: 'number' },
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'h1', label: '', type: 'header' },
  { name: 'address', label: 'Straße + Hausnummer', type: 'text' },
  { name: 'city', label: 'Stadt', type: 'text' },
  { name: 'zip', label: 'Postleitzahl', type: 'text' },
  { name: 'telephone', label: 'Telefon', type: 'text' },
  { name: 'fax', label: 'Fax', type: 'text' },
  { name: 'email', label: 'Email', type: 'text' },
  { name: 'h2', label: '', type: 'header' },
  { name: 'region', label: 'Region', type: 'text' },
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
      <Typography variant="h2">Neue Station</Typography>
      <Form submit={submitHandler} fields={fields} />
    </Layout>
  );
};

export default NewStationPage;
