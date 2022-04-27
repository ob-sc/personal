import { accessConstants } from '../../../config/constants';
import { DGColFn } from '../../../types/client';
import { gridEmptyVal } from '../../utils/client';

const userColumns: DGColFn = () => [
  { field: 'username', headerName: 'Benutzer', width: 300, sm: true },
  {
    field: 'access',
    headerName: 'Berechtigung',
    width: 250,
    valueFormatter: (param) =>
      accessConstants(param.value ?? 0).translate() ?? '-',
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
