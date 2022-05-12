import { DGColFn, FormField, SelectOption } from 'types/client';
import { gridEmptyVal, withEmptyOption } from 'utils/client';

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
    width: 220,
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

export function stationFields(options: SelectOption[]) {
  const withEmptyRegionOption = withEmptyOption(options, 'Keine Region');

  const fields: FormField[] = [
    { name: 'h0', label: 'Bezeichnung', type: 'header' },
    { name: 'id', label: 'Nummer', type: 'number', required: true },
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'h1', label: 'Kontakt', type: 'header' },
    {
      name: 'address',
      label: 'Straße & Hausnummer',
      type: 'text',
    },
    { name: 'zip', label: 'Postleitzahl', type: 'text' },
    { name: 'city', label: 'Stadt', type: 'text' },
    { name: 'telephone', label: 'Telefon', type: 'text' },
    { name: 'fax', label: 'Fax', type: 'text' },
    { name: 'email', label: 'Email', type: 'text' },
    { name: 'h2', label: 'Region', type: 'header' },
    {
      name: 'region_id',
      label: 'Region',
      type: 'select',
      required: true,
      options,
    },
    {
      name: 'subregion_id',
      label: 'Region 2',
      type: 'select',
      options: withEmptyRegionOption,
    },
  ];

  return fields;
}

export default stationColumns;
