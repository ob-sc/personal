import { InferGetServerSidePropsType as IPT } from 'next';
import { useRouter } from 'next/router';
import { withSessionSsr } from 'src/common/middleware/withSession';
import Layout from 'src/common/components/Layout';
import DataGrid from 'src/common/components/DataGrid';
import { RowClickHandler } from 'src/common/types/client';
import stationColumns from 'src/modules/stations/columns';
import { useGetStations } from 'src/modules/stations/api';
import { accessConstants, routes } from 'src/config/constants';

import RegionsContainer from 'src/modules/stations/components/RegionsContainer';

export const getServerSideProps = withSessionSsr();

function AllStationsPage({ user }: IPT<typeof getServerSideProps>) {
  const { data, error } = useGetStations();
  const router = useRouter();

  const rowClickHandler: RowClickHandler = async (e) => {
    const { id } = e;
    // window.location.href = `/users/${id}`;
    router.push(`/stations/${id}`);
  };

  const cols = stationColumns();

  const { permitted } = accessConstants(user.access);
  const hasAccess = permitted['/stations'];

  return (
    <Layout session={user} blockAccess={!hasAccess}>
      <DataGrid
        columns={cols}
        rows={data ?? []}
        error={error !== undefined}
        loading={!data && !error}
        rowClickHandler={rowClickHandler}
        add={routes['/stations/new'] <= user.access}
        actionHandler={() => {
          router.push('/stations/new');
        }}
      />
      <RegionsContainer />
    </Layout>
  );
}

export default AllStationsPage;
