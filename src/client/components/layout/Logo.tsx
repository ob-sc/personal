import { Box } from '@mui/material';
import Image from 'next/image';
import { MouseEventHandler } from '../../../../types';

interface Props {
  clickHandler: MouseEventHandler;
}

const Logo = ({ clickHandler }: Props) => (
  <Box sx={{ '&:hover': { cursor: 'pointer' } }}>
    <Image
      width="184px"
      height="35px"
      src="/logo_starcar2x.png"
      alt="logo"
      onClick={clickHandler}
    />
  </Box>
);

export default Logo;
