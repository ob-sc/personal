import { Box } from '@mui/material';

interface Props {
  data: { label: string; value: string }[];
}

function DataDisplay({ data }: Props) {
  // children ist array bei mehreren react nodes, sonst string

  return !data ? null : (
    <Box>
      {data.map((r) => (
        <div key={r.label}>{r.value}</div>
      ))}
    </Box>
  );
}

export default DataDisplay;
