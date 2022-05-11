import { InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { withSessionSsr } from '../../src/lib/withSession';
import Layout from '../../src/client/components/layout/Layout';
import DataGrid from '../../src/client/components/common/DataGrid';
import { RowClickHandler } from '../../types/client';
import stationColumns from '../../src/client/tables/stations';
import { useGetStations } from '../../src/client/api/stations';
import { accessConstants } from '../../config/constants';
import { Box, Typography } from '@mui/material';
import { useGetRegions } from 'src/client/api/regions';
import RegionChip from 'src/client/components/stations/RegionChip';
import Link from 'src/client/components/common/Link';

export const getServerSideProps = withSessionSsr();

// Home: NextPage
const AllStationsPage = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data, error } = useGetStations();
  const regions = useGetRegions();
  const router = useRouter();

  const rowClickHandler: RowClickHandler = async (e) => {
    const { id } = e;
    // window.location.href = `/users/${id}`;
    router.push(`/stations/${id}`);
  };

  const cols = stationColumns();

  const { hasAccess, routes } = accessConstants(user.access, 'stations');

  return (
    <Layout session={user} blockAccess={!hasAccess}>
      <DataGrid
        columns={cols}
        rows={data ?? []}
        error={error !== undefined}
        loading={!data && !error}
        rowClickHandler={rowClickHandler}
        add={user.access >= routes['stations/new']}
        actionHandler={() => {
          router.push('/stations/new');
        }}
      />
      <Box sx={{ width: '100%', mt: 2 }}>
        <Typography variant="h5">Regionen</Typography>
        <Box
          sx={{
            display: 'flex',
            flex: 'row wrap',
            gap: 1,
            mt: 2,
            // overflow: 'scroll',
            maxWidth: '100%',
          }}
        >
          {regions?.data?.map((region) => (
            <RegionChip
              label={region.name}
              deleteId={region.id}
              key={`region-${region.id}`}
            />
          ))}
          <Link href="/regions/new">Neue Region</Link>
        </Box>
        <Box sx={{ mt: 2 }}></Box>
      </Box>
    </Layout>
  );
};

export default AllStationsPage;

// todo overflow chips
