import { Box, Checkbox } from '@mui/material';
import { AxiosResponse } from 'axios';
import { border } from 'src/common/styles';
import { Access } from 'src/common/types/server';
import { ap } from 'src/common/utils/user';
import { deleteAccessBit, postAccessBit } from 'src/modules/users/api';
import { KeyedMutator } from 'swr';

interface Props {
  id: number;
  access: Access | undefined;
  mutate: KeyedMutator<AxiosResponse>;
}

function UserAuthorizationTable({ id, access, mutate }: Props) {
  const handleCheckboxClick = async (bitPosition: number, checked: boolean) => {
    if (!checked) await postAccessBit(id, bitPosition);
    else await deleteAccessBit(id, bitPosition);
    mutate();
  };

  const keyMap = (key: string) =>
    key === 'regions'
      ? 'Regionen'
      : key === 'stations'
      ? 'Stationen'
      : key === 'users'
      ? 'Benutzer'
      : 'Admin';

  return (
    <Box sx={{ ...border, p: 1 }}>
      <table style={{ width: 'min(500px, 80%)' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>Berechtigung</th>
            <th style={{ textAlign: 'left' }}>Lesen</th>
            <th style={{ textAlign: 'left' }}>Schreiben</th>
          </tr>
        </thead>
        <tbody>
          {access &&
            Object.entries(access).map(([k, v]) => (
              <tr key={k}>
                <td>{keyMap(k)}</td>
                <td>
                  <Checkbox
                    checked={v.read}
                    onClick={() => {
                      handleCheckboxClick(ap[k as keyof Access].read, v.read);
                    }}
                  />
                </td>
                <td>
                  <Checkbox
                    checked={v.write}
                    onClick={() => {
                      handleCheckboxClick(ap[k as keyof Access].write, v.write);
                    }}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Box>
  );
}

export default UserAuthorizationTable;
