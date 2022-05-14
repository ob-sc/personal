import { Box, CircularProgress } from '@mui/material';
import { fullContainerCentered } from 'client/styles';

interface Props {
  size?: number | string; // in px bei num, sonst unit mitgeben (3rem etc)
}

function CenteredSpinner({ size }: Props) {
  return (
    <Box sx={fullContainerCentered}>
      <CircularProgress size={size} />
    </Box>
  );
}

export default CenteredSpinner;
