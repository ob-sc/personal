import { GridColDef } from '@mui/x-data-grid';
import { toLocalDate } from '../../lib/util';

const userColumns: GridColDef[] = [
  { field: 'username', headerName: 'Benutzer', width: 200 },
  { field: 'domain', headerName: 'Domain', width: 150 },
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
    field: 'stations',
    headerName: 'Stationen',
    width: 150,
    valueFormatter: (params) => (params.value === null ? '-' : params.value),
  },
  {
    field: 'createdAt',
    headerName: 'Erstellt',
    width: 150,
    type: 'date',
    valueFormatter: (params) => toLocalDate(params.value as string),
  },
  {
    field: 'updatedAt',
    headerName: 'Update',
    width: 150,
    type: 'date',
    valueFormatter: (params) => toLocalDate(params.value as string),
  },
];

export default userColumns;