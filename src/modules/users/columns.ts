import { DGColFn } from 'src/common/types/client';
// import { gridEmptyVal } from 'src/common/utils/client';

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
];

// keine fields weil user nicht über form angelegt wird

export default userColumns;
