import { DGColFn } from 'types/client';
import { gridEmptyVal } from 'src/utils/client';

const stationColumns: DGColFn = () => [
  {
    field: 'id',
    headerName: 'Nr',
    width: 70,
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
    field: 'region',
    headerName: 'Region',
    width: 100,
    valueFormatter: (param) => param.value.name,
  },
  {
    field: 'subregion',
    headerName: 'Region 2',
    width: 100,
    valueFormatter: (param) => param.value?.name ?? '-',
  },
  {
    field: 'address',
    headerName: 'Anschrift',
    width: 240,
    valueFormatter: gridEmptyVal,
  },
  {
    field: 'zip',
    headerName: 'Postleitzahl',
    width: 160,
    valueFormatter: gridEmptyVal,
  },
  {
    field: 'city',
    headerName: 'Stadt',
    width: 180,
    valueFormatter: gridEmptyVal,
  },
  {
    field: 'email',
    headerName: 'E-Mail',
    width: 250,
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
