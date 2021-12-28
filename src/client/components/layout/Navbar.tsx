import { AppBar, Box, IconButton, Toolbar } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';
import { useRouter } from 'next/router';
import Logo from './Logo';
import { ParsedUser } from '../../../../types/user';
import NavLink from '../common/NavLink';

interface Props {
  session?: ParsedUser;
}

// todo overflow in menu bei mobile, dann auch logo raus?

const Navbar = ({ session }: Props) => {
  const router = useRouter();

  const handleLogout = () => {
    axios.delete('/api/session').then(() => {
      window.sessionStorage.clear();
      // window.location.href = '/login';
      router.push('/login');
    });
  };

  return (
    <Box component="nav" sx={{ flexGrow: 1, my: 2 }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Logo
            clickHandler={() => {
              // window.location.href = '/';
              router.push('/');
            }}
          />
          {session !== undefined ? (
            <>
              <Box sx={{ width: 50 }} />

              <NavLink href="/temps">Aushilfen</NavLink>
              {session.access > 1 ? <NavLink href="/employees">Mitarbeiter</NavLink> : null}
              {session.access === 4 ? <NavLink href="/users">Benutzer</NavLink> : null}

              <Box sx={{ flexGrow: 1 }} />

              <IconButton size="large" color="inherit" onClick={handleLogout}>
                <LogoutIcon />
              </IconButton>
            </>
          ) : null}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
