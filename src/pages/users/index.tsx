import { useState } from 'react';
import { InferGetServerSidePropsType as IPT } from 'next';
import { useRouter } from 'next/router';
import { RowClickHandler } from 'src/common/types/client';
import { useGetUsers } from 'src/modules/users/api';
import { withSessionSsr } from 'src/common/middleware/withSession';
import Layout from 'src/common/components/Layout';
import DataGrid from 'src/common/components/DataGrid';
import userColumns from 'src/modules/users/columns';
import NewUserStepperModal from 'src/modules/users/components/NewUserStepperModal';

export const getServerSideProps = withSessionSsr();

function AllUsersPage({ user }: IPT<typeof getServerSideProps>) {
  const [modalOpen, modalSetOpen] = useState(false);
  const users = useGetUsers();
  const router = useRouter();

  const rowClickHandler: RowClickHandler = async (e) => {
    const { id } = e;
    router.push(`/users/${id}`);
  };

  const cols = userColumns();

  const newUserHandler = () => {
    modalSetOpen(true);
  };

  const hasAccess = user.access.users.read;

  return (
    <Layout session={user} blockAccess={!hasAccess}>
      <DataGrid
        columns={cols}
        rows={users.data ?? []}
        error={users.error !== undefined}
        loading={!users.data && !users.error}
        rowClickHandler={rowClickHandler}
        add
        actionHandler={newUserHandler}
      />

      <NewUserStepperModal
        open={modalOpen}
        onClose={() => modalSetOpen(false)}
      />
    </Layout>
  );
}

export default AllUsersPage;
