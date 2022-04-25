import { InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { withSessionSsr } from '../../src/lib/withSession';
import Layout from '../../src/client/components/layout/Layout';
import DataGrid from '../../src/client/components/common/DataGrid';
import { RowClickHandler } from '../../types/client';
import { useGetUsers } from '../../src/client/api/users';
import userColumns from '../../src/client/tables/users';

export const getServerSideProps = withSessionSsr();

// Home: NextPage
const AllUsersPage = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data, error } = useGetUsers();
  const router = useRouter();

  const rowClickHandler: RowClickHandler = async (e) => {
    const { id } = e;
    // window.location.href = `/users/${id}`;
    router.push(`/users/${id}`);
  };

  console.log(data);

  return (
    <Layout session={user}>
      <DataGrid
        columns={userColumns}
        rows={data ?? []}
        error={error !== undefined}
        loading={!data && !error}
        rowClickHandler={rowClickHandler}
      />
    </Layout>
  );
};

export default AllUsersPage;
