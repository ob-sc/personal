import { DGColFn, FormField, SelectOption } from 'src/common/types/client';
import { gridEmptyVal, withEmptyOption } from 'src/common/utils/client';

export const stationDescriptions = {
  id: 'Nummer',
  name: 'Name',
  address: 'Adresse',
  zip: 'Postleitzahl',
  city: 'Stadt',
  telephone: 'Telefon',
  fax: 'Fax',
  email: 'E-Mail',
  region_id: 'Region 1',
  subregion_id: 'Region 2',
  region: 'Region 1',
  subregion: 'Region 2',
  users: 'Benutzer',
};

const stationColumns: DGColFn = () => [
  {
    field: 'id',
    headerName: stationDescriptions.id,
    width: 80,
    sm: true,
    valueFormatter: gridEmptyVal,
  },
  {
    field: 'name',
    headerName: stationDescriptions.name,
    width: 220,
    sm: true,
  },
  {
    field: 'region',
    headerName: stationDescriptions.region,
    width: 100,
  },
  {
    field: 'subregion',
    headerName: stationDescriptions.subregion,
    width: 100,
    valueFormatter: gridEmptyVal,
  },
  {
    field: 'address',
    headerName: stationDescriptions.address,
    width: 240,
    valueFormatter: gridEmptyVal,
  },
  {
    field: 'zip',
    headerName: stationDescriptions.zip,
    width: 160,
    valueFormatter: gridEmptyVal,
  },
  {
    field: 'city',
    headerName: stationDescriptions.city,
    width: 180,
    valueFormatter: gridEmptyVal,
  },
  {
    field: 'email',
    headerName: stationDescriptions.email,
    width: 250,
    valueFormatter: gridEmptyVal,
  },
  {
    field: 'telephone',
    headerName: stationDescriptions.telephone,
    width: 180,
    valueFormatter: gridEmptyVal,
  },
  {
    field: 'fax',
    headerName: stationDescriptions.fax,
    width: 180,
    valueFormatter: gridEmptyVal,
  },
];

export function stationFields(options: SelectOption[]) {
  const withEmptyRegionOption = withEmptyOption(options, 'Keine Region');

  const fields: FormField[] = [
    { name: 'h0', label: 'Bezeichnung', type: 'header' },
    {
      name: 'id',
      label: stationDescriptions.id,
      type: 'number',
      required: true,
    },
    {
      name: 'name',
      label: stationDescriptions.name,
      type: 'text',
      required: true,
    },
    { name: 'h1', label: 'Kontakt', type: 'header' },
    {
      name: 'address',
      label: stationDescriptions.address,
      type: 'text',
    },
    { name: 'zip', label: stationDescriptions.zip, type: 'text' },
    { name: 'city', label: stationDescriptions.city, type: 'text' },
    { name: 'telephone', label: stationDescriptions.telephone, type: 'text' },
    { name: 'fax', label: stationDescriptions.fax, type: 'text' },
    { name: 'email', label: stationDescriptions.email, type: 'text' },
    { name: 'h2', label: 'Region', type: 'header' },
    {
      name: 'region_id',
      label: stationDescriptions.region_id,
      type: 'select',
      required: true,
      options,
    },
    {
      name: 'subregion_id',
      label: stationDescriptions.subregion_id,
      type: 'select',
      options: withEmptyRegionOption,
    },
  ];

  return fields;
}

export default stationColumns;
