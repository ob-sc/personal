import { AppBar, Box, IconButton, Toolbar } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/router';
import { ParsedUser } from '../../../../types/user';
import NavLink from '../common/NavLink';
import Logo from './Logo';
import MobileMenu from './MobileMenu';
import { deleteSession } from '../../api/sessions';
import useMobileContext from '../../context/MobileContext';

interface Props {
  session?: ParsedUser;
}

const menuItems = [
  { access: 0, route: '/temps', label: 'Aushilfen' },
  { access: 2, route: '/employees', label: 'Mitarbeiter' },
  { access: 4, route: '/users', label: 'Benutzer' },
  { access: 4, route: '/stations', label: 'Stationen' },
];

const Navbar = ({ session }: Props) => {
  const router = useRouter();
  const { mobile } = useMobileContext();

  const handleLogout = async () => {
    await deleteSession();
    window.sessionStorage.clear();
    // window.location.href = '/login';
    router.push('/login');
  };

  return (
    <Box component="nav" sx={{ my: 2 }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Logo
            clickHandler={() => {
              // window.location.href = '/';
              router.push('/');
            }}
          />

          {session === undefined ? null : (
            <>
              <Box sx={{ width: 20 }} />

              {mobile
                ? null
                : menuItems
                    .filter((item) => session.access >= item.access)
                    .map((item) => (
                      <NavLink key={item.route} href={item.route}>
                        {item.label}
                      </NavLink>
                    ))}

              <Box sx={{ flexGrow: 1 }} />

              {!mobile ? null : (
                <MobileMenu
                  mobile={mobile}
                  session={session}
                  menuItems={menuItems}
                />
              )}

              <IconButton size="large" color="inherit" onClick={handleLogout}>
                <LogoutIcon />
              </IconButton>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
