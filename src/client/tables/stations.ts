import { DataGridCol } from '../../../types/client';
import { gridEmptyVal } from '../../utils/client';

const stationColumns: DataGridCol[] = [
  {
    field: 'id',
    headerName: 'ID',
    width: 75,
    sm: true,
    valueFormatter: gridEmptyVal,
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 180,
    sm: true,
  },
  {
    field: 'address',
    headerName: 'Anschrift',
    width: 180,
    valueFormatter: gridEmptyVal,
  },
  {
    field: 'city',
    headerName: 'Stadt',
    width: 180,
    valueFormatter: gridEmptyVal,
  },
  {
    field: 'region',
    headerName: 'Region',
    width: 180,
    valueFormatter: (param) => param.value.name,
  },
  {
    field: 'subregion',
    headerName: 'Region 2',
    width: 180,
    valueFormatter: (param) => param.value?.name ?? '-',
  },
  {
    field: 'email',
    headerName: 'E-Mail',
    width: 180,
    valueFormatter: gridEmptyVal,
  },
  {
    field: 'telephone',
    headerName: 'Telefon',
    width: 180,
    valueFormatter: gridEmptyVal,
  },
  {
    field: 'fax',
    headerName: 'Fax',
    width: 180,
    valueFormatter: gridEmptyVal,
  },
];

export default stationColumns;
