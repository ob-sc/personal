import { InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { withSessionSsr } from '../../src/lib/withSession';
import Layout from '../../src/client/components/layout/Layout';
import DataGrid from '../../src/client/components/common/DataGrid';
import { RowClickHandler } from '../../types';
import stationColumns from '../../src/client/tables/stations';
import { useGetStations } from '../../src/client/api/stations';

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

  console.log(data);

  return (
    <Layout session={user}>
      <DataGrid
        columns={stationColumns}
        rows={data ?? []}
        error={error !== undefined}
        loading={!data && !error}
        rowClickHandler={rowClickHandler}
        add
        actionHandler={() => {
          router.push('/stations/new');
        }}
      />
    </Layout>
  );
};

export default AllStationsPage;
