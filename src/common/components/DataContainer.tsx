import { Box, Typography } from '@mui/material';
import { cropText } from 'src/common/styles';
import { CProps } from 'src/common/types/client';

interface Props extends CProps {
  label: string;
}

const containerStyle = {
  height: 50,
  display: 'flex',
  flexDirection: 'column',
  m: 1,
};

const labelStyle = {
  color: 'secondary.dark',
};

function DataContainer({ label, children }: Props) {
  const isEmpty =
    (Array.isArray(children) && children.length === 0) ||
    children === null ||
    children === undefined ||
    children === false ||
    children === '';

  return (
    <Box sx={containerStyle}>
      <Typography sx={labelStyle} variant="subtitle2">
        {label}
      </Typography>
      <Typography sx={cropText} variant="body1">
        {isEmpty ? '-' : children}
      </Typography>
    </Box>
  );
}

export default DataContainer;
