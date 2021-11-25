import { createTheme } from "@mui/material/styles";
import { deDE } from "@mui/material/locale";

export const colors = {
  greywhite: "#fbfbfb",
  grey: "#c0c0c0",
  blackish: "#6e6e6e",
  brand: "#feed01",
};

const theme = createTheme(
  {
    palette: {
      background: {
        default: colors.greywhite,
      },
      primary: {
        main: colors.blackish,
        light: colors.grey,
      },
    },
    components: {
      MuiButton: {
        defaultProps: {
          disableRipple: true,
          variant: "outlined",
        },
      },
    },
  },
  deDE
);

export default theme;
