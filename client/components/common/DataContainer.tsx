import { Box, Typography } from '@mui/material';
import { cropText } from 'client/styles';
import { CProps } from 'types/client';

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
  return (
    <Box sx={containerStyle}>
      <Typography sx={labelStyle} variant="subtitle2">
        {label}
      </Typography>
      <Typography sx={cropText} variant="body1">
        {children}
      </Typography>
    </Box>
  );
}

export default DataContainer;
