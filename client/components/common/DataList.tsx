import { Box, Divider } from '@mui/material';
import DataContainer from 'client/components/common/DataContainer';
import { border } from 'client/styles';
import { KeyValue } from 'types/client';
import { removeSpaces } from 'utils/shared';

interface Props {
  data: KeyValue[];
}

function DataList({ data }: Props) {
  const arrayLength = data.length;
  return !data ? null : (
    <Box sx={border}>
      {data?.map((val, i) => (
        <Box key={removeSpaces(val.key)}>
          <DataContainer label={val.key}>{val.value}</DataContainer>
          {i < arrayLength - 1 ? <Divider /> : null}
        </Box>
      ))}
    </Box>
  );
}

export default DataList;
