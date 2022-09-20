import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { border } from 'src/common/styles';
import { User } from 'src/entities/User';
import { putQlik } from 'src/modules/users/api';

interface Props {
  userId: number;
  qlik: User['qlik'];
}

function QlikSelection({ userId, qlik }: Props) {
  return (
    <>
      <Typography variant="h2">Qlik</Typography>
      <Box sx={{ ...border, px: 2, py: 1 }}>
        <FormControl>
          <RadioGroup
            defaultValue={qlik}
            name="qlik-radio-buttons-group"
            onChange={async (e) => {
              await putQlik(userId, Number(e.target.value));
            }}
          >
            <FormControlLabel value={0} control={<Radio />} label="Kein Qlik" />
            <FormControlLabel
              value={1}
              control={<Radio />}
              label="Angefordert"
            />
            <FormControlLabel value={2} control={<Radio />} label="Aktiv" />
          </RadioGroup>
        </FormControl>
      </Box>
    </>
  );
}

export default QlikSelection;
