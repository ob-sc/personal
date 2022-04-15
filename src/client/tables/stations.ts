import { GridColDef } from '@mui/x-data-grid';

const userColumns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 75 },
  { field: 'name', headerName: 'Name', width: 180 },
  { field: 'address', headerName: 'Anschrift', width: 180 },
  { field: 'city', headerName: 'Stadt', width: 180 },
  { field: 'region', headerName: 'Region', width: 180 },
  { field: 'subregion', headerName: 'Region 2', width: 180 },
  { field: 'email', headerName: 'E-Mail', width: 180 },
  { field: 'telephone', headerName: 'Telefon', width: 180 },
  { field: 'fax', headerName: 'Fax', width: 180 },
];

export default userColumns;
