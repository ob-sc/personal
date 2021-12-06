import { Box } from '@mui/material';
import Image from 'next/image';
import { MouseEventHandler } from '../../../../types';

interface Props {
  clickHandler: MouseEventHandler;
}

const Logo = ({ clickHandler }: Props) => (
  <Box sx={{ '&:hover': { cursor: 'pointer' } }}>
    {/* favicon hat einen png layer mit 256x256 px */}
    <Image width="64px" height="64px" src="/favicon.ico" alt="logo" onClick={clickHandler} />
  </Box>
);

export default Logo;
