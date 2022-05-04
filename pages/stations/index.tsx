import { InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { withSessionSsr } from '../../src/lib/withSession';
import Layout from '../../src/client/components/layout/Layout';
import DataGrid from '../../src/client/components/common/DataGrid';
import { RowClickHandler } from '../../types/client';
import stationColumns from '../../src/client/tables/stations';
import { useGetStations } from '../../src/client/api/stations';
import { accessConstants } from '../../config/constants';

export const getServerSideProps = withSessionSsr();

// Home: NextPage
const AllStationsPage = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data, error } = useGetStations();
  const router = useRouter();

  const rowClickHandler: RowClickHandler = async (e) => {
    const { id } = e;
    // window.location.href = `/users/${id}`;
    router.push(`/stations/${id}`);
  };

  const cols = stationColumns();

  const { hasAccess, routes } = accessConstants(user.access, 'stations');

  console.log(data);

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
    </Layout>
  );
};

export default AllStationsPage;
