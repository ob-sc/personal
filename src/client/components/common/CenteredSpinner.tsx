import { Box, CircularProgress } from '@mui/material';

interface Props {
  size?: number | string; // in px bei num, sonst unit mitgeben (3rem etc)
}

const CenteredSpinner = ({ size }: Props) => (
  <Box
    sx={{
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <CircularProgress size={size} />
  </Box>
);

export default CenteredSpinner;
