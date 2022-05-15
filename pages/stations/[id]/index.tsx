import { InferGetServerSidePropsType as IPT } from 'next';
import { useRouter } from 'next/router';
import { Box, Typography } from '@mui/material';
import { accessConstants } from 'config/constants';
import { withSessionSsr } from 'lib/withSession';
import { useGetStation } from 'client/api/stations';
import Layout from 'client/components/layout/Layout';
import DataList from 'client/components/common/DataList';
import { stationDescriptions } from 'client/tables/stations';
import { KeyValue } from 'types/client';
import { commaJoin } from 'utils/shared';
import Button from 'client/components/common/Button';

export const getServerSideProps = withSessionSsr();

function SingleStationPage({ user }: IPT<typeof getServerSideProps>) {
  const router = useRouter();
  const { id } = router.query;
  const { data, isValidating } = useGetStation(Number(id));

  const { permitted } = accessConstants(user.access);
  const hasAccess = permitted['/users'];

  const usersString = commaJoin(
    data?.users.map(
      (v) => `${v.first_name && v.first_name[0]}. ${v.last_name}`
    ) ?? []
  );

  const displayData: KeyValue[] = [
    { key: stationDescriptions.id, value: String(data?.id) },
    { key: stationDescriptions.name, value: data?.name },

    { key: stationDescriptions.address, value: data?.address },
    { key: stationDescriptions.zip, value: data?.zip },
    { key: stationDescriptions.city, value: data?.city },
    { key: stationDescriptions.telephone, value: data?.telephone },
    { key: stationDescriptions.fax, value: data?.fax },
    { key: stationDescriptions.email, value: data?.email },
    { key: stationDescriptions.region, value: data?.region.name },
    {
      key: stationDescriptions.subregion,
      value: data?.subregion ? data.subregion.name : null,
    },
    {
      key: 'Benutzer',
      value: usersString,
    },
  ];

  const editClickHandler = () => {
    console.log('hi');
  };

  return (
    <Layout loading={isValidating} session={user} blockAccess={!hasAccess}>
      <Typography variant="h2" gutterBottom>
        {data?.name}
      </Typography>
      <DataList data={displayData} />
      <Box sx={{ mb: 2 }} />
      <Button onClick={editClickHandler}>Bearbeiten</Button>
    </Layout>
  );
}

export default SingleStationPage;
