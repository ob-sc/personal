import { InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { RowClickHandler } from 'types/client';
import { accessConstants } from 'config/constants';
import { useGetUsers } from 'src/client/api/users';
import { withSessionSsr } from 'src/lib/withSession';
import Layout from 'src/client/components/layout/Layout';
import DataGrid from 'src/client/components/common/DataGrid';
import userColumns from 'src/client/tables/users';

export const getServerSideProps = withSessionSsr();

// Home: NextPage
const AllUsersPage = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const users = useGetUsers();
  const router = useRouter();

  const rowClickHandler: RowClickHandler = async (e) => {
    const { id } = e;
    router.push(`/users/${id}`);
  };

  const cols = userColumns();

  const { hasAccess } = accessConstants(user.access, 'users');

  return (
    <Layout session={user} blockAccess={!hasAccess}>
      <DataGrid
        columns={cols}
        rows={users.data ?? []}
        error={users.error !== undefined}
        loading={!users.data && !users.error}
        rowClickHandler={rowClickHandler}
      />
    </Layout>
  );
};

export default AllUsersPage;
