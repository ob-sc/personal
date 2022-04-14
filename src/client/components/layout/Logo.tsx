import { Box } from '@mui/material';
import { MouseEventHandler } from '../../../../types';

interface Props {
  clickHandler: MouseEventHandler;
}

const Logo = ({ clickHandler }: Props) => (
  <Box sx={{ '&:hover': { cursor: 'pointer' } }}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      width="200"
      src="/logo_starcar2x.png"
      alt="logo"
      onClick={clickHandler}
    />
  </Box>
);

export default Logo;
