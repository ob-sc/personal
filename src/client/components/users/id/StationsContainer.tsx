import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { useState } from 'react';
import { ParsedUser } from 'types/server';
import { postAllowedStation } from 'src/client/api/users';
import { Station } from 'src/entities/Station';

interface Props {
  stations: Station[];
  user: ParsedUser;
}

const SCCheckbox = ({
  station,
  user,
}: {
  station: Station;
  user: ParsedUser;
}) => {
  const initialChecked = user.stations.includes(station.id);
  const [checked, setChecked] = useState(initialChecked);

  return (
    <FormGroup key={station.id}>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={(e) => {
              if (checked) {
                postAllowedStation(user.id, station.id);
              }

              setChecked(e.target.checked);
            }}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        }
        label={`${station.id} - ${station.name}`}
      />
    </FormGroup>
  );
};

function StationsContainer({ stations, user }: Props) {
  return (
    <>
      {stations.map((station) => (
        <SCCheckbox station={station} user={user} key={station.id} />
      ))}
    </>
  );
}

export default StationsContainer;
