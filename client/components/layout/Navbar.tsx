import { AppBar, Box, IconButton, Toolbar } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/router';
import { ParsedUser } from 'types/server';
import { routes } from 'config/constants';
import useMobileContext from 'client/context/MobileContext';
import { deleteSession } from 'client/api/sessions';
import Logo from 'client/components/layout/Logo';
import NavLink from 'client/components/common/NavLink';
import MobileMenu from 'client/components/layout/MobileMenu';

interface Props {
  session?: ParsedUser;
}

const menuItems = [
  {
    access: routes['/temps'],
    route: '/temps',
    label: 'Aushilfen',
  },
  {
    access: routes['/users'],
    route: '/users',
    label: 'Benutzer',
  },
  {
    access: routes['/stations'],
    route: '/stations',
    label: 'Stationen',
  },
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
