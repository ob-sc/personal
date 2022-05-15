import { Box, CircularProgress, Fade } from '@mui/material';
import { fullContainerCentered } from 'src/common/styles';

// kein spinner bei antwort < 1 sekunde
// https://www.nngroup.com/articles/response-times-3-important-limits/

interface Props {
  size?: number | string; // in px bei num, sonst unit mitgeben (3rem etc)
}

function CenteredSpinner({ size }: Props) {
  return (
    <Box sx={fullContainerCentered}>
      <Fade
        in={true}
        style={{
          // transitionDelay: query === 'progress' ? '800ms' : '0ms',
          transitionDelay: '800ms',
        }}
        unmountOnExit
      >
        <CircularProgress size={size} />
      </Fade>
    </Box>
  );
}

export default CenteredSpinner;
