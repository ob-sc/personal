import { useState } from 'react';
import { InferGetServerSidePropsType } from 'next';
import { Box, CircularProgress, IconButton, TextField } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import SyncIcon from '@mui/icons-material/Sync';
import { withSessionSsr } from '../../src/lib/withSession';
import Layout from '../../src/client/components/layout/Layout';
import useRequest from '../../src/client/hooks/useRequest';
import DataGrid from '../../src/client/components/common/DataGrid';
import { DBUser } from '../../src/db/users';
import { toLocalDate } from '../../src/lib/util';
import { RowClickHandler } from '../../types';
import searchFilter from '../../src/client/util/searchFilter';
import axios from 'axios';
// import styles from "../styles/Home.module.css";

export const getServerSideProps = withSessionSsr();

// Home: NextPage
const Manage = ({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data, error, mutate } = useRequest<DBUser[]>({ url: '/api/users' });
  const [syncing, setSyncing] = useState(false);
  const [search, setSearch] = useState('');

  const rows = searchFilter<DBUser>(search, data ?? []);

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

  const rowClickHandler: RowClickHandler = (e) => {
    console.log(e);
  };

  return (
    <Layout session={user}>
      <Box mb={1}>
        <IconButton
          sx={{ mr: 2 }}
          onClick={() => {
            setSyncing(true);
            axios.post('/api/directory/sync').then(() => {
              mutate();
              setSyncing(false);
            });
          }}
        >
          {syncing ? <CircularProgress size={22} /> : <SyncIcon />}
        </IconButton>
        <TextField
          placeholder="Suche"
          size="small"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </Box>
      <DataGrid
        columns={columns}
        rows={rows}
        error={!!error}
        loading={!data && !error}
        rowClickHandler={rowClickHandler}
      />
    </Layout>
  );
};

export default Manage;
