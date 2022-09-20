import {
  Box,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { ParsedUser } from 'src/common/types/server';
import {
  deleteAllowedStation,
  deleteUserRegion,
  postAllowedStation,
  postUserRegion,
} from 'src/modules/users/api';
import { Station } from 'src/entities/Station';
import { border } from 'src/common/styles';
import useMobileContext from 'src/common/context/MobileContext';
import { Region } from 'src/entities/Region';

interface Props {
  stations: Station[];
  regions: Region[];
  user: ParsedUser;
}

const ASCCheckbox = ({
  station,
  user,
  includedInRegion,
}: {
  station: Station;
  user: ParsedUser;
  includedInRegion: boolean;
}) => {
  const initialChecked = user.stations.includes(station.id);
  const [checked, setChecked] = useState(initialChecked);

  return (
    <FormGroup key={station.id}>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked || includedInRegion}
            onChange={(e) => {
              if (!checked) {
                postAllowedStation(user.id, station.id);
              } else deleteAllowedStation(user.id, station.id);

              setChecked(!!e.target.checked);
            }}
            inputProps={{ 'aria-label': 'controlled' }}
            disabled={includedInRegion}
          />
        }
        label={`${station.id} - ${station.name}`}
      />
    </FormGroup>
  );
};

const stationInRegion = (stationId: number, region: Region) =>
  Array.isArray(region?.stations)
    ? region.stations.findIndex((station) => station.id === stationId) !== -1
    : false;

function AllowedStationsContainer({ stations, regions, user }: Props) {
  const { sm, md } = useMobileContext();
  const initialRegion = user.region?.id ? String(user.region.id) : '';
  const [selectedRegion, setSelectedRegion] = useState('');

  useEffect(() => {
    setSelectedRegion(initialRegion);
  }, [initialRegion]);

  const handleChange = async (event: SelectChangeEvent) => {
    const regionId = event.target.value;

    setSelectedRegion(event.target.value);
    try {
      if (regionId) await postUserRegion(user.id, Number(regionId));
      else await deleteUserRegion(user.id);
    } catch (e) {
      setSelectedRegion(initialRegion);
    }
  };

  const style = {
    display: 'grid',
    gridTemplateColumns: `repeat(${sm ? 1 : md ? 2 : 4}, 1fr)`,
    p: 2,
  };

  return (
    <Box sx={border}>
      <Box sx={{ width: 400, p: 1 }}>
        <FormControl fullWidth>
          <InputLabel id="region-select-label">Region</InputLabel>
          <Select
            labelId="region-select-label"
            id="region-select"
            value={selectedRegion}
            label="Region"
            onChange={handleChange}
          >
            <MenuItem value={''}>Keine</MenuItem>
            {regions.map((region) => (
              <MenuItem key={region.id} value={String(region.id)}>
                {region.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Divider />

      <Box sx={style}>
        {stations.map((station) => (
          <ASCCheckbox
            station={station}
            user={user}
            key={station.id}
            includedInRegion={
              !!selectedRegion &&
              stationInRegion(station.id, regions[Number(selectedRegion)])
            }
          />
        ))}
      </Box>
    </Box>
  );
}

export default AllowedStationsContainer;

// todo toggle freigegebene stationen ,damit ausklappen, sonst nur die freigegebenen anzeigen?
// todo iwo oben auswahl für zb alle, keine, alle aus region bla etc? dann brauch ich allgemeinen speicher knopf der eine form abschickt, dann wird api komisch
// todo sonst lieber button alle stationen der extra flag in der db setzt? regionen per filter? nimmt dann andere checkboxes raus?
