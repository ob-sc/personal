import { Box } from '@mui/material';
import { CProps } from 'types/client';

interface Props extends CProps {
  label?: string;
}

function DataDisplay({ label, children }: Props) {
  // children ist array bei mehreren react nodes, sonst string
  const multipleChildren = Array.isArray(children);
  console.log(children);

  return <Box>{multipleChildren}</Box>;
}

export default DataDisplay;
