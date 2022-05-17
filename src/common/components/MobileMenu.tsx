import { MouseEvent, useState } from 'react';
import { IconButton, Menu, MenuItem as MuiMenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NavLink from 'src/common/components/NavLink';
import { MenuItem } from 'src/common/components/Navbar';

interface Props {
  mobile: boolean;
  menuItems: MenuItem[];
}

const MobileMenu = ({ mobile, menuItems }: Props) => {
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
          .filter((item) => item.access === true)
          .map((item) => (
            <MuiMenuItem key={item.route} onClick={handleClose}>
              <NavLink href={item.route}>{item.label}</NavLink>
            </MuiMenuItem>
          ))}
      </Menu>
    </>
  );
};

export default MobileMenu;
