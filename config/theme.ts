import { createTheme } from '@mui/material/styles';
import { deDE } from '@mui/material/locale';

export const colors = {
  greywhite: '#fbfbfb',
  greylight: '#cacaca',
  grey: '#969696',
  blackish: '#6e6e6e',
  brand: '#feed01',
};

const theme = createTheme(
  {
    palette: {
      background: {
        default: colors.greywhite,
      },
      primary: {
        main: colors.blackish,
        // light: colors.grey,
      },
      secondary: {
        main: colors.grey,
        light: colors.greylight,
      },
    },
    components: {
      MuiButton: {
        defaultProps: {
          disableRipple: true,
          variant: 'outlined',
        },
      },
    },
  },
  deDE
);

export default theme;
