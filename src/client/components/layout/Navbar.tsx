import { AppBar, Box, IconButton, Toolbar } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Session } from '../../../../types/user';
import LinkButton from '../common/LinkButton';
import Logo from './Logo';

interface Props {
  session: Session;
}

// todo overflow in menu bei mobile, dann auch bild raus

const Navbar = ({ session }: Props) => {
  const router = useRouter();

  return (
    <Box component="nav" sx={{ flexGrow: 1, my: 2 }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Logo clickHandler={() => router.push('/')} />
          <Box sx={{ width: 50 }} />

          <LinkButton href="/temps">Aushilfen</LinkButton>
          {session.access > 1 ? <LinkButton href="/employees">Mitarbeiter</LinkButton> : null}
          {session.access === 4 ? <LinkButton href="/manage">Verwaltung</LinkButton> : null}

          <Box sx={{ flexGrow: 1 }} />

          <IconButton
            size="large"
            color="inherit"
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
