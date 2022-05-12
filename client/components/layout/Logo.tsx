import { Box } from '@mui/material';
import { MouseEventHandler } from 'types/client';

interface Props {
  clickHandler: MouseEventHandler;
}

function Logo({ clickHandler }: Props) {
  return (
    <Box sx={{ '&:hover': { cursor: 'pointer' } }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        width="160"
        src="/logo_starcar2x.png"
        alt="logo"
        onClick={clickHandler}
      />
    </Box>
  );
}

export default Logo;
