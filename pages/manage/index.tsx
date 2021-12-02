import { useState } from 'react';
import { InferGetServerSidePropsType } from 'next';
import { Box, TextField } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { withSessionSsr } from '../../src/lib/withSession';
import Layout from '../../src/client/components/layout/Layout';
import useRequest from '../../src/client/hooks/useRequest';
import DataGrid from '../../src/client/components/common/DataGrid';
import { DBUser } from '../../src/db/users';
import { toLocalDate } from '../../src/lib/util';
import { CellClickHandler } from '../../types';
import searchFilter from '../../src/client/util/searchFilter';
// import styles from "../styles/Home.module.css";

export const getServerSideProps = withSessionSsr();

// Home: NextPage
const Manage = ({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data, error } = useRequest<DBUser[]>({ url: '/api/users' });

  const [search, setSearch] = useState('');

  const rows = searchFilter<DBUser>(search, data ?? []);

  const columns: GridColDef[] = [
    { field: 'username', headerName: 'Benutzer', width: 250 },
    { field: 'domain', headerName: 'Domain', width: 150 },
    { field: 'access', headerName: 'Berechtigung', width: 150 },
    { field: 'region', headerName: 'Region', width: 150 },
    {
      field: 'stations',
      headerName: 'Stationen',
      width: 250,
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

  const cellClickHandler: CellClickHandler = (e) => {
    console.log(e);
  };

  return (
    <Layout session={user}>
      <Box mb={1}>
        <TextField
          placeholder="Suche"
          size="small"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          sx={{ mb: 1 }}
        />
      </Box>
      <DataGrid
        columns={columns}
        rows={rows}
        error={!!error}
        loading={!data && !error}
        cellClickHandler={cellClickHandler}
      />
    </Layout>
  );
};

export default Manage;
