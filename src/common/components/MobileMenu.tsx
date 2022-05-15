import { MouseEvent, useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { ParsedUser } from 'src/common/types/server';
import NavLink from 'src/common/components/NavLink';

interface Props {
  mobile: boolean;
  session: ParsedUser;
  menuItems: { access: number; route: string; label: string }[];
}

const MobileMenu = ({ mobile, session, menuItems }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return !mobile ? null : (
    <>
      <IconButton
        size="large"
        id="mobile-menu-button"
        aria-controls={open ? 'mobile-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="mobile-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'mobile-menu-button',
        }}
      >
        {menuItems
          .filter((item) => session.access >= item.access)
          .map((item) => (
            <MenuItem key={item.route} onClick={handleClose}>
              <NavLink href={item.route}>{item.label}</NavLink>
            </MenuItem>
          ))}
      </Menu>
    </>
  );
};

export default MobileMenu;
