import { InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { withSessionSsr } from '../../src/lib/withSession';
import Layout from '../../src/client/components/layout/Layout';
import { postStation } from '../../src/client/api/stations';
import Form from '../../src/client/components/common/Form';
import { FormField } from '../../types/client';
import { Typography } from '@mui/material';
import { useGetRegions } from '../../src/client/api/regions';
import { selectOptionMapper, withEmptyOption } from '../../src/utils/client';
import { accessConstants } from '../../config/constants';

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

// Home: NextPage
const NewStationPage = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  const submitHandler = async (values: unknown) => {
    await postStation(values);

    router.push('/stations');
  };

  const { data } = useGetRegions();

  const options = data?.map(selectOptionMapper) ?? [];
  const withEmptyRegionOption = withEmptyOption(options, 'Keine Region');

  const fields: FormField[] = [
    { name: 'h0', label: 'Bezeichnung', type: 'header' },
    { name: 'id', label: 'Nummer', type: 'number', required: true },
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'h1', label: 'Kontakt', type: 'header' },
    {
      name: 'address',
      label: 'Straße & Hausnummer',
      type: 'text',
    },
    { name: 'zip', label: 'Postleitzahl', type: 'text' },
    { name: 'city', label: 'Stadt', type: 'text' },
    { name: 'telephone', label: 'Telefon', type: 'text' },
    { name: 'fax', label: 'Fax', type: 'text' },
    { name: 'email', label: 'Email', type: 'text' },
    { name: 'h2', label: 'Region', type: 'header' },
    {
      name: 'region_id',
      label: 'Region',
      type: 'select',
      required: true,
      options,
    },
    {
      name: 'subregion_id',
      label: 'Region 2',
      type: 'select',
      options: withEmptyRegionOption,
    },
  ];

  const { hasAccess } = accessConstants(user.access, 'stations/new');

  return (
    <Layout session={user} blockAccess={!hasAccess}>
      <Typography variant="h2" gutterBottom>
        Neue Station
      </Typography>
      <Form submit={submitHandler} fields={fields} cols={3} />
    </Layout>
  );
};

export default NewStationPage;
