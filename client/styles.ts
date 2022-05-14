import theme from 'config/theme';

export const border = {
  p: 1.5,
  border: 1,
  borderColor: theme.palette.secondary.light,
  borderRadius: 2,
};

export const fullscreenCenteredFlex = {
  height: '100vh',
  width: '100vw',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 2,
};

export const fullContainerCentered = {
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

export const cropText = {
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  // width: '100%',
};
