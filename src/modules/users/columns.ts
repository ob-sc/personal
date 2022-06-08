import { DGColFn } from 'src/common/types/client';
import { gridEmptyVal, gridTinyIntVal } from 'src/common/utils/client';

// Daten ohne readUser, also Felder direkt aus der DB

export const userDescriptions = {
  username: 'Benutzername',
  first_name: 'Vorname',
  last_name: 'Nachname',
  active: 'Aktiv',
};

const userColumns: DGColFn = () => [
  {
    field: 'username',
    headerName: userDescriptions.username,
    width: 300,
    sm: true,
  },
  {
    field: 'first_name',
    headerName: userDescriptions.first_name,
    width: 300,
    valueFormatter: gridEmptyVal,
  },
  {
    field: 'last_name',
    headerName: userDescriptions.last_name,
    width: 300,
    valueFormatter: gridEmptyVal,
  },
  {
    field: 'active',
    headerName: userDescriptions.active,
    width: 200,
    type: 'boolean',
    valueFormatter: gridTinyIntVal,
  },
];

// keine fields weil user nicht über form angelegt wird

export default userColumns;
