import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
} from '@mui/material';
import { useState } from 'react';
import { ParsedUser } from 'src/common/types/server';
import { postAllowedStation } from 'src/modules/users/api';
import { Station } from 'src/entities/Station';
import { border } from 'src/common/styles';
import useMobileContext from 'src/common/context/MobileContext';
import DataContainer from 'src/common/components/DataContainer';

interface Props {
  stations: Station[];
  user: ParsedUser;
}

const ASCCheckbox = ({
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

function AllowedStationsContainer({ stations, user }: Props) {
  const { sm, md } = useMobileContext();

  const style = {
    display: 'grid',
    gridTemplateColumns: `repeat(${sm ? 1 : md ? 2 : 4}, 1fr)`,
    p: 2,
  };

  return (
    <Box sx={border}>
      <DataContainer label="Region">Regionnn</DataContainer>
      <Divider />

      <Box sx={style}>
        {stations.map((station) => (
          <ASCCheckbox station={station} user={user} key={station.id} />
        ))}
      </Box>
    </Box>
  );
}

export default AllowedStationsContainer;

// todo toggle freigegebene stationen ,damit ausklappen, sonst nur die freigegebenen anzeigen?
// todo iwo oben auswahl für zb alle, keine, alle aus region bla etc? dann brauch ich allgemeinen speicher knopf der eine form abschickt, dann wird api komisch
// todo sonst lieber button alle stationen der extra flag in der db setzt? regionen per filter? nimmt dann andere checkboxes raus?
