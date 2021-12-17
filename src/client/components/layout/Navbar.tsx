import { AppBar, Box, IconButton, Toolbar } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';
import { useRouter } from 'next/router';
import { ParsedUser } from '../../../../types/user';
import NavLink from '../common/NavLink';
import Logo from './Logo';

interface Props {
  session?: ParsedUser;
}

// todo overflow in menu bei mobile, dann auch logo raus?

const Navbar = ({ session }: Props) => {
  const router = useRouter();

  return (
    <Box component="nav" sx={{ flexGrow: 1, my: 2 }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Logo clickHandler={() => router.push('/')} />
          {session !== undefined ? (
            <>
              <Box sx={{ width: 50 }} />

              <NavLink href="/temps">Aushilfen</NavLink>
              {session.access > 1 ? <NavLink href="/employees">Mitarbeiter</NavLink> : null}
              {session.access === 4 ? <NavLink href="/users">Benutzer</NavLink> : null}

              <Box sx={{ flexGrow: 1 }} />

              <IconButton
                size="large"
                color="inherit"
                onClick={() => {
                  axios.delete('/api/session').then(() => {
                    router.push('/login');
                  });
                }}
              >
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
