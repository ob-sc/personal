import { Box, Divider } from '@mui/material';
import DataContainer from 'client/components/common/DataContainer';
import { border } from 'client/styles';
import { removeSpaces } from 'utils/shared';

interface Props {
  data: { label: string; value: string }[];
}

function DataList({ data }: Props) {
  const arrayLength = data.length;

  return !data ? null : (
    <Box sx={border}>
      {data.map((val, i) => (
        <Box key={removeSpaces(val.label)}>
          <DataContainer label={val.label}>{val.value}</DataContainer>
          {i < arrayLength - 1 ? <Divider /> : null}
        </Box>
      ))}
    </Box>
  );
}

export default DataList;
