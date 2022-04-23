import { DataGridCol } from '../../../types/client';
import { translateAccess } from '../../utils/shared';

const userColumns: DataGridCol[] = [
  { field: 'username', headerName: 'Benutzer', width: 300, sm: true },
  {
    field: 'access',
    headerName: 'Berechtigung',
    width: 250,
    valueFormatter: (params) => translateAccess(params.value) ?? '-',
  },
  {
    field: 'region',
    headerName: 'Region',
    width: 250,
    valueFormatter: (params) => (params.value === null ? '-' : params.value),
  },
  {
    field: 'stations',
    headerName: 'Stationen',
    width: 250,
    valueFormatter: (params) => (params.value === null ? '-' : params.value),
  },
];

export default userColumns;
