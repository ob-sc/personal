import { useState } from 'react';
import { InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import axios from 'axios';
import { GridColDef } from '@mui/x-data-grid';
import { CircularProgress } from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import { withSessionSsr } from '../../src/lib/withSession';
import Layout from '../../src/client/components/layout/Layout';
import useRequest from '../../src/client/hooks/useRequest';
import DataGrid from '../../src/client/components/common/DataGrid';
import { DBUser } from '../../src/db/users';
import { toLocalDate } from '../../src/lib/util';
import { RowClickHandler } from '../../types';

export const getServerSideProps = withSessionSsr();

// Home: NextPage
const Users = ({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data, error, mutate } = useRequest<DBUser[]>({ url: '/api/users' });
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);

  const actionHandler = () => {
    setSyncing(true);
    axios.post('/api/directory/sync').finally(() => {
      mutate();
      setSyncing(false);
    });
  };

  const columns: GridColDef[] = [
    { field: 'username', headerName: 'Benutzer', width: 200 },
    { field: 'domain', headerName: 'Domain', width: 130 },
    {
      field: 'access',
      headerName: 'Berechtigung',
      width: 150,
      valueFormatter: (params) => (params.value === null ? '-' : params.value),
    },
    {
      field: 'region',
      headerName: 'Region',
      width: 150,
      valueFormatter: (params) => (params.value === null ? '-' : params.value),
    },
    {
      field: 'adstation',
      headerName: 'AD Station',
      width: 150,
      valueFormatter: (params) => (params.value === 0 ? '-' : params.value),
    },
    {
      field: 'stations',
      headerName: 'Stationen',
      width: 150,
      valueFormatter: (params) => (params.value === null ? '-' : params.value),
    },
    {
      field: 'createdAt',
      headerName: 'Erstellt',
      width: 100,
      type: 'date',
      valueFormatter: (params) => toLocalDate(params.value as string),
    },
    {
      field: 'updatedAt',
      headerName: 'Update',
      width: 100,
      type: 'date',
      valueFormatter: (params) => toLocalDate(params.value as string),
    },
  ];

  const rowClickHandler: RowClickHandler = async (e) => {
    const { id } = e;
    router.push(`/users/${id}`);
  };

  return (
    <Layout session={user}>
      <DataGrid
        columns={columns}
        rows={data ?? []}
        error={!!error}
        loading={!data && !error}
        rowClickHandler={rowClickHandler}
        actionHandler={actionHandler}
        actionIcon={syncing ? <CircularProgress size={22} /> : <SyncIcon />}
      />
    </Layout>
  );
};

export default Users;
