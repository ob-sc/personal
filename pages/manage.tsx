import { InferGetServerSidePropsType } from 'next';
import { GridColDef } from '@mui/x-data-grid';
import { withSessionSsr } from '../src/lib/withSession';
import Layout from '../src/client/components/layout/Layout';
import useRequest from '../src/client/hooks/useRequest';
import DataGrid from '../src/client/components/common/DataGrid';
import { DBUser } from '../src/db/users';
import { toLocalDate } from '../src/lib/util';
// import styles from "../styles/Home.module.css";

export const getServerSideProps = withSessionSsr();

// Home: NextPage
const Manage = ({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data, error } = useRequest<DBUser[]>({ url: '/api/users' });

  const columns: GridColDef[] = [
    { field: 'username', headerName: 'Benutzer', width: 150 },
    { field: 'domain', headerName: 'Domain', width: 150 },
    { field: 'access', headerName: 'Berechtigung', width: 150 },
    { field: 'region', headerName: 'Region', width: 150 },
    { field: 'extrastation', headerName: 'Station', width: 150 },
    {
      field: 'createdAt',
      headerName: 'Erstellt',
      width: 150,
      type: 'date',
      valueFormatter: (params) => toLocalDate(String(params.value)),
    },
    {
      field: 'updatedAt',
      headerName: 'Update',
      width: 150,
      type: 'date',
      valueFormatter: (params) => toLocalDate(String(params.value)),
    },
  ];

  return (
    <Layout session={user}>
      <DataGrid columns={columns} rows={data ?? []} error={!!error} loading={!data && !error} />
    </Layout>
  );
};

export default Manage;
