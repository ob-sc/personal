import { AppBar, Box, IconButton, Toolbar } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/router';
import { deleteSession } from 'src/modules/auth/api';
import { ParsedUser } from 'src/common/types/server';
import useMobileContext from 'src/common/context/MobileContext';
import NavLink from 'src/common/components/NavLink';
import { flexGrow } from 'src/common/styles';
import MobileMenu from 'src/common/components/MobileMenu';
import Logo from 'src/common/components/Logo';

interface Props {
  session?: ParsedUser;
}

export interface MenuItem {
  access: boolean;
  route: string;
  label: string;
}

const Navbar = ({ session }: Props) => {
  const router = useRouter();
  const { mobile } = useMobileContext();

  const handleLogout = async () => {
    await deleteSession();
    window.sessionStorage.clear();
    // window.location.href = '/login';
    router.push('/login');
  };

  const menuItems = [
    // {
    //   access: session?.access.temps.read ?? false,
    //   route: '/temps',
    //   label: 'Aushilfen',
    // },
    {
      access: session?.access.users.read ?? false,
      route: '/users',
      label: 'Benutzer',
    },
    {
      access: session?.access.stations.read ?? false,
      route: '/stations',
      label: 'Stationen',
    },
    {
      access: session?.access.admin.read ?? false,
      route: '/settings',
      label: 'Einstellungen',
    },
  ];

  return (
    <Box component="nav" sx={{ my: 2 }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Logo
            clickHandler={() => {
              router.push('/');
            }}
          />

          {session === undefined ? null : (
            <>
              <Box sx={{ width: 20 }} />

              {mobile
                ? null
                : menuItems
                    .filter((item) => item.access === true)
                    .map((item) => (
                      <NavLink key={item.route} href={item.route}>
                        {item.label}
                      </NavLink>
                    ))}

              <Box sx={flexGrow} />

              {!mobile ? null : (
                <MobileMenu mobile={mobile} menuItems={menuItems} />
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
