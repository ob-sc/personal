import { DGColFn } from 'types/client';
import { accessConstants } from 'config/constants';
import { gridEmptyVal } from 'utils/client';

export const userDescriptions = {
  id: 'ID',
  username: 'Benutzername',
  access: 'Berechtigungen',
  region: 'Region',
  stations: 'Stationen',
};

const userColumns: DGColFn = () => [
  {
    field: 'username',
    headerName: userDescriptions.username,
    width: 300,
    sm: true,
  },
  {
    field: 'access',
    headerName: userDescriptions.access,
    width: 250,
    valueFormatter: (param) => accessConstants(param.value ?? 0).translated,
  },
  {
    field: 'region',
    headerName: userDescriptions.region,
    width: 250,
    valueFormatter: gridEmptyVal,
  },
  {
    field: userDescriptions.stations,
    headerName: 'Stationen',
    width: 250,
    valueFormatter: gridEmptyVal,
  },
];

// keine fields weil user nicht über form angelegt wird

export default userColumns;
