import { Box, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { useState } from 'react';
import { ParsedUser } from 'types/server';
import { postAllowedStation } from 'client/api/users';
import { Station } from 'entities/Station';

interface Props {
  stations: Station[];
  user: ParsedUser;
}

const style = {
  // height: 200,
  // display: 'grid',
  // gridTemplateColumns: 'repeat(4, 1fr)',
  columnCount: 4,
};

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
              if (!checked) {
                postAllowedStation(user.id, station.id);
              }

              setChecked(!!e.target.checked);
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
    <Box sx={style}>
      {stations.map((station) => (
        <SCCheckbox station={station} user={user} key={station.id} />
      ))}
    </Box>
  );
}

export default StationsContainer;

// todo toggle freigegebene stationen ,damit ausklappen, sonst nur die freigegebenen anzeigen?
// todo iwo oben auswahl für zb alle, keine, alle aus region bla etc? dann brauch ich allgemeinen speicher knopf der eine form abschickt, dann wird api komisch
// todo sonst lieber button alle stationen der extra flag in der db setzt? regionen per filter? nimmt dann andere checkboxes raus?
