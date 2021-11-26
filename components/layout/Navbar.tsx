import { AppBar, Box, IconButton, Toolbar } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Session } from '../../types/api';

interface Props {
  session: Session;
}

const Navbar = ({ session }: Props) => {
  const router = useRouter();
  return (
    <Box component="nav" mb={2}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            sx={{ mr: 2 }}
            onClick={() => {
              // wichtig: muss post sein, sonst löscht sich der cookie nicht
              axios.post('/api/session/logout').then(() => {
                router.push('/login');
              });
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
