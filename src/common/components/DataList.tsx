import { Box, Divider } from '@mui/material';
import DataContainer from 'src/common/components/DataContainer';
import { border } from 'src/common/styles';
import { KeyValue } from 'src/common/types/client';
import { removeSpaces } from 'src/common/utils/shared';

interface Props {
  data: (KeyValue | undefined | null)[];
}

function DataList({ data }: Props) {
  const arrayLength = data.length;
  return !data ? null : (
    <Box sx={border}>
      {data?.map((val, i) =>
        val ? (
          <Box key={removeSpaces(val.key)}>
            <DataContainer label={val.key}>{val.value}</DataContainer>
            {i < arrayLength - 1 ? <Divider /> : null}
          </Box>
        ) : null
      )}
    </Box>
  );
}

export default DataList;
