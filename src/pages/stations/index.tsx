import { InferGetServerSidePropsType as IPT } from 'next';
import { useRouter } from 'next/router';
import { withSessionSsr } from 'src/common/middleware/withSession';
import Layout from 'src/common/components/Layout';
import DataGrid from 'src/common/components/DataGrid';
import { RowClickHandler } from 'src/common/types/client';
import stationColumns from 'src/modules/stations/columns';
import { useGetStations } from 'src/modules/stations/api';
import RegionsContainer from 'src/modules/regions/components/RegionsContainer';

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

  const { read: canRead, write: canWrite } = user.access.stations;
  const hasRegionAccess = user.access.regions.write;

  return (
    <Layout session={user} blockAccess={!canRead}>
      <DataGrid
        columns={cols}
        rows={data ?? []}
        error={error !== undefined}
        loading={!data && !error}
        rowClickHandler={rowClickHandler}
        add={canWrite}
        actionHandler={() => {
          router.push('/stations/new');
        }}
      />
      {hasRegionAccess ? <RegionsContainer /> : null}
    </Layout>
  );
}

export default AllStationsPage;

// todo kalender mit wochenenden, hover zeigt wer und wie lange? dann nur add button da iwo. bei users dann eintragen und die letzten direkt anzeigen? verwltung krieg das nicht
