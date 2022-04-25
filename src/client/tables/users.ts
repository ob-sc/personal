import { DataGridCol } from '../../../types/client';
import { gridEmptyVal } from '../../utils/client';
import { translateAccess } from '../../utils/shared';

const userColumns: DataGridCol[] = [
  { field: 'username', headerName: 'Benutzer', width: 300, sm: true },
  {
    field: 'access',
    headerName: 'Berechtigung',
    width: 250,
    valueFormatter: (param) => translateAccess(param.value) ?? '-',
  },
  {
    field: 'region',
    headerName: 'Region',
    width: 250,
    valueFormatter: gridEmptyVal,
  },
  {
    field: 'stations',
    headerName: 'Stationen',
    width: 250,
    valueFormatter: gridEmptyVal,
  },
];

export default userColumns;
